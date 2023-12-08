import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { getBlByClientRest } from "../../../../Redux/blReduce";
import { getActionCloturer } from "../../../../Redux/actionReduce";
import {
  getAllActions,
  getAllParmacieCmd,
} from "../../../../Redux/commandesReduce";
import { useNavigate } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { useDispatch } from "react-redux";
import Select from "react-select";
import jwt_decode from "jwt-decode";

// core components
function ListSuivi() {
  document.title = "Liste des suivis";
  var annee = localStorage.getItem("annee");
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const [loader, setLoader] = React.useState(true);
  const [action, setAction] = React.useState({
    value: 0,
    label: "Tous",
  });
  const [optionsAction, setOptionsAction] = React.useState([
    {
      value: "",
      label: "Action",
      isDisabled: true,
    },
  ]);
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
  var mm = new Date().getMonth();
  var objSelected = null;
  switch (mm) {
    case 0:
    case 1:
    case 2:
      objSelected = { value: 1, label: "Trimestre 1" };
      break;
    case 3:
    case 4:
    case 5:
      objSelected = { value: 2, label: "Trimestre 2" };
      break;
    case 6:
    case 7:
    case 8:
      objSelected = { value: 3, label: "Trimestre 3" };
      break;
    case 9:
    case 10:
    case 11:
      objSelected = { value: 4, label: "Trimestre 4" };
      break;
  }
  const [trimestre, setTrimestre] = React.useState(objSelected);
  const [optionsTrimestre] = React.useState([
    {
      value: "",
      label: "Trimestre",
      isDisabled: true,
    },
    { value: 1, label: "Trimestre 1" },
    { value: 2, label: "Trimestre 2" },
    { value: 3, label: "Trimestre 3" },
    { value: 4, label: "Trimestre 4" },
  ]);
  const idLine = decoded.userauth.line;
  const idRole = decoded.userauth.idrole;
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);

  const getClients = useCallback(async () => {
    var act = await dispatch(getAllParmacieCmd());
    var res = await act.payload;
    setOptionsClient(res);
  }, [dispatch]);

  const getClient = useCallback(
    async (idAction, idClient, trimestreVal) => {
      var client = await dispatch(
        getBlByClientRest({ idAction, idClient, annee, trimestreVal })
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

  const getAction = useCallback(async () => {
    var act = await dispatch(getActionCloturer({ idLine, idRole, annee }));
    var res = act.payload;
    var arrayOption = [];
    res.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    var year = await dispatch(getAllActions({ date: annee }));
    var arrayOption = await year.payload;
    /* var act1 = await dispatch(fetchAction({ idLine, idRole, annee }));
    var res1 = act1.payload;
    res1.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    }); */
    if (arrayOption.length > 0) {
      setAction(arrayOption[0]);
      getClient(arrayOption[0].value, 0, trimestre.value);
    } else {      
      setLoader(false);
    }
    setOptionsAction(arrayOption);
  }, [dispatch, idLine, idRole, annee, getClient]);

  useEffect(() => {
    getAction();
    getClients();
  }, [getClients, getAction]); //now shut up eslint

  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="4">
            <Form.Group>
              <label>Action </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={action}
                onChange={(value) => {
                  setEntities([]);
                  setLoader(true);
                  setAction(value);
                  getClient(value.value, client.value, trimestre.value);
                }}
                options={optionsAction}
              />
            </Form.Group>
          </Col>
          <Col md="4">
            <Form.Group>
              <label>Client </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={client}
                onChange={(value) => {
                  setEntities([]);
                  setLoader(true);
                  setClient(value);
                  getClient(action.value, value.value, trimestre.value);
                }}
                options={optionsClient}
              />
            </Form.Group>
          </Col>
          <Col md="4">
            <Form.Group>
              <label>Trimestre </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={trimestre}
                onChange={(value) => {
                  setEntities([]);
                  setLoader(true);
                  setTrimestre(value);
                  getClient(action.value, client.value, value.value);
                }}
                options={optionsTrimestre}
                placeholder="Trimestre"
              />
            </Form.Group>
          </Col>
        </Row>
        <Card className="table-visualisation-action">
          <Card.Body>
            <ReactTable
              data={entities}
              columns={[
                {
                  Header: "Pharmacie",
                  accessor: "nomClient",
                },
                {
                  Header: "objectif",
                  accessor: "objectif",
                },
                {
                  Header: "Détail",
                  accessor: "id",
                  Cell: ({ cell }) => (
                    <div className="block-action">
                      <Button
                        className="message"
                        onClick={() => {
                          localStorage.setItem("returnVis", "/suivie");
                          navigate(
                            "/detailVisualisation/" +
                              cell.row.original.idAction +
                              "/" +
                              cell.row.original.id +
                              "/0"
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
                  Header: "bl",
                  accessor: "",
                  Cell: ({ cell }) => (
                    <div className="block-action">
                      <Button
                        className="message"
                        onClick={() => {
                          localStorage.setItem("returnVis", "/suivie");
                          /* navigate("/detailVisualisation/"+cell.row.original.idAction+"/"+cell.row.original.id); */
                          navigate(
                            "/detailSuivi/" +
                              cell.row.original.id +
                              "/" +
                              cell.row.original.idAction
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

export default ListSuivi;
