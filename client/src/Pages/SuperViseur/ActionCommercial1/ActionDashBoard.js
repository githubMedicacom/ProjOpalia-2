import React, { useState, useEffect,useCallback } from "react";
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
  ArcElement
} from 'chart.js';
import { Bar,Doughnut } from 'react-chartjs-2';
import Select from "react-select";
import { Card, Container, Row, Col } from "react-bootstrap";
import { getObjectifById, getObjectifDelegueById, getActionByYear } from "../../../Redux/actionReduce";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";

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
  document.title = "Pack tableau de bord";
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  var date =localStorage.getItem("annee");
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

  const getObjectif = useCallback(async (id) => {
    var objectif = await dispatch(getObjectifById({id,idLine}));
    var res = objectif.payload;
    var pieVal = [res.pourcentageBl,res.pourcentageRest];
    var labels =["Objectif BL","Objectif Rest"];
    var objPie = {
      labels: labels,
      datasets: [
        {
          data: pieVal,
          backgroundColor: [
            'rgba(29, 199, 234, 0.6)',
            'rgba(251, 64, 75,0.6)',
          ],
          borderColor: [
            '#1DC7EA',
            '#FB404B',
          ],
          borderWidth: 1,
        },
      ],
    };
    setPourcentageBl(objPie);
  }, [dispatch,idLine]);
  const getObjectifDelegue = useCallback(async (id) => {
    var objectif = await dispatch(getObjectifDelegueById({id,idLine}));
    var res = objectif.payload;
    var pourcentageBl = res.pourcentageBl;
    var label = res.label;
    var dataBar = res.dataBar;
    var labelBar = res.labelBar;    
    var objBar = {
      labels:labelBar,
      datasets: [
        {
          label: 'Année sélectionnée',
          data: dataBar,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
            'rgba(29, 199, 234, 0.6)',
            'rgba(251, 64, 75,0.6)',
            'rgb(255 165 52 / 60%)',
            'rgb(147 104 233 / 60%)',
            'rgb(135 203 22 / 60%)',
            'rgb(31 119 208 / 60%)',
            'rgb(94 94 94 / 60%)',
            'rgb(221 75 57 / 60%)',
            'rgb(53 70 92 / 60%)',
            'rgb(229 45 39 / 60%)',
            'rgb(85 172 238 / 60%)',
          ],
          borderColor: [
            '#1DC7EA',
            '#FB404B',
            '#FFA534',
            '#9368E9',
            '#87CB16',
            '#1F77D0',
            '#5e5e5e',
            '#dd4b39',
            '#35465c',
            '#e52d27',
            '#55acee',
          ],
          borderWidth: 1,
        },
      ],
    };
    setPourcentageDelegue(objPie)
  }, [dispatch,idLine]);

  const getActionsByYear = useCallback(async (date) => {
    var year = await dispatch(getActionByYear({date,idLine}));
    var data = await year.payload;
    
    var arrayOption = [];
    var objectifSelect = data.length !==0?data[0]:null;
    Object.keys(data).forEach((element) => {
      arrayOption.push({
        value: data[element].id,
        label: data[element].nom,
      });
    });
    if(objectifSelect !== null) {
      setAction({
        value: objectifSelect.id,
        label: objectifSelect.nom
      })
      getObjectif(objectifSelect.id)
      getObjectifDelegue(objectifSelect.id)
    }
    setOptionsAction(arrayOption);
  }, [dispatch,getObjectif,getObjectifDelegue,idLine]);
  useEffect(() => {
    getActionsByYear(date);
  }, [getActionsByYear,date]);
  function changeAction(val){
    setAction(val);
    getObjectif(val.value)
    getObjectifDelegue(val.value)
    /* getObjectifById(val.value)
    getObjectifDelegueById(val.value) */
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
                  <Card.Title as="h4">
                    {action !==null?action.label:""}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md="6">
                      <Card>
                        <Card.Body className="doughnut">
                          {pourcentageBl != null?<Doughnut options={options} data={pourcentageBl} height={"70"}/>:"Aucun donnée"}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card>
                        <Card.Body className="doughnut">
                          {pourcentageDelegue != null?<Doughnut options={options} data={pourcentageDelegue} height={"70"}/>:"Aucun donnée"}                          
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>
                  <Card.Title as="h4">
                    Objectif/Délégué
                  </Card.Title>
                </Card.Header>
                <Card.Body className="barObj">
                  <Row>
                    <Col md="12">
                      {dataBar != null?<Bar data={dataBar} height={"70"}/>:"Aucun donnée"}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default PackDashBoard;
