import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
import { ExcelRenderer } from "react-excel-renderer";
import { getActiveFournisseur } from "../../Redux/fournisseurReduce";
import { getActiveProduit } from "../../Redux/produitReduce";
import {
  releveVenteAddedExcel,
  saveFile,
  cheeckProduit,
  verifReleveVente,
  cheeckFournisseur
} from "../../Redux/releveVenteReduce";
import { getActiveDelegue } from "../../Redux/usersReduce";
import { getAllAnneeLignesBL } from "../../Redux/blReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTableBl.js";
import { Alert } from "react-bootstrap";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import "cropperjs/dist/cropper.css";
import { verifGrous } from "./VerifVenteExcel/verifGrousVente";
import jwt_decode from "jwt-decode";

function ReleveVente() {
  /* const str = "Karray-feěvrier-2023.xlsx";
  console.log(str.replace(/[^a-zA-Z0-9,;\-.!? ]/g, ''),str); */

  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idRole = decoded.userauth.idrole;

  var list = [43, 16, 47, 41, 12, 40, 48, 46, 28, 11, 44, 13, 38, 50, 17,45,34];
  var date = new Date().getFullYear();
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
  const [produitExist, setProduitExist] = React.useState("");

  const [annee, setAnnee] = React.useState(null);
  const [txtAlert, setTxtAlert] = React.useState("");
  const [anneeSelect, setAnneeSelect] = React.useState([]);
  const [optionsAnnee, setOptionsAnnee] = React.useState([
    {
      value: "",
      label: "Annee",
      isDisabled: true,
    },
  ]);

  const [fourSelected, setFourSelected] = React.useState([]);
  const [optionFour, setOptionFour] = React.useState([
    {
      value: "",
      label: "Grossiste",
      isDisabled: true,
    },
  ]);

  const [delegueSelected, setDelegueSelected] = React.useState(null);
  const [optionDelegue, setOptionDelegue] = React.useState([
    {
      value: "",
      label: "Delegué",
      isDisabled: true,
    },
  ]);

  const [type, setType] = React.useState(null);
  const [typeGro, setTypeGro] = React.useState(null);
  const [optionTypeGro] = React.useState([
    {
      value: "",
      label: "Extraction",
      isDisabled: true,
    },
    {
      value: "1",
      label: "Fin mois",
    },
  ]);
  const [typeSelect, setTypeSelect] = React.useState([]);
  const [optionType] = React.useState([
    {
      value: "",
      label: "Type",
      isDisabled: true,
    },
    {
      value: "2",
      label: "Vente",
    },
  ]);
  
  const [moisSelect, setMoisSelect] = React.useState([]);
  const [testAffiche, setTestAffiche] = useState(true);
  const [optionsMois] = React.useState([
    {
      value: "",
      label: "Mois",
      isDisabled: true,
    },
    { value: "01", label: "janvier" },
    { value: "02", label: "février" },
    { value: "03", label: "mars" },
    { value: "04", label: "avril" },
    { value: "05", label: "mai" },
    { value: "06", label: "juin" },
    { value: "07", label: "juillet" },
    { value: "08", label: "août" },
    { value: "09", label: "septembre" },
    { value: "10", label: "octobre" },
    { value: "11", label: "novembre" },
    { value: "12", label: "décembre" },
  ]);
  const getAnnes = useCallback(async () => {
    var year = await dispatch(getAllAnneeLignesBL());
    var arrayOption = [];
    var testA = false;
    year.payload.forEach((element) => {
      if (date === element.annee) testA = true;
      arrayOption.push({ value: element.annee, label: element.annee });
    });
    if (!testA) {
      arrayOption.push({ value: date, label: date });
    }
    setOptionsAnnee(arrayOption);
  }, [dispatch, date]);

  //table body
  const [entities, setEntities] = useState([]);
  const [entitiesFr, setEntitiesFr] = useState([]);
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

  /** start crop img**/
  const [fileName, setFileName] = useState("");

  const fileHandler = (e,annee, testAffiche, type) => {
    let fileObj = e.target.files[0];
    if (fileObj) {
        setUploadFile(fileObj);
        var str = fileObj.name.replace(/[^a-zA-Z0-9,;\-.!? ]/g, "");
        setFileName(str);
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, async (err, resp) => {
          if (err) {
            console.log(err);
          } else {
            let arrayBody = [];
            arrayBody = await verifGrous(
              resp.rows,
              annee.value,
              type.value
            );
            checkProd(arrayBody);
            checkFour(arrayBody);
          }
        });
      
    }
  };

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
      filtered = typeSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setTypeSelect(filtered);
      filtered = anneeSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setAnneeSelect(filtered);
      filtered = moisSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setMoisSelect(filtered);
      filtered = entities.filter(function (value, index, arr) {
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
            if (
              prod[i] !== null &&
              typeof prod[i] !== "undefined" &&
              prod[i] !== "undefined"
            ) {
              arrayBody.push({
                idProduit: prod[i][2],
                designation: prod[i][0],
                codeFr: table[i].codeFr,
                mois: table[i].mois,
                code: table[i].code,
                vente: table[i].vente,
              });
            } else {
              if (table[i].code !== "")
                produitexit.push(
                  "Code produit " + table[i].code + " \n\n/ \n\n"
                );
              arrayBody.push({
                idProduit: null,
                designation: table[i].designation,
                code: table[i].code,
                vente: table[i].vente,
              });
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


  const checkFour = useCallback(
    async (table) => {
      var arrayFrs = [];
      dispatch(cheeckFournisseur(table)).then(
        (rowsdes) => {
          if (rowsdes !== undefined && rowsdes.payload.length > 0) {
            var frs = rowsdes.payload;
            for (var i = 0; i < frs.length; i++) {
              if (
                frs[i] !== null &&
                typeof frs[i] !== "undefined" &&
                frs[i] !== "undefined"
              ) {
                arrayFrs.push({
                  idFrs: frs[i][2],
                  codeFr: frs[i][0],
                  mois: table[i].mois,
                  code: table[i].code,
                  vente: table[i].vente,

                });
              }
            }
            setEntitiesFr(arrayFrs)
          }
          else {
            setEntitiesFr([])
          }
          }
      );
    },
    [dispatch]
  );


  const setTable = useCallback(
    async (table, init) => {
      //1 => update table ***** 0 => initialiser table
      var arrayBody = [];
      if (init === 1) {
        table.forEach((value) => {
          arrayBody.push({
            code: value.code,
            idProduit: value.idProduit,
            idFrs : value.idFrs ,
            designation: value.designation,
            vente: value.vente,
            date: value.date,
            codeFr : value.codeFr,
            mois : value.mois ,
          });
        });
        setEntities(arrayBody);
      } else {
        checkProd(table);
        checkFour(table);
      }
    },
    [checkProd]
  );

  //get fournisseur
  const getFournisseur = useCallback(async () => {
    var fournisseur = await dispatch(getActiveFournisseur());
    var entities = fournisseur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.code });
    });
    setOptionFour(arrayOption);
  }, [dispatch]);



  const showTable = useCallback(
    async (file,type,annee) => {
      if (
        file &&
        type !== null &&
        type.value !== "" &&
        annee !== null &&
        annee.value !== ""  
      ) {
        dispatch(
          verifReleveVente({
            annee: annee.value,
            namefile: fileName,
          })
        ).then(async (e) => {
          if (e.payload === false) {
            if (typeof file === "object") {
              var element = document.getElementById("table-BL");
              element.classList.remove("hidden");
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
    [dispatch, fileName]
  );

  const removeProduit = useCallback(
    async (list, select, id) => {
      list[id].idProduit = null;
      list[id].designation = null;
      select[id] = null;
      setProduitSelect(select);
      setEntities(list);
      setTable(list, 1);
    },
    [setTable]
  );

  const removeGrossiste = useCallback(
    async (list, select, id) => {
      list[id].idFrs = null;
      list[id].codeFr = null;
      setEntitiesFr(list);
      setTable(list, 1);
    },
    [setTable]
  );

  const saveTable = useCallback(
    async (entities, entitiesFr , uploadFile, annee, type, typeGro) => {
      console.log(entities)
      var verif = true;
      if (entities.length > 0) {
        entities.forEach((data) => {
          if (data.idProduit === null) verif = false;
        });
      } else {
        verif = false;
      }
      if (verif === false) {
        notify("tr", "Vérifier vos données!", "danger");
      } else {
        const dataArray = new FormData();
        dataArray.append("file", uploadFile);
        dataArray.append("name", uploadFile.name);
        var bl = "";
        dataArray.append("bl", bl);
          dispatch(saveFile(dataArray)).then((e) => {
            var filename = e.payload.filename;
            dispatch(
              releveVenteAddedExcel({
                annee: annee.value,
                file: filename,
                namefile: uploadFile.name,
                ligneReleve: entities,
                ligne : entitiesFr,
                type: type.value,
                typeGro: typeGro.value,
              })
            ).then((e) => {
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
        
      }
    },
    [dispatch]
  );

  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      code: null,
      idProduit: null,
      idFrs : null ,
      designation: null,
      vente: null,
      date: null,
      codeFr : null , 
      mois : 0 ,
    };
    setEntities(list);
  }

  useEffect(() => {
    getFournisseur();
    getAnnes();
    getproduit();
  }, [getAnnes, getFournisseur, getproduit]);
  const getOptionLabel = (option) => {
    var classNames = "red-four";
    if (list.indexOf(parseInt(option.value)) > -1) classNames = "";
    return <div className={classNames}>{option.label}</div>;
  };



  return (
    <>
      <Container fluid className="responsive-BL table-dynamique releve-class">
        {produitExist !== "" ? (
          <Alert variant="danger">{produitExist}</Alert>
        ) : (
          ""
        )}
        {txtAlert !== "" ? <Alert variant="danger">{txtAlert}</Alert> : ""}
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Reléve vente</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                 
                </Row>
                <div className="text-center">
                {idRole === 3 ? (
                  <Row>
                    <Col md="3">
                      <span>Délégué *</span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        placeholder="Délégué"
                        value={delegueSelected}
                        onChange={(value) => {
                          setDelegueSelected(value);
                        }}
                        options={optionDelegue}
                      />
                    </Col>
                  </Row>
                    ) : ""}
                    <br></br>
                  <Row>
                    <Col md="4">
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
                    <Col md="4">
                      <span>Extraction * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="Type"
                        placeholder="Extraction"
                        value={typeGro}
                        onChange={(v) => {
                          setTypeGro(v);
                        }}
                        options={optionTypeGro}
                      />
                    </Col>
                    <Col md="4">
                      <span>Annee * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="annee"
                        value={annee}
                        onChange={(value) => {
                          setAnnee(value);
                        }}
                        options={optionsAnnee}
                        placeholder="Annee"
                      />
                      <br></br>
                    </Col>
                  </Row>
                 
                  {
                  type !== null &&
                  annee !== null ? (
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroupFileAddon01"
                        >
                          Import fichier
                        </span>
                      </div>
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile01"
                          aria-describedby="inputGroupFileAddon01"
                          onChange={(e) => {
                            fileHandler(
                              e,
                              annee,
                              testAffiche,
                              type
                            );
                          }}
                        />
                        <label className="custom-file-label">{fileName}</label>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {testAffiche === false ? (
                    <table className="table responsive-BL ">
                      <thead className="rt-thead -header">
                        <tr>
                          <td>Code</td>
                          <td>Designation</td>
                          <td>Stock</td>
                          <td>Vente</td>
                          <td>Date limite</td>
                        </tr>
                      </thead>
                    </table>
                  ) : (
                    ""
                  )}
                  <br />
                  <Button
                    className="btn-wd btn-outline mr-1 float-right extraction"
                    id="blExt"
                    type="button"
                    variant="info"
                    onClick={(v) => {
                      showTable(uploadFile,type,annee);
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
                          Header: "Code Grossiste",
                          accessor: "codeFr",
                          Cell: ({ cell }) => (
                            <div>
                              {entities[cell.row.id].codeFr !== null ? (
                                <Form.Group className="desinationProduit">
                                  <Form.Control
                                    className="green"
                                    readOnly
                                    defaultValue={cell.row.values.codeFr}
                                    placeholder="Code Grossiste"
                                    type="text"
                                  ></Form.Control>
                                    <Button
                                    onClick={() => {
                                      removeGrossiste(
                                        entities,
                                        fourSelected,
                                        cell.row.id
                                      );
                                    }}
                                  >
                                    <i className="fa fa-trash" />
                                  </Button>
                                </Form.Group>
                              ) : (
                                <div className="table-bl">
                                  {cell.row.values.codeFr != null ? (
                                    <Form.Group className="desinationProduit">
                                      <Form.Control
                                        className="red"
                                        readOnly
                                        defaultValue={
                                          cell.row.values.codeFr
                                        }
                                        placeholder="Code Grossite"
                                        type="text"
                                      ></Form.Control>
                                      <Button
                                        onClick={() => {
                                          removeGrossiste(
                                            entities,
                                            fourSelected,
                                            cell.row.id
                                          );
                                        }}
                                      >
                                        <i className="fa fa-trash" />
                                      </Button>
                                    </Form.Group>
                                  ) : (
                                    ""
                                  )}
                                  <Select
                                    className="react-select primary "
                                    classNamePrefix="react-select"
                                    name="Produit"
                                    placeholder="Code Grossite"
                                    value={fourSelected[cell.row.id]}
                                    onChange={(v) => {
                                      var e = [...entities];
                                      var select = fourSelected;
                                      e[cell.row.id].idFrs = v.value;
                                      e[cell.row.id].codeFr = v.label;
                                      select[cell.row.id] = v;
                                      setFourSelected(select);
                                      setEntities(e);
                                      setTable(e, 1);
                                    }}
                                    options={optionFour}
                                  />
                                </div>
                              )}
                            </div>
                          ),
                          
                        },
                        {
                          Header: "Designation",
                          accessor: "designation",
                          Cell: ({ cell }) => (
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
                                      removeProduit(
                                        entities,
                                        produitSelect,
                                        cell.row.id
                                      );
                                    }}
                                  >
                                    <i className="fa fa-trash" />
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
                                          removeProduit(
                                            entities,
                                            produitSelect,
                                            cell.row.id
                                          );
                                        }}
                                      >
                                        <i className="fa fa-trash" />
                                      </Button>
                                    </Form.Group>
                                  ) : (
                                    ""
                                  )}
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
                          Header: "Mois",
                          accessor: "mois",
                          Cell: ({ cell }) => (
                            <div>
                              {entities[cell.row.id].mois !== 0 ? (
                                cell.row.values.mois
                              ) : (
                                <div className="table-bl" style={{marginLeft:"-60px"}}>
                                  <Select
                                    className="react-select primary "
                                    classNamePrefix="react-select"
                                    name="Moid"
                                    placeholder="Mois"
                                    value={moisSelect[cell.row.id]}
                                    onChange={(v) => {
                                      var e = [...entities];
                                      var select = moisSelect;
                                      e[cell.row.id].mois = v.value;
                                      select[cell.row.id] = v;
                                      setMoisSelect(select);
                                      setEntities(e);
                                      console.log(entities)
                                    }}
                                    options={optionsMois}
                                  />
                                </div>
                              )}
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
                        saveTable(entities, entitiesFr , uploadFile, annee, type, typeGro)
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
export default ReleveVente;
