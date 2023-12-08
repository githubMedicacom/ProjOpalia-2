import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  exportBl,
  exportExcelSpontanee,
  getAllParmacieBl,
  getBlByPackSpontanee,
} from "../../../../Redux/blReduce";
import { useNavigate } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { useDispatch } from "react-redux";
import Select from "react-select";
import jwt_decode from "jwt-decode";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// core components
function ListPackSpontanee() {
  document.title = "Liste des suivis";
  var annee = localStorage.getItem("annee");
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const [alert, setAlert] = React.useState(null);
  const [loader, setLoader] = React.useState(true);
  const confirmMessage = (anneeLocal) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(anneeLocal)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const [action, setAction] = React.useState({
    value: 0,
    label: "Tous",
  });
  const [client, setClient] = React.useState({
    value: 0,
    label: "Tous",
  });
  const [optionsClient, setOptionsClient] = React.useState([
    {
      value: "",
      label: "Client",
      isDisabled: true,
    },
  ]);
  const idLine = decoded.userauth.line;
  const idRole = decoded.userauth.idrole;
  const idUser = decoded.userauth.id;
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [data, setData] = React.useState([]);

  const getClients = useCallback(async () => {
    var pharmacie = await dispatch(
      getAllParmacieBl({ idLine: idLine, idRole: idRole, anneeLocal: annee })
    );
    var entities = pharmacie.payload;
    setOptionsClient(entities);
  }, [dispatch]);

  const getCmdSpontanne = useCallback(
    async (idAction, idClient) => {
      var excel = await dispatch(exportExcelSpontanee({ idClient, annee }));
      var res = excel.payload;
      setData(res);
      var client = await dispatch(
        getBlByPackSpontanee({
          idAction,
          idClient,
          idRole,
          idLine,
          idUser,
          annee,
        })
      );
      var status = client.payload.status;
      var bl = client.payload.bl;
      if (status === 200) {
        setEntities(bl);
      }
      setLoader(false);
      /* setEntities(client.payload); */
    },
    [dispatch, annee]
  );

  useEffect(() => {
    getCmdSpontanne(0, 0);
    getClients();
  }, [getClients, getCmdSpontanne]); //now shut up eslint

  const exporter = useCallback(async () => {
    document.getElementById("export").click();
    hideAlert();
  }, [dispatch]);

  return (
    <>
      <Container fluid>
        {alert}
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="6">
            <Form.Group>
              <label>Client </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={client}
                onChange={(value) => {
                  setLoader(false);
                  setEntities([]);
                  setClient(value);
                  getCmdSpontanne(action.value, value.value);
                }}
                options={optionsClient}
              />
            </Form.Group>
          </Col>
        </Row>
        <Card className="table-visualisation-action">
          <Card.Body>
            <Row>
              <Col md="12" className="pdfExcel">
                <span>
                  <Button onClick={() => confirmMessage(annee)}>
                    Export Excel<i className="fas fa-file-excel"></i>
                  </Button>
                </span>
              </Col>
              <Col md="12" className="hidden">
                <ExcelFile
                  className="hidden"
                  element={<button id="export">Export Excel</button>}
                  filename={"Commande spontannée"}
                >
                  <ExcelSheet data={data} name="Commande spontannée">
                    <ExcelColumn label="idBl" value="idBl" />
                    <ExcelColumn label="Numero BL" value="numeroBL" />
                    <ExcelColumn label="Nom délegué" value="nomDelegue" />
                    <ExcelColumn label="Code One Key" value="code" />
                    <ExcelColumn label="Pharmacie" value="nomClt" />
                    <ExcelColumn label="Bricks" value="ims" />
                    <ExcelColumn label="Code adonix" value="codeAdonix" />
                    <ExcelColumn label="Grossiste" value="fournisseur" />
                    <ExcelColumn label="Désigantion" value="designation" />
                    <ExcelColumn label="A.C" value="nom_action" />
                    <ExcelColumn label="Nom pack" value="pack" />
                    <ExcelColumn label="Jour" value="day" />
                    <ExcelColumn label="Mois" value="month" />
                    <ExcelColumn label="Année" value="annee" />
                    <ExcelColumn label="Quantite" value="qte" />
                    <ExcelColumn label="Total HT" value="mnt" />
                    <ExcelColumn label="Total TTC" value="mnt_ttc" />
                    <ExcelColumn label="Bonification" value="bonif" />
                  </ExcelSheet>
                </ExcelFile>
              </Col>
            </Row>
            <ReactTable
              data={entities}
              columns={[
                {
                  Header: "Utilisateur",
                  accessor: "bls.users.nomU",
                },
                {
                  Header: "Pharmacie",
                  accessor: "bls.pharmacies.nom",
                },
                {
                  Header: "A.C",
                  accessor: "bls.actions.nom",
                },
                {
                  Header: "mntBl",
                  accessor: "mntBl",
                  Cell: ({ cell }) => (
                    <div className="block-action">
                      {cell.row.original.mntBl.toFixed(3)}
                    </div>
                  ),
                },
                {
                  Header: "Détail",
                  accessor: "id",
                  Cell: ({ cell }) => (
                    <div className="block-action">
                      <Button
                        className="message"
                        onClick={() => {
                          localStorage.setItem(
                            "returnVis",
                            "/commandeSpontanee"
                          );
                          navigate(
                            "/detailCmdSpontanee/" +
                              cell.row.original.bls.id_action +
                              "/" +
                              cell.row.original.bls.client
                          );
                        }}
                        variant="success"
                        size="sm"
                      >
                        Détail
                        <i
                          className="fa fa-eye"
                          id={"idLigne_" + cell.row.values.id}
                        />
                      </Button>
                    </div>
                  ),
                },
                {
                  Header: "b",
                  accessor: "",
                },
              ]}
            />
            {loader === true ? (
              <div>
                <img
                  src={require("../../../../assets/img/loader.gif").default}
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
      </Container>
    </>
  );
}

export default ListPackSpontanee;
