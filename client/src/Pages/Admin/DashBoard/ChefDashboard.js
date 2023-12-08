import React, { useCallback, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { chartFourPharma,chartFourProd, suiviMensuelFour,getTotalPackFour } from "../../../Redux/dashReduce";
import {
  getAllProdFourBl,
  getFournisseurBl,
  getAllParmaParFour,
} from "../../../Redux/blReduce";
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
import { Bar,Doughnut,Line } from "react-chartjs-2";
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
  const dispatch = useDispatch();
  var anneeLocal = localStorage.getItem("annee");
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      maintainAspectRatio: false
    },
  };

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
  //chart produit
  const [dataProduit, setDataProduit] = useState(null);

  //chart client
  const [dataClient, setDataClient] = useState(null);
  const [labels] = React.useState(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]);
  const [dataSuivi, setDataSuivi] = React.useState(null);

  /*** Fin new chart ***/

  //total pack
  const [pack, setPack] = useState(null);

  //produit
  const [produit, setProduit] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
    },
  ]);

  //Pharmacie
  const [pharmacie, setPharmacie] = React.useState([]);
  const [optionPharmacie, setOptionPharmacie] = React.useState([
    {
      value: "",
      label: "Pharmacie",
    },
  ]);

  //Fournisseur
  const [fournisseur, setFournisseur] = React.useState({
    value: 0,
    label: "Tous",
  });
  const [optionFournisseur, setOptionFournisseur] = React.useState([
    {
      value: "",
      label: "Grossiste",
    },
  ]);

  //get produit by fournisseur from bl
  const getProduitBl = useCallback(async (fournisseur) => {
    var produit = await dispatch(
      getAllProdFourBl({ fournisseur:fournisseur.value, anneeLocal:anneeLocal })
    );
    var entities = produit.payload;
    setOptionProduit(entities);
  }, [dispatch, anneeLocal]);

  //get Pharmacie by fournisseur from bl
  const getPharmacieBl = useCallback(async (fournisseur) => {
    var marche = await dispatch(
      getAllParmaParFour({ fournisseur:fournisseur.value, anneeLocal:anneeLocal })
    );
    var entities = marche.payload;
    setOptionPharmacie(entities);
  }, [dispatch, anneeLocal]);

  //get fournisseur from bl
  const getFournisseur = useCallback(async () => {
    var marche = await dispatch(getFournisseurBl());
    var entities = marche.payload;
    setOptionFournisseur(entities);
  }, [dispatch]);

  //chart Pharmacie
  const getFourPharma = useCallback(
    async (mois, qteCA, four, client, nb) => {
      var chiffre = await dispatch(
        chartFourPharma({
          qteCA: qteCA.value,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idPharmacie: client,
          fournisseur: four.value,
          limit: nb,
        })
      );
      
      var arrayFour = chiffre.payload.arrayFour;
      var arrayMnt = chiffre.payload.arrayMnt;
      var arrayOption = chiffre.payload.arrayOption;
      var objBricks = {
        labels: arrayFour,
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
      setDataClient(objBricks);
      setPharmacie(arrayOption);
    },
    [dispatch, anneeLocal]
  );

  //dashboard CA BL par produit
  const getFourProd = useCallback(
    async (mois, qteCA, four, prod, nb) => {
      var chiffre = await dispatch(
        chartFourProd({
          qteCA: qteCA.value,
          year: parseInt(anneeLocal),
          mois: mois.value,
          idProduit: prod,
          fournisseur: four.value,
          limit: nb,
        })
      );
      
      var arrayFour = chiffre.payload.arrayFour;
      var arrayMnt = chiffre.payload.arrayMnt;
      var arrayOption = chiffre.payload.arrayOption;
      var objBricks = {
        labels: arrayFour,
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
      setDataProduit(objBricks);
      setProduit(arrayOption);
      /* setDataClient(objBricks);
      setPharmacie(arrayOption); */
    },
    [dispatch, anneeLocal]
  );

  //dashboard Suivi mensuel du CA/qte généré par BL
  const getSuivi = useCallback(async (qteCA,four) => {
    var yearNow = parseInt(anneeLocal);
    var response = await dispatch(suiviMensuelFour({
      qteCA: qteCA.value,
      fournisseur: four.value,
      year: yearNow,
    }));
    let dataBL = response.payload;
    var arrayYear = [];
    labels.forEach((e) => {
      var resultNow = dataBL.filter(function (elem) {
        return elem.mounth === e && parseInt(elem.annee) === yearNow;
      });
      if (
        typeof resultNow[0] !== "undefined" &&
        parseFloat(resultNow[0].annee) === yearNow
      ) {
        arrayYear.push(parseFloat(resultNow[0].qteCA).toFixed(3));
      } else {
        arrayYear.push(0);
      }
    });
    var objSuivi = {
      labels,
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
  }, [dispatch,anneeLocal,labels]);

  //dashboard CA BL par pharmacie
  const getTotPack = useCallback(async (m,q,four) => {
    var chiffre = await dispatch(getTotalPackFour({
      year: parseInt(anneeLocal),
      mois: m.value,
      qteCA:q.value,
      fournisseur: four.value,
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
    getProduitBl(fournisseur);
    getPharmacieBl(fournisseur);
    getFournisseur();
    getFourPharma(mois, qteCA, fournisseur, "", 10);
    getFourProd(mois, qteCA, fournisseur, "", 10);
    getSuivi(qteCA,fournisseur);
    getTotPack(mois,qteCA,fournisseur);
  }, [getPharmacieBl, getFournisseur, getProduitBl, mois, qteCA, fournisseur,getFourPharma,getFourProd,getSuivi,getTotPack]);

  const changeMois = useCallback(async (val) => {
    setMois(val);
  }, []);

  const changeFour = useCallback(async (val) => {
    setFournisseur(val);
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
  return (
    <>
      <Container fluid>
        <div id="position">
          <Row>
            <Col md="4" className="pr-1">
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
            <Col md="4" className="pr-1">
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
            <Col md="4" className="pr-1">
              <label htmlFor="exampleInputEmail1">Grossiste</label>
              <Select
                className="react-select primary select-print"
                classNamePrefix="react-select"
                name="singleSelect"
                value={fournisseur}
                onChange={changeFour}
                options={optionFournisseur}
                placeholder="Grossiste"
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
                        value={pharmacie}
                        onChange={(val) => {
                          var nb = val.length;
                          setPharmacie(val);
                          var pharma ="("
                          val.forEach((v,k)=>{
                            
                            if((k+1) < nb)
                              pharma+=v.value+",";
                            else 
                              pharma+=v.value;
                          })
                          pharma+=")"
                          getFourPharma(mois, qteCA,fournisseur, pharma, nb);
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
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  Pharmacie */}
          
          {/* start  Produit */}
          <Row>
            <Col md="12">
              <Card>
                <Card.Header>
                  <Row>
                    <Col md="3" className="pr-1">
                      <Card.Title as="h4">
                        {qteCA.value === 1
                          ? "Qte vendue par produit"
                          : "CA BL par produit"}
                      </Card.Title>
                    </Col>
                    <Col md="9">
                      <Select
                        isMulti
                        className="react-select primary select-print"
                        classNamePrefix="react-select"
                        name="singleSelect"
                        value={produit}
                        onChange={(val) => {
                          var nb = val.length;
                          setProduit(val);
                          var prod ="("
                          val.forEach((v,k)=>{
                            
                            if((k+1) < nb)
                            prod+=v.value+",";
                            else 
                            prod+=v.value;
                          })
                          prod+=")"
                          getFourProd(mois, qteCA,fournisseur, prod, nb);
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
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* end  Produit */}
          <Row>
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
      </Container>
    </>
  );
}

export default BlIms;
