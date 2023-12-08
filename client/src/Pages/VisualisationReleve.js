import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { getActiveDelegue, getDelegueByLine } from "../Redux/usersReduce";
import { allReleveList, deletereleve } from "../Redux/releveReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../components/ReactTable/ReactTable.js";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import ReactExport from "react-export-excel";
import { getActiveFournisseur } from "../Redux/fournisseurReduce";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function VisualisationReleve() {
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

  const getDelegue = useCallback(
    async (p) => {
      var anneeLocal = year;
      if (idRole == 1)
        var delegueBD = await dispatch(getDelegueByLine({ idLine }));
      else {
        var delegueBD = await dispatch(getActiveDelegue());
      }
      var entities = delegueBD.payload;
      var arrayOption = [];
      arrayOption.push({ value: 0, label: "Tous" });
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.nomU + " " + e.prenomU });
        if (e.id === p) {
          setDelegueSelect({ value: e.id, label: e.nomU + " " + e.prenomU });
        }
      });
      setOptions(arrayOption);
    },
    [dispatch, idLine, idRole, year]
  );

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
    async (idGrossiste, idDelegue) => {
      var idUser = idRole === 1 || idRole === 0 || idRole === 3 ? idDelegue : id;
      var list = await dispatch(
        allReleveList({
          idLine: idLine,
          idDelegue: idUser,
          idRole: idRole,
          annee: year,
          grossiste: idGrossiste,
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
  React.useEffect(() => {
    if (idRole === 2) {
      listeReleve(0, id);
    } else {
      listeReleve(0, 0);
    }
    getFournisseur();
    if (idRole <= 1) getDelegue();
  }, [listeReleve, getFournisseur, getDelegue, id, idRole]);
  function paymentBl(idBl) {
    navigate("/telechargerFichierReleve/" + idBl);
  }

  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          {idRole <= 1 ? (
            <Col md="6">
              <label>Délégué </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={delegueSelect}
                onChange={(value) => {
                  setLoader(true);
                  setData([]);
                  setDelegueSelect(value);
                  listeReleve(grossisteSelect.value, value.value);
                }}
                options={options}
              />{" "}
            </Col>
          ) : (
            ""
          )}
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
        </Row>
        <Row>
          <Col md="12" className="pdfExcel">
            <ExcelFile
              element={<button id="export">Export Liste</button>}
              filename={"listeRelevé"}
            >
              <ExcelSheet data={data} name="listeRelevé">
                <ExcelColumn label="Nom délegué" value="delegue" />
                <ExcelColumn label="Code adonix" value="code" />
                <ExcelColumn label="Grossiste" value="fournisseur" />
                <ExcelColumn label="Mois" value="mois" />
                <ExcelColumn label="Date insertion" value="createdAt" />
              </ExcelSheet>
            </ExcelFile>
          </Col>
        </Row>
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
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={(e) => {
                                navigate("/updateReleve/" + cell.row.values.id);
                                localStorage.setItem(
                                  "file",
                                  cell.row.original.file
                                );
                               
                              }}
                              className="delete btn btn-warning ml-1 float-right"
                            >
                              <i className="fa fa-edit" />
                            </Button>
                          </div>
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
                      src={require("../assets/img/loader.gif").default}
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

export default VisualisationReleve;
