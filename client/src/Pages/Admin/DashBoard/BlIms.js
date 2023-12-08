import React, { useCallback, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import {
  totalCA,
  produitMarche,
  venteBLProduit,
  venteBLPharmacie,
  chartPharmacieBricks,
  chiffreParIms,
  detailsImsBricks,
  detailsImsMarche,
} from "../../../Redux/dashReduce";
import {
  getAllProduitBl,
  getAllMarcheBl,
  getAllParmacieBl,
  getAllImsBl,
  getMarcheFromDetail,
} from "../../../Redux/blReduce";
import jwt_decode from "jwt-decode";
import { getActiveIms } from "../../../Redux/imsReduce";
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
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
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

function BlIms() {
  document.title = "Bl Ims";
  /* const [limitPharmacie, setLimitPharmacie] = useState(10);
  const [limitBricks, setLimitBricks] = useState(10);
  const [limitProduit , setLimitProduit] = useState(10);
  const [limitMarche, setLimitMarche] = useState(10); */
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line;
  const idRole = decoded.userauth.idrole;
  var anneeLocal = localStorage.getItem("annee");

  const [optionsQteCA] = useState([
    {
      isDisabled: true,
    },
    { value: 1, label: "Quantité", libelle: "quantite" },
    { value: 2, label: "Chiffre d'affaire (TND)", libelle: "montant" },
  ]);
  const [qteCA, setQteCA] = useState({
    value: 2,
    label: "Chiffre d'affaire",
    libelle: "quantite",
  });

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
  /*** Début new chart ***/

  //chart bricks
  const [dataBricks, setDataBricks] = useState(null);
  //chart produit
  const [dataProduit, setDataProduit] = useState(null);

  //chart client
  const [dataClient, setDataClient] = useState(null);

  //clientBrikse
  const [dataClientBricks, setDataClientBricks] = useState(null);

  //chart Marche
  const [dataMarche, setDataMarche] = useState(null);
  //chart Detail ims par marche
  const [marcheOpalia, setMarcheOpalia] = useState(null);
  //chart detail ims par bricks
  const [opaliaMarket, setOpaliaMarket] = useState(null);

  /*** Fin new chart ***/

  //produit
  const [produitSelected, setProduitSelected] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
    },
  ]);

  //marche
  const [marcheSelected, setMarcheSelected] = React.useState([]);
  const [optionMarche, setOptionMarche] = React.useState([
    {
      value: "",
      label: "Marche",
    },
  ]);

  //Pharmacie
  const [pharmacieSelected, setPharmacieSelected] = React.useState([]);
  const [optionPharmacie, setOptionPharmacie] = React.useState([
    {
      value: "",
      label: "Pharmacie",
    },
  ]);

  //CA par pharmacies par bricks (Top 15)
  const [briksClient, setBriksClient] = useState();
  const [optionBriks, setOptionBriks] = React.useState([
    {
      value: "",
      label: "Briks",
    },
  ]);

  //CA des BL par Bricks
  const [briksSelected, setBricksSelected] = useState([]);

  //CA (IMS) d'Opalia par rapport au total du marché par bricks
  const [optionIms, setOptionIms] = React.useState([
    {
      value: "",
      label: "Bricks",
      isDisabled: true,
    },
  ]);
  const [briksIms, setBriksIms] = useState([]);
  //CA (IMS) produit opalia par rapport au marché total
  const [marcheDetail, setMarcheDetail] = useState([]);

  const [marcheFromDetail, setMarcheFromDetail] = useState([
    {
      value: "",
      label: "Marché",
      isDisabled: true,
    },
  ]);

  //dashbord header  (Total CA,Total vente,total pharmacie)
  const getHeader = useCallback(
    async (mois) => {
      var header = await dispatch(
        totalCA({
          year: parseInt(anneeLocal),
          idLine: parseInt(idLine),
          mois: mois.value,
          idRole: idRole,
        })
      );
      setTotal(header.payload.montant);
      setTotalClient(header.payload.totalClient);
      setTotalVente(header.payload.totalBl);
    },
    [dispatch, anneeLocal, idLine, idRole]
  );

  //chart produit
  // bech nejbdo produit illi mawjoudine fil bl
  const getProduitBl = useCallback(async () => {
    var produit = await dispatch(getAllProduitBl({idLine,idRole,anneeLocal}));
    var entities = produit.payload;
    setOptionProduit(entities);
  }, [dispatch,idLine,idRole,anneeLocal]);

  //chart produit
  const getProduit = useCallback(
    async (mois, qteCA, prod,nb) => {
      var array = [];
      prod.forEach((e) => {
        array.push(e.value);
      });
      var chiffre = await dispatch(
        venteBLProduit({
          qteCA: qteCA.value,
          idLine: null,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idRole: idRole,
          produit: array,
          limit:nb
        })
      );
      var arrayProd = chiffre.payload.arrayProd;
      var arrayOption = chiffre.payload.arrayOption;
      var arrayMnt = chiffre.payload.arrayMnt;
      var objProduit = {
        labels: arrayProd,
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
      setDataProduit(objProduit);
      if (mois.value === 0) setProduitSelected(arrayOption);
    },
    [dispatch, anneeLocal, idRole]
  );

  //chart marche
  // bech nejbdo marche illi mawjoudine fil bl
  const getMarcheBl = useCallback(async () => {
    var marche = await dispatch(getAllMarcheBl({idLine,idRole,anneeLocal}));
    var entities = marche.payload;
    setOptionMarche(entities);
  }, [dispatch,idLine,idRole,anneeLocal]);

  //chart marche
  const getMarche = useCallback(
    async (mois, qteCA, marche,nb) => {
      var array = [];
      marche.forEach((e) => {
        array.push(e.value);
      });
      var chiffre = await dispatch(
        produitMarche({
          qteCA: qteCA.value,
          idLine: null,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idRole: idRole,
          marche: array,
          limit:nb
        })
      );
      var arrayMarche = chiffre.payload.arrayMarche;
      var arrayOption = chiffre.payload.arrayOption;
      var arrayMnt = chiffre.payload.arrayMnt;
      var objMarche = {
          labels:arrayMarche,
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
      setDataMarche(objMarche);
      if (mois.value === 0) setMarcheSelected(arrayOption);
    },
    [dispatch, anneeLocal, idRole]
  );

  //chart Pharmacie
  // bech nejbdo Pharmacie illi mawjoudine fil bl
  const getPharmacieBl = useCallback(async () => {
    var marche = await dispatch(getAllParmacieBl({idLine,idRole,anneeLocal}));
    var entities = marche.payload;
    setOptionPharmacie(entities);
  }, [dispatch,idLine,idRole,anneeLocal]);

  //chart Pharmacie
  const getPharmacie = useCallback(
    async (mois, qteCA, pharmacie,nb) => {
      var array = [];
      pharmacie.forEach((e) => {
        array.push(e.value);
      });
      var chiffre = await dispatch(
        venteBLPharmacie({
          qteCA: qteCA.value,
          idLine: null,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idRole: idRole,
          idUser: 0,
          pharmacie: array,
          limit:nb
        })
      );
      var arrayPharmacie = chiffre.payload.arrayPharmacie;
      var arrayOption = chiffre.payload.arrayOption;
      var arrayMnt = chiffre.payload.arrayMnt;
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
      if (mois.value === 0) setPharmacieSelected(arrayOption);
    },
    [dispatch, anneeLocal, idRole]
  );

  //CA par pharmacies par bricks (Top 15)
  // bech nejbdo Briks illi mawjoudine fil bl
  const getIms = useCallback(async () => {
    var ims = await dispatch(getAllImsBl({idLine,idRole,anneeLocal}));
    var entities = ims.payload;
    setOptionBriks(entities);
  }, [dispatch,idLine,idRole,anneeLocal]);

  //CA par pharmacies par bricks (Top 15)
  const getPharmacieBricks = useCallback(
    async (mois, qteCA, idBriks) => {
      var chiffre = await dispatch(
        chartPharmacieBricks({
          qteCA: qteCA.value,
          idLine: null,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idRole: idRole,
          idBriks: idBriks,
        })
      );
      var arrayIms = chiffre.payload.arrayIms;
      var arrayMnt = chiffre.payload.arrayMnt;
      var objBricks = {
        labels: arrayIms,
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
      setDataClientBricks(objBricks);
      if (idBriks === 0) setBriksClient({ value: 0, label: "Tous" });
    },
    [dispatch, anneeLocal, idRole]
  );

  // CA des BL par Bricks
  const getBricks = useCallback(
    async (mois, qteCA, ims,nb) => {
      var array = [];
      ims.forEach((e) => {
        array.push(e.value);
      });
      var chiffre = await dispatch(
        chiffreParIms({
          qteCA: qteCA.value,
          idLine: null,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idRole: idRole,
          idBriks: array,
          limit:nb
        })
      );
      var arrayIms = chiffre.payload.arrayIms;
      var arrayOption = chiffre.payload.arrayOption;
      var arrayMnt = chiffre.payload.arrayMnt;
      var objBricks = {
        labels: arrayIms,
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
      setDataBricks(objBricks);
      if (mois.value === 0) setBricksSelected(arrayOption);
    },
    [dispatch, anneeLocal, idRole]
  );

  //CA (IMS) d'Opalia par rapport au total du marché par bricks
  const getDetailBricks = useCallback(
    async (mois, qteCA, ims) => {
      var array = [];
      var arrayOpalia = [];
      var arrayMarket = [];
      ims.forEach((e) => {
        array.push(e.value);
        /* arrayIms.push(e.label); */
        arrayMarket[e.value] = 0;
        arrayOpalia[e.label] = 0;
      });
      var chiffre = await dispatch(
        detailsImsBricks({
          qteCA: qteCA.value,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idBriks: array,
          arrayMarket: arrayMarket,
          arrayOpalia: arrayOpalia,
        })
      );
      var opalia = chiffre.payload.arrayOpalia;
      var market = chiffre.payload.arrayMarket;
      var arrayIms = chiffre.payload.arrayIms;
      var objIms = {
        labels: arrayIms,
        datasets: [
          {
            label: "Opalia",
            data: opalia,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            barPercentage: 0.5,
            barThickness: 10,
            maxBarThickness: 18,
            minBarLength: 2,
          },
          {
            label: "Total",
            data: market,
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            barPercentage: 0.5,
            barThickness: 10,
            maxBarThickness: 18,
            minBarLength: 2,
          },
        ],
      };
      setOpaliaMarket(objIms);
    },
    [dispatch, anneeLocal]
  );
  
  // bech nejbdo Ims etat = 1
  const getImsActive = useCallback(async () => {
    var response = await dispatch(getActiveIms());
    var entities = response.payload;
    var arrayOption = [];
    var arrayOption1 = [];
    var nb = 0;
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle });
      if (nb < 10) {
        arrayOption1.push({ value: e.id, label: e.libelle });
      } else if (nb === 10) {
        getDetailBricks(mois, qteCA, arrayOption1);
      }
      nb++;
    });
    setOptionIms(arrayOption);
    setBriksIms(arrayOption1);
  }, [dispatch, mois, qteCA, getDetailBricks]);

  //CA (IMS) produit opalia par rapport au marché total
  const getDetailMarche = useCallback(
    async (mois, qteCA, marche) => {
      var array = [];
      /* var marcheVerif = [];
      var arrayMarket = [];
      var j = 0; */
      marche.forEach((e) => {
        array.push(e.value);
        /* j++; */
      });
      var chiffre = await dispatch(
        detailsImsMarche({
          qteCA: qteCA.value,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idMarche: array,
        })
      );
      var opalia = chiffre.payload.arrayOpalia;
      var market = chiffre.payload.arrayMarket;
      var arrayMarche = chiffre.payload.arrayMarche;
      var objEvo = {
        labels:arrayMarche,
        datasets: [
          {
            label: 'Marché total',
            data: market,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            barPercentage: 0.5,
            barThickness: 10,
            maxBarThickness: 18,
            minBarLength: 2,
          },
          {
            label: 'Marché opalia',
            data: opalia,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            barPercentage: 0.5,
            barThickness: 10,
            maxBarThickness: 18,
            minBarLength: 2,
          },
        ],
      };
      setMarcheOpalia(objEvo);
    },
    [dispatch, anneeLocal]
  );

  //chart Detail ims par marche
  const getMarcheDetail = useCallback(async () => {
    var produit = await dispatch(getMarcheFromDetail());
    var entities = await produit.payload;
    var items = await entities.slice(0, 10);
    getDetailMarche(mois, qteCA, items);
    setMarcheDetail(items);
    setMarcheFromDetail(entities);
  }, [dispatch, getDetailMarche, mois, qteCA]);

  //useEffect
  React.useEffect(() => {
    getProduitBl();
    getMarcheBl();
    getPharmacieBl();
    getIms();
    getImsActive();
    getMarcheDetail();
    getHeader(mois);
    getProduit(mois, qteCA, [],10);
    getPharmacie(mois, qteCA, [],10);
    getBricks(mois,qteCA,[],10);
    getPharmacieBricks(mois, qteCA, 0);
    getMarche(mois, qteCA, [],10);
  }, [getHeader,mois,getMarche,getMarcheBl,getProduit,getProduitBl,getPharmacie,getPharmacieBl,qteCA,getPharmacieBricks,
      getBricks,getIms,getImsActive,getMarcheDetail,idLine,idRole,anneeLocal]);

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
    var input1 = document.getElementById("capture1");
    var input2 = document.getElementById("capture2");
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
      pdf.save("BlIms part 1 " + date + ".pdf");
    });
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
      pdf.save("BlIms part 2 " + date + ".pdf");
    });
    for (const key in printhidden) {
      if (typeof printhidden[key] === "object")
        printhidden[key].style.display = "block";
    }
  }
  /* const format = (num, decimals) => num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }); */
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
        <div id="capture1">
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
            {/* start  Produit */}
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="3" className="pr-1">
                        <Card.Title as="h4">
                          {qteCA.value === 1
                            ? "Qte des produits extraits des BL"
                            : "CA des produits extraits des BL"}
                        </Card.Title>
                      </Col>
                      <Col md="9">
                        <Select
                          isMulti
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={produitSelected}
                          onChange={(val) => {
                            var nb = val.length;
                            /* setLimitProduit(nb); */
                            setProduitSelected(val);
                            getProduit(mois, qteCA, val, nb);
                          }}
                          options={optionProduit}
                          placeholder="Produit"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {dataProduit != null ? (
                      <Bar data={dataProduit} height={"70"} />
                    ) : ""}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* end  Produit */}

            {/* start  Pharmacie */}
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="3" className="pr-1">
                        <Card.Title as="h4">
                          {qteCA.value === 1
                            ? "Qte vendue par pharmacie"
                            : "CA BL par pharmacie"}
                        </Card.Title>
                      </Col>
                      <Col md="9">
                        <Select
                          isMulti
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={pharmacieSelected}
                          onChange={(val) => {
                            var nb = val.length;
                            /* setLimitPharmacie(nb) */
                            setPharmacieSelected(val);
                            getPharmacie(mois, qteCA, val,nb);
                          }}
                          options={optionPharmacie}
                          placeholder="Pharmacie"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {dataClient != null ? (
                      <Bar data={dataClient} height={"70"} />
                    ) : ""}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* end  Pharmacie */}

            {/* start  Pharmacie Bricks */}
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Row>
                      <Col md="3" className="pr-1">
                        <Card.Title as="h4">
                          {qteCA.value === 1
                            ? "Qte vendue par pharmacies par bricks"
                            : "CA par pharmacies par bricks (Top 15)"}
                        </Card.Title>
                      </Col>
                      <Col md="9">
                        <Select
                          className="react-select primary select-print"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={briksClient}
                          onChange={(val) => {
                            setBriksClient(val);
                            getPharmacieBricks(mois, qteCA, val.value);
                          }}
                          options={optionBriks}
                          placeholder="Briks"
                        />
                        <br></br>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    {dataClientBricks != null ? (
                      <Bar data={dataClientBricks} height={"70"} />
                    ) : ""}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* end  Pharmacie Bricks */}
            
          </div>
        </div>
        
        <div className="chartBL" id="capture2">
          {/* start  Bricks */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md="3" className="pr-1">
                      <Card.Title as="h4">
                        {qteCA.value === 1
                          ? "Qte vendue par Bricks"
                          : "CA des BL par Bricks"}
                      </Card.Title>
                    </Col>
                    <Col md="9">
                      <Select
                        isMulti
                        className="react-select primary select-print"
                        classNamePrefix="react-select"
                        name="singleSelect"
                        value={briksSelected}
                        onChange={(val) => {
                          var nb = val.length;
                          /* setLimitBricks(nb); */
                          setBricksSelected(val)
                          getBricks(mois,qteCA,val,nb)
                        }}
                        options={optionBriks}
                        placeholder="Briks"
                      />
                      <br></br>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {dataBricks != null ? (
                    <Bar data={dataBricks} height={"70"} />
                  ) : ""}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  Bricks */}

          {/* start  detailsImsBricks */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md="3" className="pr-1">
                      <Card.Title as="h4">
                        {qteCA.value === 1
                          ? "QTE (IMS) vendue par opalia par rapport au total du marché par bricks"
                          : "CA (IMS) d'Opalia par rapport au total du marché par bricks"}
                      </Card.Title>
                    </Col>
                    <Col md="9">
                      <Select
                        isMulti
                        className="react-select primary select-print"
                        classNamePrefix="react-select"
                        name="singleSelect"
                        value={briksIms}
                        onChange={(val) => {
                          setBriksIms(val);
                          getDetailBricks(mois, qteCA, val);
                        }}
                        options={optionIms}
                        placeholder="Briks"
                      />
                      <br></br>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="scrollProduit">
                  {opaliaMarket != null ? (
                    <Bar data={opaliaMarket} height={"70"} />
                  ) : ""}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  detailsImsBricks */}

          {/* start  Marche */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md="3" className="pr-1">
                      <Card.Title as="h4">
                        {qteCA.value === 1
                          ? "QTE vendue par marchè"
                          : "CA BL par marchè"}
                      </Card.Title>
                    </Col>
                    <Col md="9">
                      <Select
                        isMulti
                        className="react-select primary select-print"
                        classNamePrefix="react-select"
                        name="singleSelect"
                        value={marcheSelected}
                        onChange={(val) => {
                          var nb = val.length;
                          /* setLimitMarche(nb); */
                          setMarcheSelected(val);
                          getMarche(mois, qteCA, val,nb);
                        }}
                        options={optionMarche}
                        placeholder="Marche"
                      />
                      <br></br>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {dataMarche != null ? (
                    <Bar data={dataMarche} height={"70"} />
                  ) : ""}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  Marche */}

          {/* start  detailsImsMarche */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md="3" className="pr-1">
                      <Card.Title as="h4">
                        {qteCA.value === 1
                          ? "QTE (IMS) produit opalia par rapport au marché total"
                          : "CA (IMS) produit opalia par rapport au marché total"}
                      </Card.Title>
                    </Col>
                    <Col md="9">
                      <Select
                        isMulti
                        className="react-select primary select-print"
                        classNamePrefix="react-select"
                        name="singleSelect"
                        value={marcheDetail}
                        onChange={(val) => {
                          setMarcheDetail(val);
                          getDetailMarche(mois, qteCA, val);
                          /* getMarche(mois,qteCA,val) */
                        }}
                        options={marcheFromDetail}
                        placeholder="Marché"
                      />
                      <br></br>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {marcheOpalia != null ? (
                    <Bar data={marcheOpalia} height={"70"} />
                  ) : ""}
                </Card.Body> 
              </Card>
            </Col>
          </Row>
          {/* end  detailsImsMarche */}
        </div>
      </Container>
    </>
  );
}

export default BlIms;
