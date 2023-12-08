import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import ReactExport from "react-export-excel";
import { allReleve, allReleveBi } from "../../Redux/releveReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ListeReleve() {
  document.title = "Liste des reléves grossistes";
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const id = decoded.userauth.id;
  var dateToday = new Date();
  var releveDate =
    dateToday.getDate() +
    "/" + 
    (dateToday.getMonth() + 1) +
    "/" +
    dateToday.getFullYear();
  var dateToday = new Date();
  var anneeLocal = localStorage.getItem("annee");
  const [alert, setAlert] = React.useState(null);
  const [loader, setLoader] = React.useState(true);

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

  const confirmMessage = (anneeLocal, i) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(anneeLocal, i)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const [data, setData] = React.useState([]);
  const [data1, setData1] = React.useState([]);
  const [bi, setBi] = React.useState([]);
  const [biVente, setBiVente] = React.useState([]);

  const ListeReleve = useCallback(
    async (anneeLocal) => {
      var prod = await dispatch(
        allReleve({
          id: id,
          annee: parseInt(anneeLocal),
        })
      );
      var res = prod.payload;
      var array = [];
      var $p = {};
      var array1 = [];
      var arrayBi = [];
      var $p1 = {};
      res.forEach((element) => {
        /* var valBi = {
          designation: element.produits.designation,
          prix: element.produits.prix,
          code: element.produits.code,
          code_pf: element.produits.code_pf,
          code_lbr: element.produits.code_lbr,
          fournisseur: element.releves.fournisseurs.nom,
          codeA: element.releves.fournisseurs.code,
          volume: element.mesure,
          valeur: element.mesure
            ? (element.produits.prix * element.mesure).toFixed(2)
            : 0,
          mois: element.mois,
          annee: element.annee,
          type: element.type === 1 ? "STOCK" : "VENTE",
        };
        arrayBi.push(valBi); */
        var val = {
          id_produit: element.id_produit,
          id_fournisseur: element.releves.id_fournisseur,
          designation: element.produits.designation,
          prix: element.produits.prix,
          code: element.produits.code,
          code_pf: element.produits.code_pf,
          code_lbr: element.produits.code_lbr,
          fournisseur: element.releves.fournisseurs.nom,
          codeA: element.releves.fournisseurs.code,
          delegue:
            element.releves.users.nomU + " " + element.releves.users.prenomU,
          mesure: element.mesure,
          type: element.type,
          jan: "N/A",
          fev: "N/A",
          mars: "N/A",
          avr: "N/A",
          mai: "N/A",
          juin: "N/A",
          juillet: "N/A",
          aout: "N/A",
          sep: "N/A",
          oct: "N/A",
          nov: "N/A",
          dec: "N/A",
          val_jan: "N/A",
          val_fev: "N/A",
          val_mars: "N/A",
          val_avr: "N/A",
          val_mai: "N/A",
          val_juin: "N/A",
          val_juillet: "N/A",
          val_aout: "N/A",
          val_sep: "N/A",
          val_oct: "N/A",
          val_nov: "N/A",
          val_dec: "N/A",
          type: "N/A",
          na:
            element.date === null || element.date === "0000-00-00"
              ? "N/A"
              : element.date,
        };
        if (element.type == 2) {
          val.type = "Vente";
          if ($p[element.releves.id_fournisseur]) {
            if ($p[element.releves.id_fournisseur][element.id_produit]) {
              if (
                $p[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ]
              )
                $p[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ] += element.mesure;
              else {
                $p[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ] = 0;
                $p[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ] += element.mesure;
              }
            } else {
              $p[element.releves.id_fournisseur][element.id_produit] = {};
              $p[element.releves.id_fournisseur][element.id_produit][
                element.mois
              ] = 0;
              $p[element.releves.id_fournisseur][element.id_produit][
                element.mois
              ] += element.mesure;
              array.push(val);
            }
          } else {
            $p[element.releves.id_fournisseur] = {};
            $p[element.releves.id_fournisseur][element.id_produit] = {};
            $p[element.releves.id_fournisseur][element.id_produit][
              element.mois
            ] = 0;
            $p[element.releves.id_fournisseur][element.id_produit][
              element.mois
            ] += element.mesure;
            array.push(val);
          }
        } else {
          val.type = "Stock";
          if ($p1[element.releves.id_fournisseur]) {
            if ($p1[element.releves.id_fournisseur][element.id_produit]) {
              if (
                $p1[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ]
              )
                $p1[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ] += element.mesure;
              else {
                $p1[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ] = 0;
                $p1[element.releves.id_fournisseur][element.id_produit][
                  element.mois
                ] += element.mesure;
              }
            } else {
              $p1[element.releves.id_fournisseur][element.id_produit] = {};
              $p1[element.releves.id_fournisseur][element.id_produit][
                element.mois
              ] = 0;
              $p1[element.releves.id_fournisseur][element.id_produit][
                element.mois
              ] += element.mesure;
              array1.push(val);
            }
          } else {
            $p1[element.releves.id_fournisseur] = {};
            $p1[element.releves.id_fournisseur][element.id_produit] = {};
            $p1[element.releves.id_fournisseur][element.id_produit][
              element.mois
            ] = 0;
            $p1[element.releves.id_fournisseur][element.id_produit][
              element.mois
            ] += element.mesure;
            array1.push(val);
          }
        }
      });
      /* setBi(arrayBi); */
      array.forEach((element) => {
        for (var i = 1; i < 13; i++) {
          switch (i) {
            case 1:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.jan = $p[element.id_fournisseur][element.id_produit][i];
                element.val_jan =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 2:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.fev = $p[element.id_fournisseur][element.id_produit][i];
                element.val_fev =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 3:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.mars =
                  $p[element.id_fournisseur][element.id_produit][i];
                element.val_mars =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 4:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.avr = $p[element.id_fournisseur][element.id_produit][i];
                element.val_avr =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 5:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.mai = $p[element.id_fournisseur][element.id_produit][i];
                element.val_mai =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 6:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.juin =
                  $p[element.id_fournisseur][element.id_produit][i];
                element.val_juin =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 7:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.juillet =
                  $p[element.id_fournisseur][element.id_produit][i];
                element.val_juillet =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 8:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.aout =
                  $p[element.id_fournisseur][element.id_produit][i];
                element.val_aout =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 9:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.sep = $p[element.id_fournisseur][element.id_produit][i];
                element.val_sep =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 10:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.oct = $p[element.id_fournisseur][element.id_produit][i];
                element.val_oct =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 11:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.nov = $p[element.id_fournisseur][element.id_produit][i];
                element.val_nov =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 12:
              if ($p[element.id_fournisseur][element.id_produit][i]) {
                element.dec = $p[element.id_fournisseur][element.id_produit][i];
                element.val_dec =
                  $p[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            default:
              break;
          }
        }
      });

      array1.forEach((element) => {
        for (var i = 1; i < 13; i++) {
          switch (i) {
            case 1:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.jan =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_jan =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 2:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.fev =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_fev =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 3:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.mars =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_mars =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 4:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.avr =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_avr =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 5:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.mai =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_mai =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 6:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.juin =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_juin =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 7:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.juillet =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_juillet =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 8:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.aout =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_aout =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 9:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.sep =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_sep =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 10:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.oct =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_oct =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 11:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.nov =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_nov =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            case 12:
              if ($p1[element.id_fournisseur][element.id_produit][i]) {
                element.dec =
                  $p1[element.id_fournisseur][element.id_produit][i];
                element.val_dec =
                  $p1[element.id_fournisseur][element.id_produit][i] *
                  element.prix;
              }
              break;
            default:
              break;
          }
        }
      });
      setData(array);
      setData1(array1);
      setLoader(false);
    },
    [dispatch, id]
  );

  const exporter = useCallback(
    async (anneeLocal, i) => {
      document.getElementById("export" + i).click();
      hideAlert();
    },
    [dispatch, ListeReleve]
  );
  const getBI = useCallback(
    async (anneeLocal) => {
      var prod = await dispatch(
        allReleveBi({
          id: id,
          annee: parseInt(anneeLocal),
          mois: mois.value,
        })
      );
      var res = prod.payload;
      var arrayBi = [];
      var arrayBiStock = [];
      res.forEach((element) => {
        var valBi = {
          produit_ims: element.produits.produit_ims,
          designation: element.produits.designation,
          prix: element.produits.prix,
          code: element.produits.code,
          code_pf: element.produits.code_pf,
          code_lbr: element.produits.code_lbr,
          fournisseur: element.releves.fournisseurs.nom,
          codeA: element.releves.fournisseurs.code,
          opalia:
            element.produits.code_lbr !== null &&
            element.produits.code_lbr !== ""
              ? "LBR"
              : "OPALIA",
          volume: element.mesure,
          valeur: element.mesure
            ? (element.produits.prix * element.mesure).toFixed(2)
            : 0,
          mois: element.mois,
          annee: element.annee,
          date: element.annee + "-" + element.mois + "-01",
          type: element.type === 1 ? "STOCK" : "VENTE",
          typeGro: element.releves.type === 1 ? "Fin mois" : "Mi-mois",
          insertDate:new Date(new Date(element.createdAt).getTime() - new Date(element.createdAt).getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10)
        };
        if (element.type === 1) arrayBiStock.push(valBi);
        else arrayBi.push(valBi);
      });
      setBiVente(arrayBi);
      setBi(arrayBiStock);
    },
    [dispatch, id, mois]
  );
  React.useEffect(() => {
    ListeReleve(anneeLocal);
    getBI(anneeLocal);
  }, [ListeReleve, getBI, anneeLocal]);

  return (
    <>
      {alert}
      <Container fluid>
        <Row>
          <Col md="12">
            <h4 className="title">
              Tableau recupulatif des donnèes Reléve grossiste
            </h4>
            <h1 className="title">Vente</h1>
            <Card>
              <Card.Body>
                <Row>
                  <Col md="6" className="pr-1 float-left">
                    <label>Mois</label>
                    <Select
                      className="react-select primary select-print"
                      classNamePrefix="react-select"
                      name="singleSelect"
                      value={mois}
                      onChange={(value) => {
                        setData([]);
                        setData1([]);
                        setLoader(true);
                        setMois(value);
                      }}
                      options={optionsMois}
                      placeholder="Mois"
                    />
                    <br></br>
                  </Col>
                  <Col md="6" className="pdfExcel float-right">
                    <span>
                      <Button onClick={() => confirmMessage(anneeLocal, 2)}>
                        Export Excel BI vente
                        <i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                    <span>
                      <Button
                        className="mr-1"
                        onClick={() => confirmMessage(anneeLocal, 3)}
                      >
                        Export Excel BI stock
                        <i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                  </Col>

                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export3">Export Excel</button>}
                      filename={releveDate + "Relevebi_vente_stock"}
                    >
                      <ExcelSheet data={bi} name="RelevesBI">
                        <ExcelColumn label="GROSSISTE" value="fournisseur" />
                        <ExcelColumn label="PRODUIT IMS" value="produit_ims" />
                        <ExcelColumn label="DESIGNATION" value="designation" />
                        <ExcelColumn label="CODE ADONIX" value="codeA" />
                        <ExcelColumn label="Valeur" value="valeur" />
                        <ExcelColumn label="Volume" value="volume" />
                        <ExcelColumn label="Type 2" value="type" />
                        <ExcelColumn label="CODE PF" value="code_pf" />
                        <ExcelColumn label="Date" value="date" />
                        <ExcelColumn label="Type 3" value="type" />
                        <ExcelColumn label="CODE PCT LBR" value="code_lbr" />
                        <ExcelColumn label="CODE PCT" value="code" />
                        <ExcelColumn label="Type 4" value="opalia" />
                        <ExcelColumn label="Type 5" value="typeGro" />
                        <ExcelColumn label="Date insertion" value="insertDate" />

                      </ExcelSheet>
                    </ExcelFile>
                  </Col>

                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export2">Export Excel</button>}
                      filename={releveDate + "Relevebi_vente_stock"}
                    >
                      <ExcelSheet data={biVente} name="RelevesBI">
                        <ExcelColumn label="GROSSISTE" value="fournisseur" />
                        <ExcelColumn label="PRODUIT IMS" value="produit_ims" />
                        <ExcelColumn label="DESIGNATION" value="designation" />
                        <ExcelColumn label="CODE ADONIX" value="codeA" />
                        <ExcelColumn label="Valeur" value="valeur" />
                        <ExcelColumn label="Volume" value="volume" />
                        <ExcelColumn label="Type 2" value="type" />
                        <ExcelColumn label="CODE PF" value="code_pf" />
                        <ExcelColumn label="Date" value="date" />
                        <ExcelColumn label="Type 3" value="type" />
                        <ExcelColumn label="CODE PCT LBR" value="code_lbr" />
                        <ExcelColumn label="CODE PCT" value="code" />
                        <ExcelColumn label="Type 4" value="opalia" />
                        <ExcelColumn label="Type 5" value="typeGro" />
                        <ExcelColumn label="Date insertion" value="insertDate" />
                      </ExcelSheet>
                    </ExcelFile>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="table-style">
            {/*     <Row>
                  <Col md="12" className="pdfExcel">
                    <span>
                      <Button onClick={() => confirmMessage(anneeLocal, 0)}>
                        Export Excel<i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                  </Col>

                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export0">Export Excel</button>}
                      filename={releveDate + "Relevevente"}
                    >
                      <ExcelSheet data={data} name="Releves">
                        <ExcelColumn label="Code adonix" value="codeA" />
                        <ExcelColumn label="Grossiste" value="fournisseur" />
                        <ExcelColumn label="Code Produit" value="code" />
                        <ExcelColumn label="Code pf" value="code_pf" />
                        <ExcelColumn label="Code pct lbr" value="code_lbr" />
                        <ExcelColumn label="Désignation" value="designation" />

                        <ExcelColumn label="Jan Volume" value="jan" />
                        <ExcelColumn label="Jan Valeur" value="val_jan" />

                        <ExcelColumn label="Fev Volume" value="fev" />
                        <ExcelColumn label="Fev Valeur" value="val_fev" />

                        <ExcelColumn label="Mars Volume" value="mars" />
                        <ExcelColumn label="Mars Valeur" value="val_mars" />

                        <ExcelColumn label="Avr Volume" value="avr" />
                        <ExcelColumn label="Avr Valeur" value="val_avr" />

                        <ExcelColumn label="Mai Volume" value="mai" />
                        <ExcelColumn label="Mai Valeur" value="val_mai" />

                        <ExcelColumn label="Juin Volume" value="juin" />
                        <ExcelColumn label="Juin Valeur" value="val_juin" />

                        <ExcelColumn label="Juillet Volume" value="juillet" />
                        <ExcelColumn
                          label="Juillet Valeur"
                          value="val_juillet"
                        />

                        <ExcelColumn label="Aout Volume" value="aout" />
                        <ExcelColumn label="Aout Valeur" value="val_aout" />

                        <ExcelColumn label="Sep Volume" value="sep" />
                        <ExcelColumn label="Sep Valeur" value="val_sep" />

                        <ExcelColumn label="Oct Volume" value="oct" />
                        <ExcelColumn label="Oct Valeur" value="val_oct" />

                        <ExcelColumn label="Nov Volume" value="nov" />
                        <ExcelColumn label="Nov Valeur" value="val_nov" />

                        <ExcelColumn label="Dec Volume" value="dec" />
                        <ExcelColumn label="Dec Valeur" value="val_dec" />

                        <ExcelColumn label="Date limite" value="na" />
                        <ExcelColumn label="Type" value="type" />
                      </ExcelSheet>
                    </ExcelFile>
                  </Col>
                </Row> */}

                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Grossiste",
                      accessor: "fournisseur",
                    },
                    {
                      Header: "Designation",
                      accessor: "designation",
                    },
                    {
                      Header: "Jan",
                      accessor: "jan",
                    },
                    {
                      Header: "Fev",
                      accessor: "fev",
                    },
                    {
                      Header: "Mars",
                      accessor: "mars",
                    },
                    {
                      Header: "Avr",
                      accessor: "avr",
                    },
                    {
                      Header: "Mai",
                      accessor: "mai",
                    },
                    {
                      Header: "Juin",
                      accessor: "juin",
                    },
                    {
                      Header: "Juillet",
                      accessor: "juillet",
                    },
                    {
                      Header: "Aout",
                      accessor: "aout",
                    },
                    {
                      Header: "Sep",
                      accessor: "sep",
                    },
                    {
                      Header: "Oct",
                      accessor: "oct",
                    },
                    {
                      Header: "Nov",
                      accessor: "nov",
                    },
                    {
                      Header: "dec",
                      accessor: "dec",
                    },
                    {
                      Header: "Date limite",
                      accessor: "na",
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {loader === true ? (
                  <div>
                    <img
                      src={require("../../assets/img/loader.gif").default}
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
            <hr></hr>
            <br></br>
            <h1 className="title">Stock</h1>
            <Card>
              <Card.Body className="table-style">
                {/* <Row>
                  <Col md="12" className="pdfExcel">
                    <span>
                      <Button onClick={() => confirmMessage(anneeLocal, 1)}>
                        Export Excel<i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                  </Col>

                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export1">Export Excel</button>}
                      filename={releveDate + "Relevestock"}
                    >
                      <ExcelSheet data={data1} name="Releves">
                        <ExcelColumn label="Code adonix" value="codeA" />
                        <ExcelColumn label="Grossiste" value="fournisseur" />
                        <ExcelColumn label="Code Produit" value="code" />
                        <ExcelColumn label="Code pf" value="code_pf" />
                        <ExcelColumn label="Code pct lbr" value="code_lbr" />
                        <ExcelColumn label="Désignation" value="designation" />

                        <ExcelColumn label="Jan Volume" value="jan" />
                        <ExcelColumn label="Jan Valeur" value="val_jan" />

                        <ExcelColumn label="Fev Volume" value="fev" />
                        <ExcelColumn label="Fev Valeur" value="val_fev" />

                        <ExcelColumn label="Mars Volume" value="mars" />
                        <ExcelColumn label="Mars Valeur" value="val_mars" />

                        <ExcelColumn label="Avr Volume" value="avr" />
                        <ExcelColumn label="Avr Valeur" value="val_avr" />

                        <ExcelColumn label="Mai Volume" value="mai" />
                        <ExcelColumn label="Mai Valeur" value="val_mai" />

                        <ExcelColumn label="Juin Volume" value="juin" />
                        <ExcelColumn label="Juin Valeur" value="val_juin" />

                        <ExcelColumn label="Juillet Volume" value="juillet" />
                        <ExcelColumn
                          label="Juillet Valeur"
                          value="val_juillet"
                        />

                        <ExcelColumn label="Aout Volume" value="aout" />
                        <ExcelColumn label="Aout Valeur" value="val_aout" />

                        <ExcelColumn label="Sep Volume" value="sep" />
                        <ExcelColumn label="Sep Valeur" value="val_sep" />

                        <ExcelColumn label="Oct Volume" value="oct" />
                        <ExcelColumn label="Oct Valeur" value="val_oct" />

                        <ExcelColumn label="Nov Volume" value="nov" />
                        <ExcelColumn label="Nov Valeur" value="val_nov" />

                        <ExcelColumn label="Dec Volume" value="dec" />
                        <ExcelColumn label="Dec Valeur" value="val_dec" />

                        <ExcelColumn label="Date limite" value="na" />
                        <ExcelColumn label="Type" value="type" />
                      </ExcelSheet>
                    </ExcelFile>
                  </Col>
                </Row> */}

                <ReactTable
                  data={data1}
                  columns={[
                    {
                      Header: "Grossiste",
                      accessor: "fournisseur",
                    },
                    {
                      Header: "Designation",
                      accessor: "designation",
                    },
                    {
                      Header: "Jan",
                      accessor: "jan",
                    },
                    {
                      Header: "Fev",
                      accessor: "fev",
                    },
                    {
                      Header: "Mars",
                      accessor: "mars",
                    },
                    {
                      Header: "Avr",
                      accessor: "avr",
                    },
                    {
                      Header: "Mai",
                      accessor: "mai",
                    },
                    {
                      Header: "Juin",
                      accessor: "juin",
                    },
                    {
                      Header: "Juillet",
                      accessor: "juillet",
                    },
                    {
                      Header: "Aout",
                      accessor: "aout",
                    },
                    {
                      Header: "Sep",
                      accessor: "sep",
                    },
                    {
                      Header: "Oct",
                      accessor: "oct",
                    },
                    {
                      Header: "Nov",
                      accessor: "nov",
                    },
                    {
                      Header: "dec",
                      accessor: "dec",
                    },
                    {
                      Header: "Date limite",
                      accessor: "na",
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {loader === true ? (
                  <div>
                    <img
                      src={require("../../assets/img/loader.gif").default}
                      alt="loader"
                    />
                  </div>
                ) : data1.length === 0 ? (
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

export default ListeReleve;
