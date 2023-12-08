import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import {  getFileReleveMedical,  getDetailReleveMedical} from "../../Redux/releveMedicalReduce";
import SweetAlert from "react-bootstrap-sweetalert";
function TelechargerFichierReleveMedical() {  
  document.title = "Détails relevé";
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  var idBl = location.idBl;
  var id = location.id;
  //input
  const [fileURL, setFileURL] = React.useState(null);
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



  const hideAlert = () => {
    setAlert(null);
  };
  /* detailBl */
  const detailBl = useCallback(async () => {
    var det = await dispatch(getDetailReleveMedical(idBl));
    var data = await det.payload;
    
    setAlert(
      <SweetAlert
        customClass="pop-up-bl"
        style={{ display: "block", marginTop: "-100px" }}
        title={"Détail Relevé"}
        onConfirm={() => hideAlert()}
        cancelBtnBsStyle="danger"
      >
        <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Produit</th>
              <th>Code PCT</th>
              <th>Mois</th>
              <th>Année</th>
              <th>Montant</th>
              <th>Type</th>
              <th>Date limite</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => {
              var type=e.type==1?'stock':"vente";
              return (
                <tr key={"ligne-" + e.id}>
                  <td>{e.produits.designation}</td>
                  <td>{e.produits.code}</td>
                  <td>{e.mois}</td>
                  <td>{e.annee}</td>
                  <td>{e.mesure?e.mesure.toFixed(3):"N/A"}</td>
                  <td>{type}</td>
                  <td>{e.date==null || e.date=='0000-00-00'?"N/A":e.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SweetAlert>
    );
  }, [dispatch, idBl]);
  



  const getFile = React.useCallback(
    async (file) => {
      var fileLocal = localStorage.getItem("file");
      if(fileLocal !=="null"){
        setFileName(fileLocal);
        var splitFile = fileLocal.split(".");
        var ext1 = splitFile[splitFile.length - 1];
        setExt(ext1);
        dispatch(getFileReleveMedical(idBl)).then(async (e1) => {
          var ff = null;
          if (ext1.toLowerCase() === "pdf") {
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
    [dispatch,idBl]
  );

  useEffect(() => {
    getFile(idBl);
  }, [getFile, idBl, id]);

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
                    navigate("/VisualisationReleveMedical");
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
                        Détail Relevé
                        </Card.Title>
                        {  <Button
                            id={"idLigneV_" + idBl}
                            onClick={(e) => {
                              detailBl();
                            }}
                            className="delete btn btn-success float-right"
                          >
                            <i className="fa fa-eye" id={"idLigneV_" + idBl} />
                          </Button>}
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <div className="pdf-vs">
                        {ext.toLowerCase() === "pdf" ? (
                          <div className="visualiser">
                            <iframe
                              title="Transition"
                              width="100%"
                              height="500px"
                              src={`${fileURL}#toolbar=0`}
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
                      </div>
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

export default TelechargerFichierReleveMedical;
