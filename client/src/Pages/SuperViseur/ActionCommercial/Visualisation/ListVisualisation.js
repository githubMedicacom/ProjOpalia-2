import ReactTable from "../../../../components/ReactTable/ReactTableColor";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { getAllClientSeg } from "../../../../Redux/segmentReduce";
import { getActionById } from "../../../../Redux/actionReduce";
import {
  commandeAdded,
  getAllCommande,
  getCommandeByEtat,
  totalCaByAction,
  getBlByClientRest,
  getColorClientCmd,
  getColorClient,
  payerDelegue,
  payerOpalia,
  getTypePayments,
} from "../../../../Redux/commandesReduce";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { getIdSecteurIms } from "../../../../Redux/secteurReduce";
import { verifBlByCLient } from "../../../../Redux/blReduce";
import Select from "react-select";
import { packGetById } from "../../../../Redux/packReduce";

// core components
function ListVisualisation() {
  document.title = "Liste des actions";
  const navigate = useNavigate();
  const location = useParams();
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
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idUser = decoded.userauth.id;
  const idRole = decoded.userauth.idrole;
  const idSect = decoded.userauth.idsect;
  const nom_prenom = decoded.userauth.nomU;
  var id = location.id;
  const idLine = location.idLine;
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [entitiesEnCours, setEntitiesEnCours] = React.useState([]);
  const [caPharmacie, setCaPharmacie] = React.useState([]);
  const [idBls, setIdBls] = React.useState([]);
  const [commande, setCommande] = React.useState([]);
  const [commandeR, setCommandeR] = React.useState([]);
  const [nom, setNom] = React.useState("");
  const [idPack, setIdPack] = React.useState("");
  const [objectif, setObjectif] = React.useState(0);
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [pack, setPack] = React.useState([]);
  const [countBl, setCountBl] = React.useState(0);
  const [alert, setAlert] = React.useState(null);
  const [testDate, setTestDate] = React.useState(true);
  const [loaderEnCours, setLoaderEnCours] = React.useState(true);
  const [loaderValidation, setLoaderValidation] = React.useState(true);
  const [loaderValide, setLoaderValide] = React.useState(true);
  const [loaderRefuser, setLoaderRefuser] = React.useState(true);
  /* var currentAnnee = new Date().getFullYear(); */
  const [optionsTrimestre, setOptionsTrimestre] = React.useState([
    {
      value: "",
      label: "-Selectioner-",
      isDisabled: true,
    },
    /* {
      value: 1,
      label: `Trimestre 1 (${currentAnnee}-01-01 => ${currentAnnee}-03-31)`,
    },
    {
      value: 2,
      label: `Trimestre 2 (${currentAnnee}-04-01 => ${currentAnnee}-06-30)`,
    },
    {
      value: 3,
      label: `Trimestre 3 (${currentAnnee}-07-01 => ${currentAnnee}-09-30)`,
    },
    {
      value: 4,
      label: `Trimestre 4 (${currentAnnee}-10-01 => ${currentAnnee}-12-31)`,
    }, */
  ]);
  const [trimestreSelect, setTrimestreSelect] = React.useState({
    value: 0,
    label: "-Selectioner-",
  });
  const getCommentaire = useCallback(async (commentaire) => {
    var note = commentaire.split(",");
    var array = [];
    var arrayUl = [];
    for (const key1 in note) {
      const element1 = note[key1];
      var splitComment = element1.split(" ");
      var comm = "";
      for (let index = 0; index < splitComment.length - 1; index++) {
        const element2 = splitComment[index];
        comm += element2 + " ";
      }
      var arrayComm = [];
      arrayComm.push(<span key={"arrayComm1" + key1}>{comm}</span>);
      arrayComm.push(
        <span key={"arrayComm2" + key1} className="blue">
          {splitComment[splitComment.length - 1]}
        </span>
      );
      array.push(<li key={"note-" + key1}>{arrayComm}</li>);
    }
    arrayUl.push(<ul key={"note-ul"}>{array}</ul>);
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Note"}
        onConfirm={() => hideAlert()}
        cancelBtnBsStyle="danger"
      >
        {arrayUl}
        {/* {note.map((val, key) => {
          return <div key={"note-" + key}>{val}</div>;
        })} */}
      </SweetAlert>
    );
  }, []);

  const confirmMessage = (event, ligne, idBls, caPharmacie) => {
    localStorage.setItem("commentaire", "");
    var check = parseInt(event);
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={
          parseInt(check) === 1 || parseInt(check) === 3
            ? "Commande accepter"
            : "Réintroduire la commande"
        }
        onConfirm={() => submitForm(check, ligne, idBls, caPharmacie)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        {check !== 7 ? (
          <div>
            <Form.Group className="input-comment">
              <label>Note</label>
              <textarea
                className="form-control"
                onChange={(value) => {
                  localStorage.setItem("commentaire", value.target.value);
                }}
                rows="5"
              ></textarea>
            </Form.Group>
          </div>
        ) : (
          ""
        )}
      </SweetAlert>
    );
  };

  const pop_up_bl = useCallback(async (id_pharmacie) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Vérifier vos bls"}
        onConfirm={() => {
          localStorage.setItem(
            "returnVis",
            `/visualisation/${id}/${location.idLine}`
          );
          navigate(`/detailSuivi/${id_pharmacie}/${id}`);
        }}
        cancelBtnBsStyle="danger"
      ></SweetAlert>
    );
  }, []);

  const hideAlert = () => {
    setAlert(null);
  };

  const getSegment = useCallback(
    async (list, findCmd, tot) => {
      var dd = list.date_debut;
      var df = list.date_fin;
      var idSeg = "(" + list.idSegment + ")";
      var secteur = await dispatch(getIdSecteurIms(idSect));
      var idBricks = secteur.payload;
      var res = null;
      var test = false;
      const arraySplit = list.idSegment.split(",");
      arraySplit.forEach((element) => {
        if (parseInt(element) === 0) test = true;
      });
      if (idRole === 2) {
        if (test === false) {
          res = await dispatch(
            getAllClientSeg({
              idSeg,
              idRole,
              idBricks,
              dd,
              df,
              id,
              idUser,
            })
          );
        } else {
          res = await dispatch(
            getAllClientSeg({ idSeg, idRole, idBricks, dd, df, id, idUser })
          );
        }
        var rowsAC = res.payload.rows;
        var objClient = res.payload.objClient;
        var objBl = res.payload.objBl;
        setCaPharmacie(objClient);
        setIdBls(objBl);
        if (rowsAC.length !== 0) {
          var arrayAC = [];
          for (const key in rowsAC) {
            const val = rowsAC[key];
            /* var colorRes = await dispatch(
              getColorClient({ idClient: val.id_pharmacie, id: id })
            );
            var res = colorRes.payload.listAC;
            var color = !res ? "color" : ""; */
            var verif = await dispatch(
              verifBlByCLient({
                idAction: id,
                idUser: idUser,
                idClient: val.id_pharmacie,
              })
            );
            var testValider = await verif.payload.testValider;
            var color = objClient[val.id_pharmacie] < tot ? "color" : "";
            arrayAC.push({
              Pharmacie: val.Pharmacie,
              Segment: val.Segment,
              delegue: val.delegue,
              id: val.id,
              id_pharmacie: val.id_pharmacie,
              nomSeg: val.nomSeg,
              note: val.note,
              total: val.total,
              color: color,
              etatBls: testValider === false ? 0 : 1,
            });
          }
          setEntities(arrayAC);
        } else {
          setEntities([]);
        }
      }
    },
    [dispatch, idRole, idSect, id, idUser]
  );
  /**
   * function hedhi bech najbdo pharmacie illi 3adaw commande w idha ken pharmacie mawsoulch lil objectif mte3o ilawno bil rouge
   * **/
  const getCommande = useCallback(
    async (list, tot) => {
      //commande after  accepted by chef
      var trimestre = list.value;
      //Liste des pharmacies validées && refusés
      var res = await dispatch(getAllCommande({ id, trimestre }));
      var findCmd = await res.payload.findCmd;
      var findCmdR = await res.payload.findCmdR;
      setCommandeR(findCmdR);
      setLoaderRefuser(false);
      var array = [];
      if (findCmd.length !== 0) {
        for (const key in findCmd) {
          const val = findCmd[key];
          /* var colorRes = await dispatch(
            getColorClientCmd({
              idClient: val.id_pharmacie,
              id: id,
              idCmd: val.id,
            })
          );
          var res = colorRes.payload.listAC;
          var color = !res ? "color" : ""; */
          var color = val.total < objectif ? "color" : "";
          array.push({
            pharmacie: val.pharmacies.nom,
            Segment: val.Segment,
            delegue: val.users.nomU + " " + val.users.prenomU,
            id: val.id,
            id_pharmacie: val.id_pharmacie,
            nomSeg: val.segments.nom,
            note: val.note,
            total: val.total,
            decharge: val.decharge,
            payer: val.payer,
            color: color,
            payer_delegue: val.payer_delegue,
            commentaire: val.commentaire,
            datePayementOpa: val.datePayementOpa,
            payerOpa: val.payerOpa,
            montantOpaAmm: val.montantOpaAmm,
            montantOpaAmc: val.montantOpaAmc,
          });
        }
        setLoaderValide(false);
        setCommande(array);
      } else {
        setLoaderValide(false);
        setCommande([]);
      }

      //commande before  accepted by chef
      // Liste des pharmacies en cours de validation
      var res1 = await dispatch(
        getCommandeByEtat({ id, idUser, idRole, trimestre })
      );
      var rows = await res1.payload.rows;
      if (rows.length !== 0) {
        array = [];
        for (const key in rows) {
          const val = rows[key];
          /* var colorRes = await dispatch(
            getColorClientCmd({
              idClient: val.id_pharmacie,
              id: id,
              idCmd: val.id,
            })
          );
          var res = colorRes.payload.listAC;
          var color = !res ? "color" : ""; */
          var color = val.total < tot ? "color" : "";
          array.push({
            Pharmacie: val.Pharmacie,
            Segment: val.Segment,
            delegue: val.delegue,
            id: val.id,
            etat: val.etat,
            id_pharmacie: val.id_pharmacie,
            nomSeg: val.nomSeg,
            note: val.note,
            total: val.total,
            color: color,
            payer_delegue: val.payer_delegue,
            commentaire: val.commentaire,
          });
        }
        setEntitiesEnCours(array);
        setLoaderValidation(false);
      } else {
        setEntitiesEnCours([]);
        setLoaderValidation(false);
      }
    },
    [dispatch, id, idRole, idUser]
  );

  const getTotal = useCallback(async () => {
    var total = await dispatch(totalCaByAction(id));
    setCountBl(total.payload.mntTotal);
  }, [dispatch, id]);

  const getAction = useCallback(async () => {
    var today = new Date();
    var action = await dispatch(getActionById(id));
    var result = action.payload.findAction;
    if (result.length === 0) {
      setTimeout(() => {
        navigate("/listAction");
      }, 1000);
    } else {
      var entities = result[0];
      console.log(entities)
      var dateD = new Date(entities.date_debut); // Or the date you'd like converted.
      var dateDD = new Date(dateD.getTime() - dateD.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      var dateF = new Date(entities.date_fin); // Or the date you'd like converted.
      var dateFF = new Date(dateF.getTime() - dateF.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      if (
        dateF.getTime() <= today.getTime() ||
        dateD.getTime() >= today.getTime()
      ) {
        setTestDate(false);
      }
      setNom(entities.nom);
      setIdPack(parseInt(entities.idPacks))
      setObjectif(entities.objectif);
      setDateDebut(dateDD);
      setDateFin(dateFF);
      var groupPacks = entities.groupPacks.split(",");
      setPack(groupPacks);
      /* getSegment(entities, findCmd, entities.objectif); */
      getTotal(entities);
      var array = [];
      var i = 0;
      var trimestreS = localStorage.getItem("trimestre");
      var selected = null;
      var mmN = new Date().getMonth() + 1;
      var aaN = new Date().getFullYear();
      for (
        let index = dateD.getMonth() + 1;
        index <= dateF.getMonth() + 1;
        index = index + 3 /* index = index + 1 */
      ) {
        i++;
        var mmF = index + 2;
        /* var mmF = index + 1; */
        var dateDS = index + "-" + dateF.getFullYear();
        var dateFS =
          mmF <= dateF.getMonth() + 1
            ? mmF + "-" + dateF.getFullYear()
            : dateF.getMonth() + 1 + "-" + dateF.getFullYear();
        array.push({
          value: i,
          label: "Trimestre " + i + " (" + dateDS + "=>" + dateFS + ")",
          month_d: index,
          month_f: mmF,
          year_d: dateD.getFullYear(),
          year_f: dateF.getFullYear(),
        });
        if (trimestreS && parseInt(trimestreS) === i) {
          var list = {
            value: i,
            label: "Trimestre " + i + " (" + dateDS + "=>" + dateFS + ")",
            month_d: index,
            month_f: mmF,
            year_d: dateD.getFullYear(),
            year_f: dateF.getFullYear(),
          };
          selected = list;
        }
        if (selected === null) {
          if (
            index <= mmN &&
            dateD.getFullYear() <= aaN &&
            mmN <= mmF &&
            aaN <= dateF.getFullYear()
          ) {
            selected = {
              value: i,
              label: "Trimestre " + i + " (" + dateDS + "=>" + dateFS + ")",
              month_d: index,
              month_f: mmF,
              year_d: dateD.getFullYear(),
              year_f: dateF.getFullYear(),
            };
          }
        }
      }
      if (selected) {
        changeTrimestre(selected, entities.objectif);
      }
      setTrimestreSelect(selected);
      setOptionsTrimestre(array);
    }
  }, [dispatch, id, getTotal, navigate]);

  const getBlByClient = useCallback(
    async (etat) => {
      var res = await dispatch(getBlByClientRest({ id: id, etat: etat }));
      var findCmd = await res.payload.listAC;
      if (etat === 1) getAction(findCmd);
      else getCommande(findCmd);
    },
    [dispatch, id, getAction, getCommande]
  );

  useEffect(() => {
    getBlByClient(1);
    /* getBlByClient(2); */
    localStorage.removeItem("commentaire");
  }, [getBlByClient]); //now shut up eslint

  function listActions() {
    navigate("/listAction");
  }

  function submitForm(event, ligne, idBls, caPharmacie) {
    var note = localStorage.getItem("commentaire");
    if ((note !== "" && event !== 7) || event === 7) {
      dispatch(
        commandeAdded({
          etat: event,
          total: caPharmacie[ligne.id_pharmacie],
          idBls: idBls[ligne.id_pharmacie],
          id_pharmacie: ligne.id_pharmacie,
          id_segment: ligne.Segment,
          id_user: idUser,
          nom_prenom: nom_prenom,
          note: note,
          id_action: id,
          trimestre: trimestreSelect.value,
          id_cmd: event > 2 ? ligne.id : 0,
        })
      ).then((data) => {
        var ch = "Clôturer avec succès";
        switch (data.payload) {
          case 200:
            notify("tr", ch, "success");
            break;
          case 400:
            notify("tr", "Vérifier vos données", "danger");
            break;
          default:
            break;
        }
        localStorage.removeItem("trimestre");
        localStorage.removeItem("year_d");
        localStorage.removeItem("month_d");
        localStorage.removeItem("year_f");
        localStorage.removeItem("month_f");
        setTimeout(() => {
          /* getBlByClient(1);
          getBlByClient(2); */
          window.location.reload();
        }, 1500);
        hideAlert();
      });
    } else {
      notify("tr", "Note est obligatoire", "danger");
    }
  }

  // pop bech na3mlo affichage lil pack
  const pop_up = useCallback(
    async (id) => {
      var value = await dispatch(packGetById(id));
      var headerPacks = await value.payload.header;
      var tablePacks = await value.payload.table;
      setAlert(
        <SweetAlert
          customClass="pop-up-packs"
          style={{ display: "block", marginTop: "-100px" }}
          title={"Détail pack " + headerPacks.nom}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        >
          {/* <table className="table-hover table">
            <thead>
              <tr className="tr-pack">
                <th>Produit</th>
                <th>Montant</th>
                <th>Quantité</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{headerPacks.nom}</td>
                <td>{headerPacks.bonification}</td>
                <td>{headerPacks.date}</td>
              </tr>
            </tbody>
          </table> */}
          <Row>
            <Col col="12">
              <table className="table-hover table-striped w-full table table-pack">
                <thead>
                  <tr className="tr-pack">
                    <th>Produit</th>
                    <th>Montant</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {tablePacks.map((val, key) => {
                    return (
                      <tr key={"pop-" + key}>
                        <td>{val.produits.designation}</td>
                        <td>{val.montant}</td>
                        <td>{val.quantite}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Col>
          </Row>
        </SweetAlert>
      );
    },
    [dispatch]
  );

  function GroupPacks({ groupPacks }) {
    /* var gp = groupPacks.split(",") */
    var span = [];
    groupPacks.map((val, key) => {
      var res = val.split("@");
      return span.push(
        <span
          className="pack_action"
          key={"pack" + key}
          onClick={() => {
            pop_up(res[1]);
          }}
        >
          {res[0]},
        </span>
      );
    });
    return span;
  }

  const confirmMessageD = (id, payer_delegue, commentaire) => {
    localStorage.setItem("commentaire", commentaire);
    if (payer_delegue === 0 && idRole !== 2) {
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={"Paiment délégué"}
          onConfirm={() => {
            submitFormD(id);
          }}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
          showCancel
        >
          <div>
            <Form.Group className="input-comment">
              <textarea
                defaultValue={commentaire}
                className="form-control"
                onChange={(value) => {
                  localStorage.setItem("commentaire", value.target.value);
                }}
                rows="5"
              ></textarea>
            </Form.Group>
          </div>
        </SweetAlert>
      );
    } else {
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={"Paiment délégué"}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        >
          {commentaire}
        </SweetAlert>
      );
    }
  };

  function submitFormD(id) {
    var commentaire = localStorage.getItem("commentaire");
    if (commentaire !== "") {
      dispatch(
        payerDelegue({
          commentaire: commentaire,
          id_cmd: id,
        })
      ).then((data) => {
        var ch = "Paiement avec succès";
        console.log(data);
        switch (data.payload.msg) {
          case true:
            notify("tr", ch, "success");
            break;
          case false:
            notify("tr", "Vérifier vos données", "danger");
            break;
          default:
            break;
        }
        getBlByClient(1);
        /* setTimeout(() => {
    getBlByClient(1);
        }, 1500); */
        hideAlert();
      });
    } else {
      notify("tr", "Commentaire est obligatoire", "danger");
    }
  }
  const confirmMessageOpa = async (id, mntAmm, mntAmc, etat) => {
    var valAmc = mntAmc;
    var valAmm = mntAmm;
    if (etat === 0) {
      var typeP = await dispatch(
        getTypePayments({
          mnt: objectif,
          idCmd: id,
        })
      );
      /* valAmc = typeP.payload.action_amc;
      valAmm = typeP.payload.action_amm; */
      var actions = await typeP.payload.actions;
      valAmc = actions.ca_amc * (actions.unite_boni_amc / 100);
      valAmm = actions.ca_amm * (actions.unite_boni_amm / 100);
    }
    localStorage.setItem("montantOpaAmc", valAmc);
    localStorage.setItem("montantOpaAmm", valAmm);
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Payment opalia"}
        onConfirm={() => {
          if (etat === 0) paymentOpa(id);
          else hideAlert();
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText={etat === 1 ? "Ok" : "Oui"}
        cancelBtnText="Non"
        showCancel={etat === 1 ? false : true}
      >
        <Form.Group>
          <label>Montant AMM</label>
          <Form.Control
            defaultValue={valAmm}
            readOnly={etat === 1 ? true : false}
            placeholder="Montant opalia AMM"
            type="text"
            onChange={(value) => {
              localStorage.setItem("montantOpaAmm", value.target.value);
            }}
          ></Form.Control>
          <br></br>
          <label>Montant AMC</label>
          <Form.Control
            defaultValue={valAmc}
            readOnly={etat === 1 ? true : false}
            placeholder="Montant opalia AMC"
            type="text"
            onChange={(value) => {
              localStorage.setItem("montantOpaAmc", value.target.value);
            }}
          ></Form.Control>
        </Form.Group>
      </SweetAlert>
    );
  };
  function paymentOpa(id, type) {
    var montantOpaAmm = localStorage.getItem("montantOpaAmm");
    var montantOpaAmc = localStorage.getItem("montantOpaAmc");
    dispatch(
      payerOpalia({
        id: id,
        montantOpaAmm: montantOpaAmm,
        montantOpaAmc: montantOpaAmc,
      })
    ).then((e) => {
      if (e.payload === true) {
        getBlByClient(1);
        notify("tr", "Payment opalia avec succès", "success");
      } else notify("tr", "Erreur de connexion", "danger");
    });
    hideAlert();
  }

  const changeTrimestre = useCallback(
    async (selected, tot) => {
      setTrimestreSelect(selected);
      var month_d = selected.month_d;
      var year_d = selected.year_d;
      var month_f = selected.month_f;
      var year_f = selected.year_f;
      var idSeg = "(0)";
      var secteur = await dispatch(getIdSecteurIms(idSect));
      var idBricks = secteur.payload;
      var res = null;
      /**
       *action hedhi bech najbdo pharmacie illi mazelo ma3adawech commandee w idha ken pharmacie mawsoulch lil objectif mte3o ilawno bil rouge
       * **/
      if (idRole === 2) {
        res = await dispatch(
          getAllClientSeg({
            idSeg,
            idRole,
            idBricks,
            month_d,
            year_d,
            month_f,
            year_f,
            id,
            idUser,
          })
        );
        var rowsAC = res.payload.rows;
        var objClient = res.payload.objClient;
        var objBl = res.payload.objBl;
        var objPacks = res.payload.objPacks;
        setCaPharmacie(objClient);
        setIdBls(objBl);
        if (rowsAC.length !== 0) {
          var arrayAC = [];
          for (const key in rowsAC) {
            const val = rowsAC[key];
            var verif = await dispatch(
              verifBlByCLient({
                idAction: id,
                idUser: idUser,
                idClient: val.id_pharmacie,
              })
            );
            var testValider = await verif.payload.testValider;
            var color = objClient[val.id_pharmacie] < tot ? "color" : "";
            arrayAC.push({
              Pharmacie: val.Pharmacie,
              Segment: val.Segment,
              delegue: val.delegue,
              id: val.id,
              id_pharmacie: val.id_pharmacie,
              nomSeg: val.nomSeg,
              note: val.note,
              total: val.total,
              color: color,
              etatBls: testValider === false ? 0 : 1,
            });
          }
          setEntities(arrayAC);
          setLoaderEnCours(false);
        } else {
          setEntities([]);
          setLoaderEnCours(false);
        }
      }
      getCommande(selected, tot);
    },
    [dispatch]
  );
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Button
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={listActions}
            >
              <span className="btn-label">
                <i className="fas fa-list"></i>
              </span>
              Retour à la liste
            </Button>
          </Col>
        </Row>
        <Row>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-signature"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Nom d'objectif</p>
                      <Card.Title as="h4">{nom}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                {/* <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  {pack}
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-bullseye"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">
                        Objectif à atteindre CA par pack
                      </p>
                      <Card.Title as="h4">
                        {Intl.NumberFormat("fr-FR", {
                          maximumFractionDigits: 3,
                        }).format(objectif)}
                      </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                {/* <div className="stats block-invisible">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-bullseye"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total réalisé</p>
                      <Card.Title as="h4">
                        {Intl.NumberFormat("fr-FR", {
                          maximumFractionDigits: 3,
                        }).format(parseFloat(countBl))}
                      </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                {/* <div className="stats block-invisible">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div> */}
              </Card.Footer>
            </Card>
          </Col>

          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-gifts"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Pack</p>
                      <Card.Title as="h4">
                        <GroupPacks groupPacks={pack}></GroupPacks>
                      </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                {/* <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  {pack}
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Date debut</p>
                      <Card.Title as="h4">{dateDebut}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                {/* <div className="stats block-invisible">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Date fin</p>
                      <Card.Title as="h4">{dateFin}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                {/* <div className="stats block-invisible">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div> */}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6" className="pr-1">
            <label>Trimestre*</label>
            <Select
              className="react-select primary"
              classNamePrefix="react-select"
              name="singleSelect"
              value={trimestreSelect}
              onChange={(value) => {
                setEntities([]);
                setLoaderEnCours(true);
                setEntitiesEnCours([]);
                setLoaderValidation(true);
                setCommande([]);
                setLoaderValide(true);
                setCommandeR([]);
                setLoaderRefuser(true);
                changeTrimestre(value, objectif);
                /* setTrimestreSelect(value); */
              }}
              options={optionsTrimestre}
              placeholder="Trimestre"
            />
          </Col>
        </Row>
        <Row>
          {true === true ? (
            parseInt(idRole) === 2 ? (
              <Col md="12">
                <h4 className="title">
                  Listes des pharmacies en cours d’une AC
                </h4>
                <Card className="table-visualisation-action">
                  <Card.Body>
                    <ReactTable
                      data={entities}
                      columns={[
                        {
                          Header: "Nom pharmacie",
                          accessor: "Pharmacie",
                        },
                        {
                          Header: "Segment",
                          accessor: "nomSeg",
                        },
                        {
                          Header: "CA",
                          accessor: "id_pharmacie",
                          Cell: ({ cell }) => (
                            <div>
                              {caPharmacie[cell.row.original.id_pharmacie] +
                                "/" +
                                objectif}
                            </div>
                          ),
                        },
                        {
                          Header: "Détail",
                          accessor: "",
                          Cell: ({ cell }) => (
                            <div>
                              <Button
                                id={"idLigneV_" + cell.row.values.id_pharmacie}
                                onClick={(e) => {
                                  localStorage.setItem(
                                    "trimestre",
                                    trimestreSelect.value
                                  );
                                  localStorage.setItem(
                                    "month_d",
                                    trimestreSelect.month_d
                                  );
                                  localStorage.setItem(
                                    "month_f",
                                    trimestreSelect.month_f
                                  );
                                  localStorage.setItem(
                                    "year_d",
                                    trimestreSelect.year_d
                                  );
                                  localStorage.setItem(
                                    "year_f",
                                    trimestreSelect.year_f
                                  );
                                  localStorage.setItem(
                                    "returnVis",
                                    `/visualisation/${id}/${location.idLine}`
                                  );
                                  navigate(
                                    "/detailVisualisation/" +
                                      id +
                                      "/" +
                                      cell.row.values.id_pharmacie +
                                      "/1"
                                  );
                                }}
                                className="btn btn-info"
                              >
                                Détail
                              </Button>
                            </div>
                          ),
                        },
                        {
                          Header: "BL",
                          accessor: "",
                          Cell: ({ cell }) => (
                            <div className="block-action">
                              <Button
                                className="message"
                                onClick={(e) => {
                                  localStorage.setItem(
                                    "trimestre",
                                    trimestreSelect.value
                                  );
                                  localStorage.setItem(
                                    "month_d",
                                    trimestreSelect.month_d
                                  );
                                  localStorage.setItem(
                                    "month_f",
                                    trimestreSelect.month_f
                                  );
                                  localStorage.setItem(
                                    "year_d",
                                    trimestreSelect.year_d
                                  );
                                  localStorage.setItem(
                                    "year_f",
                                    trimestreSelect.year_f
                                  );
                                  localStorage.setItem(
                                    "returnVis",
                                    `/visualisation/${id}/${location.idLine}`
                                  );
                                  navigate(
                                    `/detailSuivi/${cell.row.original.id_pharmacie}/${id}`
                                  );
                                }}
                                variant="success"
                                size="sm"
                              >
                                Visualiser
                                <i
                                  className="fa fa-eye"
                                  id={"idLigne_" + cell.row.values.id}
                                />
                              </Button>
                            </div>
                          ),
                        },
                        {
                          Header: "Clôturer",
                          accessor: "id",
                          Cell: ({ cell }) =>
                            cell.row.original.etatBls === 1 ? (
                              <div className="actions-check block-action">
                                <Row>
                                  <Col md="12">
                                    <Form.Check className="form-check-radio">
                                      <Form.Check.Label>
                                        <Form.Check.Input
                                          onClick={(val) => {
                                            /* verifBl(
                                            val.target.value,
                                            cell.row.original,
                                            idBls,
                                            caPharmacie
                                          ); */
                                            confirmMessage(
                                              val.target.value,
                                              cell.row.original,
                                              idBls,
                                              caPharmacie
                                            );
                                          }}
                                          defaultValue={
                                            idRole === 2 ? "1" : "3"
                                          }
                                          id="exampleRadios21"
                                          name="exampleRadio"
                                          type="radio"
                                        ></Form.Check.Input>
                                        <span className="form-check-sign"></span>
                                        Valide
                                      </Form.Check.Label>
                                    </Form.Check>
                                  </Col>
                                  <Col md="12">
                                    <Form.Check className="form-check-radio">
                                      <Form.Check.Label>
                                        <Form.Check.Input
                                          onClick={(val) =>
                                            confirmMessage(
                                              val.target.value,
                                              cell.row.original,
                                              idBls,
                                              caPharmacie
                                            )
                                          }
                                          defaultValue={
                                            idRole === 2 ? "2" : "4"
                                          }
                                          id="exampleRadios21"
                                          name="exampleRadio"
                                          type="radio"
                                        ></Form.Check.Input>
                                        <span className="form-check-sign"></span>
                                        Invalide
                                      </Form.Check.Label>
                                    </Form.Check>
                                  </Col>
                                </Row>
                              </div>
                            ) : (
                              "En cours de validation"
                            ),
                        },
                        {
                          Header: "color",
                          accessor: "color",
                        },
                      ]}
                    />
                    {loaderEnCours === true ? (
                      <div>
                        <img
                          src={
                            require("../../../../assets/img/loader.gif").default
                          }
                          alt="loader"
                        />
                      </div>
                    ) : entities.length === 0 ? (
                      <div className="text-center">Aucun donnée trouvé</div>
                    ) : (
                      ""
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <Col md="12">
            <h4 className="title">
              Liste des pharmacies en cours de validation
            </h4>
            <Card className="table-visualisation-action">
              <Card.Body>
                <ReactTable
                  data={entitiesEnCours}
                  columns={[
                    {
                      Header: "Délégue",
                      accessor: "delegue",
                    },
                    {
                      Header: "Nom pharmacie",
                      accessor: "Pharmacie",
                    },
                    {
                      Header: "Segment",
                      accessor: "nomSeg",
                    },
                    {
                      Header: "CA",
                      accessor: "total",
                      Cell: ({ cell }) => (
                        <div>{cell.row.values.total + "/" + objectif}</div>
                      ),
                    },
                    {
                      Header: "Note",
                      accessor: "note",
                      Cell: ({ cell }) => (
                        <div>
                          <Button
                            id={"idLigneV_" + cell.row.values.id}
                            onClick={(e) => {
                              getCommentaire(cell.row.values.note);
                            }}
                            className="btn btn-info"
                          >
                            Lire
                            <i
                              className="fa fa-comment"
                              id={"idLigneV_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "Détail",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div>
                          <Button
                            id={"idLigneV_" + cell.row.values.id_pharmacie}
                            onClick={(e) => {
                              localStorage.setItem(
                                "returnVis",
                                `/visualisation/${id}/${location.idLine}`
                              );
                              navigate("/detailValider/" + cell.row.values.id);
                            }}
                            className="btn btn-info"
                          >
                            Détail
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "BL",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="block-action">
                          <Button
                            className="message"
                            onClick={(e) => {
                              localStorage.setItem(
                                "returnVis",
                                `/visualisation/${id}/${location.idLine}`
                              );
                              navigate(`/detailCmd/${cell.row.original.id}`);
                            }}
                            variant="success"
                            size="sm"
                          >
                            Visualiser
                            <i
                              className="fa fa-eye"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "Clôturer",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-check block-action">
                          {(idRole === 1 && cell.row.original.etat <= 2) ||
                          (idRole === 7 && cell.row.original.etat === 3) ? (
                            <Row>
                              <Col md="12">
                                <Form.Check className="form-check-radio">
                                  <Form.Check.Label>
                                    <Form.Check.Input
                                      onClick={(val) =>
                                        confirmMessage(
                                          val.target.value,
                                          cell.row.original,
                                          idBls,
                                          caPharmacie
                                        )
                                      }
                                      defaultValue={idRole === 1 ? "3" : "8"}
                                      id="exampleRadios21"
                                      name="exampleRadio"
                                      type="radio"
                                    ></Form.Check.Input>
                                    <span className="form-check-sign"></span>
                                    Valide
                                  </Form.Check.Label>
                                </Form.Check>
                              </Col>
                              <Col md="12">
                                <Form.Check className="form-check-radio">
                                  <Form.Check.Label>
                                    <Form.Check.Input
                                      onClick={(val) =>
                                        confirmMessage(
                                          val.target.value,
                                          cell.row.original,
                                          idBls,
                                          caPharmacie
                                        )
                                      }
                                      defaultValue={idRole === 1 ? "7" : "9"}
                                      id="exampleRadios21"
                                      name="exampleRadio"
                                      type="radio"
                                    ></Form.Check.Input>
                                    <span className="form-check-sign"></span>
                                    Invalide {idRole === 1 ? " et retour " : ""}
                                  </Form.Check.Label>
                                </Form.Check>
                              </Col>
                              {idRole === 1 ? (
                                <Col md="12">
                                  <Form.Check className="form-check-radio">
                                    <Form.Check.Label>
                                      <Form.Check.Input
                                        onClick={(val) =>
                                          confirmMessage(
                                            val.target.value,
                                            cell.row.original,
                                            idBls,
                                            caPharmacie
                                          )
                                        }
                                        defaultValue="4"
                                        id="exampleRadios21"
                                        name="exampleRadio"
                                        type="radio"
                                      ></Form.Check.Input>
                                      <span className="form-check-sign"></span>
                                      invalide et stop
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Col>
                              ) : (
                                ""
                              )}
                            </Row>
                          ) : (
                            ""
                          )}
                        </div>
                      ),
                    },
                    {
                      Header: "color",
                      accessor: "color",
                    },
                  ]}
                />

                {loaderValidation === true ? (
                  <div>
                    <img
                      src={require("../../../../assets/img/loader.gif").default}
                      alt="loader"
                    />
                  </div>
                ) : entitiesEnCours.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des pharmacies validées</h4>
            <Card className="table-visualisation-action">
              <Card.Body>
                <ReactTable
                  data={commande}
                  columns={[
                    {
                      Header: "Délégué",
                      accessor: "delegue",
                    },
                    {
                      Header: "Nom pharmacie",
                      accessor: "pharmacie",
                    },
                    {
                      Header: "Segment",
                      accessor: "nomSeg",
                    },
                    {
                      Header: "Détail",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div>
                          <Button
                            onClick={(e) => {
                              navigate("/detailValider/" + cell.row.values.id);
                              localStorage.setItem(
                                "returnVis",
                                `/visualisation/${id}/${location.idLine}`
                              );
                            }}
                            className="btn btn-info"
                          >
                            Détail
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "BL",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="block-action">
                          <Button
                            className="message"
                            onClick={(e) => {
                              localStorage.setItem(
                                "returnVis",
                                `/visualisation/${id}/${location.idLine}`
                              );
                              navigate(`/detailCmd/${cell.row.original.id}`);
                            }}
                            variant="success"
                            size="sm"
                          >
                            Visualiser
                            <i
                              className="fa fa-eye"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "Note",
                      accessor: "note",
                      Cell: ({ cell }) => (
                        <div>
                          <Button
                            id={"idLigneV_" + cell.row.values.id}
                            onClick={(e) => {
                              getCommentaire(cell.row.values.note);
                            }}
                            className="btn btn-info"
                          >
                            Lire
                            <i
                              className="fa fa-comment"
                              id={"idLigneV_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "décharge",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <Button
                          id={"idLigne_" + cell.row.values.id}
                          onClick={(e) => {
                            navigate(
                              "/telechargerFichierCmde/" +
                                cell.row.original.payer +
                                "/" +
                                cell.row.values.id
                            );
                            localStorage.setItem(
                              "file",
                              cell.row.original.decharge
                            );
                            localStorage.setItem(
                              "returnList",
                              "visualisation/" + id + "/" + idLine
                            );
                            localStorage.setItem(
                              "idCde",
                              "true"
                            );
                          }}
                          className="btn btn-info ml-1 visualiser"
                        >
                          <i
                            className="fa fa-money-check"
                            id={"idLigne_" + cell.row.values.id}
                          />
                        </Button>
                      ),
                    },
                    {
                      Header: "paiment délégué",
                      accessor: "payer_delegue",
                      Cell: ({ cell }) =>
                        (idRole === 1 || idRole === 0) &&
                        cell.row.original.payer_delegue === 0 ? (
                          <Button
                            onClick={(e) => {
                              confirmMessageD(
                                cell.row.original.id,
                                cell.row.original.payer_delegue,
                                ""
                              );
                            }}
                            className="btn btn-info ml-1 visualiser"
                          >
                            <i className="fas fa-coins"></i>
                          </Button>
                        ) : (
                          <Button
                            onClick={(e) => {
                              confirmMessageD(
                                cell.row.original.id,
                                cell.row.original.payer_delegue,
                                cell.row.original.commentaire
                              );
                            }}
                            className="btn btn-info ml-1 visualiser"
                          >
                            <i className="far fa-comments"></i>
                          </Button>
                        ),
                    },
                    {
                      Header: "paiment opalia",
                      accessor: "payerOpa",
                      Cell: ({ cell }) => (
                        <div>
                          {idRole === 0 || idRole === 1 ? (
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={() => {
                                confirmMessageOpa(
                                  cell.row.values.id,
                                  cell.row.original.montantOpaAmm,
                                  cell.row.original.montantOpaAmc,
                                  cell.row.values.payerOpa
                                );
                              }}
                              className={
                                cell.row.original.payerOpa === 0
                                  ? "btn btn-success ml-1 visualiser"
                                  : "btn btn-warning ml-1 visualiser"
                              }
                            >
                              <i
                                className={
                                  cell.row.original.payerOpa === 0
                                    ? "fa fa-money-check mr-1"
                                    : "fa fa-eye mr-1"
                                }
                                id={"idLigne_" + cell.row.values.id}
                              />
                              {cell.row.original.payerOpa === 0
                                ? "Payment"
                                : "Détail"}
                            </Button>
                          ) : (
                            cell.row.original.datePayementOpa
                          )}
                        </div>
                      ),
                    },
                    {
                      Header: "action",
                      accessor: "action",
                      Cell: ({ cell }) =>
                        idRole === 0 || idRole === 5 ? (
                          <Button
                            onClick={(e) => {
                              confirmMessage(
                                "5",
                                cell.row.original,
                                idBls,
                                caPharmacie
                              );
                            }}
                            className="btn btn-danger ml-1 visualiser"
                          >
                            Annuler <i className="fa fa-trash" />
                          </Button>
                        ) : (
                          ""
                        ),
                    },
                    {
                      Header: "color",
                      accessor: "color",
                    },
                  ]}
                />

                {loaderValide === true ? (
                  <div>
                    <img
                      src={require("../../../../assets/img/loader.gif").default}
                      alt="loader"
                    />
                  </div>
                ) : commande.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
          {idRole === 1 || idRole === 2 ? (
            <Col md="12">
              <h4 className="title">Liste des pharmacies refusés</h4>
              <Card className="table-visualisation-action">
                <Card.Body>
                  <ReactTable
                    data={commandeR}
                    columns={[
                      {
                        Header: "Délégué",
                        accessor: "users.nom",
                        Cell: ({ cell }) => (
                          <div>
                            {cell.row.original.users.nomU +
                              " " +
                              cell.row.original.users.prenomU}
                          </div>
                        ),
                      },
                      {
                        Header: "Nom pharmacie",
                        accessor: "pharmacies.nom",
                      },
                      {
                        Header: "Détail",
                        accessor: "",
                        Cell: ({ cell }) => (
                          <div>
                            <Button
                              id={"idLigneV_" + cell.row.original.pharmacies.id}
                              onClick={(e) => {
                                navigate(
                                  "/detailValider/" + cell.row.original.id
                                );
                                localStorage.setItem(
                                  "returnVis",
                                  `/visualisation/${id}/${location.idLine}`
                                );
                              }}
                              className="btn btn-info"
                            >
                              Détail
                            </Button>
                          </div>
                        ),
                      },
                      {
                        Header: "BL",
                        accessor: "",
                        Cell: ({ cell }) => (
                          <div className="block-action">
                            <Button
                              className="message"
                              onClick={(e) => {
                                localStorage.setItem(
                                  "returnVis",
                                  `/visualisation/${id}/${location.idLine}`
                                );
                                navigate(`/detailCmd/${cell.row.original.id}`);
                              }}
                              variant="success"
                              size="sm"
                            >
                              Visualiser
                              <i
                                className="fa fa-eye"
                                id={"idLigne_" + cell.row.values.id}
                              />
                            </Button>
                          </div>
                        ),
                      },
                      {
                        Header: "Note",
                        accessor: "note",
                        Cell: ({ cell }) => (
                          <div>
                            <Button
                              id={"idLigneV_" + cell.row.values.id}
                              onClick={(e) => {
                                getCommentaire(cell.row.values.note);
                              }}
                              className="btn btn-info"
                            >
                              Lire
                              <i
                                className="fa fa-comment"
                                id={"idLigneV_" + cell.row.values.id}
                              />
                            </Button>
                          </div>
                        ),
                      },
                      {
                        Header: "action",
                        accessor: "action",
                        Cell: ({ cell }) =>
                          idRole === 1 ? (
                            <div>
                              <Button
                                onClick={(e) => {
                                  confirmMessage(
                                    "3",
                                    cell.row.original,
                                    idBls,
                                    caPharmacie
                                  );
                                }}
                                className="btn btn-success ml-1 visualiser"
                              >
                                Valider <i className="fa fa-check" />
                              </Button>
                              <Button
                                onClick={(e) => {
                                  confirmMessage(
                                    "6",
                                    cell.row.original,
                                    idBls,
                                    caPharmacie
                                  );
                                }}
                                className="btn btn-danger ml-1 visualiser"
                              >
                                Annuler <i className="fa fa-trash" />
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Button
                                onClick={(e) => {
                                  confirmMessage(
                                    "7",
                                    cell.row.original,
                                    idBls,
                                    caPharmacie
                                  );
                                }}
                                className="btn btn-danger ml-1 visualiser"
                              >
                                Réintroduire
                              </Button>
                            </div>
                          ),
                      },
                      {
                        Header: "t",
                        accessor: "",
                      },
                    ]}
                  />

                  {loaderRefuser === true ? (
                    <div>
                      <img
                        src={
                          require("../../../../assets/img/loader.gif").default
                        }
                        alt="loader"
                      />
                    </div>
                  ) : commandeR.length === 0 ? (
                    <div className="text-center">Aucun donnée trouvé</div>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Container>
    </>
  );
}

export default ListVisualisation;
