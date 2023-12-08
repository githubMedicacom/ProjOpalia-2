import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import {
  saveDecharge,
  getDecharge,
  getFileBl,
  getDetailBl,
  getBlById,
  updateDecharge,
  removeDecharge,
} from "../Redux/blReduce";
import SweetAlert from "react-bootstrap-sweetalert";
function TelechargerFichier() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  var idBl = location.idBl;
  var id = location.id;
  //input
  const [payment, setPayment] = React.useState(null);
  const [fileURL, setFileURL] = React.useState(null);
  const [paymentUrl, setPaymentUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [ext, setExt] = React.useState("");
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);

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
    if (payment.type === "image/jpeg" || payment.type === "application/pdf") {
      const fileArray = new FormData();
      fileArray.append("file", payment);
      fileArray.append("fileName", payment.name);
      dispatch(saveDecharge({ fileArray, idBl })).then((e) => {
        var dechargeName = e.payload.filename;
        dispatch(updateDecharge({ dechargeName, idBl })).then((e) => {
          if (e.payload === true) {
            notify("tr", "Payment avec succes", "success");
            setTimeout(async () => {
              localStorage.setItem("file", dechargeName);
              window.location.reload();
            }, 2000);
          } else notify("tr", "Type de fichier incorrect", "danger");
        });
        /* if (e.payload === true) {
          notify("tr", "Payment avec succes", "success");
          setTimeout(async () => {
            navigate("/visualisationBl");
          }, 2000);
        } else notify("tr", "Type de fichier incorrect", "danger"); */
      });
    } else notify("tr", "Type de fichier incorrect", "danger");
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
              <th>Pack</th>
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
              <td>{bl.users.type===0?bl.packs.nom:"Vente direct"}</td>
            </tr>
          </tbody>
        </table>
        <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Produit</th>
              <th>Code PCT</th>
              <th>Quantité</th>
              <th>PU</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => {
              s += parseFloat(e.montant);
              return (
                <tr key={"ligne-" + e.id}>
                  <td>{e.produits.designation}</td>
                  <td>{e.produits.code}</td>
                  <td>{e.quantite}</td>
                  <td>{(e.montant / e.quantite).toFixed(3)}</td>
                  <td>{e.montant.toFixed(3)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2>{"Total: " + s.toFixed(3)}</h2>
      </SweetAlert>
    );
  }, [dispatch, idBl]);
  
  const deleteDecharge = useCallback(async () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes vous sure de supprimer?"
        onConfirm={() => deleteDech(idBl)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );

  }, [dispatch, idBl]);

  function deleteDech(id) {
    dispatch(removeDecharge(id)).then((e) => {
      if (e.payload === true) {
        hideAlert();
        notify("tr", "Supprimer avec succes", "success");
        localStorage.setItem("file","null")
        setTimeout(async () => {
          window.location.reload();
        }, 2000);
      } else {
        notify("tr", "Vérifier vos données", "danger");
      }
    });
  }

  const getFile = React.useCallback(
    async (file) => {
      var fileLocal = localStorage.getItem("file");
      if(fileLocal !=="null"){
        setFileName(fileLocal);
        var splitFile = fileLocal.split(".");
        var ext1 = splitFile[splitFile.length - 1];
        setExt(ext1);
        dispatch(getDecharge(file)).then(async (e1) => {
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
      }
    },
    [dispatch]
  );
  const getFileBlFromDB = React.useCallback(
    async (file) => {
      var fileLocal = localStorage.getItem("file");
      if(fileLocal){
        setFileName(fileLocal);
        var splitFile = fileLocal.split(".");
        var ext1 = splitFile[splitFile.length - 1];
        setExt(ext1);
        if (fileLocal !== "null") {
          dispatch(getFileBl(file)).then(async (e1) => {
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
        }
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (parseInt(id) === 1) {
      getFile(idBl);
    }
    if (parseInt(id) === 2) {
      getFileBlFromDB(idBl);
    }
  }, [getFile, getFileBlFromDB, idBl, id]);

  const uploadPayment = (acceptedFiles) => {
    setPayment(acceptedFiles[0]);
    setPaymentUrl(URL.createObjectURL(acceptedFiles[0]));
  };
  return (
    <>
      {alert}
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
                          {((parseInt(id) === 0 || parseInt(id) === 1) && localStorage.getItem("file") ==="null")
                            ? "Importer fichier de décharge"
                            : localStorage.getItem("file") !=="null"?"Télécharger fichier":"Détail BL"}
                        </Card.Title>
                        {parseInt(id) === 2 ? (
                          <Button
                            id={"idLigneV_" + idBl}
                            onClick={(e) => {
                              detailBl();
                            }}
                            className="delete btn btn-success float-right"
                          >
                            <i className="fa fa-eye" id={"idLigneV_" + idBl} />
                          </Button>
                        ) : (
                          ""
                        )}
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                    {(parseInt(id) === 1 && localStorage.getItem("file") !=="null")  ? (
                        <Button
                          className="btn-fill pull-right"
                          type="button"
                          variant="danger"
                          onClick={deleteDecharge}
                        >
                          Supprimer décharge
                        </Button>
                      ) : ""}
                      <div className="pdf-vs">
                        {(fileURL === null && localStorage.getItem("file") ==="null") ? (
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
                            {localStorage.getItem("file") !=="null"?
                            <a
                              download={fileName}
                              rel="noreferrer"
                              href={fileURL}
                              target="_blank"
                              className="btn btn-info"
                            >
                              <i className="fas fa-download"></i> Télécharger
                            </a>:""}
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
                      {(parseInt(id) === 0 && localStorage.getItem("file") ==="null")|| 
                      (parseInt(id) === 1 && localStorage.getItem("file") ==="null")  ? (
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
    </>
  );
}

export default TelechargerFichier;
