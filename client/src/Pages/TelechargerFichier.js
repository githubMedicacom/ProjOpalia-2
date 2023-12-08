import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";

import { saveDecharge, getDecharge } from "../Redux/commandesReduce";
import {
  getFileBl,
  getDetailBl,
  getBlById,
  saveDechargeBl,
  getDechargeBl,
} from "../Redux/blReduce";
import jwt_decode from "jwt-decode";
import SweetAlert from "react-bootstrap-sweetalert";
/**
 * Component hedha bech na3mlo bih affiche file bl idha ken id 2
 * upload file decharge idha ken etat 0
 * affiche file decharge commande idha ken etat 1
 * affiche file decharge bl idha ken etat 4
 **/
/*** 0. save decharge *** 1. get decharge commande *** 2. get file bl *** 4. get decharge bl***/
function TelechargerFichier() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  var idBl = location.idBl;
  var id = location.id;
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const idRole = decoded.userauth.idrole;

  //input
  const [payment, setPayment] = React.useState(null);
  const [fileURL, setFileURL] = React.useState(null);
  const [paymentUrl, setPaymentUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [ext, setExt] = React.useState("");
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
  const [loader, setLoader] = React.useState(true);

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
      payment: "nc-payment nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  function submitForm(event) {
    if (payment) {
      if (payment.type === "image/jpeg" || payment.type === "application/pdf") {
        const fileArray = new FormData();
        fileArray.append("file", payment);
        fileArray.append("fileName", payment.name);
        if (parseInt(id) === 0) {
          dispatch(saveDecharge({ fileArray, idBl })).then((e) => {
            if (e.payload === true) {
              notify("tr", "Payment avec succes", "success");
              localStorage.setItem("file", payment.name);
              navigate("/telechargerFichier/1/" + idBl);
              getFile(idBl);
            } else notify("tr", "Type de fichier incorrect", "danger");
          });
        } else {
          console.log(fileArray, idBl);
          dispatch(saveDechargeBl({ fileArray, idBl })).then((e) => {
            if (e.payload === true) {
              notify("tr", "Payment avec succes", "success");
              localStorage.setItem("file", payment.name);
              navigate("/telechargerFichier/4/" + idBl);
              getFileDechargeBl(idBl);
            } else notify("tr", "Type de fichier incorrect", "danger");
          });
        }
      } else notify("tr", "Type de fichier incorrect (PDF/JPEG/JPG)", "danger");
    } else notify("tr", "Il faut selectionner un fichier", "danger");
  }

  const hideAlert = () => {
    setAlert(null);
  };
  /* detailBl */
  const detailBl = useCallback(async () => {
    var det = await dispatch(getDetailBl(idBl));
    var data = await det.payload;
    var dataBl = await dispatch(getBlById(idBl));
    var bl = await dataBl.payload;
    var s = 0;
    var s_ttc = 0;
    setAlert(
      <SweetAlert
        customClass="pop-up-bl"
        style={{ display: "block", marginTop: "-100px" }}
        title={"Détail BL"}
        onConfirm={() => hideAlert()}
        cancelBtnBsStyle="danger"
      >
        <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Nom délégue</th>
              <th>Numéro BL</th>
              <th>Date BL</th>
              <th>Pharmacie</th>
              <th>Grossiste</th>
              <th>Bricks</th>
              <th>A.C</th>
              <th>Segments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bl.users.nomU + " " + bl.users.prenomU}</td>
              <td>{bl.numeroBL}</td>
              <td>{bl.dateBl}</td>
              <td>{bl.pharmacies.nom}</td>
              <td>{bl.fournisseur}</td>
              <td>{bl.ims.libelle}</td>
              <td>{bl.actions ? bl.actions.nom : ""}</td>
              <td>{bl.actions ? bl.actions.segments.nom : ""}</td>
            </tr>
          </tbody>
        </table>
        <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Produit</th>
              <th>Code PCT</th>
              <th>Produit</th>
              <th>Pack</th>
              <th>Quantité</th>
              <th>PU</th>
              <th>Montant TH</th>
              <th>Montant TTC</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => {
              // somme HT
              s += parseFloat(e.montant);
              // somme TTC
              s_ttc += parseFloat(e.montant_ttc);
              return (
                <tr key={"ligne-" + e.id}>
                  <td>{e.produits.designation}</td>
                  <td>{e.produits.code}</td>
                  <td>{e.produits.type === 1 ? "AMC" : "AMM"}</td>
                  <td>{e.packs ? e.packs.nom : e.bls.packs.nom}</td>
                  <td>{e.quantite}</td>
                  <td>{(e.montant / e.quantite).toFixed(3)}</td>
                  <td>{e.montant.toFixed(3)}</td>
                  <td>{e.montant_ttc.toFixed(3)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2>
          {"Total HT: " +
            Intl.NumberFormat("fr-FR", {
              maximumFractionDigits: 3,
            }).format(s.toFixed(3))}
        </h2>
        <h2>
          {"Total TTC: " +
            Intl.NumberFormat("fr-FR", {
              maximumFractionDigits: 3,
            }).format(s_ttc.toFixed(3))}
        </h2>
      </SweetAlert>
    );
  }, [dispatch, idBl]);
  const getFile = React.useCallback(
    async (file) => {
      var fileLocal = localStorage.getItem("file");
      setFileName(fileLocal);
      var splitFile = fileLocal.split(".");
      var ext1 = splitFile[splitFile.length - 1];
      setExt(ext1);
      dispatch(getDecharge(file)).then(async (e1) => {
        setLoader(false);
        var ff = null;
        if (ext1 === "pdf") {
          ff = new Blob([e1.payload], {
            type: "application/pdf",
          });
        } else {
          ff = new Blob([e1.payload], {
            type: "application/*",
          });
        }

        const f = URL.createObjectURL(ff);
        setFileURL(f);
      });
    },
    [dispatch]
  );
  const getFileBlFromDB = React.useCallback(
    async (file) => {
      var fileLocal = localStorage.getItem("file");
      setFileName(fileLocal);
      var splitFile = fileLocal.split(".");
      var ext1 = splitFile[splitFile.length - 1];
      setExt(ext1);
      dispatch(getFileBl(file)).then(async (e1) => {
        setLoader(false);
        var ff = null;
        if (ext1 === "pdf") {
          ff = new Blob([e1.payload], {
            type: "application/pdf",
          });
        } else {
          ff = new Blob([e1.payload], {
            type: "application/*",
          });
        }

        const f = URL.createObjectURL(ff);
        setFileURL(f);
      });
    },
    [dispatch]
  );
  const getFileDechargeBl = React.useCallback(
    async (file) => {
      var fileLocal = localStorage.getItem("file");
      setFileName(fileLocal);
      var splitFile = fileLocal.split(".");
      var ext1 = splitFile[splitFile.length - 1];
      setExt(ext1);
      dispatch(getDechargeBl(file)).then(async (e1) => {
        setLoader(false);
        var ff = null;
        if (ext1 === "pdf") {
          ff = new Blob([e1.payload], {
            type: "application/pdf",
          });
        } else {
          ff = new Blob([e1.payload], {
            type: "application/*",
          });
        }

        const f = URL.createObjectURL(ff);
        setFileURL(f);
      });
    },
    [dispatch]
  );
  useEffect(() => {
    if (parseInt(id) === 1) {
      getFile(idBl);
    } else if (parseInt(id) === 2) {
      getFileBlFromDB(idBl);
    } else if (parseInt(id) === 4) {
      getFileDechargeBl(idBl);
    } else {
      setLoader(false);
    }
  }, [getFile, getFileBlFromDB, idBl, id]);

  const uploadPayment = (acceptedFiles) => {
    setPayment(acceptedFiles[0]);
    setPaymentUrl(URL.createObjectURL(acceptedFiles[0]));
  };

  return (
    <>
      {alert}
      {loader ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        ""
      )}
      {!loader ? (
        <Container fluid>
          <div className="rna-container">
            <NotificationAlert ref={notificationAlertRef} />
          </div>
          <div className="section-image">
            <Container>
              <Row>
                <Col md="12">
                  <Button
                    id="saveBL"
                    className="btn-wd btn-outline mr-1 float-left"
                    type="button"
                    variant="info"
                    onClick={() => {
                      var nav = localStorage.getItem("returnList");
                      navigate("/" + nav);
                    }}
                  >
                    <span className="btn-label">
                      <i className="fas fa-list"></i>
                    </span>
                    Retour à la liste
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <Form action="" className="form" method="">
                    <Card>
                      <Card.Header>
                        <Card.Header>
                          <Card.Title as="h4" className="float-left">
                            {parseInt(id) === 0 || parseInt(id) === 3
                              ? "Importer fichier de décharge"
                              : "Télécharger fichier"}
                          </Card.Title>
                          {parseInt(id) === 2 ? (
                            <Button
                              id={"idLigneV_" + idBl}
                              onClick={(e) => {
                                detailBl();
                              }}
                              className="delete btn btn-success float-right"
                            >
                              <i
                                className="fa fa-eye"
                                id={"idLigneV_" + idBl}
                              />
                            </Button>
                          ) : (
                            ""
                          )}
                        </Card.Header>
                      </Card.Header>
                      <Card.Body>
                        <div className="pdf-vs">
                          {fileURL === null ? (
                            idRole === 2 ? (
                              <Dropzone onDrop={uploadPayment}>
                                {({ getRootProps, getInputProps }) => (
                                  <div
                                    {...getRootProps({
                                      className: "dropzone",
                                    })}
                                  >
                                    <input {...getInputProps()} />
                                    <div>
                                      {paymentUrl !== "" ? (
                                        <div>
                                          {payment.name}
                                          <i className="fas fa-file-alt fileUpload"></i>
                                        </div>
                                      ) : (
                                        <p>Importer un fichier</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                            ) : (
                              "Aucun détail"
                            )
                          ) : ext === "pdf" ? (
                            <div className="visualiser">
                              <iframe
                                title="Transition"
                                width="100%"
                                height="500px"
                                src={`${fileURL}#toolbar=0`}
                                /* src={fileURL} */
                              ></iframe>
                              <br></br>
                              <a
                                className="btn btn-info"
                                download={fileName}
                                rel="noreferrer"
                                href={fileURL}
                                target="_blank"
                              >
                                <i className="fas fa-file"></i> Télécharger
                              </a>
                            </div>
                          ) : (
                            <div className="visualiser">
                              <img
                                src={fileURL}
                                className="img-file"
                                alt=""
                              ></img>
                              <br></br>
                              <a
                                download={fileName}
                                rel="noreferrer"
                                href={fileURL}
                                target="_blank"
                                className="btn btn-info"
                              >
                                <i className="fas fa-download"></i> Télécharger
                              </a>
                            </div>
                          )}
                          {/* <a
                            download={fileName}
                            rel="noreferrer"
                            href={fileURL}
                            target="_blank"
                          >
                            <i className="fas fa-file"></i>{fileName}
                          </a>} */}
                        </div>
                        {(parseInt(id) === 0 || parseInt(id) === 3) &&
                        idRole === 2 ? (
                          <Button
                            className="btn-fill pull-right"
                            type="button"
                            variant="info"
                            onClick={submitForm}
                          >
                            Enregistrer
                          </Button>
                        ) : (
                          ""
                        )}
                        <div className="clearfix"></div>
                      </Card.Body>
                    </Card>
                  </Form>
                </Col>
              </Row>
            </Container>
          </div>
        </Container>
      ) : (
        ""
      )}
    </>
  );
}

export default TelechargerFichier;
