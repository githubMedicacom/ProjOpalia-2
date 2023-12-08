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
import { totalCA,getPackBriks,getBriksPack,getTotalPack  } from "../../../Redux/dashReduce";
import { getAllPackBl } from "../../../Redux/blReduce";
import jwt_decode from "jwt-decode";
import { getActiveIms } from "../../../Redux/imsReduce";
import html2canvas from "html2canvas";
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
import { Bar,Doughnut } from 'react-chartjs-2';

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
  document.title = "Tableau de bord pack";
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      maintainAspectRatio: false
      /* title: {
        display: true,
        text: 'Chart.js Bar Chart',
      }, */
    },
  };
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line
  const idRole = decoded.userauth.idrole
  var anneeLocal =localStorage.getItem("annee");

  const [optionsQteCA] = useState([
    {
      isDisabled: true,
    },
    { value: 1, label: "Quantité",libelle:"quantite" },
    { value: 2, label: "Chiffre d'affaire (TND)",libelle:"montant" },
  ]);
  const [qteCA, setQteCA] = useState({ value: 2, label: "Chiffre d'affaire",libelle:"quantite" });

  //header page
  const [total, setTotal] = useState(0);
  const [totalClient, setTotalClient] = useState(0);
  const [totalVente, setTotalVente] = useState(0);

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
  const [optionBriks, setOptionBriks] = React.useState([
    {
      value: "",
      label: "Briks",
    },
  ]);

  const [brisksPack, setBrisksPack] = useState(null);
  const [packSelect, setPackSelect] = useState({
    value: 0,
    label: "Commande groupée",
  });
  const [valPieBriks, setValPieBriks] = useState(null);

  const [optionsPack, setOptionsPack] = useState([
    {
      value: "",
      label: "Pack",
      isDisabled: true,
    },
  ]);

  // pack briks
  const [totPack, setTotPack] = useState(null);
  const [briksPackSelect, setBriksPackSelect] = useState({
      value: "",
      label: "",
  });

  //total pack
  const [pack, setPack] = useState(null);

  //dashbord header  (Total CA,Total vente,total pharmacie)
  const getHeader = useCallback(async (mois) => {
    var header = await dispatch(totalCA({
      year: parseInt(anneeLocal),
      idLine: parseInt(idLine),
      mois: mois.value,
      idRole:idRole
    }));
    setTotal(header.payload.montant);
    setTotalClient(header.payload.totalClient);
    setTotalVente(header.payload.totalBl);
  }, [dispatch,anneeLocal,idLine,idRole]);

  //Option Pack
  const getPack = useCallback(async () => {
    var p = await dispatch(getAllPackBl());
    var entities = p.payload;
    setOptionsPack(entities);
  }, [dispatch]);

  //Distrubition du CA des packs par bricks
  const getDistrubition = useCallback(async (mois,qteCA,pack,bricks) => {
    var array = [];
    bricks.forEach(e=>{
      array.push(e.value)
    })
    var chiffre = await dispatch(getPackBriks({
      qteCA: qteCA.value,
      year: parseInt(anneeLocal),
      mois: mois.value,
      idBriks:array,
      idPack:pack.value
    }));
    var arraySelect = chiffre.payload.arraySelect;
    var pieVal = chiffre.payload.pieVal;
    var pieBriks = chiffre.payload.pie;
    setBrisksPack(arraySelect);
    var objPie = {
      labels: pieBriks,
      datasets: [
        {
          data: pieVal,
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
    setValPieBriks(objPie);
  }, [dispatch,anneeLocal]);

  //Nombre des packs vendus par bricks
  const getNombrePacks = useCallback(async (mois,bricks) => {
    var chiffre = await dispatch(getBriksPack({
      year: parseInt(anneeLocal),
      mois: mois.value,
      idBriks:bricks.value,
    }));
    var arrayTot = chiffre.payload.arrayTot;
    var arrayPack = chiffre.payload.arrayPack;
    var objTot = {
      labels:arrayPack,
      datasets: [
        {
          label: 'Année sélectionnée',
          data: arrayTot,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2,
        },
      ],
    }; 
    setTotPack(objTot);
    setBriksPackSelect(bricks)
  }, [dispatch,anneeLocal]);

  //Option Briks
  const getIms = useCallback(async () => {
    var response = await dispatch(getActiveIms());  
    var entities = response.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle });
    });
    if(arrayOption.length !== 0){
      getNombrePacks(mois,arrayOption[0])
    }
    setOptionBriks(arrayOption);
  }, [dispatch,getNombrePacks,mois]);

  //getTotalPack
  const getTotPack = useCallback(async (m,q) => {
    var chiffre = await dispatch(getTotalPack({
      year: parseInt(anneeLocal),
      mois: m.value,
      qteCA:q.value,
    }));
    var tabpack =chiffre.payload.tabpack;
    var valpack =chiffre.payload.valpack;
    var objPie = {
      labels: valpack,
      datasets: [
        {
          data: tabpack,
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
    setPack(objPie); 
  }, [dispatch,anneeLocal]);

  //useEffect
  React.useEffect(() => {
    getIms();
    getPack();
    getDistrubition(mois,qteCA,packSelect,[]);
    getTotPack(mois,qteCA);
    getHeader(mois);
  }, [getIms,getPack,getDistrubition,getTotPack,getHeader,mois,qteCA,packSelect]);

  const changeMois = useCallback(async (val) => {
    setMois(val);
  }, []);

  const changeQteCA = useCallback(async (val) => {
    setQteCA(val);
  }, []);

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
    var input1 = document.getElementById("capture");
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
      pdf.save("Pack " + date + ".pdf");
    });
    for (const key in printhidden) {
      if (typeof printhidden[key] === "object")
        printhidden[key].style.display = "block";
    }
  }
  
  return (
    <>
      <Container fluid>
        <div id="position">
          <Row>
            <Col md="6" className="pr-1">
              <label htmlFor="exampleInputEmail1">
                Quantité/Chiffre d'affaire
              </label>
              <Select
                className="react-select primary select-print"
                classNamePrefix="react-select"
                name="singleSelect"
                value={qteCA}
                onChange={changeQteCA}
                options={optionsQteCA}
                placeholder="Quantité/Chiffre d'affaire"
              />
              <br></br>
            </Col>
            <Col md="6" className="pr-1">
              <label htmlFor="exampleInputEmail1">Mois</label>
              <Select
                className="react-select primary select-print"
                classNamePrefix="react-select"
                name="singleSelect"
                value={mois}
                onChange={changeMois}
                options={optionsMois}
                placeholder="Mois"
              />
              <br></br>
            </Col>
          </Row>
        </div>
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
        <div id="capture">
          <Row>
            <Col lg="4" md="6" sm="4">
              <Card className="card-stats">
                <Card.Body>
                  <Row>
                    <Col xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Total CA</p>
                        <Card.Title as="h4">
                          {total == null ? 0 : Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(total)} TND
                        </Card.Title>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                <hr></hr>
                </Card.Footer>
              </Card>
            </Col>
            <Col lg="4" md="6" sm="4">
              <Card className="card-stats">
                <Card.Body>
                  <Row>
                    <Col xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Total vente</p>
                        <Card.Title as="h4">{totalVente}</Card.Title>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                <hr></hr>
                </Card.Footer>
              </Card>
            </Col>
            <Col lg="4" md="6" sm="4">
              <Card className="card-stats">
                <Card.Body>
                  <Row>
                    <Col xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="fas fa-user"></i>
                      </div>
                    </Col>
                    <Col xs="7">
                      <div className="numbers">
                        <p className="card-category">Total Pharmacie</p>
                        <Card.Title as="h4">{totalClient}</Card.Title>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                <hr></hr>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          <div className="chartBL">
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="4" className="pr-1">
                        <Card.Title as="h4">
                          Distrubition du {qteCA.value === 1 ? "QTE":"CA"} des packs par bricks
                        </Card.Title>
                      </Col>
                      <Col md="4" className="pr-1">
                        <Select
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={packSelect}
                          onChange={(val) => {
                            setPackSelect(val);
                            getDistrubition(mois,qteCA,val,brisksPack)
                          }}
                          options={optionsPack}
                          placeholder="Pack"
                        />
                        <br></br>
                      </Col>
                      <Col md="4" className="pr-1">
                        <Select
                          isMulti
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={brisksPack}
                          onChange={(val) => {
                            setBrisksPack(val);
                            getDistrubition(mois,qteCA,packSelect,val)
                          }}
                          options={optionBriks}
                          placeholder="Briks"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body className="doughnut">
                    {valPieBriks != null?<Doughnut options={options} data={valPieBriks} height={"70"}/>:""}
                  </Card.Body>
                </Card>
              </Col>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="4" className="pr-1">
                        <Card.Title as="h4">
                          Nombre des packs vendus par bricks
                        </Card.Title>
                      </Col>
                      <Col md="8" className="pr-1">
                        <Select
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={briksPackSelect}
                          onChange={(val) => {
                            setBriksPackSelect(val);
                            getNombrePacks(mois,val)
                            /* 
                            changeBriksPack(val,qteCA.value,annee.value,mois.value); */
                          }}
                          options={optionBriks}
                          placeholder="Briks"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {totPack != null?<Bar data={totPack} height={"70"}/>:""}
                  </Card.Body>
                </Card>
              </Col>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Card.Title as="h4">
                      {qteCA.value === 1
                        ? "QTE du total des packs vendus en %"
                        : "CA du total des packs vendus en %"}
                    </Card.Title>
                  </Card.Header>
                  <Card.Body className="doughnut">
                    {pack != null?<Doughnut options={options} data={pack} height={"70"}/>:""}
                  </Card.Body>
                </Card>
              </Col>

            </Row>
          </div>
        </div>
      </Container>
    </>
  );
}

export default PackDashBoard;
