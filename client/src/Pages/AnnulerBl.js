import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import {
  blDeleted,
  getAllClientBl,
  getAllDelegueBl,
  getBlAnnuler,
} from "../Redux/blReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../components/ReactTable/ReactTable.js";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";

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

  const [data, setData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);

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
        title={"Étes Vous sure de supprimer ce Bl?"}
        onConfirm={() => {
          deleteBl(bl.id, idRow);
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
  function deleteBl(id, idRow) {
    var list = data;
    list.splice(idRow, 1);
    setData(list);
    dispatch(blDeleted({ id }));
    notify("tr", "Supprimer avec succès", "success");
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
        getBlAnnuler({
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
  React.useEffect(() => {
    if (idRole === 2) {
      listeBl(0, id);
      getPharmacie(id);
    } else {
      listeBl(0, 0);
      getPharmacie(0);
    }

    if (idRole <= 1) getDelegue();
  }, [listeBl, getPharmacie, getDelegue, id, idRole]);
  function paymentBl(id, idBl) {
    /*** 0. save decharge *** 1. get decharge *** 2. get file bl***/
    navigate("/telechargerFichier/" + idBl + "/" + id);
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
                  setLoader(true);
                  setDelegueSelect(value);
                  listeBl(pharmacieSelect.value, value.value);
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
                setLoader(true);
                setPharmacieSelect(value);
                listeBl(value.value, delegueSelect.value);
              }}
              options={optionsPharmacie}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <h4 className="title">BL annuler</h4>
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
                          onClick={() => {
                            paymentBl(cell.row.values.id, 2);
                            localStorage.setItem(
                              "file",
                              cell.row.original.file
                            );
                            localStorage.setItem("returnList", "annulerBl");
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
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div>
                          <Button
                            id={"idLigne_" + cell.row.values.id}
                            onClick={() => {
                              confirmMessage(cell.row.original, 0, cell.row.id);
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
    </>
  );
}

export default VisualisationBl;
