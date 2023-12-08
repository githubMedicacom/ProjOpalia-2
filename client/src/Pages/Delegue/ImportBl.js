import React, { useEffect, useCallback } from "react";

import NotificationAlert from "react-notification-alert";

import { CSVReader } from "react-papaparse";
import { useDispatch } from "react-redux";
import { getActiveProduit } from "../../Redux/produitReduce";
import { getActivePharmacie } from "../../Redux/pharmacieReduce";
import { saveExcel,verifNumBl } from "../../Redux/excelReduce";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { Alert } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
const buttonRef = React.createRef();

function ImportIms() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const dispatch = useDispatch();
  const [alert, setAlert] = React.useState(null);
  const [client, setClient] = React.useState([]);
  const [produit, setProduit] = React.useState([]);
  const [blExist, setBlExist] = React.useState("");
  const [data, setData] = React.useState([]);
  const id = decoded.userauth.id;
  const notificationAlertRef = React.useRef(null);
  const notify = (place, msg, type) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{msg}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };
  //get Produit
  const getProduit = useCallback(async () => {
    var prod = await dispatch(getActiveProduit());
    var entities = prod.payload;
    /* setProduit(entities) */
    var arrayOption = {};
    entities.forEach((e) => {
      if (e.code != null) arrayOption[e.code] = { id: e.id, code: e.code };
    });
    setProduit(arrayOption);
  }, [dispatch]);

  //get pharmacie
  const getPharmacie = useCallback(async () => {
    var entities = [];
    var pharm = await dispatch(getActivePharmacie());
    entities = pharm.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      if (e.code != null) arrayOption[e.code] = { id: e.id, idIms: e.idIms };
    });
    setClient(arrayOption);
  }, [dispatch]);

  //get pharmacie
  const verifNum = useCallback(async (arrayExiste) => {
    var num = await dispatch(verifNumBl({arrayExiste}));
    var res = num.payload.num;
    if(res !== null)
      setBlExist("Numero bl: "+res);
    /* var arrayOption = [];
    entities.forEach((e) => {
      if (e.code != null) arrayOption[e.code] = { id: e.id, idIms: e.idIms };
    }); */
  }, [dispatch]);

  const handleOnFileLoad = (data) => {
    var array = [];
    var arrayNum = [];
    var dataFormat = "";
    Object.keys(data).forEach((element) => {
      if (parseInt(element) !== 0) {
        var dateTrime = data[element].data[3];
        if (
          typeof dateTrime !== "undefined" &&
          data[element].data.length === 10
        ) {
          var dataSplit = dateTrime.split("/");
          dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0];
          var color = "";
          var clt = null;
          var nomClt = data[element].data[1];
          var codeClt = data[element].data[0];
          var ims = null;
          var prod = null;
          var nomProd = data[element].data[6];
          var codeProd = data[element].data[4];

          if (produit[data[element].data[4]]) {
            prod = produit[data[element].data[4]].id;
          } else {
            color = "red-background";
          }

          if (client[data[element].data[0]]) {
            clt = client[data[element].data[0]].id;
            ims = client[data[element].data[0]].idIms;
          } else {
            color = "orange-background";
          }
          arrayNum.push(data[element].data[2]);
          array.push({
            client: clt,
            nomClt: nomClt,
            codeClt: codeClt,
            numBl: data[element].data[2],
            numeroBL: data[element].data[2],
            dateBl: dataFormat,
            id_pack: 0,
            id_gouvernorat: ims,
            etat: 3,
            produit: prod,
            nomProd: nomProd,
            codeProd: codeProd,
            qte: data[element].data[7],
            mnt: data[element].data[8],
            idBl: null,
            color: color,
            iduser: id,
          });
        }
      }
    });
    verifNum(arrayNum);
    setData(array);
  };

  const handleOnError = (err) => {
    console.log(err);
  };

  const handleOnRemoveFile = () => {};

  const handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  useEffect(() => {
    getProduit();
    getPharmacie();
  }, [getProduit, getPharmacie]); //now shut up eslint
  function submitForm() {
    var arraImport = {};
    var testFile = true;
    data.forEach((val) => {
      if (val.color === "") {
        let mnt = val.mnt;
        mnt = mnt.replace(",",".");
        mnt = mnt.replace(/\s/g,"");
        let obj = {
          produit: val.produit,
          qte: val.qte,
          mnt: mnt,
          idBl: null,
        };
        if (!arraImport[val.numBl]) {
          arraImport[val.numBl] = {
            header: [
              {
                client: val.client,
                numBl: val.numBl,
                numeroBL: val.numeroBL,
                dateBl: val.dateBl,
                id_pack: 0,
                id_gouvernorat: val.id_gouvernorat,
                etat: 3,
                iduser: id,
              },
            ],
            ligne: [obj],
          };
        } else {
          arraImport[val.numBl]["ligne"].push(obj);
        }
      } else {
        testFile = false;
      }
    });
    if (testFile) {
      notify("tr", "Imporation avec succes", "success");
      dispatch(saveExcel({ insert: arraImport }));
    } else {
      notify("tr", "Vérifier votre fichier", "danger");
    }
  }
  const confirmMessage = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cette ligne?"
        onConfirm={() => deleteLigne(id)}
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
  function deleteLigne(id) {
    var list = [...data];
    if (data.length > 1) {
      list.splice(parseInt(id), 1);
      setData(list);
      notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
    hideAlert();
  }
  return (
    <>
      {alert}
      <Container fluid>
        <h4 className="title">Import Excel</h4>
        {blExist !== "" ? (
          <Alert variant="danger">
            {blExist}
          </Alert>
        ) : ""}
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Row>
                  <Col md="12">
                    <div className="importCSV">
                      <CSVReader
                        ref={buttonRef}
                        onFileLoad={handleOnFileLoad}
                        onError={handleOnError}
                        noClick
                        noDrag
                        onRemoveFile={handleOnRemoveFile}
                      >
                        {({ file }) => (
                          <aside
                            className="uploadCSV"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              marginBottom: 10,
                            }}
                          >
                            <button
                              type="button"
                              onClick={handleOpenDialog}
                              className="btn-wd btn-line float-left btn btn-info"
                            >
                              Import Excel (CSV)
                            </button>
                            <div
                              style={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#ccc",
                                height: 45,
                                lineHeight: 2.5,
                                marginTop: 5,
                                marginBottom: 5,
                                paddingLeft: 13,
                                paddingTop: 3,
                                width: "60%",
                              }}
                            >
                              {file && file.name}
                            </div>
                            <button
                              className="btn-wd btn-line float-left btn btn-danger"
                              onClick={handleRemoveFile}
                            >
                              Supprimer
                            </button>
                          </aside>
                        )}
                      </CSVReader>
                      <div className="import-csv-bl">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Code client </th>
                              <th>Nom client </th>
                              <th>Num facture </th>
                              <th>Date </th>
                              <th>CODE Produit </th>
                              <th>Désignation Produit </th>
                              <th>QTE </th>
                              <th>CA BRUT </th>
                              <th>action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, key) => {
                              return (
                                <tr key={"tr" + key} className={item.color}>
                                  <td>{item.codeClt}</td>
                                  <td>{item.nomClt}</td>
                                  <td>{item.numeroBL}</td>
                                  <td>{item.dateBl}</td>
                                  <td>{item.codeProd}</td>
                                  <td>{item.nomProd}</td>
                                  <td>{item.qte}</td>
                                  <td>{item.mnt}</td>
                                  <td>
                                    <Button
                                      onClick={(e) => {
                                        confirmMessage(key);
                                      }}
                                      variant="danger"
                                      size="sm"
                                      className="text-danger btn-link delete"
                                    >
                                      <i className="fa fa-trash" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="legend-excel">
                          <span className="danger-legend"></span> : Produit
                        </div>
                        <div className="legend-excel">
                          <span className="warning-legend"></span> : Client
                        </div>

                        <br></br>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Button
                  className="btn-fill pull-right"
                  type="button"
                  variant="info"
                  onClick={submitForm}
                >
                  Enregistrer
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ImportIms;
