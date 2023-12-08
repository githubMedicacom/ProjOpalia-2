import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import ReactExport from "react-export-excel";
import { commandeValide, exportBl } from "../Redux/blReduce";
import { allProduitPack } from "../Redux/packReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../components/ReactTable/ReactTable.js";
import SweetAlert from "react-bootstrap-sweetalert";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function CommandeValide() {
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line;
  const idRole = decoded.userauth.idrole;
  var dateToday = new Date();
  var produitDate =
    dateToday.getDate() +
    "/" +
    (dateToday.getMonth() + 1) +
    "/" +
    dateToday.getFullYear();
  var anneeLocal = localStorage.getItem("annee");
  const [alert, setAlert] = React.useState(null);
  const [loader, setLoader] = React.useState(true);
  const confirmMessage = (trimestre, anneeLocal) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(trimestre, anneeLocal)}
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

  const [trimestre, setTrimestre] = React.useState({
    value: 0,
    label: "Tous",
  });
  const [optionsTrimestre] = React.useState([
    {
      value: "",
      label: "Mois",
      isDisabled: true,
    },
    { value: 0, label: "Tous" },
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ]);
  const [optionsValider] = React.useState([
    {
      value: "",
      label: "Etat",
      isDisabled: true,
    },
    { value: 0, label: "En cours" },
    { value: 1, label: "Validée" },
    { value: 2, label: "Annulée" },
  ]);
  const [valider, setValider] = React.useState({
    value: 0,
    label: "En cours",
  });
  const [data, setData] = React.useState([]);

  const listeProduits = useCallback(
    async (trimestre, anneeLocal, valider) => {
      //bech nejbdo produit pack_produit w inzidoh fil array
      var packProd = await dispatch(allProduitPack());
      var resPack = await packProd.payload;
      var prod = await dispatch(
        commandeValide({
          valider: valider.value,
          idLine: idLine,
          idRole: idRole,
          annee: parseInt(anneeLocal),
          trimestre: trimestre.value,
        })
      );
      var resProd = await prod.payload;
      var array = [];
      if (resProd.length > 0) {
        resProd.forEach((val) => {
          var newVal = val;
          if(resPack[val.idPack][val.idProd])
          newVal.seuil=resPack[val.idPack][val.idProd].montant;
          else 
          newVal.seuil=0;
          newVal.type = val.type_prod === 1?"AMC":"AMM";
          array.push(newVal)
        });
      }
      setData(array);
      setLoader(false);
    },
    [dispatch, idLine, idRole]
  );

  const exporter = useCallback(
    async (trimestre, anneeLocal) => {
      dispatch(exportBl()).then(() => {
        document.getElementById("export").click();
        hideAlert();
      });
    },
    [dispatch]
  );

  React.useEffect(() => {
    listeProduits(trimestre, anneeLocal, valider);
  }, [listeProduits, trimestre, anneeLocal, valider]);

  return (
    <>
      {alert}
      <Container fluid>
        <Row>
          <Col md="12">
            <h4 className="title">
              Tableau recupulatif des donnèes BL validée
            </h4>
            <Card>
              <Card.Body className="table-style">
                <Row>
                  <Col md="3" className="pr-1">
                    <label htmlFor="exampleInputEmail1">Mois</label>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      value={trimestre}
                      onChange={(value) => {
                        setTrimestre(value);
                        setLoader(true);
                      }}
                      options={optionsTrimestre}
                      placeholder="Trimestre"
                    />
                    <br></br>
                  </Col>
                  <Col md="3" className="pr-1">
                    <label htmlFor="exampleInputEmail1">Etat</label>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      value={valider}
                      onChange={(value) => {
                        setValider(value);
                        setLoader(true);
                      }}
                      options={optionsValider}
                      placeholder="Trimestre"
                    />
                    <br></br>
                  </Col>
                  <Col md="6" className="pdfExcel">
                    <span>
                      <Button
                        onClick={() => confirmMessage(trimestre, anneeLocal)}
                      >
                        Export Excel<i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                  </Col>
                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export">Export Excel</button>}
                      filename={produitDate + "ExtractionAC"}
                    >
                      <ExcelSheet data={data} name="Produits">
                        <ExcelColumn label="idBl" value="idBl" />
                        <ExcelColumn label="Numero BL" value="numeroBL" />
                        <ExcelColumn label="Pharmacie" value="nomClt" />
                        <ExcelColumn label="Segment" value="nomSeg" />
                        <ExcelColumn label="Nom délegué" value="nomDelegue" />
                        <ExcelColumn label="Bricks" value="ims" />
                        <ExcelColumn label="Grossite" value="fournisseur" />
                        <ExcelColumn label="Désigantion" value="designation" />
                        <ExcelColumn label="Type" value="type" />
                        <ExcelColumn label="Nom pack" value="pack" />
                        <ExcelColumn label="Jour" value="day" />
                        <ExcelColumn label="Mois" value="month" />
                        <ExcelColumn label="Année" value="annee" />
                        <ExcelColumn label="Quantite" value="qte" />
                        <ExcelColumn label="Total HT" value="mnt" />
                        <ExcelColumn label="Total TTC" value="mnt_ttc" />
                        <ExcelColumn label="Total seuil" value="seuil" />
                        <ExcelColumn
                          label="Date insertion"
                          value="dateInsertion"
                        />
                      </ExcelSheet>
                    </ExcelFile>
                  </Col>
                </Row>
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Numero BL",
                      accessor: "numeroBL",
                    },
                    {
                      Header: "nomDelegue",
                      accessor: "nomDelegue",
                    },
                    {
                      Header: "Pharmacie",
                      accessor: "nomClt",
                    },
                    {
                      Header: "Grossiste",
                      accessor: "fournisseur",
                    },
                    {
                      Header: "Désignation",
                      accessor: "designation",
                    },
                    {
                      Header: "Jour",
                      accessor: "day",
                    },
                    {
                      Header: "Mois",
                      accessor: "month",
                    },
                    {
                      Header: "Annee",
                      accessor: "annee",
                    },
                    {
                      Header: "pack",
                      accessor: "pack",
                    },
                    {
                      Header: "Quantite",
                      accessor: "qte",
                    },
                    {
                      Header: "Total HT",
                      accessor: "mnt",
                    },
                    {
                      Header: "Total seuil",
                      accessor: "seuil",
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

export default CommandeValide;
