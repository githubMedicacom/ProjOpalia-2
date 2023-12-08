import React, { useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import Select from "react-select";
import { Card, Container, Row, Col } from "react-bootstrap";
import {
  getObjectifById,
  getObjectifDelegueById,
  getActionByYear,
} from "../../../Redux/actionReduce";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import {
  getAllActions,
  getAllDelegue,
  getCommandeByAction,
} from "../../../Redux/commandesReduce";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

function PackDashBoard() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line;
  const idUser = decoded.userauth.id;
  const idRole = decoded.userauth.idrole;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  var date = localStorage.getItem("annee");
  const dispatch = useDispatch();

  //Option annee
  const [optionsAction, setOptionsAction] = useState([
    {
      value: "",
      label: "Action",
      isDisabled: true,
    },
  ]);
  const [action, setAction] = useState(null);
  const [pourcentageBl, setPourcentageBl] = useState(null);
  const [pourcentageDelegue, setPourcentageDelegue] = useState(null);
  const [dataBar, setDataBar] = useState(null);

  //objectif realiser
  const [dataRealiser, setDataRealiser] = useState(null);

  //Option Realiser
  const [optionsRealiser, setOptionsRealiser] = useState([
    {
      value: "",
      label: "Délégué",
      isDisabled: true,
    },
  ]);
  const [realiser, setRealiser] = useState([]);

  const getObjectif = useCallback(
    async (id) => {
      var objectif = await dispatch(getObjectifById({ id }));
      var res = objectif.payload;
      var pieVal = [res.pourcentageBl, res.pourcentageRest];
      var labels = ["Objectif BL", "Objectif Rest"];
      var objPie = {
        labels: labels,
        datasets: [
          {
            data: pieVal,
            backgroundColor: [
              "rgba(29, 199, 234, 0.6)",
              "rgba(251, 64, 75,0.6)",
            ],
            borderColor: ["#1DC7EA", "#FB404B"],
            borderWidth: 1,
          },
        ],
      };
      setPourcentageBl(objPie);
    },
    [dispatch, idLine]
  );
  const getObjectifDelegue = useCallback(
    async (id) => {
      var objectif = await dispatch(getObjectifDelegueById({ id }));
      var res = objectif.payload;
      var pourcentageBl = res.pourcentageBl;
      var label = res.label;
      var dataBar = res.dataBar;
      var labelBar = res.labelBar;
      var objBar = {
        labels: labelBar,
        datasets: [
          {
            label: "Année sélectionnée",
            data: dataBar,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            barPercentage: 0.5,
            barThickness: 10,
            maxBarThickness: 18,
            minBarLength: 2,
          },
        ],
      };
      setDataBar(objBar);
      var objPie = {
        labels: label,
        datasets: [
          {
            data: pourcentageBl,
            backgroundColor: [
              "rgba(29, 199, 234, 0.6)",
              "rgba(251, 64, 75,0.6)",
              "rgb(255 165 52 / 60%)",
              "rgb(147 104 233 / 60%)",
              "rgb(135 203 22 / 60%)",
              "rgb(31 119 208 / 60%)",
              "rgb(94 94 94 / 60%)",
              "rgb(221 75 57 / 60%)",
              "rgb(53 70 92 / 60%)",
              "rgb(229 45 39 / 60%)",
              "rgb(85 172 238 / 60%)",
            ],
            borderColor: [
              "#1DC7EA",
              "#FB404B",
              "#FFA534",
              "#9368E9",
              "#87CB16",
              "#1F77D0",
              "#5e5e5e",
              "#dd4b39",
              "#35465c",
              "#e52d27",
              "#55acee",
            ],
            borderWidth: 1,
          },
        ],
      };
      setPourcentageDelegue(objPie);
    },
    [dispatch, idLine]
  );

  const getCmdByAction = useCallback(async (id,objectif, arrayOption, limit) => {
    var array = [];
    arrayOption.forEach((e) => {
      array.push(e.value);
    });
    var res = await dispatch(
      getCommandeByAction({ date, idRole, idUser, limit, id, array,objectif })
    );
    var dataCmd = await res.payload.dataCmd;
    var labelCmd = await res.payload.labelCmd;
    var arrayOption = await res.payload.arrayOption;
    var arrayObj = await res.payload.arrayObj;
    var objBar = {
      labels: labelCmd,
      datasets: [
        {
          label: 'Objectif ',
          data: arrayObj,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2,
        },
        {
          label: "Réalisé",
          data: dataCmd,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2,
        },
      ],
    };
    setRealiser(arrayOption);
    setDataRealiser(objBar);
  }, []);

  const getActionsByYear = useCallback(
    async (date) => {
      var year = await dispatch(getAllActions({ date }));
      var data = await year.payload;

      var arrayOption = [];
      var objectifSelect = data.length !== 0 ? data[0] : null;
      Object.keys(data).forEach((element) => {
        arrayOption.push({
          value: data[element].value,
          label: data[element].label,
          objectif: data[element].objectif
        });
      });
      if (objectifSelect !== null) {
        setAction({
          value: objectifSelect.value,
          label: objectifSelect.label,
          objectif: objectifSelect.objectif,
        });
        getObjectif(objectifSelect.value);
        /* 
        getObjectifDelegue(objectifSelect.value);
        getCmdByAction(objectifSelect.value,objectifSelect.objectif, [], 10); */
      }
      setOptionsAction(arrayOption);
    },
    [dispatch, getObjectif, getObjectifDelegue, idLine, getCmdByAction]
  );

  const getDelegue = useCallback(async () => {
    var res = await dispatch(getAllDelegue({ date }));
    var data = await res.payload;
    setOptionsRealiser(data);
  }, []);

  useEffect(() => {
    getActionsByYear(date);
    getDelegue();
  }, [getActionsByYear, date]);

  function changeAction(val) {
    setAction(val);
    getObjectif(val.value);
    getObjectifDelegue(val.value);
    getCmdByAction(val.value,val.objectif, [], 10);
  }

  return (
    <>
      <Container fluid>
        <div>
          <Row>
            <Col md="4" className="pr-1">
              <label>Action commercial</label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                name="singleSelect"
                value={action}
                onChange={changeAction}
                options={optionsAction}
                placeholder="Action commercial"
              />
              <br></br>
            </Col>
          </Row>
        </div>
        <div className="chartBL">
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md="3" className="pr-1">
                      <Card.Title as="h4">Objectif/Réalisé</Card.Title>
                    </Col>
                    <Col md="9">
                      <Select
                        isMulti
                        className="react-select primary select-print"
                        classNamePrefix="react-select"
                        name="singleSelect"
                        value={realiser}
                        onChange={(val) => {
                          var nb = val.length;
                          /* setLimitPharmacie(nb) */
                          setRealiser(val);
                          getCmdByAction(action.value,action.objectif, val, nb);
                        }}
                        options={optionsRealiser}
                        placeholder="Délégué"
                      />
                      <br></br>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="barObj">
                  <Row>
                    <Col md="12">
                      {dataRealiser != null ? (
                        <Bar data={dataRealiser} height={"70"} />
                      ) : (
                        "Aucun donnée"
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title as="h4">
                    {action !== null ? action.label : ""}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md="6">
                      <Card>
                        <Card.Body className="doughnut">
                          {pourcentageBl != null ? (
                            <Doughnut
                              options={options}
                              data={pourcentageBl}
                              height={"70"}
                            />
                          ) : (
                            "Aucun donnée"
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card>
                        <Card.Body className="doughnut">
                          {pourcentageDelegue != null ? (
                            <Doughnut
                              options={options}
                              data={pourcentageDelegue}
                              height={"70"}
                            />
                          ) : (
                            "Aucun donnée"
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              {/* <Card>
                <Card.Header>
                  <Card.Title as="h4">Objectif/Délégué</Card.Title>
                </Card.Header>
                <Card.Body className="barObj">
                  <Row>
                    <Col md="12">
                      {dataBar != null ? (
                        <Bar data={dataBar} height={"70"} />
                      ) : (
                        "Aucun donnée"
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card> */}
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default PackDashBoard;
