import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Card, Container, Row, Col, Form, Button } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { getClientSegmentById,getAllClientSeg } from "../../../../Redux/segmentReduce";
import { getActionById } from "../../../../Redux/actionReduce";
import {
  commandeAdded,
  getAllCommande,
  getCommandeByEtat,
} from "../../../../Redux/commandesReduce";
import { totalCaByPack } from "../../../../Redux/blReduce";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { getIdSecteurIms } from "../../../../Redux/secteurReduce";

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
  localStorage.removeItem("commentaire");
  var decoded = jwt_decode(token);
  var idUser = decoded.userauth.id;
  const idRole = decoded.userauth.idrole;
  const idSect = decoded.userauth.idsect;
  var id = location.id;
  const idLine = location.idLine;
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [caPharmacie, setCaPharmacie] = React.useState([]);
  const [commande, setCommande] = React.useState([]);
  const [nom, setNom] = React.useState("");
  const [objectif, setObjectif] = React.useState("");
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [pack, setPack] = React.useState([]);
  const [countBl, setCountBl] = React.useState("");
  const [alert, setAlert] = React.useState(null);
  const [testDate, setTestDate] = React.useState(true);
  const getCommentaire = useCallback(async (commentaire) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Note"}
        onConfirm={() => hideAlert()}
        cancelBtnBsStyle="danger"
      >
        {commentaire !== "" && commentaire !== null
          ? commentaire
          : "Aucune note"}
      </SweetAlert>
    );
  }, []);
  const confirmMessage = (event, ligne) => {
    var check = event.target.value;
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={
          parseInt(check) === 1 || parseInt(check) === 3
            ? "Commande accepter"
            : "Commande réfuser"
        }
        onConfirm={() => submitForm(event, ligne)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        {parseInt(check) === 2 || parseInt(check) === 3 ? (
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
  const hideAlert = () => {
    setAlert(null);
  };
  const getSegment = useCallback(
    async (list) => {
      var dd = list.date_debut;
      var df = list.date_fin;
      var idSeg = "(" + list.idSegment + ")";
      var secteur = await dispatch(getIdSecteurIms(idSect));
      var idBricks = secteur.payload;
      var res = null;
      if (idRole === 2){
        if(idSeg !== "(0)")
          res = await dispatch(
            getClientSegmentById({ idSeg, idRole, idBricks, dd, df,id })
          );
        else 
          res = await dispatch(
            getAllClientSeg({ idSeg, idRole, idBricks, dd, df,id })
          );
      }
      else res = await dispatch(getCommandeByEtat(id));
      setEntities(res.payload.rows);
      setCaPharmacie(res.payload.objClient);
    },
    [dispatch, idRole, idSect, id]
  );

  const getCommande = useCallback(async () => {
    var res = await dispatch(getAllCommande(id));
    setCommande(res.payload);
  }, [dispatch, id]);
  const getTotal = useCallback(
    async (entities) => {
      var total = await dispatch(
        totalCaByPack({
          idPacks: entities.idPacks,
          dateDebut: entities.date_debut,
          dateFin: entities.date_fin,
          idLine: idLine,
        })
      );
      setCountBl(total.payload.countBl);
    },
    [dispatch, idLine]
  );

  const getAction = useCallback(async () => {
    var today = new Date();
    var action = await dispatch(getActionById(id));
    var result = action.payload;
    if (result.length === 0) {
      setTimeout(() => {
        navigate("/listAction");
      }, 1000);
    } else {
      var entities = result[0];
      var dateD = new Date(entities.date_debut); // Or the date you'd like converted.
      var dateDD = new Date(dateD.getTime() - dateD.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      var dateF = new Date(entities.date_fin); // Or the date you'd like converted.
      var dateFF = new Date(dateF.getTime() - dateF.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      if (
        dateF.getTime() < today.getTime() ||
        dateD.getTime() > today.getTime()
      ) {
        setTestDate(false);
      }
      setNom(entities.nom);
      setObjectif(entities.objectif);
      setDateDebut(dateDD);
      setDateFin(dateFF);
      setPack(entities.libPack);
      getSegment(entities);
      getTotal(entities);
    }
  }, [dispatch, id, getSegment, getTotal, navigate]);

  useEffect(() => {
    getAction();
    getCommande();
  }, [getAction, getCommande]); //now shut up eslint

  function listActions() {
    navigate("/listAction");
    /* window.location.replace("/listAction"); */
  }
  function submitForm(event, ligne) {
    var note = localStorage.getItem("commentaire");
    dispatch(
      commandeAdded({
        etat: event.target.value,
        id_pharmacie: ligne.id_pharmacie,
        id_segment: ligne.Segment,
        id_user: idUser,
        note: note,
        id_action: id,
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
      getAction();
      getCommande();
      setTimeout(() => {
        getAction();
        getCommande();
      }, 1500);
      hideAlert();
    });
  }
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
                      <p className="card-category">Objectif à atteindre</p>
                      <Card.Title as="h4">{objectif}</Card.Title>
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
                      <p className="card-category">Objectif restant</p>
                      <Card.Title as="h4">{objectif - countBl}</Card.Title>
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
                      <Card.Title as="h4">{pack}</Card.Title>
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
          {testDate === true ? (
            parseInt(idRole) === 1 ? (
              <Col md="12">
                <h4 className="title">Liste des pharmacies en cours de validation</h4>
                <Card className="table-visualisation-action">
                  <Card.Body>
                    <ReactTable
                      data={entities}
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
                          accessor: "id_pharmacie",
                          Cell: ({ cell }) => (
                            <div>
                              {caPharmacie[cell.row.original.id_pharmacie]}
                            </div>
                          ),
                        },
                        {
                          Header: "Clôturer",
                          accessor: "id",
                          Cell: ({ cell }) => (
                            <div className="actions-check block-action">
                              <Row>
                                <Col md="4">
                                  <Form.Check className="form-check-radio">
                                    <Form.Check.Label>
                                      <Form.Check.Input
                                        onClick={(val) =>
                                          confirmMessage(val, cell.row.original)
                                        }
                                        defaultValue={idRole === 2 ? "1" : "3"}
                                        id="exampleRadios21"
                                        name="exampleRadio"
                                        type="radio"
                                      ></Form.Check.Input>
                                      <span className="form-check-sign"></span>
                                      Oui
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Col>
                                <Col md="6">
                                  <Form.Check className="form-check-radio">
                                    <Form.Check.Label>
                                      <Form.Check.Input
                                        onClick={(val) =>
                                          confirmMessage(val, cell.row.original)
                                        }
                                        defaultValue={idRole === 2 ? "2" : "4"}
                                        id="exampleRadios21"
                                        name="exampleRadio"
                                        type="radio"
                                      ></Form.Check.Input>
                                      <span className="form-check-sign"></span>
                                      Non
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Col>
                              </Row>
                            </div>
                          ),
                        },
                        {
                          Header: "action",
                          accessor: "",
                        },
                      ]}
                    />
                    {entities.length === 0 ? (
                      <div className="text-center">Aucun donnée trouvé</div>
                    ) : (
                      ""
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ) : parseInt(idRole) === 2 ? (
              <Col md="12">
                <h4 className="title">Liste des pharmacies en cours de validation</h4>
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
                              {caPharmacie[cell.row.original.id_pharmacie]}
                            </div>
                          ),
                        },
                        {
                          Header: "Clôturer",
                          accessor: "id",
                          Cell: ({ cell }) => (
                            <div className="actions-check block-action">
                              <Row>
                                <Col md="4">
                                  <Form.Check className="form-check-radio">
                                    <Form.Check.Label>
                                      <Form.Check.Input
                                        onClick={(val) =>
                                          confirmMessage(val, cell.row.original)
                                        }
                                        defaultValue={idRole === 2 ? "1" : "3"}
                                        id="exampleRadios21"
                                        name="exampleRadio"
                                        type="radio"
                                      ></Form.Check.Input>
                                      <span className="form-check-sign"></span>
                                      Oui
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Col>
                                <Col md="6">
                                  <Form.Check className="form-check-radio">
                                    <Form.Check.Label>
                                      <Form.Check.Input
                                        onClick={(val) =>
                                          confirmMessage(val, cell.row.original)
                                        }
                                        defaultValue={idRole === 2 ? "2" : "4"}
                                        id="exampleRadios21"
                                        name="exampleRadio"
                                        type="radio"
                                      ></Form.Check.Input>
                                      <span className="form-check-sign"></span>
                                      Non
                                    </Form.Check.Label>
                                  </Form.Check>
                                </Col>
                              </Row>
                            </div>
                          ),
                        },
                        {
                          Header: "action",
                          accessor: "",
                        },
                      ]}
                    />
                    {entities.length === 0 ? (
                      <div className="text-center">Aucun donnée trouvé</div>
                    ) : (
                      ""
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ) : ""
          ) : ""}
          <Col md="12">
            <h4 className="title">Liste des pharmacies validées</h4>
            <Card className="table-visualisation-action">
              <Card.Body>
                <ReactTable
                  data={commande}
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
                      Header: "Segment",
                      accessor: "segments.nom",
                    },
                    /* {
                      Header: "pack",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div>
                          {pack}
                        </div>
                      ),
                    }, */
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
                            Lire{" "}
                            <i
                              className="fa fa-comment"
                              id={"idLigneV_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "Etat",
                      accessor: "etat",
                      Cell: ({ cell }) => (
                        <div>
                          {cell.row.values.etat === 1 ||
                          cell.row.values.etat === 3
                            ? "Oui"
                            : "Non"}
                        </div>
                      ),
                    },
                    {
                      Header: "action",
                      accessor: "",
                    },
                  ]}
                />
                {commande.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListVisualisation;
