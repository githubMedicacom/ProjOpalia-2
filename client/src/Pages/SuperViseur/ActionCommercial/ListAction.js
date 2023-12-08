import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  fetchAction,
  actionChangeEtat,
  getActionCloturer,
  getActionUgById
} from "../../../Redux/actionReduce";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";

import SweetAlert from "react-bootstrap-sweetalert";
import NotificationAlert from "react-notification-alert";
import { useNavigate , useParams } from "react-router-dom";

// core components
function ListRole() {
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
  var annee = localStorage.getItem("annee");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line;
  const idRole = decoded.userauth.idrole;
  var id = location.id;
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [cloturer, setCloturer] = React.useState([]);
  function ajouter() {
    navigate("/action/ajout");
  }


  const getAction = useCallback(async () => {
    var actions = await dispatch(fetchAction({ idLine, idRole, annee }));
    setEntities(actions.payload);
  }, [dispatch, idLine, idRole, annee]);
  const getActionsCloturer = useCallback(async () => {
    var actions = await dispatch(getActionCloturer({ idLine, idRole, annee }));
    setCloturer(actions.payload);
  }, [dispatch, idLine, idRole, annee]);
  const [alert, setAlert] = React.useState(null);
  const confirmMessage = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes Vous sure de clôturer?"
        onConfirm={() => changeEtat(id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        {/* Vous éte sure de supprime cette root? */}
      </SweetAlert>
    );
  };

  function changeEtat(id) {
    dispatch(actionChangeEtat(id)).then((e1) => {
      getAction();
      getActionsCloturer();
      notify("tr", "Action clôturer", "success");
      hideAlert();
    });
  }
  const hideAlert = () => {
    setAlert(null);
  };

  const detailAction = useCallback(async (id) => {
    var det = await dispatch(getActionUgById(id));
    var data = await det.payload;
    setAlert(
      <SweetAlert
        customClass="pop-up-bl"
        style={{ display: "block", marginTop: "-100px" }}
        title={"Détail UG"}
        onConfirm={() => hideAlert()}
        cancelBtnBsStyle="danger"
      >
        <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Produit</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => {
              return (
                <tr key={e.id}>
                  <td>{e.produits.designation}</td>
                  <td>{e.quantiteUg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SweetAlert>
    );
  }, [dispatch, id]);


  useEffect(() => {
    getAction();
    getActionsCloturer();
  }, [getAction, getActionsCloturer]); //now shut up eslint
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          {idRole === 0 || idRole === 5 ? (
            <Col md="12">
              <Button
                id="saveBL"
                className="btn-wd btn-outline mr-1 float-left"
                type="button"
                variant="info"
                onClick={ajouter}
              >
                <span className="btn-label">
                  <i className="fas fa-plus"></i>
                </span>
                Ajouter une action
              </Button>
            </Col>
          ) : (
            ""
          )}  {entities.length > 0 ? 
          <Col md="12">
            <h4 className="title">Liste des actions</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Nom",
                      accessor: "nom",
                    },
                    {
                      Header: "Réseau",
                      accessor: "nomLigne",
                    },
                    {
                      Header: "Pack présent",
                      accessor: "libPack",
                    },
                    {
                      Header: "Date début",
                      accessor: "date_debut",
                    },
                    {
                      Header: "Date fin",
                      accessor: "date_fin",
                    },
                    {
                      Header: "actions",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="block-action">
                          <Button
                            className="message"
                            onClick={(e) => {
                              navigate(
                                "/visualisation/" +
                                  cell.row.values.id +
                                  "/" +
                                  cell.row.original.id_line
                              );
                            }}
                            variant="success"
                            size="sm"
                          >
                            <i
                              className="fa fa-eye"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                        
                          {idRole === 0 || idRole === 1 || idRole === 5 ? (
                          
                            <Button
                              onClick={(e) => {
                                confirmMessage(
                                  entities[cell.row.id].id,
                                  cell.row.id
                                );
                              }}
                              variant="danger"
                              size="sm"
                            >
                              Clôturer{" "}
                              <i
                                className="fa fa-trash"
                                id={"idLigne_" + cell.row.values.id}
                              />
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                        
                      ),
                      
                    },
                    {
                      Header: "taches",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="block-action">
                           
                          {idRole !== 0 ? (
                            <Button
                              className="message"
                              onClick={(e) => {
                                navigate("/discution/" + cell.row.values.id);
                                /* window.location.replace("/discution/"+cell.row.values.id) */
                              }}
                              variant="success"
                              size="sm"
                            >
                              {/* Discution */}{" "}
                              <i
                                className="fa fa-comments"
                                id={"idLigne_" + cell.row.values.id}
                              />
                            </Button>
                          ) : (
                            ""
                          )}
                          {idRole !== 0 ? (
                            <Button
                              onClick={(e) => {
                                navigate("/todoList/" + cell.row.values.id);
                                /* window.location.replace("/todoList/"+cell.row.values.id) */
                              }}
                              variant="info"
                              size="sm"
                            >
                              TodoList{" "}
                              <i
                                className="fa fa-eye"
                                id={"idLigne_" + cell.row.values.id}
                              />
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                      ),
                    },
                    {
                    
                      Header: "Detail UG",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div  className="actions-right block_action">
                          { entities[cell.row.id] && entities[cell.row.id].qteug != undefined  ? (
                            <Button
                              className="message"
                              onClick={(e) => {
                                detailAction(entities[cell.row.id].id,
                                  cell.row.id);
                              }}
                              variant="info"
                              size="sm"
                            >
                             
                              <i
                                className="fa fa-eye"  
                              />
                            </Button>
                             ) : (
                              ""
                            )}
                       
                       
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {entities.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
          : ""}
          <Col md="12">
            <h4 className="title">Liste des actions clôturées</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={cloturer}
                  columns={[
                    {
                      Header: "Nom",
                      accessor: "nom",
                    },
                    {
                      Header: "Réseau",
                      accessor: "nomLigne",
                    },
                    {
                      Header: "Pack présent",
                      accessor: "libPack",
                    },
                    {
                      Header: "Date début",
                      accessor: "date_debut",
                    },
                    {
                      Header: "Date fin",
                      accessor: "date_fin",
                    },
                    {
                      Header: "actions",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="block-action">
                          <Button
                            className="message"
                            onClick={(e) => {
                              navigate(
                                "/visualisation/" +
                                  cell.row.values.id +
                                  "/" +
                                  cell.row.original.id_line
                              );
                              /* window.location.replace("/visualisation/"+cell.row.values.id) */
                            }}
                            variant="success"
                            size="sm"
                          >
                            <i
                              className="fa fa-eye"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "taches",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="block-action">
                          {idRole !== 0 ? (
                            <Button
                              className="message"
                              onClick={(e) => {
                                window.location.replace(
                                  "/discution/" + cell.row.values.id
                                );
                              }}
                              variant="success"
                              size="sm"
                            >
                              <i
                                className="fa fa-comments"
                                id={"idLigne_" + cell.row.values.id}
                              />
                            </Button>
                          ) : (
                            ""
                          )}
                          {idRole !== 0 ? (
                            <Button
                              onClick={(e) => {
                                window.location.replace(
                                  "/todoList/" + cell.row.values.id
                                );
                              }}
                              variant="info"
                              size="sm"
                            >
                              TodoList{" "}
                              <i
                                className="fa fa-eye"
                                id={"idLigne_" + cell.row.values.id}
                              />
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                      ),
                    },
                    {
                      Header: "Detail UG",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div  className="actions-right block_action">
                     { entities[cell.row.id] && entities[cell.row.id].qteug != undefined  ? (

                            <Button
                              className="message"
                              onClick={(e) => {
                                detailAction(entities[cell.row.id].id,
                                  cell.row.id);
                              }}
                              variant="info"
                              size="sm"
                            >
                              <i
                                className="fa fa-eye"  
                              />
                            </Button>
                             ) : (
                              ""
                            )}
                       
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {cloturer.length === 0 ? (
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

export default ListRole;
