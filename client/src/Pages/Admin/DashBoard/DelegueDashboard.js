import React,{useCallback,useState} from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import {
  Card,
  Container,
  Row,
  Col,
  Button
} from "react-bootstrap";
import { venteBLPharmacie,suiviMensuel  } from "../../../Redux/dashReduce";
import { getAllParmacieBl } from "../../../Redux/blReduce";
import jwt_decode from "jwt-decode";
import jspdf from "jspdf";
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
import { Bar,Line } from 'react-chartjs-2';
import html2canvas from "html2canvas";

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

function DelegueDashboard() {
  document.title = "Tableau de bord";
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idUser = decoded.userauth.id;
  const idLine = decoded.userauth.line;
  const idRole = decoded.userauth.idrole;
  /* const [limitPharmacie, setLimitPharmacie] = useState(10); */
  const [dataEvo, setDataEvo] = useState(null);
  const [dataSuivi, setDataSuivi] = useState(null);
  const [dataClient, setDataClient] = useState(null);
  var anneeLocal =localStorage.getItem("annee");
  const [qteCA] = useState({ value: 2, label: "Chiffre d'affaire",libelle:"quantite" });

  const [mois] = React.useState({
    value: 0,
    label: "Tous",
  });
  
  const [labels] = React.useState(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]);

  //Pharmacie
  const [pharmacieSelected, setPharmacieSelected] = React.useState([]);
  const [optionPharmacie, setOptionPharmacie] = React.useState([
    {
      value: "",
      label: "Pharmacie",
    },
  ]);

  //get Pharmacie from bl
  const getPharmacieBl = useCallback(async () => {
    var marche = await dispatch(getAllParmacieBl({idLine,idRole,anneeLocal,idUser}));
    var entities = marche.payload;
    setOptionPharmacie(entities);
  }, [dispatch,idLine,idRole,anneeLocal,idUser]);

  //chart Pharmacie
  const getPharmacie = useCallback(async (mois,qteCA,pharmacie,nb) => {
    var array = [];
    pharmacie.forEach(e=>{
      array.push(e.value)
    })
    var chiffre = await dispatch(venteBLPharmacie({
      qteCA: qteCA.value,
      idLine: parseInt(idLine),
      year: parseInt(anneeLocal),
      mois: mois.value,
      idRole:idRole,
      idUser:idUser,
      pharmacie:array,
      limit:nb
    }));
    var arrayPharmacie=chiffre.payload.arrayPharmacie;
    var arrayOption=chiffre.payload.arrayOption;
    var arrayMnt=chiffre.payload.arrayMnt;
    var objClient = {
      labels: arrayPharmacie,
      datasets: [
        {
          label: "Année sélectionnée",
          data: arrayMnt,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2,
        },
      ],
    };
    setDataClient(objClient);
    setPharmacieSelected(arrayOption);
  }, [dispatch,anneeLocal,idRole,idLine,idUser]);

  //Suivi mensuel du CA généré par BL
  const getSuivi = useCallback(async (qteCA) => {
    var yearNow = parseInt(anneeLocal);
    var lastYear = yearNow - 1;
    var response = await dispatch(suiviMensuel({
      qteCA: qteCA.value,
      idLine: parseInt(idLine),
      idUser:idUser,
      year: yearNow,
    }));
    let dataBL = response.payload;
    var arrayYear = [];
    var arrayLastYear = [];
    labels.forEach((e) => {
      var resultNow = dataBL.filter(function (elem) {
        return elem.mounth === e && parseInt(elem.annee) === yearNow;
      });
      var resultLast = dataBL.filter(function (elem) {
        return elem.mounth === e && parseInt(elem.annee) === lastYear;
      });
      if (
        typeof resultNow[0] !== "undefined" &&
        parseFloat(resultNow[0].annee) === yearNow
      ) {
        arrayYear.push(parseFloat(resultNow[0].qteCA).toFixed(3));
      } else {
        arrayYear.push(0);
      }

      if (
        typeof resultLast[0] !== "undefined" &&
        parseFloat(resultLast[0].annee) === lastYear
      ) {
         arrayLastYear.push(resultLast[0].qteCA.toFixed(3));
      } else {
        arrayLastYear.push(0);
      }
    });
    var objEvo = {
      labels: labels,
      datasets: [
        {
          label: 'Année sélectionnée',
          data: arrayYear,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2,
        },
        {
          label: 'Année précédente',
          data: arrayLastYear,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2,
        },
      ],
    };
    var objSuivi = {
      labels: labels,
      datasets: [
        {
          label: 'Année sélectionnée',
          data: arrayYear,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    setDataSuivi(objSuivi)
    setDataEvo(objEvo)
  }, [dispatch,anneeLocal,idLine,idUser,labels]);

  //useEffect
  React.useEffect(() => {
    getPharmacieBl();
    getSuivi(qteCA);
    getPharmacie(mois,qteCA,[],10);
  }, [mois,qteCA,getPharmacieBl,getSuivi,getPharmacie]);

  window.onscroll = function () {
    var scroll = window.pageYOffset;
    var element = document.getElementById("position");
    if (element != null)
      if (scroll > 300) {
        element.classList.add("scrollMenu");
      } else {
        element.classList.remove("scrollMenu");
      }
  };

  //capture dashbord and convert to pdf
  function exportPdf() {
    var printhidden = document.getElementsByClassName("select-print");
    for (const key in printhidden) {
      if (typeof printhidden[key] === "object")
        printhidden[key].style.display = "none";
    }
    var input1 = document.getElementById("capture1");
    html2canvas(input1, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jspdf("p", "mm", "a4");
      var date1 = new Date();
      var date = new Date(date1.getTime() - date1.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Dashboard délégué " + date + ".pdf");
    });
    for (const key in printhidden) {
      if (typeof printhidden[key] === "object")
        printhidden[key].style.display = "block";
    }
  }
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="4" className="pr-1">
            <Button
              className="btn-fill"
              type="button"
              variant="info"
              onClick={exportPdf}
            >
              Imprimer <i className="fas fa-print"></i>
            </Button>
          </Col>
        </Row>
        <div id="capture1" className="chartBL">
          {/* start  Suivi  */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Card.Title as="h4">
                    {qteCA.value === 1
                      ? "Suivi mensuel du Qte vendu dans BL"
                      : "Suivi mensuel du CA généré par BL"}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  {dataSuivi != null?<Line data={dataSuivi} height={"70"}/>:""}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  Suivi */}

          {/* start  Évolution  */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Card.Title as="h4">
                    {qteCA.value === 1
                      ? "Évolution du Qte vendu dans BL"
                      : "Évolution du CA généré par BL"}
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  {dataEvo != null?<Bar data={dataEvo} height={"70"}/>:""}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  Évolution */}

          {/* start  Pharmacie */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md="3" className="pr-1">
                      <Card.Title as="h4">
                        {qteCA.value === 1
                          ? "QTE (BL) des produits vendus par pharmacies"
                          : "CA (BL) des produits vendus par pharmacies"}
                      </Card.Title>
                    </Col>
                    <Col md="9">
                      <Select
                        isMulti
                        className="react-select primary select-print"
                        classNamePrefix="react-select"
                        name="singleSelect"
                        value={pharmacieSelected}
                        onChange={(val)=>{
                          var nb = val.length;
                          /* setLimitPharmacie(nb) */
                          setPharmacieSelected(val)
                          getPharmacie(mois,qteCA,val,nb)
                        }}
                        options={optionPharmacie}
                        placeholder="Pharmacie"
                      />
                      <br></br>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {dataClient != null ? <Bar data={dataClient} height={"70"} /> : ""}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  Pharmacie */}
        </div>
      </Container>
    </>
  );
}

export default DelegueDashboard;
