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
import { totalCA,suiviMensuel,chiffreParSecteur,venteBLParDelegue, getDeleguePharmacie } from "../../../Redux/dashReduce";
import { getAllDelegueBl,getAllParmacieBl,getAllSecteurBl } from "../../../Redux/blReduce";
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
import { Bar,Doughnut,Line } from 'react-chartjs-2';
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

function Overview() {
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
  //Pharmacie
  const [pharmacieSelected, setPharmacieSelected] = React.useState([]);
  const [optionPharmacie, setOptionPharmacie] = React.useState([
    {
      value: "",
      label: "Pharmacie",
    },
  ]);
  const [user, setUser] = useState({
    value: 0,
    label: "Tous",
  });
  document.title = "Overview";
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line
  const idRole = decoded.userauth.idrole
  var anneeLocal =localStorage.getItem("annee");
  /* const [limitDelegue, setLimitDelegue] = useState(10);
  const [limitSecteur, setLimitSecteur] = useState(10); */
  const [labels] = React.useState(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]);
  const [dataEvo, setDataEvo] = React.useState(null);
  const [dataSuivi, setDataSuivi] = React.useState(null);
  const [valPie, setValPie] = useState(null);

  const [optionsQteCA] = useState([
    {
      isDisabled: true,
    },
    { value: 1, label: "Quantité",libelle:"quantite" },
    { value: 2, label: "Chiffre d'affaire (TND)",libelle:"montant" },
  ]);
  const [qteCA, setQteCA] = useState({ value: 2, label: "Chiffre d'affaire",libelle:"quantite" });

  //user
  const [userSelected, setUserSelected] = React.useState([]);
  const [optionUser, setOptionUser] = React.useState([
    {
      value: "",
      label: "User",
    },
  ]);

  //secteur
  const [secteurSelected, setSecteurSelected] = React.useState([]);
  const [optionSecteur, setOptionSecteur] = React.useState([
    {
      value: "",
      label: "Secteur",
    },
  ]);

  //header page
  const [total, setTotal] = useState(0);
  const [totalClient, setTotalClient] = useState(0);
  const [totalVente, setTotalVente] = useState(0);
  //chiffreParSecteur
  const [caParSect, setCaParSect] = useState(null);
  //venteBLParDelegueAdmin
  const [caDelegue, setCADelegue] = useState(null);

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

  //secteur
  const getSecteur = useCallback(async (mois,qteCA,sect,nb) => {
    var array = [];
    sect.forEach(e=>{
      array.push(e.value)
    })
    var chiffre = await dispatch(chiffreParSecteur({
      qteCA: qteCA.value,
      idLine: idLine,
      year: parseInt(anneeLocal),
      mois: mois.value,
      idRole:idRole,
      secteur:array,
      limit:nb
    }));
    
    var arraySect =chiffre.payload.arraySect;
    var arrayMnt =chiffre.payload.arrayMnt;    
    var objSecteur = {
      labels:arraySect,
      datasets: [
        {
          label: 'Année sélectionnée',
          data: arrayMnt,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2,
        },
      ],
    }; 
    setCaParSect(objSecteur)
    if(mois.value===0)
      setSecteurSelected(chiffre.payload.arrayOption);
  }, [dispatch,idRole,anneeLocal,idLine]);

  //suivi
  const getSuivi = useCallback(async (qteCA) => {
    var yearNow = parseInt(anneeLocal);
    var lastYear = yearNow - 1;
    var response = await dispatch(suiviMensuel({
      qteCA: qteCA.value,
      idLine: parseInt(idLine),
      idUser:0,
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
      labels,
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
      labels,
      datasets: [
        {
          label: 'Année sélectionnée',
          data: arrayYear,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        /* {
          label: 'Année précédente',
          data: arrayLastYear,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }, */
      ],
    };
    setDataSuivi(objSuivi)
    setDataEvo(objEvo)
  }, [dispatch,anneeLocal,idLine,labels]);

  //venteBLParDelegue
  const getBLParDelegue = useCallback(async (mois,qteCA,user,nb) => {
    var array = [];
    user.forEach(e=>{
      array.push(e.value)
    })
    var chiffre = await dispatch(venteBLParDelegue({
      qteCA: qteCA.value,
      idLine: idLine,
      year: parseInt(anneeLocal),
      mois: mois.value,
      idRole:idRole,
      user:array,
      limit:nb
    }));
    var arrayUser=chiffre.payload.arrayUser;
    var arrayOption=chiffre.payload.arrayOption;
    var arrayMnt=chiffre.payload.arrayMnt;
    var objDelegue= {
      labels:arrayUser,
      datasets: [
        {
          label: 'Année sélectionnée',
          data: arrayMnt,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          barPercentage: 0.5,
          barThickness: 10,
          maxBarThickness: 18,
          minBarLength: 2
        },
      ],
    }; 
    setCADelegue(objDelegue);
    if(mois.value===0)
      setUserSelected(arrayOption);
  }, [dispatch,anneeLocal,idLine,idRole]);


  //Distrubition du CA des packs par bricks
  const getDelePharma = useCallback(async (mois,qteCA,user,pharma) => {
    var array = [];
    pharma.forEach(e=>{
      array.push(e.value)
    })
    var chiffre = await dispatch(getDeleguePharmacie({
      idLine:idLine,
      idRole:idRole,
      qteCA: qteCA.value,
      year: parseInt(anneeLocal),
      mois: mois.value,
      idPharmacie:array,
      idUser:user.value
    }));
    var arraySelect = chiffre.payload.arraySelect;
    var pieVal = chiffre.payload.pieVal;
    var pieBriks = chiffre.payload.pie;
    setPharmacieSelected(arraySelect);
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
    setValPie(objPie);
  }, [dispatch,anneeLocal,idLine,idRole]);

  //get utilisateur
  //get delegue by ligne role and annee
  const getUtilisateur = useCallback(async () => {
    var utilisateur = await dispatch(getAllDelegueBl({idLine,idRole,anneeLocal}));
    var entities = utilisateur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.users.id, label: e.users.nomU + " " + e.users.prenomU });
    });
    if(arrayOption.length >0){
      getDelePharma(mois,qteCA,arrayOption[0],[])
      setUser(arrayOption[0])
    }
    setOptionUser(arrayOption);
  }, [dispatch,idLine,idRole,anneeLocal,getDelePharma,mois,qteCA]);

  //get utilisateur
  //get secteur by ligne role and annee
  const getSecteurActiveBL = useCallback(async () => {
    var utilisateur = await dispatch(getAllSecteurBl({idLine,idRole,anneeLocal}));
    var entities = utilisateur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.users.secteurs.id, label: e.users.secteurs.libelleSect });
    });
    setOptionSecteur(arrayOption);
  }, [dispatch,idLine,idRole,anneeLocal]);

  //chart Pharmacie
  //get delegue by ligne role and annee
  const getPharmacieBl = useCallback(async () => {
    var marche = await dispatch(getAllParmacieBl({idLine,idRole,anneeLocal}));
    var entities = marche.payload;
    setOptionPharmacie(entities);
  }, [dispatch,idLine,idRole,anneeLocal]);
  
  React.useEffect(() => {
    getUtilisateur();
    getPharmacieBl();
    getSecteurActiveBL();
    getSuivi(qteCA);
    getHeader(mois);
    getSecteur(mois,qteCA,[],10);
    getBLParDelegue(mois,qteCA,[],10)
  }, [getHeader,getSuivi,getBLParDelegue,getSecteur,getSecteurActiveBL,getUtilisateur,getPharmacieBl,mois,qteCA]);

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
      pdf.save("Overview part 1 " + date + ".pdf");
    });

    var input2 = document.getElementById("capture2");
    html2canvas(input2, {
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
      pdf.save("Overview part 2 " + date + ".pdf");
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
                        <i className="fa fa-usd"></i>
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
                  <Card.Footer>
                    <div className="legend">
                      <i className="fas fa-circle text-info"></i> Année précédente
                      <i className="fas fa-circle text-danger"></i> Année sélectionnée
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="4" className="pr-1">
                        <Card.Title as="h4">
                          {qteCA.value === 1
                            ? "Qte vendu dans les BL selon le secteur"
                            : "CA généré par les BL selon le secteur"}
                        </Card.Title>
                      </Col>
                      <Col md="8">
                        <Select
                          isMulti
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={secteurSelected}
                          onChange={(val)=>{
                            var nb = val.length;
                            /* setLimitSecteur(nb); */
                            setSecteurSelected(val)
                            getSecteur(mois,qteCA,val,nb)
                          }}
                          options={optionSecteur}
                          placeholder="secteur"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {caParSect != null?<Bar data={caParSect} height={"70"}/>:""}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
        
        <div id="capture2" className="chartBL">   
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="4" className="pr-1">
                        <Card.Title as="h4">
                          {qteCA.value === 1
                            ? "QTE géneré par les BL selon délégué"
                            : "CA géneré par les BL selon délégué"}
                        </Card.Title>
                      </Col>
                      <Col md="8">
                        <Select
                          isMulti
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={userSelected}
                          onChange={(val)=>{
                            var nb = val.length;
                            /* setLimitDelegue(nb); */
                            setUserSelected(val)
                            getBLParDelegue(mois,qteCA,val,nb)
                          }}
                          options={optionUser}
                          placeholder="Délégué"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {caDelegue != null?<Bar data={caDelegue} height={"70"}/>:""}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="4" className="pr-1">
                        <Card.Title as="h4">
                          {qteCA.value === 1 ? "QTE":"CA"} géneré par les BL selon délégué/pharmacie
                        </Card.Title>
                      </Col>
                      <Col md="4" className="pr-1">
                        <Select
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={user}
                          onChange={(val) => {
                            setUser(val);
                            getDelePharma(mois,qteCA,val,[])
                          }}
                          options={optionUser}
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
                          value={pharmacieSelected}
                          onChange={(val) => {
                            setPharmacieSelected(val);
                            getDelePharma(mois,qteCA,user,val)
                          }}
                          options={optionPharmacie}
                          placeholder="Pharmacie"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body className="doughnut">
                    {valPie != null?<Doughnut options={options} data={valPie} height={"70"}/>:""}
                  </Card.Body>
                </Card>
              </Col>

            </Row>       
        </div>
      </Container>
    </>
  );
}

export default Overview;
