import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";

import {
  blVerif,
  getBlById,
  getDetailBl,
  getFileBl,
  updateBl,
} from "../../Redux/blReduce";
import { getActiveProduit } from "../../Redux/produitReduce";
import { getPharmaBySeg } from "../../Redux/pharmacieReduce";
import { getActiveFournisseur } from "../../Redux/fournisseurReduce";
import { getPackByProduits, verifPackByProduits } from "../../Redux/packReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTableBl.js";
import jwt_decode from "jwt-decode";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import "cropperjs/dist/cropper.css";
import { getActionByLine } from "../../Redux/actionReduce";
import { totalCaByAction } from "../../Redux/commandesReduce";
import { useNavigate, useParams } from "react-router";
import { getTvaByAnnee } from "../../Redux/tvaReduce";

function UpdateBL() {
  var token = localStorage.getItem("x-access-token");
  var annee = localStorage.getItem("annee");
  var decoded = jwt_decode(token);
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
  const location = useParams();
  const navigate = useNavigate();
  var idBl = location.idBl;
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  //total ttc
  const [somme, setSomme] = useState(0.0);
  //total ht
  const [sommeHt, setSommeHt] = useState(0.0);
  const [adresse, setAdresse] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
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
  const [packSelected, setPackSelected] = React.useState([]);
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
  const [objFour, setObjFour] = React.useState({});
  //Produit
  const [produitSelect, setProduitSelect] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
      isDisabled: true,
    },
  ]);
  const [objProduit, setObjProduit] = React.useState({});

  //Objectif
  const [objectifSelect, setObjectifSelect] = React.useState([]);
  const [optionObjectif, setOptionObjectif] = React.useState([
    {
      value: "",
      label: "Objectif",
      isDisabled: true,
    },
  ]);
  const [tva, setTva] = useState({});
  //table body
  const [entities, setEntities] = useState([]);
  const [entitiesEntete, setEntitiesEntete] = useState([]);

  /** start crop img**/
  const [loader, setLoader] = React.useState(true);
  const [fileURL, setFileURL] = React.useState(null);
  const [ext, setExt] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  /** end crop img**/
  const getFile = useCallback(
    async (file) => {
      var splitFile = file.split(".");
      var ext1 = splitFile[splitFile.length - 1];
      setExt(ext1);
      setFileName(file);
      dispatch(getFileBl(idBl)).then(async (e1) => {
        var ff = null;
        if (ext1 === "pdf") {
          ff = new Blob([e1.payload], {
            type: "application/pdf",
          });
        } else {
          ff = new Blob([e1.payload], {
            type: "application/*",
          });
        }

        const f = URL.createObjectURL(ff);
        setFileURL(f);
        setLoader(false);
      });
    },
    [dispatch, idBl]
  );

  /***
   * bech inlawjoud 3al action bil idLine illi jeya min pharmacie selectionner
   ***/
  const getObjectif = useCallback(
    async (list) => {
      var id_action = list.id_action;
      var idLine = list.users.line;
      var objectif = await dispatch(getActionByLine(idLine));
      var entities = objectif.payload;
      var arrayOption = [];
      arrayOption.push({
        value: 0,
        label: "Commande spontanée",
        libPack: "Commande spontanée",
        idPack: 0,
        date_debut: "",
        date_fin: "",
        id_segment: 0,
      });
      if (id_action === 0) {
        setObjectifSelect({
          value: 0,
          label: "Commande spontanée",
          libPack: "Commande spontanée",
          idPack: 0,
          date_debut: "",
          date_fin: "",
          id_segment: 0,
        });
      }
      entities.forEach((e) => {
        if (e.id !== 0) {
          arrayOption.push({
            value: e.id,
            label: e.nom,
            libPack: e.libPack,
            idPack: e.idPack,
            date_debut: e.date_debut,
            date_fin: e.date_fin,
            id_segment: e.id_segment,
          });
          if (id_action === e.id) {
            setDateDebut(e.date_debut);
            setDateFin(e.date_fin);
            setObjectifSelect({
              value: e.id,
              label: e.nom,
              libPack: e.libPack,
              idPack: e.idPack,
              date_debut: e.date_debut,
              date_fin: e.date_fin,
              id_segment: e.id_segment,
            });
          }
        }
      });
      getPharmacie(list.actions.id_segment);
      setClientSelected({
        value: list.pharmacies.id,
        label: list.pharmacies.nom,
        idIms: list.ims.id,
        libIms: list.ims.libelle,
        adresse: list.pharmacies.adresse,
      });
      setOptionObjectif(arrayOption);
      getFile(list.file);
    },
    [dispatch]
  );
  //remplire entitiesEntete
  function setFour(etat, list) {
    /*** 0- etat initial 1-update entete ***/
    var array = [];
    if (etat === 0) {
      array.push({
        Adresse: list.pharmacies.adresse,
        Client: list.client,
        Fournisseur: list.fournisseur,
        dateBL: list.dateBl,
        ims: list.ims.libelle,
        idIms: list.ims.id,
        numBl: list.numBl,
        iduser: list.iduser,
        id_action: list.id_action,
        file: list.file,
        numeroBL: list.numeroBL,
        code: list.pharmacies.code,
      });
      setFournisseur(list.fournisseur);
      setIms(list.ims.libelle);
      setAdresse(list.pharmacies.adresse);
      setEntitiesEntete(array);
      getObjectif(list);
      /* setObjectifSelect({
        value:
      }) */
    } else {
      array = [...list];
      array.Fournisseur = null;
    }
    setEntitiesEntete(array);
  }

  const setTable = useCallback(
    async (table, init, objFour, tva, objProduit) => {
      //1 => update table ***** 0 => initialiser table
      var arrayBody = [];
      //total TTC
      var moy = 0;
      //total HT
      var moyHt = 0;

      if (init === 0) {
        var packSelected = [];
        table.forEach((value) => {
          var prix = parseFloat(value.montant) / parseFloat(value.quantite);
          arrayBody.push({
            Designation: value.produits.designation,
            Prix: prix.toFixed(3),
            Quantite: value.quantite,
            Code: value.produits.code,
            Montant: value.montant.toFixed(3),
            montant_ttc: value.montant_ttc.toFixed(3),
            idProduit: value.produits.id,
            id_pack: value.id_pack,
            quantite_rest_p: value.quantite_rest_p,
            montant_rest_p: value.montant_rest_p,
          });
          packSelected.push({
            value: value.packs.id,
            label: value.packs.nom,
            qte: value.quantite,
            mnt: value.montant_rest,
          });
          moy += parseFloat(value.montant_ttc);
          moyHt += parseFloat(value.montant);
        });
        setPackSelected(packSelected);
        setSomme(moy.toFixed(3));
        setSommeHt(moyHt.toFixed(3));
        setEntities(arrayBody);
      } else {
        table.forEach((value) => {
          var sommeMnt = parseFloat(value.Prix) * parseFloat(value.Quantite);
          var sommeMntTtc = sommeMnt;
          if (objProduit[value.idProduit]) {
            if (
              objFour &&
              objFour.tva === 1 &&
              objProduit[value.idProduit].type === 1
            ) {
              sommeMntTtc = sommeMnt * (1 + tva.tva / 100);
            }
          }
          arrayBody.push({
            Designation: value.Designation,
            Prix: value.Prix,
            Quantite: value.Quantite,
            Code: value.Code,
            Montant: sommeMnt.toFixed(3),
            montant_ttc: sommeMntTtc.toFixed(3),
            idProduit: value.idProduit,
            id_pack: value.id_pack,
            quantite_rest_p: value.quantite_rest_p,
            montant_rest_p: value.montant_rest_p,
          });
          moyHt += parseFloat(sommeMnt);
          moy += parseFloat(sommeMntTtc);
        });
        setSomme(moy.toFixed(3));
        setSommeHt(moyHt.toFixed(3));
        setEntities(arrayBody);
      }
    },
    []
  );
  const detailBl = useCallback(async () => {
    var det = await dispatch(getDetailBl(idBl));
    var detail = await det.payload;
    var dataBl = await dispatch(getBlById(idBl));
    var bl = await dataBl.payload;
    setTable(detail, 0, {}, {}, {});
    setFour(0, bl);
  }, [dispatch, idBl]);

  //get Produit
  // bech najbdo produit etat mtehom 1
  const getproduit = useCallback(async () => {
    var type = await dispatch(getActiveProduit());
    var entities = type.payload;
    var arrayOption = [];
    var obj = {};
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.designation, code: e.code });
      obj[e.id] = e;
    });
    setOptionProduit(arrayOption);
    setObjProduit(obj);
  }, [dispatch]);

  //get pharmacie
  // bech najbdo pharmacie etat mtehom 1
  const getPharmacie = useCallback(
    async (id_segment) => {
      var entities = await dispatch(getPharmaBySeg(id_segment));
      var arrayOption = await entities.payload.arrayOption;
      setOptionClient(arrayOption);
    },
    [dispatch]
  );

  //get fournisseur
  // bech najbdo fournisseur etat mtehom 1
  const getFournisseur = useCallback(async () => {
    var fournisseur = await dispatch(getActiveFournisseur());
    var entities = fournisseur.payload;
    var arrayOption = [];
    var obj = {};
    entities.forEach((e) => {
      obj[e.nom] = e;
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setObjFour(obj);
    setOptionFour(arrayOption);
  }, [dispatch]);

// ajouter nouveau ligne entities
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
  
  //effacer ligne de entities
  function deleteLigne(nb) {
    if (entities.length > 1) {
      var list = [...packSelected];
      var list1 = [...produitSelect];
      list.splice(parseInt(nb), 1);
      list1.splice(parseInt(nb), 1);
      setPackSelected(list);
      setProduitSelect(list1);
      var som = somme;
      var somHt = sommeHt;
      somHt -= parseFloat(entities[nb].Montant);
      som -= parseFloat(entities[nb].montant_ttc);
      setSomme(som.toFixed(3));
      setSommeHt(somHt.toFixed(3));
      var filtered = entities.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setEntities(filtered);
      notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
  }

  //sauvgarder les données dans la BD
  const saveTable = useCallback(
    async (entitiesEntete, entities, objectifSelect, dd, df) => {
      var yearBl = new Date(entitiesEntete[0].dateBL);
      var yearNow = new Date();
      var verifDate = yearNow.getFullYear() - yearBl.getFullYear();
      var verifBl = await dispatch(
        blVerif({
          numeroBL: entitiesEntete[0].numeroBL,
          fournisseur: entitiesEntete[0].Fournisseur,
          somme: somme,
          id: idBl,
        })
      );
      var testT = await verifBl.payload;
      if (
        verifDate < 0 ||
        verifDate > 1 ||
        yearBl.getTime() > yearNow.getTime()
      )
        notify("tr", "Date invalide", "danger");
      else if (
        (objectifSelect.length !== 0 &&
          entitiesEntete[0].dateBL < dd &&
          objectifSelect.value !== 0) ||
        (objectifSelect.length !== 0 &&
          entitiesEntete[0].dateBL > df &&
          objectifSelect.value !== 0)
      )
        notify("tr", `Date doit compris entre ${dd} et ${df}`, "danger");
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
        if (entities.length > 0) {
          entities.forEach((data) => {
            if (data.idProduit === null) verif = false;
            if (data.Montant === "" || parseInt(data.Montant) === 0)
              verif = false;
            if (data.Quantite === "" || data.Quantite === 0) verif = false;
          });
        } else {
          verif = false;
        }

        if (verif === false) {
          notify("tr", "Vérifier vos données!", "danger");
        } else {
          setIsDisabled(true);
          dispatch(
            updateBl({ bl: entitiesEntete[0], ligneBl: entities, idBl: idBl })
          ).then((e) => {
            if (e.payload === true) {
              notify("tr", "Modifier avec succes", "success");
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              notify("tr", "Vérifier vos données!", "danger");
            }
          });
        }
      }
    },
    [dispatch, somme]
  );

  //effacer produit 
  const removeProduit = useCallback(
    async (list, select, packsSelect, id, objFour, tva, objProduit) => {
      list[id].idProduit = null;
      list[id].Designation = null;
      list[id].id_pack = null;
      list[id].montant_ttc = list[id].Montant;
      select[id] = null;
      packsSelect[id] = null;
      setProduitSelect(select);
      setPackSelected(packsSelect);
      setEntities(list);
      setTable(list, 1, objFour, tva, objProduit);
    },
    [setTable]
  );

  //effacer fournisseur
  const removeFournisseur = useCallback(async (list, id) => {
    setFour(1, list);
    setFournisseur(null);
  }, []);

  // function hedha idha ken selectiona action commande spontanée bech ya3mel selection pack commande spontanée lil tout produits
  function getPackSpontannee(list) {
    var ligneFinal = [...list];
    var packsFinal = [];
    var arrayOption = [
      {
        value: 0,
        label: "Commande spontanée",
        mnt: 0,
        qte: 0,
      },
    ];
    ligneFinal.forEach((val) => {
      var newVal = val;
      newVal.id_pack = 0;
      newVal.montant_rest_p = 0;
      newVal.quantite_rest_p = 0;
      packsFinal.push({
        value: 0,
        label: "Commande spontanée",
        mnt: 0,
        qte: 0,
      });
    });
    setEntities(ligneFinal);
    setPackSelected(packsFinal);
    setOptionPack(arrayOption);
  }

  //get pack
  /* bech inlawjo idha ken produit mawjoud fil pack mte3 action walla la idha ken mawjoud islectioni pack 
  idha ken moch mawjoud islectionni pack commande groupées
  */
  const getPackProd = useCallback(
    async (action, list, client) => {
      if (action.length !== 0) {
        var id_action = action.value;
        var totalCmd = await dispatch(totalCaByAction(id_action));
        var mntTotal = await totalCmd.payload.mntTotal;
        var idClient = client ? client.value : null;
        if (id_action !== 0) {
          dispatch(
            getPackByProduits({
              arrayFinal: list,
              idPacks: action.idPack,
              idClient: idClient,
              mntTotal: mntTotal,
              id_action: id_action,
              idUser: idUser,
            })
          ).then((dataFinal) => {
            var ligneFinal = dataFinal.payload.arrayFinal;
            var packsFinal = dataFinal.payload.packSelected;
            var testP = dataFinal.payload.test;
            if (testP)
              notify(
                "tr",
                "Il existe un ou plusieurs produit non affecté à un pack",
                "danger"
              );
            setEntities(ligneFinal);
            setPackSelected(packsFinal);
            if (idClient) {
              var arrayOption = dataFinal.payload.arrayOption;
              setOptionPack(arrayOption);
            }
          });
        } else {
          getPackSpontannee(list);
        }
      }
    },
    [dispatch, idUser]
  );

  /** 
   * bech in9arno produit selectionner idha ken mawjoud fil pack ou non 
   **/
  const verifPack = useCallback(
    async (idProduit, idPack, select, e, id, objFour, tva, objProduit) => {
      var packProd = await dispatch(verifPackByProduits({ idProduit, idPack }));
      var res = await packProd.payload;
      if (res.msg === true) {
        setPackSelected(select);
        setEntities(e);
        setTable(e, 1, objFour, tva, objProduit);
      } else {
        e[id].id_pack = 0;
        e[id].quantite_rest_p = 0;
        e[id].montant_rest_p = 0;
        select[id] = {
          value: 0,
          label: "Commande spontanée",
        };
        setPackSelected(select);
        setEntities(e);
        setTable(e, 1, objFour, tva, objProduit);
        notify("tr", "Le produit n'appartient pas à ce pack", "danger");
      }
    },
    [dispatch]
  );
  
  /**
   * bech najbdo tva bil ennee
   **/
  const getTva = useCallback(async () => {
    var req = await dispatch(getTvaByAnnee(annee));
    var res = await req.payload;
    setTva(res);
  }, [dispatch]);

  useEffect(() => {
    getproduit();
    getFournisseur();
    detailBl();
    getTva();
  }, [getproduit, getFournisseur]);

  return (
    <>
      {loader ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        ""
      )}
      {!loader ? (
        <Container fluid className="responsive-BL table-dynamique">
          <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
          </div>
          <Row>
            <Col md="12">
              <Button
                id="saveBL"
                className="btn-wd btn-outline mr-1 float-left"
                type="button"
                variant="info"
                onClick={() => {
                  navigate("/visualisationBl");
                }}
              >
                <span className="btn-label">
                  <i className="fas fa-list"></i>
                </span>
                Retour à la liste
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Modifier BL</Card.Title>
                </Card.Header>
                <Card.Body>
                  {ext === "pdf" ? (
                    <div className="visualiser">
                      <iframe
                        title="Transition"
                        width="100%"
                        height="500px"
                        src={`${fileURL}#toolbar=0`}
                        /* src={fileURL} */
                      ></iframe>
                      <br></br>
                      <a
                        className="btn btn-info"
                        download={fileName}
                        rel="noreferrer"
                        href={fileURL}
                        target="_blank"
                      >
                        <i className="fas fa-file"></i> Télécharger
                      </a>
                    </div>
                  ) : (
                    <div className="visualiser">
                      <img src={fileURL} className="img-file" alt=""></img>
                      <br></br>
                      <a
                        download={fileName}
                        rel="noreferrer"
                        href={fileURL}
                        target="_blank"
                        className="btn btn-info"
                      >
                        <i className="fas fa-download"></i> Télécharger
                      </a>
                    </div>
                  )}
                  <Row id="table-BL-header">
                    <Col md="12">
                      <hr></hr>
                      {entitiesEntete.length > 0 ? (
                        <div>
                          <div className="table-header1">
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
                                  Header: "date",
                                  accessor: "dateBL",
                                  Cell: ({ cell }) => (
                                    <Form.Group>
                                      <Form.Control
                                        defaultValue={cell.row.values.dateBL}
                                        type="date"
                                        onChange={(d) => {
                                          var entete = [...entitiesEntete];
                                          entete[0].dateBL = d.target.value;
                                          setEntitiesEntete(entete);
                                        }}
                                      ></Form.Control>
                                    </Form.Group>
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
                                              removeFournisseur(
                                                entitiesEntete,
                                                cell.row.id
                                              );
                                            }}
                                          >
                                            <i className="fa fa-trash" />
                                          </Button>
                                        </Form.Group>
                                      )}
                                    </div>
                                  ),
                                },
                                {
                                  Header: "Action",
                                  accessor: "objectif",
                                  Cell: () => (
                                    <div className="table-bl">
                                      <Select
                                        placeholder="Action"
                                        className="react-select primary "
                                        classNamePrefix="react-select"
                                        name="objectif"
                                        value={objectifSelect}
                                        onChange={(value) => {
                                          setObjectifSelect(value);
                                          getPharmacie(value.id_segment);
                                          setDateDebut(value.date_debut);
                                          setDateFin(value.date_fin);
                                          var entete = [...entitiesEntete];
                                          entete[0].id_action = value.value;
                                          setEntitiesEntete(entete);
                                          getPackProd(
                                            value,
                                            entities,
                                            clientSelected
                                          );
                                        }}
                                        options={optionObjectif}
                                      />
                                    </div>
                                  ),
                                },
                              ]}
                              className="-striped -highlight primary-pagination"
                            />
                          </div>
                          <br></br>
                          <ReactTable
                            data={entitiesEntete}
                            columns={[
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
                                          /* getPack(v.value); */
                                          if (objectifSelect.length !== 0)
                                            getPackProd(
                                              objectifSelect,
                                              entities,
                                              v
                                            );
                                          else {
                                            notify(
                                              "tr",
                                              "Il faut selectionner une action",
                                              "danger"
                                            );
                                          }
                                        }}
                                        options={optionClient}
                                      />
                                    </div>
                                  </div>
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
                  <Row id="table-BL">
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
                                        removeProduit(
                                          entities,
                                          produitSelect,
                                          packSelected,
                                          cell.row.id,
                                          objFour[
                                            entitiesEntete[0].Fournisseur
                                          ],
                                          tva,
                                          objProduit
                                        );
                                      }}
                                    >
                                      <i className="fa fa-trash" />
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
                                            removeProduit(
                                              entities,
                                              produitSelect,
                                              packSelected,
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
                                        var e = [...entities];
                                        var select = produitSelect;
                                        e[cell.row.id].idProduit = v.value;
                                        e[cell.row.id].Designation = v.label;
                                        e[cell.row.id].Code = v.code;
                                        var sommeMntTtc = parseFloat(
                                          e[cell.row.id].Montant
                                        );
                                        if (objProduit[v.value]) {
                                          if (
                                            objFour[
                                              entitiesEntete[0].Fournisseur
                                            ] &&
                                            objFour[
                                              entitiesEntete[0].Fournisseur
                                            ].tva === 1 &&
                                            objProduit[v.value].type === 1
                                          ) {
                                            sommeMntTtc =
                                              sommeMntTtc * (1 + tva.tva / 100);
                                          }
                                        }
                                        e[cell.row.id].montant_ttc =
                                          sommeMntTtc.toFixed(3);
                                        select[cell.row.id] = v;
                                        getPackProd(
                                          objectifSelect,
                                          e,
                                          clientSelected
                                        );
                                        setProduitSelect(select);

                                        var som = 0;
                                        e.forEach((val) => {
                                          som += parseFloat(val.montant_ttc);
                                        });
                                        setSomme(som.toFixed(3));
                                        /* setEntities(e); */
                                        /* setTable(
                                          e,
                                          1,
                                          objFour[
                                            entitiesEntete[0].Fournisseur
                                          ],
                                          tva,
                                          objProduit
                                        ); */
                                      }}
                                      options={optionProduit}
                                    />
                                  </div>
                                )}
                              </div>
                            ),
                          },
                          {
                            Header: "Packs",
                            accessor: "id_pack",
                            Cell: ({ cell }) => (
                              <div className="table-bl">
                                <Select
                                  className="react-select primary "
                                  classNamePrefix="react-select"
                                  name="Packs"
                                  placeholder="Packs"
                                  value={packSelected[cell.row.id]}
                                  onChange={(v) => {
                                    var e = [...entities];
                                    var select = [...packSelected];
                                    e[cell.row.id].id_pack = v.value;
                                    e[cell.row.id].quantite_rest_p = v.qte;
                                    e[cell.row.id].montant_rest_p = v.mnt;
                                    select[cell.row.id] = v;
                                    verifPack(
                                      e[cell.row.id].idProduit,
                                      e[cell.row.id].id_pack,
                                      select,
                                      e,
                                      cell.row.id,
                                      objFour[entitiesEntete[0].Fournisseur],
                                      tva,
                                      objProduit
                                    );
                                    /* verifPack(
                                      e[cell.row.id].idProduit,
                                      e[cell.row.id].id_pack,
                                      select,
                                      e,
                                      cell.row.id
                                    ); */
                                  }}
                                  options={optionPack}
                                />
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
                                        var mnt =
                                          parseFloat(value.target.value) *
                                          parseFloat(e[cell.row.id].Prix);
                                        e[cell.row.id].Montant = mnt.toFixed(3);
                                      }
                                      e[cell.row.id].Quantite = parseFloat(
                                        value.target.value
                                      );
                                      setTable(
                                        e,
                                        1,
                                        objFour[entitiesEntete[0].Fournisseur],
                                        tva,
                                        objProduit
                                      );
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
                                        var mnt =
                                          parseFloat(value.target.value) *
                                          parseFloat(e[cell.row.id].Quantite);
                                        e[cell.row.id].Montant = mnt.toFixed(3);
                                      }
                                      e[cell.row.id].Prix = parseFloat(
                                        value.target.value
                                      );
                                      setTable(
                                        e,
                                        1,
                                        objFour[entitiesEntete[0].Fournisseur],
                                        tva,
                                        objProduit
                                      );
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
                                      e[cell.row.id].Montant =
                                        value.target.value;
                                      setTable(
                                        e,
                                        1,
                                        objFour[entitiesEntete[0].Fournisseur],
                                        tva,
                                        objProduit
                                      );
                                    }}
                                  ></Form.Control>
                                </Form.Group>
                              </div>
                            ),
                          },
                          {
                            Header: "montant ttc",
                            accessor: "montant_ttc",
                            Cell: ({ cell }) => (
                              <div>
                                <Form.Group>
                                  <Form.Control
                                    readOnly
                                    value={cell.row.values.montant_ttc}
                                    placeholder="montant_ttc"
                                    type="Number"
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
                      <div className="totalMax">Total HT : {sommeHt} TND</div>
                      <div className="totalMax">Total TTC : {somme} TND</div>
                      {!isDisabled ? (
                        <Button
                          id="saveBL"
                          className="btn-wd btn-outline mr-1 float-right"
                          type="button"
                          variant="success"
                          onClick={() =>
                            saveTable(
                              entitiesEntete,
                              entities,
                              objectifSelect,
                              dateDebut,
                              dateFin
                            )
                          }
                        >
                          <span className="btn-label">
                            <i className="fas fa-check"></i>
                          </span>
                          Enregistrer
                        </Button>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        ""
      )}
    </>
  );
}
export default UpdateBL;
