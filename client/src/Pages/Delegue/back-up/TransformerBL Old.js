import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";

import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import {
  extractionsBL,
  blAdded,
  saveFile,
  blVerif,
  saveFile64,
} from "../../Redux/blReduce";
import { cheeckProduit, getActiveProduit } from "../../Redux/produitReduce";
import { getPharmacieByBricks, getActivePharmacie } from "../../Redux/pharmacieReduce";
import { getIdSecteurIms } from "../../Redux/secteurReduce";
import {
  getActiveFournisseur,
  cheeckFournisseur,
} from "../../Redux/fournisseurReduce";
import { getActiveDelegue } from "../../Redux/usersReduce";
import { getPackBySegment } from "../../Redux/packReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTableBl.js";
import jwt_decode from "jwt-decode";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import Configuration from "../../configuration";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

function TransformerBL() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idrole = decoded.userauth.idrole;
  /* const idSect = decoded.userauth.idsect; */
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
  const [somme, setSomme] = useState(0.0);
  const [adresse, setAdresse] = useState(null);
  //user
  const [userSelected, setUserSelected] = React.useState(null);
  const [optionUser, setOptionUser] = React.useState([
    {
      value: "",
      label: "User",
      isDisabled: true,
    },
  ]);
  //client
  const [clientSelected, setClientSelected] = React.useState(null);
  const [optionClient, setOptionClient] = React.useState([
    {
      value: "",
      label: "Pharmacie",
      isDisabled: true,
    },
  ]);
  //IMS
  const [ims, setIms] = React.useState(null);
  //pack
  const [packSelected, setPackSelected] = React.useState(null);
  const [optionPack, setOptionPack] = React.useState([
    {
      value: "",
      label: "Pack",
      isDisabled: true,
    },
  ]);
  //fournisseur
  const [fournisseur, setFournisseur] = React.useState(null);
  const [fourSelected, setFourSelected] = React.useState(null);
  const [optionFour, setOptionFour] = React.useState([
    {
      value: "",
      label: "Grossiste",
      isDisabled: true,
    },
  ]);
  //Produit
  const [produitSelect, setProduitSelect] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
      isDisabled: true,
    },
  ]);
  //table body
  const [entities, setEntities] = useState([]);
  const [entitiesEntete, setEntitiesEntete] = useState([]);
  const [uploadFile, setUploadFile] = React.useState();

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
  const showTableCrop = (img) => {
    var element = document.getElementById("table-BL");
    var element1 = document.getElementById("table-BL-header");
    element.classList.add("hidden");
    element1.classList.add("hidden");
    document.getElementById("loaderTable").classList.remove("hidden");
    dispatch(saveFile64({ imageSrc: img })).then((e) => {
      var res = e.payload.data;
      setFileName(e.payload.fileName);
      if (res.length !== 0) {
        checkFour(res[0], res);
      }
      checkProd(res);
      element.classList.remove("hidden");
      element1.classList.remove("hidden");
    });
  };
  /** end crop img**/
  function setFour(four,newDateFormat,idDelegue){
    var array = [];
    array.push({
      Adresse: null,
      Client: null,
      nomClient: null,
      Fournisseur: four,
      dateBL: newDateFormat,
      ims: null,
      numBl: null,
      iduser: idDelegue,
      id_pack: 0,
      file: null,
      numeroBL: null,
    });
    setEntitiesEntete(array);
  }
  const checkFour = useCallback(
    async (four, entities) => {
      dispatch(cheeckFournisseur({ nomFournisseur: four.Fournisseur })).then(
        (rowsdes) => {
          var idDelegue = parseInt(idrole) === 2 ? idUser : null;
          var fo = rowsdes.payload;
          
          var newDateFormat = setFormatDate(entities[0].DateBL);
          var four = null;
          if (fo[0] !== null) {
            setFournisseur(fo[0][0]);
            four = fo[0][0];
          } else {
            setFournisseur(null);
          }          
          setFour(four,newDateFormat,idDelegue)
          /* var entete = [];
            entete.push({
            Adresse: null,
            Client: null,
            nomClient: null,
            Fournisseur: four,
            dateBL: newDateFormat,
            ims: null,
            numBl: null,
            iduser: idDelegue,
            id_pack: 0,
            file: null,
            numeroBL: null,
          });
          setEntitiesEntete(entete); */
        }
      );
    },
    [dispatch, idUser, idrole]
  );
  const checkProd = useCallback(
    async (table) => {
      var arrayBody = [];
      dispatch(cheeckProduit(table)).then((rowsdes) => {
        var prod = rowsdes.payload;
        var som = 0;
        for (var i = 0; i < prod.length; i++) {
          var prix = 0;
          var qte = 0;
          /* var mnt = 0; */
          /* var mnt=parseFloat(table[i].Prix) * parseFloat(table[i].Quantite); */
          /* if (!isNaN(parseFloat(table[i].Montant))) {
            mnt = parseFloat(table[i].Montant);
          } */
          if (!isNaN(parseInt(table[i].Quantite))) {
            qte = parseInt(table[i].Quantite);
          }
          
          if (!isNaN(parseFloat(table[i].Prix))) {
            prix = parseFloat(table[i].Prix);
          }
          var mnt= prix * qte;
          som += mnt;
          if (prod[i] !== null) {
            arrayBody.push({
              Designation: prod[i][0],
              Prix: prix,
              Quantite: qte,
              Code: table[i].Code,
              Montant: mnt.toFixed(3),
              idProduit: prod[i][2],
            });
          } else {
            arrayBody.push({
              Designation: table[i].Designation,
              Prix: prix,
              Quantite: qte,
              Code: table[i].Code,
              Montant: mnt.toFixed(3),
              idProduit: null,
            });
          }
        }
        setSomme(som.toFixed(3));
        setEntities(arrayBody);
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
        var moy = 0;
        table.forEach((value) => {
          var sommeMnt=parseFloat(value.Prix) * parseFloat(value.Quantite);
          arrayBody.push({
            Designation: value.Designation,
            Prix: value.Prix,
            Quantite: value.Quantite,
            Code: value.Code,
            Montant: sommeMnt.toFixed(3),
            idProduit: value.idProduit,
          });
          moy += parseFloat(sommeMnt);
        });
        setSomme(moy.toFixed(3));
        setEntities(arrayBody);
      } else {
        checkProd(table);
      }
    },
    [checkProd]
  );
  function uploadBL(event) {
    var element = document.getElementById("table-BL");
    var element1 = document.getElementById("table-BL-header");
    element.classList.add("hidden");
    element1.classList.add("hidden");
    let blFile = event.target.files[0];
    if(blFile){
      var ext = blFile.name.split(".")
      setExtensionFile(ext[(ext.length-1)]);
      setImage(URL.createObjectURL(blFile));
      if (ext[1] === "pdf") {
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

  //get pharmacie
  const getPharmacie = useCallback(async () => {
    /* var secteur = await dispatch(getIdSecteurIms(idSect));
    var idBricks = secteur.payload;
    var pharmacie = await dispatch(getPharmacieByBricks({idBricks}));
    var entities = pharmacie.payload; */
    var entities = [];
    entities = await dispatch(getActivePharmacie());
    /* if(idrole === 2){
      var secteur = await dispatch(getIdSecteurIms(idSect));
      var idBricks = secteur.payload;
      if(idBricks[0] === 0)
        entities = await dispatch(getActivePharmacie());
      else
        entities = await dispatch(getPharmacieByBricks({idBricks}));
    }      
    else{
      entities = await dispatch(getActivePharmacie());
    } */
    var arrayOption = [];
      entities.payload.forEach((e) => {
        arrayOption.push({
          value: e.id,
          label: e.nom,
          idIms: e.ims.id,
          libIms: e.ims.libelle,
          adresse: e.adresse,
        });
      });
    setOptionClient(arrayOption);
  }, [dispatch]);

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

  //get utilisateur
  const getUtilisateur = useCallback(async () => {
    var utilisateur = await dispatch(getActiveDelegue());
    var entities = utilisateur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nomU + " " + e.prenomU });
    });
    setOptionUser(arrayOption);
  }, [dispatch]);

  //get pack
  const getPack = useCallback(async (idPharmacie) => {
    var pack = await dispatch(getPackBySegment(idPharmacie));
    var arrayOption = pack.payload;
    setPackSelected(arrayOption[0]);
    setOptionPack(arrayOption);
  }, [dispatch]);

  const showTable = useCallback(
    async (file) => {
      var element = document.getElementById("table-BL");
      var element1 = document.getElementById("table-BL-header");
      element.classList.add("hidden");
      element1.classList.add("hidden");
      if (typeof file === "object") {
        document.getElementById("loaderTable").classList.remove("hidden");
        const dataArray = new FormData();
        dataArray.append("file", file);
        dataArray.append("api_key", Configuration.api_key);

        dataArray.append("name", file.name);
        var bl = await dispatch(extractionsBL(dataArray));
        var entities = bl.payload;

        /* var element = document.getElementById("table-BL");
        var element1 = document.getElementById("table-BL-header"); */
        element.classList.remove("hidden");
        element1.classList.remove("hidden");
        if (entities.length !== 0) {
          checkFour(entities[0], entities);
        }
        setTable(entities, 0);
        notify("tr", "Extraction avec succes", "success");
      } else {
        notify("tr", "Il faut selectionner un bl", "danger");
      }
    },
    [dispatch, checkFour, setTable]
  );
  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      Designation: null,
      Prix: 0,
      Quantite: 0,
      Code: 0,
      Montant: 0,
      idProduit: null,
    };
    setEntities(list);
  }
  function deleteLigne(nb) {
    if (entities.length > 1) {
      /* 
      var liste = entities;
      liste.splice(nb, 1);
      setEntities(liste); */
      var som = somme;
      som -= parseFloat(entities[nb].Montant);
      setSomme(som.toFixed(3));
      var filtered = entities.filter(function(value, index, arr){
        return index !== parseInt(nb);
      });
      setEntities(filtered);
        notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
  }
  function setFormatDate(d) {
    var formatDate = null;
    if (d !== "" && d !== null) {
      var str = d.replaceAll("/", "");
      if (isNaN(str.trim()) === false) {
        var pos = d.indexOf("/");
        var dataFormat = "";
        var dateTrime = "";
        var dataSplit = "";
        if (pos !== -1) {
          dateTrime = d.trim();
          dataSplit = dateTrime.split("/");
          dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0];
        } else {
          dateTrime = d.trim();
          dataSplit = dateTrime.split("-");
          dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0];
        }
        var newDate = new Date(dataFormat);
        if (newDate === "Invalid Date") formatDate = null;
        else formatDate = dataFormat;
      }
    }
    return formatDate;
  }
  /* const test = useCallback(async (f, n) => {
    var verif = await dispatch(blVerif({ numeroBL: n, fournisseur: f }));
    return verif.payload;
  }); */
  const saveTable = useCallback(
    async (entitiesEntete, entities, uploadFile) => {
      /* var testT = await test(
        entitiesEntete[0].Fournisseur,
        entitiesEntete[0].numeroBL
      ); */
      /* var yearBl = new Date(entitiesEntete[0].dateBL).getFullYear();
      var yearNow = new Date().getFullYear();
      var verifDate = yearNow - yearBl; */
      var yearBl = new Date(entitiesEntete[0].dateBL);
      var yearNow = new Date();
      var verifDate = yearNow.getFullYear() - yearBl.getFullYear();
      var verifBl = await dispatch(
        blVerif({
          numeroBL: entitiesEntete[0].numeroBL,
          fournisseur: entitiesEntete[0].Fournisseur,
          somme:somme
        })
      );
      var testT = await verifBl.payload;
      if(verifDate < 0 || verifDate > 1 || yearBl.getTime() > yearNow.getTime())
        notify("tr", "Date invalide", "danger");
      else if (
        entitiesEntete[0].Client === null ||
        entitiesEntete[0].Fournisseur === null ||
        entitiesEntete[0].dateBL === null ||
        entitiesEntete[0].dateBL === "" ||
        entitiesEntete[0].iduser === null ||
        entitiesEntete[0].numeroBL === null ||
        entitiesEntete[0].numeroBL === ""
      ) {
        notify("tr", "Vérifier vos données!", "danger");
      } else if (testT === true) {
        notify("tr", "Bl existe deja ", "danger");
      } else {
        var verif = true;
        entities.forEach((data) => {
          if (data.idProduit === null) verif = false;
          if (data.Montant === "" || data.Montant === 0) verif = false;
          if (data.Quantite === "" || data.Quantite === 0) verif = false;
        });
        if (verif === false) {
          notify("tr", "Vérifier vos données!", "danger");
        } else {
          if(traitment === false){
            const dataArray = new FormData();
            dataArray.append("file", uploadFile);
            dataArray.append("name", uploadFile.name);
            var bl = "";
            dataArray.append("bl", bl);
            dispatch(saveFile(dataArray)).then((e) => {
              entitiesEntete[0].file = e.payload.filename;
              var nomClientSplit = entitiesEntete[0].nomClient.replaceAll(" ","");
              var numBl = nomClientSplit + "@" + entitiesEntete[0].dateBL + "@" + entities[0].idProduit + "@" + entities[0].Quantite + "@" + somme;
              entitiesEntete[0].numBl = numBl;
              dispatch(blAdded({ bl: entitiesEntete[0], ligneBl: entities})).then((e) => {
                if(e.payload===true){
                  notify("tr", "Insertion avec succes", "success");
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                }else{                
                  notify("tr", "Vérifier vos données!", "danger");
                }
              });
            });
          } else {
            entitiesEntete[0].file = fileName;
            var nomClientSplit = entitiesEntete[0].nomClient.replaceAll(" ","");
            var numBl = nomClientSplit + "@" + entitiesEntete[0].dateBL + "@" + entities[0].idProduit + "@" + entities[0].Quantite + "@" + somme;
            entitiesEntete[0].numBl = numBl;
            dispatch(blAdded({ bl: entitiesEntete[0], ligneBl: entities})).then((e) => {
              if(e.payload===true){
                notify("tr", "Insertion avec succes", "success");
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              }else{                
                notify("tr", "Vérifier vos données!", "danger");
              }
            });
            /* fileName */
          }
        }
      }
    },
    [dispatch, somme,fileName,traitment]
  );

  const removeProduit = useCallback(async (list,select,id) => {
    list[id].idProduit = null;
    list[id].Designation = null;
    /* var select = produitSelect; */
    select[id] = null;
    setProduitSelect(select);
    setEntities(list);
    setTable(list, 1);
  },
    [setTable]
  );
  const removeFournisseur = useCallback(async (list,id) => {
    setFour(null,list[0].dateBL,list[0].iduser);
    setFournisseur(null);
  },
    []
  );
  useEffect(() => {
    getproduit();
    getPharmacie();
    getFournisseur();
    if (idrole === 3) getUtilisateur();
  }, [
    getproduit,
    getPharmacie,
    getFournisseur,
    getUtilisateur,
    idrole,
  ]);
  return (
    <>
      <Container fluid className="responsive-BL table-dynamique">
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Tranformer BL</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="text-center">
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
                  {/* <Document
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
                  </Document> */}
                  {extensionFile === "" ? (
                    <h4>
                      Veuillez sélectionner un document PDF/Image <br></br> Nous
                      recomandons d'utiliser PDFScaner pour la prise des photos
                    </h4>
                  ) : extensionFile === "pdf" ? (
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
                </div>
                {/* crop image */}
                {traitment !==false?        
                  <div>
                    <div style={{ width: "100%" }}>
                      <br />
                      <br />
                      <Cropper
                        style={{ height: 650, width: "100%" }}
                        zoomTo={0}
                        initialAspectRatio={1}
                        preview=".img-preview"
                        src={image1}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        rotatable={true}
                        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                        onInitialized={(instance) => {
                          setCropper(instance);
                        }}
                        guides={true}
                        rotateTo={rotation}
                      />
                    </div>
                    <div className="sliderContainer">
                      <Typography
                        variant="overline"
                        className="sliderLabel"
                      >
                        Rotation
                      </Typography>
                      <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        className="slider"
                        onChange={(e, rotation) => {
                            setRotation(rotation)
                            cropper.rotate(rotation)
                          }
                        }
                      />
                    </div> 
                    <div>
                      <div
                        className="box"
                        style={{ width: "50%", float: "right", height: "300px" }}
                      >
                        <h1>
                          <button className="btn btn-info" onClick={getCropData}>
                            Traitment
                          </button>
                        </h1>
                        {cropData !=="#"?
                          <div>
                            <img style={{ width: "100%" }} src={cropData} alt="cropped" />
                          </div>
                        :""}
                        
                      </div>    
                      <br style={{ clear: "both" }} />
                    </div>
                  </div>
                :""}
                <Button
                  className="btn-wd btn-outline mr-1 float-right extraction"
                  id="blExt"
                  type="button"
                  variant="info"
                  onClick={(v) => {
                    if(traitment === false)
                      showTable(uploadFile);
                    else if(cropData!=="#"){                       
                      showTableCrop(cropData);
                    }
                  }}
                >
                  <span className="btn-label">
                    <i className="fas fa-cogs"></i>
                  </span>
                  BL Extractions
                </Button>
                {image !=="" && traitment === false?
                  <Button
                    className="btn-wd mr-1 float-left"
                    id="blExt"
                    type="button"
                    variant="danger"
                    onClick={(v) => {
                      setTraitment(true);
                    }}
                  >
                    <span className="btn-label">
                      <i className="fas fa-image"></i>
                    </span>
                    traitment image
                  </Button>
                :""}
                <br></br>

                <div className="text-center">
                  <img
                    id="loaderTable"
                    className="hidden"
                    src={require("../../assets/img/loader.gif").default} 
                    alt="loader"
                  />
                </div>
                <br></br>
                <Row className="hidden" id="table-BL-header">
                  {idrole === 3 ? (
                    <Col md="3">
                      <span>Délégué</span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="Delegue"
                        placeholder="Délégué"
                        value={userSelected}
                        onChange={(v) => {
                          setUserSelected(v);
                          var entete = entitiesEntete;
                          entete[0].iduser = v.value;
                          setEntitiesEntete(entete);
                        }}
                        options={optionUser}
                      />
                    </Col>
                  ) : ""}
                  <Col md="12">
                    <hr></hr>
                    {entitiesEntete.length > 0 ? (
                      <div>
                        <ReactTable
                          data={entitiesEntete}
                          columns={[
                            {
                              Header: "Numero BL",
                              accessor: "numeroBL",
                              Cell: ({ cell }) => (
                                <Form.Group>
                                  <Form.Control
                                    defaultValue={cell.row.values.numeroBL}
                                    placeholder="numero BL"
                                    type="text"
                                    onChange={(val) => {
                                      var entete = entitiesEntete;
                                      entete[0].numeroBL = val.target.value;
                                      setEntitiesEntete(entete);
                                    }}
                                  ></Form.Control>
                                </Form.Group>
                              ),
                            },
                            {
                              Header: "Pharmacie",
                              accessor: "Client",
                              Cell: ({ cell }) => (
                                <div className="table-bl">
                                  <div>
                                    <Select
                                      className="react-select primary "
                                      classNamePrefix="react-select"
                                      name="Pharmacie"
                                      placeholder="Pharmacie"
                                      value={clientSelected}
                                      onChange={(v) => {
                                        var entete = entitiesEntete;
                                        entete[0].idIms = v.idIms;
                                        entete[0].Adresse = v.adresse;
                                        entete[0].Client = v.value;
                                        entete[0].nomClient = v.label;
                                        setEntitiesEntete(entete);
                                        setIms(v.libIms);
                                        setAdresse(v.adresse);
                                        setClientSelected(v);
                                        getPack(v.value);
                                      }}
                                      options={optionClient}
                                    />
                                  </div>
                                </div>
                              ),
                            },
                            {
                              Header: "date",
                              accessor: "dateBL",
                              Cell: ({ cell }) => (
                                <Form.Group>
                                  <Form.Control
                                    defaultValue={cell.row.values.dateBL}
                                    type="date"
                                    onChange={(d) => {
                                      var entete = entitiesEntete;
                                      entete[0].dateBL = d.target.value;
                                      setEntitiesEntete(entete);
                                    }}
                                  ></Form.Control>
                                </Form.Group>
                              ),
                            },
                            {
                              Header: "Bricks",
                              accessor: "idIms",
                              Cell: ({ cell }) => (
                                <Form.Group>
                                  <Form.Control
                                    readOnly
                                    defaultValue={ims}
                                    placeholder="Bricks"
                                    type="text"
                                  ></Form.Control>
                                </Form.Group>
                              ),
                            },
                          ]}
                          className="-striped -highlight primary-pagination"
                        />
                        <br></br>
                        <ReactTable
                          data={entitiesEntete}
                          columns={[
                            {
                              Header: "Packs",
                              accessor: "packs",
                              Cell: ({ cell }) => (
                                <div className="table-bl">
                                  <Select
                                    placeholder="Pack"
                                    className="react-select primary "
                                    classNamePrefix="react-select"
                                    name="Pack"
                                    value={packSelected}
                                    onChange={(v) => {
                                      setPackSelected(v);
                                      var entete = entitiesEntete;
                                      entete[0].id_pack = v.value;
                                      setEntitiesEntete(entete);
                                    }}
                                    options={optionPack}
                                  />
                                </div>
                              ),
                            },
                            {
                              Header: "Grossiste",
                              accessor: "Fournisseur",
                              Cell: ({ cell }) => (
                                <div className="table-bl">
                                  {fournisseur === null ? (
                                    <div>
                                      <Select
                                        className="react-select primary "
                                        placeholder="Grossiste"
                                        classNamePrefix="react-select"
                                        name="Fournisseur"
                                        value={fourSelected}
                                        onChange={(v) => {
                                          var entete = entitiesEntete;
                                          entete[0].Fournisseur = v.label;
                                          setFourSelected(v);
                                          setEntitiesEntete(entete);
                                        }}
                                        options={optionFour}
                                      />
                                    </div>
                                  ) : (
                                    <Form.Group className="fournisseurInput">
                                      <Form.Control
                                        readOnly
                                        className="green"
                                        defaultValue={fournisseur}
                                        placeholder="Grossiste"
                                        type="text"
                                      ></Form.Control>
                                      <Button
                                        onClick={() => {
                                          removeFournisseur(entitiesEntete,cell.row.id)
                                        }}
                                      >
                                        <i className="fa fa-trash"/>
                                      </Button>
                                    </Form.Group>
                                  )}
                                </div>
                              ),
                            },
                            {
                              Header: "Adresse",
                              accessor: "adresse",
                              Cell: ({ cell }) => (
                                <Form.Group>
                                  <Form.Control
                                    readOnly
                                    defaultValue={adresse}
                                    placeholder="Adresse"
                                    type="text"
                                  ></Form.Control>
                                </Form.Group>
                              ),
                            },
                          ]}
                          className="-striped -highlight primary-pagination"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
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
                          accessor: "Designation",
                          Cell: ({ cell }) => (
                            <div>
                              {entities[cell.row.id].idProduit !== null ? (
                                <Form.Group className="desinationProduit">
                                  <Form.Control
                                    className="green"
                                    readOnly
                                    defaultValue={cell.row.values.Designation}
                                    placeholder="Designation"
                                    type="text"
                                  ></Form.Control>
                                  <Button
                                    onClick={() => {
                                      removeProduit(entities,produitSelect,cell.row.id)
                                    }}
                                  >
                                    <i
                                      className="fa fa-trash"
                                    />
                                  </Button>
                                </Form.Group>
                              ) : (
                                <div className="table-bl">
                                  {cell.row.values.Designation != null ? (
                                    <Form.Group className="desinationProduit">
                                      <Form.Control
                                        className="red"
                                        readOnly
                                        defaultValue={
                                          cell.row.values.Designation
                                        }
                                        placeholder="Designation"
                                        type="text"
                                      ></Form.Control>
                                      <Button
                                        onClick={() => {
                                          removeProduit(entities,produitSelect,cell.row.id)
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
                                          e[cell.row.id].Designation = v.label;
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
                          accessor: "Code",
                          Cell: ({ cell }) => (
                            <div>
                              <Form.Group>
                                <Form.Control
                                  readOnly
                                  defaultValue={cell.row.values.Code}
                                  placeholder="Code"
                                  type="text"
                                ></Form.Control>
                              </Form.Group>
                            </div>
                          ),
                        },
                        {
                          Header: "Quantite",
                          accessor: "Quantite",
                          Cell: ({ cell }) => (
                            <div>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={cell.row.values.Quantite}
                                  placeholder="quantité"
                                  type="Number"
                                  onBlur={(value) => {
                                    var e = entities;
                                    if (e[cell.row.id].Prix != null) {
                                      var mnt = parseFloat(value.target.value) * parseFloat(e[cell.row.id].Prix);
                                      e[cell.row.id].Montant = mnt.toFixed(3);
                                    }
                                    e[cell.row.id].Quantite = parseFloat(
                                      value.target.value
                                    );
                                    setTable(e, 1);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </div>
                          ),
                        },
                        {
                          Header: "Prix",
                          accessor: "Prix",
                          Cell: ({ cell }) => (
                            <div>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={cell.row.values.Prix}
                                  placeholder="Prix"
                                  type="Number"
                                  onBlur={(value) => {
                                    var e = entities;
                                    if (e[cell.row.id].Quantite != null) {
                                      var mnt = parseFloat(value.target.value) * parseFloat(e[cell.row.id].Quantite);
                                      e[cell.row.id].Montant = mnt.toFixed(3);
                                    }
                                    e[cell.row.id].Prix = parseFloat(
                                      value.target.value
                                    );
                                    setTable(e, 1);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </div>
                          ),
                        },
                        {
                          Header: "Montant",
                          accessor: "Montant",
                          Cell: ({ cell }) => (
                            <div>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={cell.row.values.Montant}
                                  placeholder="Montant"
                                  type="Number"
                                  onBlur={(value) => {
                                    var e = entities;
                                    e[cell.row.id].Montant = value.target.value;
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
                    <br></br>
                    <Button
                      className="btn-fill pull-left"
                      type="button"
                      variant="info"
                      nom="redac"
                      onClick={(ev) => AjoutLigne()}
                    >
                      Ajouter
                    </Button>
                  </Col>
                  <Col md="12">
                    <div className="totalMax">Total HT : {somme} TND</div>

                    <Button
                      id="saveBL"
                      className="btn-wd btn-outline mr-1 float-right"
                      type="button"
                      variant="success"
                      onClick={() =>
                        saveTable(entitiesEntete, entities, uploadFile)
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
export default TransformerBL;