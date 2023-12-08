import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import ReactExport from "react-export-excel";
import { tableProduits, exportBl, getExport } from "../Redux/blReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../components/ReactTable/ReactTable.js";
import SweetAlert from "react-bootstrap-sweetalert";
import { allProduitPack } from "../Redux/packReduce";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ListeProduits() {
  document.title = "Liste des produits";
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
      label: "Trimestre",
      isDisabled: true,
    },
    { value: 0, label: "Tous" },
    { value: 1, label: "Trimestre 1" },
    { value: 2, label: "Trimestre 2" },
    { value: 3, label: "Trimestre 3" },
    { value: 4, label: "Trimestre 4" },
  ]);
  const [data, setData] = React.useState([]);
  const [dataExport, setDataExport] = React.useState([]);

  const listeProduits = useCallback(
    async (trimestre, anneeLocal) => {
      //bech nejbdo produit pack_produit w inzidoh fil array
      var packProd = await dispatch(allProduitPack());
      var resPack = await packProd.payload;
      var prod = await dispatch(
        tableProduits({
          idLine: idLine,
          idRole: idRole,
          annee: parseInt(anneeLocal),
          trimestre: trimestre.value,
        })
      );
      var res = prod.payload.r1;

      var obj = prod.payload.obj;

      var array = [];
      res.forEach((element) => {
        var val = element;

        if (resPack[val.idPack] && resPack[val.idPack][val.idProd])
          val.seuil = resPack[val.idPack][val.idProd].montant;
        else val.seuil = 0;
        if (element.type === 1) {
          val.packs = "Vente direct";
        } else {
          val.packs = element.pack;
          if (element.idPack === null) {
            val.packs = element.packBl;
          }
        }

        if (val.type_prod === 0) {
          val.type_produit = "AMM";
          val.bonif = (val.mnt * (val.unite_boni_amm / 100)).toFixed(3);
        } else {
          val.type_produit = "AMC";
          val.bonif = (val.mnt * (val.unite_boni_amc / 100)).toFixed(3);
        }

        if (obj[val.idBl]) {
          val.dateValidation = obj[val.idBl];
        } else {
          val.dateValidation = null;
        }

        //if (cmdeBls[val.idBL]) { val.dateValidation = cmdeBls[val.idBL];}

        array.push(val);
      });
      setData(array);
      setLoader(false);
      var user = await dispatch(getExport());
      setDataExport(user.payload);
    },
    [dispatch, idLine, idRole]
  );

  const exporter = useCallback(
    async (trimestre, anneeLocal) => {
      dispatch(exportBl()).then((e) => {
        var cmdeBls = e.payload;
        document.getElementById("export").click();
        hideAlert();
        listeProduits(trimestre, anneeLocal);
      });
    },
    [dispatch, listeProduits]
  );
  React.useEffect(() => {
    listeProduits(trimestre, anneeLocal);
  }, [listeProduits, trimestre, anneeLocal]);

  return (
    <>
      {alert}
      <Container fluid>
        <Row>
          <Col md="12">
            <h4 className="title">Tableau recupulatif des donnèes BL</h4>
            <Card>
              <Card.Body className="table-style">
                <Row>
                  <Col md="3" className="pr-1">
                    <label htmlFor="exampleInputEmail1">Trimestre</label>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      value={trimestre}
                      onChange={(value) => {
                        setData([]);
                        setLoader(true);
                        setTrimestre(value);
                        listeProduits(value, anneeLocal);
                      }}
                      options={optionsTrimestre}
                      placeholder="Trimestre"
                    />
                    <br></br>
                  </Col>
                  <Col md="9" className="pdfExcel">
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
                      filename={produitDate + "Produit"}
                    >
                      <ExcelSheet data={data} name="Produits">
                        <ExcelColumn label="idBl" value="idBl" />
                        <ExcelColumn label="Numero BL" value="numeroBL" />
                        <ExcelColumn label="Nom délegué" value="nomDelegue" />
                        <ExcelColumn label="Code One Key" value="code" />
                        <ExcelColumn label="Pharmacie" value="nomClt" />
                        <ExcelColumn label="Bricks" value="ims" />
                        <ExcelColumn label="Code adonix" value="codeAdonix" />
                        <ExcelColumn label="Grossiste" value="fournisseur" />
                        <ExcelColumn label="Désigantion" value="designation" />
                        <ExcelColumn label="Type" value="type_produit" />
                        <ExcelColumn label="Nom action" value="nom_action" />
                        <ExcelColumn label="Nom pack" value="packs" />
                        <ExcelColumn label="Jour" value="day" />
                        <ExcelColumn label="Mois" value="month" />
                        <ExcelColumn label="Année" value="annee" />
                        <ExcelColumn label="Quantite" value="qte" />
                        <ExcelColumn label="Total HT" value="mnt" />
                        <ExcelColumn label="Total TTC" value="mnt_ttc" />
                        <ExcelColumn label="Total seuil" value="seuil" />
                        <ExcelColumn label="Bonification" value="bonif" />
                        <ExcelColumn
                          label="Date validation"
                          value="dateValidation"
                        />
                        <ExcelColumn label="Décharge" value="payer" />
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
                      accessor: "packs",
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
          {idRole === 0 ? (
            <Col md="12">
              <h4 className="title">Historique de téléchargement</h4>
              <Card>
                <Card.Body className="table-style">
                  <ReactTable
                    data={dataExport}
                    columns={[
                      {
                        Header: "nom",
                        accessor: "users.nomU",
                      },
                      {
                        Header: "prenom",
                        accessor: "users.prenomU",
                      },
                      {
                        Header: "Date",
                        accessor: "createdAt",
                        Cell: ({ cell }) => (
                          <div className="block_action">
                            {cell.row.values.createdAt !== null
                              ? new Date(
                                  new Date(
                                    cell.row.values.createdAt
                                  ).getTime() -
                                    new Date(
                                      cell.row.values.createdAt
                                    ).getTimezoneOffset() *
                                      60000
                                )
                                  .toISOString()
                                  .slice(0, 16)
                                  .replace("T", " à ")
                              : ""}
                          </div>
                        ),
                      },
                      {
                        Header: "",
                        accessor: "vide",
                        sortable: false,
                        filterable: false,
                      },
                    ]}
                    className="-striped -highlight primary-pagination"
                  />
                  {dataExport.length === 0 ? (
                    <div className="text-center">Aucun donnée trouvé</div>
                  ) : (
                    ""
                  )}
                </Card.Body>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Container>
    </>
  );
}

export default ListeProduits;
