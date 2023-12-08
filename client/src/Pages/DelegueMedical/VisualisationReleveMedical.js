import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { allReleveList, deletereleve } from "../../Redux/releveMedicalReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import ReactExport from "react-export-excel";
import { getActiveFournisseur } from "../../Redux/fournisseurReduce";
import { allReleveMedicalBi } from "../../Redux/releveMedicalReduce";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function VisualisationReleveMedical() {
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

  const [data, setData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const [dataExcel, setDataExcel] = React.useState([]);
  const [dataPayer, setDataPayer] = React.useState([]);
  const [bi, setBi] = React.useState([]);
  const [biVente, setBiVente] = React.useState([]);

  const [mois, setMois] = React.useState({
    value: 0,
    label: "Tous",
  });
  const [optionsMois] = React.useState([
    {
      value: "",
      label: "Mois",
      isDisabled: true,
    },
    { value: 0, label: "Tous" },
    { value: 1, label: "janvier" },
    { value: 2, label: "février" },
    { value: 3, label: "mars" },
    { value: 4, label: "avril" },
    { value: 5, label: "mai" },
    { value: 6, label: "juin" },
    { value: 7, label: "juillet" },
    { value: 8, label: "août" },
    { value: 9, label: "septembre" },
    { value: 10, label: "octobre" },
    { value: 11, label: "novembre" },
    { value: 12, label: "décembre" },
  ]);

  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Délégué",
      isDisabled: true,
    },
  ]);
  const [delegueSelect, setDelegueSelect] = React.useState({
    value: 0,
    label: "Tous",
  });
  // Pharmacie
  const [optionsFournisseur, setOptionsFournisseur] = React.useState([
    {
      value: "",
      label: "Grossiste",
      isDisabled: true,
    },
  ]);
  const [grossisteSelect, setGrossisteSelect] = React.useState({
    value: 0,
    label: "Tous",
  });

  var anneeLocal = localStorage.getItem("annee");
  var dateToday = new Date();
  var releveDate =
    dateToday.getDate() +
    "/" +
    (dateToday.getMonth() + 1) +
    "/" +
    dateToday.getFullYear();

  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
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

  const confirmExportMessage = (anneeLocal, i) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(anneeLocal, i)}
        onCancel={() => hideExportAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  const hideExportAlert = () => {
    setAlert(null);
  };

 

  //get fournisseur
  const getFournisseur = useCallback(async () => {
    var fournisseur = await dispatch(getActiveFournisseur());
    var entities = fournisseur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionsFournisseur(arrayOption);
  }, [dispatch]);

  const listeReleve = useCallback(
    async (idGrossiste, idDelegue , moi) => {
      var idUser = idRole === 1 || idRole === 0 ? idDelegue : id;
      var list = await dispatch(
        allReleveList({
          idLine: idLine,
          idDelegue: idUser,
          idRole: idRole,
          annee: year,
          grossiste: idGrossiste,
          mois: moi,
        })
      );
      var res = list.payload;
      var array = [];
      res.forEach((element) => {
        var e = {
          id: element.id,
          delegue: element.users.nomU + " " + element.users.prenomU,
          fournisseur: element.fournisseurs.nom,
          code: element.fournisseurs.code,
          mois: element.mois,
          file: element.file,
          type: element.type,
          createdAt: element.createdAt,
        };
        array.push(e);
      });
      setLoader(false);
      setData(array);
    },
    [dispatch, id, idLine, idRole, year]
  );

  const getBI = useCallback(
    async (anneeLocal) => {
      var prod = await dispatch(
        allReleveMedicalBi({
          id: id,
          annee: parseInt(anneeLocal),
          mois: mois.value,
        })
      );
      var res = prod.payload;
      var arrayBi = [];
      var arrayBiStock = [];
      res.forEach((element) => {
        var valBi = {
          produit_ims: element.produits.produit_ims,
          designation: element.produits.designation,
          prix: element.produits.prix,
          code: element.produits.code,
          code_pf: element.produits.code_pf,
          code_lbr: element.produits.code_lbr,
          fournisseur: element.releves_medicals.fournisseurs.nom,
          codeA: element.releves_medicals.fournisseurs.code,
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
          type: element.type === 1 ? "STOCK" : "VENTE",
          typeGro:
            element.releves_medicals.type === 1 ? "Fin mois" : "Mi-mois",
        };
        if (element.type === 1) arrayBiStock.push(valBi);
        else arrayBi.push(valBi);
      });
      setBiVente(arrayBi);
      setBi(arrayBiStock);
    },
    [dispatch, id, mois]
  );

  function paymentBl(idBl) {
    navigate("/TelechargerFichierReleveMedical/" + idBl);
  }

  const exporter = useCallback(
    async (anneeLocal, i) => {
      document.getElementById("export" + i).click();
      hideAlert();
    },
    [dispatch, listeReleve]
  );

  React.useEffect(() => {
    var moi = mois.value ;
   
    if (idRole === 0 || idRole === 7) {
      listeReleve(0, id , moi);
    } else {
      listeReleve(0, 0);
    }
    getFournisseur();
    getBI(anneeLocal);
  }, [listeReleve, getFournisseur, id, idRole, getBI]);

  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Card>
          <Card.Body>
            <Row>
              <Col md="6">
                <label>Grossiste </label>
                <Select
                  className="react-select primary"
                  classNamePrefix="react-select"
                  value={grossisteSelect}
                  onChange={(value) => {
                    setLoader(true);
                    setData([]);
                    setGrossisteSelect(value);
                    listeReleve(value.value, delegueSelect.value);
                  }}
                  options={optionsFournisseur}
                />
              </Col>
              <Col md="6" className="pr-1 float-left">
                <label>Mois</label>
                <Select
                  className="react-select primary select-print"
                  classNamePrefix="react-select"
                  name="singleSelect"
                  value={mois}
                  onChange={(value) => {
                    setData([]);
                    setLoader(true);
                    setMois(value);

                  }}
                  options={optionsMois}
                  placeholder="Mois"
                />
                <br></br>
              </Col>
            </Row>
            <Row>
            {idRole <= 1 ? (
              <Col md="12" className="pdfExcel float-right">
                <span>
                  <Button onClick={() => confirmExportMessage(anneeLocal, 2)}>
                    Export Excel BI vente
                    <i className="fas fa-file-excel"></i>
                  </Button>
                </span>
                <span>
                  <Button
                    className="mr-1"
                    onClick={() => confirmExportMessage(anneeLocal, 3)}
                  >
                    Export Excel BI stock
                    <i className="fas fa-file-excel"></i>
                  </Button>
                </span>
              </Col>
                 ) : (
                  ""
                )}

              <Col md="12" className="hidden">
                <ExcelFile
                  className="hidden"
                  element={<button id="export3">Export Excel</button>}
                  filename={releveDate + "Relevebi_vente_stock"}
                >
                  <ExcelSheet data={bi} name="RelevesBI">
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
          </Card.Body>
        </Card>
        <Row>
          <Col md="12">
            <h4 className="title">Liste des relevés grossistes</h4>
            <Card>
              <Card.Body className="table-style">
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Nom Délégué",
                      accessor: "delegue",
                    },
                    {
                      Header: "Code adonix",
                      accessor: "code",
                    },
                    {
                      Header: "Grossiste",
                      accessor: "fournisseur",
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
                      Header: "Mois",
                      accessor: "mois",
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
                      Cell: ({ cell }) =>
                        idRole === 0 || idRole === 1 ? (
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
                        ) : (
                          ""
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

export default VisualisationReleveMedical;
