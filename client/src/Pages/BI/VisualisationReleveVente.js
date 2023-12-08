import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import {
  allReleveList,
  deletereleve,
  allReleveVenteBi,
} from "../../Redux/releveVenteReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function VisualisationReleveVente() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var token = localStorage.getItem("x-access-token");
  var year = localStorage.getItem("annee");
  localStorage.removeItem("bonification");
  var decoded = jwt_decode(token);
  const id = decoded.userauth.id;
  const idRole = decoded.userauth.idrole;
  var idLine = 0;
  if (idRole !== 0) {
    idLine = decoded.userauth.line;
  }
  var dateToday = new Date();
  var releveDate =
    dateToday.getDate() +
    "/" +
    (dateToday.getMonth() + 1) +
    "/" +
    dateToday.getFullYear();
  var dateToday = new Date();

  const [data, setData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
  const [biVente, setBiVente] = React.useState([]);

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

  const confirmMessage = (bl, idRow) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes Vous sure de supprimer ce Relevé?"}
        onConfirm={() => {
          deleteReleve(bl.id, idRow);
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };

  
  const confirmExport = (year, i) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(year, i)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };



  function deleteReleve(id, idRow) {
    var list = data;
    list.splice(idRow, 1);
    setData(list);
    dispatch(deletereleve({ id }));
    notify("tr", "Supprimer avec succès", "success");
    hideAlert();
  }
  const hideAlert = () => {
    setAlert(null);
  };

  const listeReleve = useCallback(
    async (idUser) => {
      var idUser = id;
      var list = await dispatch(
        allReleveList({
          idLine: idLine,
          idUserBi: idUser,
          idRole: idRole,
          annee: year,
        })
      );
      var res = list.payload;
      var array = [];
      res.forEach((element) => {
        var e = {
          id: element.id,
          userBi: element.users.nomU + " " + element.users.prenomU,
          file: element.file,
          type: element.type,
          date: element.createdAt,
        };
        array.push(e);
      });
      setLoader(false);
      setData(array);
    },
    [dispatch, id, idLine, idRole, year]
  );


  const exporter = useCallback(
    async (anneeLocal, i) => {
      document.getElementById("export" + i).click();
      hideAlert();
    },
    [dispatch, listeReleve]
  );



  const getBI = useCallback(
    async (year) => {
      var prod = await dispatch(
        allReleveVenteBi({
          id: id,
          annee: parseInt(year),
        })
      );
      var res = prod.payload;
      var arrayBi = [];
      res.forEach((element) => {
        var valBi = {
          produit_ims: element.produits.produit_ims,
          designation: element.produits.designation,
          prix: element.produits.prix,
          code: element.produits.code,
          code_pf: element.produits.code_pf,
          code_lbr: element.produits.code_lbr,
          fournisseur: element.fournisseurs.nom,
          codeA: element.fournisseurs.code,
          opalia:
            element.produits.code_lbr !== null &&
            element.produits.code_lbr !== ""
              ? "LBR"
              : "OPALIA",
          volume: element.mesure,
          valeur: element.mesure
            ? (element.produits.prix * element.mesure).toFixed(2)
            : 0,
          mois: element.mois,
          annee: element.annee,
          date: element.annee + "-" + element.mois + "-01",
          type:  "VENTE",
          typeGro: element.releves_ventes.type === 1 ? "Fin mois" : "Mi-mois",
        };
        arrayBi.push(valBi);
      });
      setBiVente(arrayBi);
    },
    [dispatch, id]
  );

  React.useEffect(() => {
    if (idRole === 2) {
      listeReleve(0, id);
    } else {
      listeReleve(0, 0);
    }
    getBI(year);
  }, [listeReleve, , id, idRole]);
  function paymentBl(idBl) {
    navigate("/telechargerFichierReleveVente/" + idBl);
  }

  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12" className="pdfExcel">
            {" "}
            <span>
              <Button onClick={() => confirmExport(year, 2)}>
                Export Excel BI vente
                <i className="fas fa-file-excel"></i>
              </Button>
            </span>
          </Col>

          <Col md="12" className="hidden">
            <ExcelFile
              className="hidden"
              element={<button id="export2">Export Excel</button>}
              filename={releveDate + "Relevebi_vente_stock"}
            >
              <ExcelSheet data={biVente} name="RelevesBI">
                <ExcelColumn label="GROSSISTE" value="fournisseur" />
                <ExcelColumn label="PRODUIT IMS" value="produit_ims" />
                <ExcelColumn label="DESIGNATION" value="designation" />
                <ExcelColumn label="CODE ADONIX" value="codeA" />
                <ExcelColumn label="Valeur" value="valeur" />
                <ExcelColumn label="Volume" value="volume" />
                <ExcelColumn label="Type 2" value="type" />
                <ExcelColumn label="CODE PF" value="code_pf" />
                <ExcelColumn label="Date" value="date" />
                <ExcelColumn label="Type 3" value="type" />
                <ExcelColumn label="CODE PCT LBR" value="code_lbr" />
                <ExcelColumn label="CODE PCT" value="code" />
                <ExcelColumn label="Type 4" value="opalia" />
                <ExcelColumn label="Type 5" value="typeGro" />
              </ExcelSheet>
            </ExcelFile>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <h4 className="title">Liste des relevés ventes</h4>
            <Card>
              <Card.Body className="table-style">
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Utilisateur BI",
                      accessor: "userBi",
                    },
                    {
                      Header: "Extraction",
                      accessor: "type",
                      Cell: ({ cell }) =>
                        parseInt(cell.row.values.type) == 1
                          ? "Fin mois"
                          : "Mi-mois",
                    },
                    {
                      Header: "Date",
                      accessor: "date",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          {cell.row.values.date !== null
                            ? new Date(
                                new Date(cell.row.values.date).getTime() -
                                  new Date(
                                    cell.row.values.date
                                  ).getTimezoneOffset() *
                                    60000
                              )
                                .toISOString()
                                .slice(0, 16)
                                .replace("T", " à ")
                            : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "visualization",
                      accessor: "file",
                      Cell: ({ cell }) => (
                        <Button
                          id={"idLigne_" + cell.row.original.id}
                          onClick={(e) => {
                            paymentBl(cell.row.original.id);
                            localStorage.setItem(
                              "file",
                              cell.row.original.file
                            );
                            localStorage.setItem(
                              "returnList",
                              "visualisationReleve"
                            );
                          }}
                          className="btn btn-info ml-1 visualiser"
                        >
                          <i
                            className="fa fa-file"
                            id={"idLigne_" + cell.row.original.id}
                          />
                          Visualiser
                        </Button>
                      ),
                    },

                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div>
                          <Button
                            id={"idLigne_" + cell.row.values.id}
                            onClick={(e) => {
                              confirmMessage(cell.row.original, cell.row.id);
                            }}
                            className="delete btn btn-danger ml-1 float-right"
                          >
                            <i
                              className="fa fa-trash"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {loader === true ? (
                  <div>
                    <img
                      src={require("../../assets/img/loader.gif").default}
                      alt="loader"
                    />
                  </div>
                ) : data.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* <a href={"#top"}
        className="hidden"
        id="download"
        rel="noopener noreferrer"
        target="_blank"
      >ici</a> */}
    </>
  );
}

export default VisualisationReleveVente;
