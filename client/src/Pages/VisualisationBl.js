import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import {
  getBlVis,
  blDeleted,
  getAllClientBl,
  numeroUpdate,
  blVerif,
  getBlPayer,
  getAllDelegueBl,
  exportBlPayment,
  payerOpalia,
} from "../Redux/blReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../components/ReactTable/ReactTable.js";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function VisualisationBl() {
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

  const [loader, setLoader] = React.useState(true);
  const [loaderPayer, setLoaderPayer] = React.useState(true);
  const [data, setData] = React.useState([]);
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
  const [optionsPharmacie, setOptionsPharmacie] = React.useState([
    {
      value: "",
      label: "Pharmacie",
      isDisabled: true,
    },
  ]);
  const [pharmacieSelect, setPharmacieSelect] = React.useState({
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
  const confirmMessage = (bl, etat, idRow) => {
    localStorage.setItem("numeroBL", bl.numeroBl);
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={
          etat === 0
            ? "Étes Vous sure de supprimer ce Bl?"
            : "Nouveau numéro BL"
        }
        onConfirm={() => {
          if (etat === 0) deleteBl(bl.id, idRow);
          else updateBl(bl);
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        {etat === 1 ? (
          <div>
            <Form.Group>
              <label>Numéro Bl * </label>
              <Form.Control
                defaultValue={bl.numeroBl}
                placeholder="Numéro Bl"
                type="text"
                onChange={(value) => {
                  localStorage.setItem("numeroBL", value.target.value);
                }}
              ></Form.Control>
            </Form.Group>
          </div>
        ) : (
          ""
        )}
      </SweetAlert>
    );
  };
  function deleteBl(id, idRow) {
    var list = data;
    list.splice(idRow, 1);
    setData(list);
    dispatch(blDeleted({ id }));
    notify("tr", "Supprimer avec succès", "success");
    hideAlert();
  }
  function updateBl(bl) {
    var num = localStorage.getItem("numeroBL");
    dispatch(
      blVerif({
        id: bl.id,
        numeroBL: num,
        fournisseur: bl.fournisseur,
        somme: bl.mnt,
      })
    ).then((e) => {
      if (e !== true) {
        dispatch(numeroUpdate({ id: bl.id, numeroBL: num })).then(() => {
          if (idRole === 2) {
            listeBl(pharmacieSelect.value, id);
          } else {
            listeBl(pharmacieSelect.value, 0);
          }
        });
        notify("tr", "Numéro est modifié avec succès", "success");
      } else notify("tr", "Numéro existe déjà ", "danger");
    });
    hideAlert();
  }
  const confirmMessageOpa = (id, mnt, etat) => {
    localStorage.setItem("montantOpa", 0);
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
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        <Form.Group>
          <Form.Control
            defaultValue={mnt}
            readOnly={etat === 1 || idRole === 1 ? true : false}
            placeholder="Montant opalia"
            type="number"
            onChange={(value) => {
              localStorage.setItem("montantOpa", value.target.value);
            }}
          ></Form.Control>
        </Form.Group>
      </SweetAlert>
    );
  };
  function paymentOpa(id) {
    var mnt = localStorage.getItem("montantOpa");
    dispatch(
      payerOpalia({
        id: id,
        montantOpa: mnt,
      })
    ).then((e) => {
      if (e.payload === true) {
        listeBlPayer(0, 0);
        notify("tr", "Payment opalia avec succès", "success");
      } else notify("tr", "Erreur de connexion", "danger");
    });
    hideAlert();
  }
  const hideAlert = () => {
    setAlert(null);
  };

  const getDelegue = useCallback(
    async (p) => {
      var anneeLocal = year;
      var delegueBD = await dispatch(
        getAllDelegueBl({ idLine, idRole, anneeLocal })
      );
      var entities = delegueBD.payload;
      var arrayOption = [];
      arrayOption.push({ value: 0, label: "Tous" });
      entities.forEach((e) => {
        arrayOption.push({
          value: e.users.id,
          label: e.users.nomU + " " + e.users.prenomU,
        });
        if (e.id === p) {
          setDelegueSelect({
            value: e.users.id,
            label: e.users.nomU + " " + e.users.prenomU,
          });
        }
      });
      setOptions(arrayOption);
    },
    [dispatch, idLine, idRole, year]
  );

  const getPharmacie = useCallback(
    async (p) => {
      var pharma = await dispatch(
        getAllClientBl({
          idLine: idLine,
          idUser: p,
          idRole: idRole,
          anneeLocal: year,
        })
      );
      var result = pharma.payload;
      var arrayOption = [];
      arrayOption.push({ value: 0, label: "Tous" });
      result.forEach((e) => {
        arrayOption.push({ value: e.pharmacies.id, label: e.pharmacies.nom });
      });
      setOptionsPharmacie(arrayOption);
    },
    [dispatch, idLine, idRole, year]
  );
  const listeBl = useCallback(
    async (idPharmacie, idDelegue) => {
      var idUser = idRole === 1 || idRole === 0 ? idDelegue : id;
      var list = await dispatch(
        getBlVis({
          idLine: idLine,
          idDelegue: idUser,
          idRole: idRole,
          year: year,
          client: idPharmacie,
        })
      );
      var res = list.payload;
      setLoader(false);
      setData(res);
    },
    [dispatch, id, idLine, idRole, year]
  );
  const listeBlPayer = useCallback(
    async (idPharmacie, idDelegue) => {
      var idUser = idRole === 1 || idRole === 0 ? idDelegue : id;
      var list = await dispatch(
        getBlPayer({
          idLine: idLine,
          idDelegue: idUser,
          idRole: idRole,
          year: year,
          client: idPharmacie,
        })
      );

      var res = await list.payload;
      var list1 = await dispatch(
        exportBlPayment({
          idLine: idLine,
          idDelegue: idUser,
          idRole: idRole,
          year: year,
          client: idPharmacie,
        })
      );
      var res1 = await list1.payload;

      setDataExcel(res1);
      setDataPayer(res);
      setLoaderPayer(false);
    },
    [dispatch, id, idLine, idRole, year]
  );
  React.useEffect(() => {
    if (idRole === 2) {
      listeBl(0, id);
      listeBlPayer(0, id);
      getPharmacie(id);
    } else {
      listeBl(0, 0);
      listeBlPayer(0, 0);
      getPharmacie(0);
    }

    if (idRole <= 1) getDelegue();
  }, [listeBl, listeBlPayer, getPharmacie, getDelegue, id, idRole]);
  function paymentBl(id, idBl) {
    /*** 3. save decharge *** 4. get decharge *** 2. get file bl***/
    navigate("/telechargerFichier/" + idBl + "/" + id);
    /* window.location.replace("/payment/"+idBl+"/"+id); */
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
                  setData([]);
                  setDataPayer([]);
                  setLoader(true);
                  setLoaderPayer(true);
                  setDelegueSelect(value);
                  listeBl(pharmacieSelect.value, value.value);
                  listeBlPayer(pharmacieSelect.value, value.value);
                  getPharmacie(value.value);
                }}
                options={options}
              />{" "}
            </Col>
          ) : (
            ""
          )}
          <Col md="6">
            <label>Pharmacie </label>
            <Select
              className="react-select primary"
              classNamePrefix="react-select"
              value={pharmacieSelect}
              onChange={(value) => {
                setData([]);
                setDataPayer([]);
                setLoader(true);
                setLoaderPayer(true);
                setPharmacieSelect(value);
                listeBl(value.value, delegueSelect.value);
                listeBlPayer(value.value, delegueSelect.value);
              }}
              options={optionsPharmacie}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12" className="pdfExcel">
            <ExcelFile
              element={<button id="export">Export Payment</button>}
              filename={"Payment"}
            >
              <ExcelSheet data={dataExcel} name="Payment">
                <ExcelColumn label="Numero Bl" value="numeroBl" />
                <ExcelColumn label="Date Bl" value="date" />
                <ExcelColumn label="Nom délegué" value="users" />
                <ExcelColumn label="Pharmacie" value="pharmacie" />
                <ExcelColumn label="Bricks" value="ims" />
                <ExcelColumn label="Grossiste" value="fournisseur" />
                <ExcelColumn label="Payer" value="payer" />
                <ExcelColumn label="Date payement" value="datePayement" />
                <ExcelColumn label="Nom pack" value="pack" />
                <ExcelColumn label="Total HT" value="mnt" />
                <ExcelColumn label="Date insertion" value="dateInsertion" />
              </ExcelSheet>
            </ExcelFile>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <h4 className="title">BL non payée</h4>
            <Card>
              <Card.Body className="table-style">
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Numéro BL",
                      accessor: "numeroBl",
                    },
                    {
                      Header: "Nom Délégué",
                      accessor: "users",
                    },
                    {
                      Header: "Pharmacies",
                      accessor: "pharmacie",
                    },
                    {
                      Header: "Grossiste",
                      accessor: "fournisseur",
                    },
                    /*  {
                      Header: "Pack",
                      accessor: "pack",
                    },
                    {
                      Header: "Bonification",
                      accessor: "bonification",
                    }, */
                    {
                      Header: "Total",
                      accessor: "mnt",
                    },
                    {
                      Header: "Date",
                      accessor: "date",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          {cell.row.values.date !== null
                            ? new Date(cell.row.values.date)
                                .toISOString()
                                .slice(0, 10)
                            : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "visualization",
                      accessor: "file",
                      Cell: ({ cell }) => (
                        <Button
                          id={"idLigne_" + cell.row.values.id}
                          onClick={(e) => {
                            paymentBl(cell.row.values.id, 2);
                            localStorage.setItem(
                              "file",
                              cell.row.original.file
                            );
                            localStorage.setItem(
                              "returnList",
                              "visualisationBl"
                            );
                          }}
                          className="btn btn-info ml-1 visualiser"
                        >
                          <i
                            className="fa fa-file"
                            id={"idLigne_" + cell.row.values.id}
                          />
                          Visualiser
                        </Button>
                      ),
                    },
                    {
                      Header: "payer",
                      accessor: "payer",
                      Cell: ({ cell }) => (
                        <Button
                          id={"idLigne_" + cell.row.values.id}
                          onClick={(e) => {
                            paymentBl(cell.row.values.id, 3);
                            localStorage.setItem("file", "null");
                            localStorage.setItem(
                              "returnList",
                              "visualisationBl"
                            );
                          }}
                          className="btn btn-success ml-1 visualiser"
                        >
                          <i
                            className="fa fa-money-check"
                            id={"idLigne_" + cell.row.values.id}
                          />
                        </Button>
                      ),
                    },
                    /* {
                      Header: "payer",
                      accessor: "payer",
                      Cell: ({ cell }) =>
                      idRole === 2 ? (
                      <Button
                        id={"idLigne_" + cell.row.values.id}
                        onClick={(e) => {
                          paymentBl(cell.row.values.id,0);
                          localStorage.setItem("file", "null");
                          localStorage.setItem("returnList", "visualisationBl");
                        }}
                        className="btn btn-success ml-1 visualiser"
                      >
                        <i
                          className="fa fa-money-check"
                          id={"idLigne_" + cell.row.values.id}
                        />
                      </Button>):"Non payé",
                    }, */
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) =>
                        idRole === 1 ? (
                          <div>
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={(e) => {
                                confirmMessage(
                                  cell.row.original,
                                  0,
                                  cell.row.id
                                );
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
                                navigate("/updateBl/" + cell.row.values.id);
                              }}
                              className="delete btn btn-warning ml-1 float-right"
                            >
                              <i className="fa fa-edit" />
                            </Button>
                          </div>
                        ) : idRole === 0 ? (
                          <div>
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={(e) => {
                                confirmMessage(
                                  cell.row.original,
                                  0,
                                  cell.row.id
                                );
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
                                navigate("/updateBl/" + cell.row.values.id);
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
                    /*  {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) =>
                        idRole === 2 ? 
                          <Button
                            id={"idLigne_" + cell.row.values.id}
                            onClick={(e) => {
                              confirmMessage(cell.row.original,1,cell.row.id);
                            }}
                            className="delete btn btn-warning ml-1 float-right"
                          >
                            <i
                              className="fa fa-edit"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                    }, */
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
          <Col md="12">
            <h4 className="title">BL payée</h4>
            <Card>
              <Card.Body className="table-style">
                <ReactTable
                  data={dataPayer}
                  columns={[
                    {
                      Header: "Numéro BL",
                      accessor: "numeroBl",
                    },
                    {
                      Header: "Nom Délégué",
                      accessor: "users",
                    },
                    {
                      Header: "Pharmacies",
                      accessor: "pharmacie",
                    },
                    {
                      Header: "Grossiste",
                      accessor: "fournisseur",
                    },
                    /*  {
                      Header: "Pack",
                      accessor: "pack",
                    },
                    {
                      Header: "Bonification",
                      accessor: "bonification",
                    }, */
                    {
                      Header: "Total",
                      accessor: "mnt",
                    },
                    {
                      Header: "Date",
                      accessor: "date",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          {cell.row.values.date !== null
                            ? new Date(cell.row.values.date)
                                .toISOString()
                                .slice(0, 10)
                            : ""}
                        </div>
                      ),
                    },
                    /* {
                      Header: "visualization",
                      accessor: "fileURL",
                      Cell: ({ cell }) => (
                          cell.row.original.ext === "pdf" ? (
                            <div className="visualiser">
                              <iframe
                                title="Transition"
                                width="100%"
                                height="100%"
                                src={cell.row.values.fileURL}
                              ></iframe>
                              <br></br>
                              <a
                                className="btn btn-info btn-bl"
                                rel="noreferrer"
                                href={cell.row.values.fileURL}
                                target="_blank"
                              >
                                <i className="fas fa-file"></i>
                                Visualiser
                              </a>
                            </div>
                          ) : 
                          <div className="visualiser">
                            <img src={cell.row.values.fileURL} className="img-file" alt=""></img>
                            <br></br>
                            <a
                              className="btn btn-info btn-bl"
                              rel="noreferrer"
                              href={cell.row.values.fileURL}
                              download={cell.row.original.file}
                              target="_blank"
                            >
                              <i className="fas fa-file"></i>
                              Visualiser
                            </a>
                          </div>
                      ),
                    }, */
                    {
                      Header: "visualization",
                      accessor: "file",
                      Cell: ({ cell }) => (
                        <Button
                          id={"idLigne_" + cell.row.values.id}
                          onClick={(e) => {
                            paymentBl(cell.row.values.id, 2);
                            localStorage.setItem(
                              "file",
                              cell.row.original.file
                            );
                            localStorage.setItem(
                              "returnList",
                              "visualisationBl"
                            );
                          }}
                          className="btn btn-info ml-1 visualiser"
                        >
                          <i
                            className="fa fa-file"
                            id={"idLigne_" + cell.row.values.id}
                          />
                          Visualiser
                        </Button>
                      ),
                    },
                    {
                      Header: "payer",
                      accessor: "payer",
                      Cell: ({ cell }) => (
                        <Button
                          id={"idLigne_" + cell.row.values.id}
                          onClick={(e) => {
                            /* downloadFile(cell.row.original.id,cell.row.original.decharge); */
                            paymentBl(cell.row.values.id, 4);
                            localStorage.setItem(
                              "file",
                              cell.row.original.decharge
                            );
                            localStorage.setItem(
                              "returnList",
                              "visualisationBl"
                            );
                          }}
                          className="btn btn-info ml-1 visualiser"
                        >
                          <i
                            className="fa fa-eye ml-1"
                            id={"idLigne_" + cell.row.values.id}
                          />
                          Décharge
                        </Button>
                      ),
                    },
                    /*  {
                      Header: "payer opalia",
                      accessor: "payerOpa",
                      Cell: ({ cell }) => (
                        <div>
                          {idRole === 0 || idRole === 1 ? (
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={() => {
                                confirmMessageOpa(
                                  cell.row.values.id,
                                  cell.row.original.montantOpa,
                                  cell.row.values.payerOpa
                                );
                              }}
                              className={
                                cell.row.values.payerOpa === 0
                                  ? "btn btn-success ml-1 visualiser"
                                  : "btn btn-warning ml-1 visualiser"
                              }
                            >
                              <i
                                className={
                                  cell.row.values.payerOpa === 0
                                    ? "fa fa-money-check mr-1"
                                    : "fa fa-eye mr-1"
                                }
                                id={"idLigne_" + cell.row.values.id}
                              />
                              {cell.row.values.payerOpa === 0 ? "Payment" : "Détail"}
                            </Button>
                          ) : (
                            cell.row.original.datePayementOpa
                          )}
                        </div>
                      ),
                    }, */
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) =>
                        idRole === 0 || idRole === 1 ? (
                          <div>
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={(e) => {
                                confirmMessage(
                                  cell.row.original,
                                  0,
                                  cell.row.id
                                );
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
                                navigate("/updateBl/" + cell.row.values.id);
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
                {loaderPayer === true ? (
                  <div>
                    <img
                      src={require("../assets/img/loader.gif").default}
                      alt="loader"
                    />
                  </div>
                ) : dataPayer.length === 0 ? (
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

export default VisualisationBl;
