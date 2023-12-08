import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";

import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { getActiveFournisseur } from "../../Redux/fournisseurReduce";
import { getActiveProduit } from "../../Redux/produitReduce";
import { releveAdded, saveFile, extractionsReleve, cheeckProduit, verifReleve } from "../../Redux/releveReduce";
import { getAllAnneeLignesBL } from "../../Redux/blReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTableBl.js";
import jwt_decode from "jwt-decode";
import { Alert } from "react-bootstrap";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import Configuration from "../../configuration";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

function ReleveGro() {
  var date = new Date().getFullYear();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idrole = decoded.userauth.idrole;
  var anneeLocal = localStorage.getItem("annee");

  const idUser = decoded.userauth.id;
  const notificationAlertRef = React.useRef(null);
  const notify = (place, msg, type) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{msg}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  const dispatch = useDispatch();
  const [extensionFile, setExtensionFile] = useState("");
  const [image, setImage] = useState("");
  const [produitExist, setProduitExist] = React.useState("");

  //fournisseur
  const [fournisseur, setFournisseur] = React.useState(null);
  const [annee, setAnnee] = React.useState(null);
  const [anneeSelect, setAnneeSelect] = React.useState([]);
  const [optionsAnnee, setOptionsAnnee] = React.useState([
    {
      value: "",
      label: "Annee",
      isDisabled: true,
    },
  ]);
  const [fourSelected, setFourSelected] = React.useState(null);
  const [optionFour, setOptionFour] = React.useState([
    {
      value: "",
      label: "Grossiste",
      isDisabled: true,
    },
  ]);
  const [type, setType] = React.useState(null);
  const [typeSelect, setTypeSelect] = React.useState([]);
  const [optionType, setOptionType] = React.useState([
    {
      value: "",
      label: "Type",
      isDisabled: true,
    },
    {
      value: "0",
      label: "Tout",
    },
    {
      value: "1",
      label: "Stock",
    },
    {
      value: "2",
      label: "Vente",
    },
  ]);
  const [mois, setMois] = React.useState(null);
  const [moisSelect, setMoisSelect] = React.useState([]);
  const [optionsMois] = React.useState([
    {
      value: "",
      label: "Mois",
      isDisabled: true,
    },
    { value: '1', label: "janvier" },
    { value: '2', label: "février" },
    { value: '3', label: "mars" },
    { value: '4', label: "avril" },
    { value: '5', label: "mai" },
    { value: '6', label: "juin" },
    { value: '7', label: "juillet" },
    { value: '8', label: "août" },
    { value: '9', label: "septembre" },
    { value: '10', label: "octobre" },
    { value: '11', label: "novembre" },
    { value: '12', label: "décembre" },
  ]);
  const getAnnes = useCallback(async () => {
    var year = await dispatch(getAllAnneeLignesBL());
    var arrayOption = [];
    var testA = false;
    year.payload.forEach(element => {
      if (date === element.annee)
        testA = true;
      arrayOption.push({ value: element.annee, label: element.annee })
    });
    if (!testA) { arrayOption.push({ value: date, label: date }) }
    setOptionsAnnee(arrayOption);
  }, [dispatch, date]);

  //table body
  const [entities, setEntities] = useState([]);
  const [uploadFile, setUploadFile] = React.useState();
  //Produit
  const [produitSelect, setProduitSelect] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
      isDisabled: true,
    },
  ]);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState("");
  const pdfOptions = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
  };

  /** start crop img**/
  const [traitment, setTraitment] = useState(false);
  const [image1, setImage1] = useState("");
  const [fileName, setFileName] = useState("");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [rotation, setRotation] = useState(0)
  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };
  /** end crop img**/
  //get Produit
  const getproduit = useCallback(async () => {
    var type = await dispatch(getActiveProduit());
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.designation });
    });
    setOptionProduit(arrayOption);
  }, [dispatch]);

  function deleteLigne(nb) {
    if (entities.length > 1) {
      /* 
      var liste = entities;
      liste.splice(nb, 1);
      setEntities(liste); */
      var filtered = produitSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setProduitSelect(filtered);
      var filtered = typeSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setTypeSelect(filtered);
      var filtered = anneeSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setAnneeSelect(filtered);
      var filtered = moisSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setMoisSelect(filtered);
      var filtered = entities.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setEntities(filtered);
      notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
  }
  const checkProd = useCallback(
    async (table) => {
      var arrayBody = [];
      dispatch(cheeckProduit(table)).then((rowsdes) => {
        if (rowsdes !== undefined && rowsdes.payload.length > 0) {
          var prod = rowsdes.payload;
          var produitexit = [];
          for (var i = 0; i < prod.length; i++) {
            var stock = 0;
            var vente = 0;
            if (table[i].stock)
              if (typeof table[i].stock == "number") { stock = table[i].stock }
              else { if(table[i].stock != "" && table[i].stock != " ") stock = table[i].stock.replace(' ', '') }
            
            if (table[i].vente)
              if (typeof table[i].vente == "number") { vente = table[i].vente }
              else { if(table[i].vente != "" && table[i].vente != " ") vente = table[i].vente.replace(' ', '') }
            if (prod[i] !== null && typeof prod[i] !== "undefined" && prod[i] !== "undefined") {
              arrayBody.push({
                idProduit: prod[i][2],
                designation: prod[i][0],
                code: table[i].code,
                vente: vente,
                stock: stock,
                mois: table[i].month,
                annee: table[i].annee,
                na: 'N/A'
              });
            } else {
              if (table[i].designation != 'DESIGNATION' && table[i].designation != '() Totaux :' && table[i].code != 'Totaux' && table[i].designation != 'libellé' && table[i].designation != 'Libellé' && table[i].designation != 'désignation' && table[i].designation != 'Designation' && table[i].designation != 'Désignation') {
                produitexit.push('Code produit ' + table[i].code + " \n\n/ \n\n");
                arrayBody.push({
                  idProduit: null,
                  designation: table[i].designation,
                  code: table[i].code,
                  vente: vente,
                  stock: stock,
                  mois: table[i].month,
                  annee: table[i].annee,
                  na: 'N/A'
                });
              }
            }
          }
          if (produitexit.length > 0) setProduitExist(produitexit);
          setEntities(arrayBody);
        } else {
          setEntities([]);
        }

        document.getElementById("loaderTable").classList.add("hidden");
      });
    },
    [dispatch]
  );
  const setTable = useCallback(
    async (table, init) => {
      //1 => update table ***** 0 => initialiser table
      var arrayBody = [];
      if (init === 1) {
        var moy = 0
        table.forEach((value) => {
          arrayBody.push({
            designation: value.designation,
            stock: value.stock,
            vente: value.vente,
            mois: value.mois,
            code: value.code,
            idProduit: value.idProduit,
            annee: value.annee,
            na: 'N/A'
          });
        });
        setEntities(arrayBody);
      } else {
        checkProd(table);
      }
    },
    [checkProd]
  );
  function uploadBL(event) {
    var element = document.getElementById("table-BL");
    element.classList.add("hidden");
    let blFile = event.target.files[0];
    if (blFile) {
      var ext = blFile.name.split(".")
      setExtensionFile(ext[(ext.length - 1)]);
      setImage(URL.createObjectURL(blFile));
      if (ext[1].toLowerCase() === "pdf") {
        setUploadFile(blFile);
      } else {
        setUploadFile(blFile);
        cropImg(event)
      }
      setEntities([]);
      onFileChange(event);
    }
  }
  function cropImg(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage1(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  function onFileChange(event) {
    setPdfFile(event.target.files[0]);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);

    setTimeout(() => {
      convertCanvasToImage();
    }, 1000);
  }

  function convertCanvasToImage() {
    let canvases = document.getElementsByClassName("react-pdf__Page__canvas");
    setImage1(canvases)
    if (!canvases || canvases.length === 0) {
      console.warn("no canvases :'(");
      return;
    }
  }





  //get fournisseur
  const getFournisseur = useCallback(async () => {
    var fournisseur = await dispatch(getActiveFournisseur());
    var entities = fournisseur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionFour(arrayOption);
  }, [dispatch]);



  const showTable = useCallback(
    async (file, type, mois, fourSelected, annee) => {
      var element = document.getElementById("table-BL");
      element.classList.add("hidden");
      if ((type !== null && type.value !== "") && (mois !== null && mois.value !== "") && (annee !== null && annee.value !== "") && (fourSelected !== null && fourSelected.label !== "")) {
        dispatch(verifReleve({ annee: annee.value, mois: mois.value, fournisseur: fourSelected.value, namefile: file.name })).then(async (e) => {
          if (e.payload === false) {
            if (typeof file === "object") {
              document.getElementById("loaderTable").classList.remove("hidden");
              const dataArray = new FormData();
              dataArray.append("fichier", file);
              dataArray.append("type1", type.value);
              dataArray.append("month", mois.value);
              dataArray.append("grossiste", fourSelected.label);
              dataArray.append("annee", annee.value);
              var bl = await dispatch(extractionsReleve(dataArray));
              var entities = bl.payload;
              element.classList.remove("hidden");

              setTable(entities, 0);
              notify("tr", "Extraction avec succes", "success");
            } else {
              notify("tr", "Il faut selectionner un releve", "danger");
            }

          } else {
            notify("tr", "Déja inserer", "danger");
          }
        });
      } else {
        notify("tr", "Vérifier vos données", "danger");
      }
    },
    [dispatch, setTable]
  );

  const removeProduit = useCallback(async (list, select, id) => {
    list[id].idProduit = null;
    list[id].designation = null;
    /* var select = produitSelect; */
    select[id] = null;
    setProduitSelect(select);
    setEntities(list);
    setTable(list, 1);
  },
    [setTable]
  );


  const saveTable = useCallback(
    async (entities, uploadFile, fourSelected, annee, mois,type) => {

      var verif = true; 
     if(entities.length>0) 
     { entities.forEach((data) => {
        if (data.idProduit === null) verif = false;
      });}
      else{verif = false;}
      if (verif === false) {
        notify("tr", "Vérifier vos données!", "danger");
      } else {
        const dataArray = new FormData();
        dataArray.append("file", uploadFile);
        dataArray.append("name", uploadFile.name);
        var bl = "";
        dataArray.append("bl", bl);
        if (fourSelected !== null) {
          dispatch(saveFile(dataArray)).then((e) => {
            var filename = e.payload.filename;
       dispatch(releveAdded({type:type.value, annee: annee.value, mois: mois.value, file: filename, namefile: uploadFile.name, ligneReleve: entities, four: fourSelected.value })).then((e) => {
              if (e.payload === true) {
                notify("tr", "Insertion avec succes", "success");
                setTimeout(() => {
                  window.location.reload();
                }, 1300);
              } else {
                notify("tr", "Vérifier vos données!", "danger");
              }
            });

          });
        } else {
          notify("tr", "Grossiste obligatoire!", "danger");
        }
      }

    },
    [dispatch, fileName, traitment]
  );

  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      designation: null,
      stock: 0,
      vente: 0,
      mois: null,
      idProduit: null,
      code: '',
      annee: null,
      na: 'N/A'
    };
    setEntities(list);
  }

  useEffect(() => {
    getFournisseur();
    getAnnes();
    getproduit();

  }, [getAnnes, getFournisseur]);
  return (
    <>
      <Container fluid className="responsive-BL table-dynamique">
        {produitExist !== "" ? (
          <Alert variant="danger">
            {produitExist}
          </Alert>
        ) : ""}
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Reléve grossiste</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
                  <Row>
                    <Col md="3">
                      <span>Type * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="Type"
                        placeholder="Type"
                        value={type}
                        onChange={(v) => {
                          setType(v);
                        }}
                        options={optionType}
                      />
                    </Col>
                    <Col md="3">
                      <span>Grossiste * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="Grossiste"
                        placeholder="Grossiste"
                        value={fourSelected}
                        onChange={(v) => {
                          setFourSelected(v);
                        }}
                        options={optionFour}
                      />
                    </Col>
                    <Col md="3" >
                      <span>Mois * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="mois"
                        value={mois}
                        onChange={(value) => { setMois(value); }}
                        options={optionsMois}
                        placeholder="Mois"
                      />
                      <br></br>
                    </Col>
                    <Col md="3" >
                      <span>Annee * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="annee"
                        value={annee}
                        onChange={(value) => { setAnnee(value); }}
                        options={optionsAnnee}
                        placeholder="Annee"
                      />
                      <br></br>
                    </Col>
                  </Row>
                  <form>
                    <Form.Group className="float-left">
                      <Form.Control
                        id="test"
                        name="file"
                        type="file"
                        accept="application/pdf, image/png, image/jpeg, image/jpg"
                        onChange={(e) => uploadBL(e)}
                      ></Form.Control>
                    </Form.Group>
                  </form>
                  <div className="clear"></div>
                  <br></br>

                  {extensionFile === "" ? (
                    <h4>
                      Veuillez sélectionner un document PDF/Image <br></br> Nous
                      recomandons d'utiliser PDFScaner pour la prise des photos
                    </h4>
                  ) : extensionFile.toLowerCase() === "pdf" ? (
                    <Document
                      file={pdfFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                      noData={
                        <h4>
                          Veuillez sélectionner un document PDF <br></br> Nous
                          recomandons d'utiliser PDFScaner pour la prise des
                          photos
                        </h4>
                      }
                      options={pdfOptions}
                    >
                      {Array.from(new Array(numPages), (el, index) => (
                        <Page
                          scale={2}
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                        />
                      ))}
                    </Document>

                  ) : (
                    <div className="image-bl">
                      <img src={image} alt="" />
                    </div>
                  )}
                  <br />
                  <Button
                    className="btn-wd btn-outline mr-1 float-right extraction"
                    id="blExt"
                    type="button"
                    variant="info"
                    onClick={(v) => {
                      if (traitment === false)
                        showTable(uploadFile, type, mois, fourSelected, annee);
                    }}
                  >
                    <span className="btn-label">
                      <i className="fas fa-cogs"></i>
                    </span>
                    Extraction
                  </Button>
                </div>

                <div className="text-center">
                  <img
                    id="loaderTable"
                    className="hidden"
                    src={require("../../assets/img/loader.gif").default}
                    alt="loader"
                  />
                </div>
                <br></br>
                <br></br>
                <Row className="hidden" id="table-BL">
                  <Col md="12">
                    <hr></hr>
                    <br></br>
                    <ReactTable
                      data={entities}
                      columns={[
                        {
                          Header: "Designation",
                          accessor: "designation", Cell: ({ cell }) => (
                            <div>
                              {entities[cell.row.id].idProduit !== null ? (
                                <Form.Group className="desinationProduit">
                                  <Form.Control
                                    className="green"
                                    readOnly
                                    defaultValue={cell.row.values.designation}
                                    placeholder="Designation"
                                    type="text"
                                  ></Form.Control>
                                  <Button
                                    onClick={() => {
                                      removeProduit(entities, produitSelect, cell.row.id)
                                    }}
                                  >
                                    <i
                                      className="fa fa-trash"
                                    />
                                  </Button>
                                </Form.Group>
                              ) : (
                                <div className="table-bl">
                                  {cell.row.values.designation != null ? (
                                    <Form.Group className="desinationProduit">
                                      <Form.Control
                                        className="red"
                                        readOnly
                                        defaultValue={
                                          cell.row.values.designation
                                        }
                                        placeholder="Designation"
                                        type="text"
                                      ></Form.Control>
                                      <Button
                                        onClick={() => {
                                          removeProduit(entities, produitSelect, cell.row.id)
                                        }}
                                      >
                                        <i
                                          className="fa fa-trash"
                                        />
                                      </Button>
                                    </Form.Group>
                                  ) : ""}
                                  <Select
                                    className="react-select primary "
                                    classNamePrefix="react-select"
                                    name="Produit"
                                    placeholder="Produit"
                                    value={produitSelect[cell.row.id]}
                                    onChange={(v) => {
                                      var e = entities;
                                      var select = produitSelect;
                                      e[cell.row.id].idProduit = v.value;
                                      e[cell.row.id].designation = v.label;
                                      select[cell.row.id] = v;
                                      setProduitSelect(select);
                                      setEntities(e);
                                      setTable(e, 1);
                                    }}
                                    options={optionProduit}
                                  />
                                </div>
                              )}
                            </div>
                          ),
                        },
                        {
                          Header: "Code",
                          accessor: "code",
                        },
                        {
                          Header: "Stock",
                          accessor: "stock",
                          Cell: ({ cell }) => (
                            <div>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={cell.row.values.stock}
                                  placeholder="Stock"
                                  type="Number"
                                  onBlur={(value) => {
                                    var e = entities;
                                    e[cell.row.id].stock = value.target.value;
                                    setTable(e, 1);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </div>
                          ),
                        },
                        {
                          Header: "Vente",
                          accessor: "vente",
                          Cell: ({ cell }) => (
                            <div>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={cell.row.values.vente}
                                  placeholder="Vente"
                                  type="Number"
                                  onBlur={(value) => {
                                    var e = entities;
                                    e[cell.row.id].vente = value.target.value;
                                    setTable(e, 1);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </div>
                          ),
                        },
                        {
                          Header: "Mois",
                          accessor: "mois",
                          Cell: ({ cell }) => (
                            entities[cell.row.id].mois !== null ? (
                              (optionsMois.map(element => {
                                if (element.value == parseInt(cell.row.values.mois)) {
                                  return element.label;
                                }
                              }))) :
                              (<div className="table-bl table-bl135">
                                <Select
                                  className="react-select primary "
                                  classNamePrefix="react-select"
                                  name="Mois"
                                  placeholder="Mois"
                                  value={moisSelect[cell.row.id]}
                                  onChange={(v) => {
                                    var e = entities;
                                    var select = moisSelect;
                                    e[cell.row.id].mois = v.value;
                                    select[cell.row.id] = v;
                                    setMoisSelect(select);
                                    setEntities(e);
                                    setTable(e, 1);
                                  }}
                                  options={optionsMois}
                                /></div>)
                          )
                        },
                        {
                          Header: "Annee",
                          accessor: "annee",
                          Cell: ({ cell }) => (
                            entities[cell.row.id].annee === null ? (<div className="table-bl table-bl135">
                              <Select
                                className="react-select primary "
                                classNamePrefix="react-select"
                                name="Annee"
                                placeholder="Annee"
                                value={anneeSelect[cell.row.id]}
                                onChange={(v) => {
                                  var e = entities;
                                  var select = anneeSelect;
                                  e[cell.row.id].annee = v.value;
                                  select[cell.row.id] = v;
                                  setAnneeSelect(select);
                                  setEntities(e);
                                  setTable(e, 1);
                                }}
                                options={optionsAnnee}
                              /></div>) : cell.row.values.annee)
                        },
                        {
                          Header: "Date limite",
                          accessor: "na",
                        },
                        ,
                        {
                          Header: "Action",
                          accessor: "id",
                          Cell: ({ cell }) => (
                            <div className="actions-right block_action">
                              <Button
                                id={"idLigneR_" + cell.row.id}
                                onClick={(ev) => {
                                  deleteLigne(cell.row.id);
                                }}
                                variant="danger"
                                size="sm"
                                className="text-danger btn-link delete"
                              >
                                <i
                                  className="fa fa-trash"
                                  id={"idLigneR_" + cell.row.id}
                                />
                              </Button>
                            </div>
                          ),
                        },
                      ]}
                      className="-striped -highlight primary-pagination"
                    />

                  </Col>
                  <br></br>
                  <hr></hr>
                  <Button
                    className="btn-fill pull-left"
                    type="button"
                    variant="info"
                    nom="redac"
                    onClick={(ev) => AjoutLigne()}
                  >
                    Ajouter
                  </Button>
                  <Col md="12">

                    <Button
                      id="saveBL"
                      className="btn-wd btn-outline mr-1 float-right"
                      type="button"
                      variant="success"
                      onClick={() =>
                        saveTable(entities, uploadFile, fourSelected, annee, mois,type)
                      }
                    >
                      <span className="btn-label">
                        <i className="fas fa-check"></i>
                      </span>
                      Enregistrer
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default ReleveGro;
