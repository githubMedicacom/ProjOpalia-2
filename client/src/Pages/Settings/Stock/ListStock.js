import NotificationAlert from "react-notification-alert";
import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  deleteStock,
  fetchStock,
  stockChangeEtat,
  exportStock,
} from "../../../Redux/stockReduce.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import { getActiveDelegue } from "../../../Redux/usersReduce.js";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
// core components
function ListStock() {
  var token = localStorage.getItem("x-access-token");
  var annee = localStorage.getItem("annee");
  var decoded = jwt_decode(token);
  var idRole = decoded.userauth.idrole;
  var idLine = decoded.userauth.line;

  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Délégué",
      isDisabled: true,
    },
  ]);
  const [delegueSelect, setDelegueSelect] = React.useState({
    value: 0,
    label: "Délégué",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const [entitiesVente, setEntitiesVente] = React.useState([]);
  const [entitiesStock, setEntitiesStock] = React.useState([]);
  var dateToday = new Date();
  var produitDate =
    dateToday.getDate() +
    "/" +
    (dateToday.getMonth() + 1) +
    "/" +
    dateToday.getFullYear();

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

  function ajouter() {
    navigate("/ajouterStock");
  }

  const getStock = useCallback(
    async (id_user) => {
      var stock = await dispatch(
        fetchStock({ id_user: id_user, annee: annee })
      );
      var excel = await dispatch(exportStock({ annee: annee }));
      var array = excel.payload;
      setEntities(stock.payload);
      setEntitiesVente(array);
      /* setEntitiesStock(arrayStock); */
    },
    [dispatch]
  );

  function changeEtat(id, e) {
    dispatch(stockChangeEtat(id)).then((e1) => {
      getStock();
      switch (e) {
        case 0:
          notify("tr", "LBR activer avec succes", "success");
          break;
        case 1:
          notify("tr", "LBR désactiver avec succes", "success");
          break;
        default:
          break;
      }
    });
  }

  const getDelegue = useCallback(
    async (p) => {
      var anneeLocal = annee;
      var delegueBD = await dispatch(getActiveDelegue());
      var entities = delegueBD.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({
          value: e.id,
          label: e.nomU + " " + e.prenomU,
        });
      });
      setOptions(arrayOption);
    },
    [dispatch, idLine, idRole]
  );
  const confirmMessage = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };

  const exporter = useCallback(async (id) => {
    document.getElementById("export"+id).click();
    hideAlert();
  }, []);

  const deleteMessage = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sure de supprimer cette ligne?"}
        onConfirm={() => deleteLigne(id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  function deleteLigne(id) {
    dispatch(deleteStock(id)).then(() => {
      getStock(0);
      notify("tr", "Supprimer avec succès", "success");
      hideAlert();
    });
  }
  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    getDelegue();
    getStock(delegueSelect.value);
  }, [getStock]); //now shut up eslint
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          {idRole === 2 ? (
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
                Ajouter LBR
              </Button>
            </Col>
          ) : (
            ""
          )}
          {idRole === 0 ? (
            <Col md="6">
              <label>Délégué </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={delegueSelect}
                onChange={(value) => {
                  setDelegueSelect(value);
                  getStock(value.value);
                }}
                options={options}
              />
            </Col>
          ) : (
            ""
          )}
          {idRole === 0 ? (
            <Col md="6" className="pdfExcel">
              <span>
                <Button className="mr-1" onClick={() => confirmMessage(1)}>
                  Export Excel<i className="fas fa-file-excel"></i>
                </Button>
              </span>
              {/* <span>
                <Button className="mr-1" onClick={() => confirmMessage(2)}>
                  Export Excel stock<i className="fas fa-file-excel"></i>
                </Button>
              </span> */}
            </Col>
          ) : (
            ""
          )}
          {idRole === 0 ? (
            <Col md="12" className="hidden">
              <ExcelFile
                className="hidden"
                element={<button id="export1">Export Excel vente</button>}
                filename={produitDate + "ExportLbr"}
              >
                <ExcelSheet data={entitiesVente} name="ExportLbr">
                  <ExcelColumn label="GROSSISTE" value="fournisseur" />
                  <ExcelColumn label="PRODUIT IMS" value="produit_ims" />
                  <ExcelColumn label="DESIGNATION" value="produit" />
                  <ExcelColumn label="CODE ADONIX" value="code_adonix" />
                  <ExcelColumn label="valeur" value="valeur" />
                  <ExcelColumn label="volume" value="volume" />
                  <ExcelColumn label="Type 2" value="type" />
                  <ExcelColumn label="CODE PF" value="code_pf" />
                  <ExcelColumn label="date" value="date" />
                  <ExcelColumn label="Type 3" value="type" />
                  <ExcelColumn label="CODE PCT LBR" value="code_lbr" />
                  <ExcelColumn label="CODE PCT" value="code" />
                  <ExcelColumn label="Type 4" value="opalia" />
                  <ExcelColumn label="Type 5" value="typeEx" />
                </ExcelSheet>
              </ExcelFile>
            </Col>
          ) : (
            ""
          )}
          {idRole === 0 ? (
            <Col md="12" className="hidden">
              <ExcelFile
                className="hidden"
                element={<button id="export2">Export Excel stock</button>}
                filename={produitDate + "ExportLbr"}
              >
                <ExcelSheet data={entitiesStock} name="ExportLbr">
                  <ExcelColumn label="fournisseur" value="fournisseur" />
                  <ExcelColumn label="produit ims" value="produit_ims" />
                  <ExcelColumn label="produit" value="produit" />
                  <ExcelColumn label="Code adonix" value="code_adonix" />
                  <ExcelColumn label="valeur" value="valeur" />
                  <ExcelColumn label="volume" value="volume" />
                  <ExcelColumn label="type 2" value="type" />
                  <ExcelColumn label="code_pf" value="code_pf" />
                  <ExcelColumn label="date" value="date" />
                  <ExcelColumn label="type 3" value="type" />
                  <ExcelColumn label="CODE PCT LBR" value="code_lbr" />
                  <ExcelColumn label="CODE PCT" value="code" />
                  <ExcelColumn label="type 4" value="opalia" />
                  <ExcelColumn label="Type 5" value="typeEx" />
                </ExcelSheet>
              </ExcelFile>
            </Col>
          ) : (
            ""
          )}
          <Col md="12">
            <h4 className="title">Liste des LBR</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "titre",
                      accessor: "titre",
                      Cell: ({ cell }) => (
                        <span className="bold">{cell.row.values.titre}</span>
                      ),
                    },
                    {
                      Header: "Utilisateur",
                      accessor: "users.nomU",
                    },
                    {
                      Header: "fournisseur",
                      accessor: "fournisseurs.nom",
                    },
                    {
                      Header: "Etat",
                      accessor: "etat",
                      Cell: ({ cell }) =>
                        cell.row.values.etat === 1 ? "Activé" : "Désactive",
                    },
                    {
                      Header: "Extraction",
                      accessor: "type",
                      Cell: ({ cell }) =>
                        cell.row.values.type === 1 ? "Début mois" : "Mi-mois",
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/stock/update/" + cell.row.values.id);
                            }}
                            variant="warning"
                            size="sm"
                            className="text-warning btn-link edit"
                          >
                            <i
                              className={
                                idRole === 2 ? "fa fa-edit" : "fa fa-eye"
                              }
                            />
                          </Button>
                          {idRole === 2 ? (
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              size="sm"
                              onClick={(e) => {
                                deleteMessage(cell.row.values.id);
                              }}
                              variant="danger"
                              className="text-danger btn-link edit"
                            >
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
        </Row>
      </Container>
    </>
  );
}

export default ListStock;
