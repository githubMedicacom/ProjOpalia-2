import React, { useEffect } from "react";
import NotificationAlert from "react-notification-alert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { tvaAdded, tvaGetById } from "../../../Redux/tvaReduce";
import { useDispatch } from "react-redux";

function AjouterTva() {
  var year = new Date().getFullYear();
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un Tva";
  else document.title = "Modifier le Tva";
  const [tva, setTva] = React.useState("");
  const [annee, setAnnee] = React.useState(year);
  const [id, setId] = React.useState(0);

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
  function submitForm(event) {
    if (tva === "") notify("tr", "Tva est obligatoire", "danger");
    else {
      dispatch(tvaAdded({ tva, annee, id })).then((e) => {
        if (e.payload === true) {
          if (isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success");
          else notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listeTva();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");
        }
      });
    }
  }

  useEffect(() => {
    async function getTva() {
      if (isNaN(location.id) === false) {
        var res = await dispatch(tvaGetById(location.id));
        var entities = res.payload;
        if (entities === false) {
          navigate("/listTva");
        } else {
          setAnnee(entities.annee);
          setTva(entities.tva);
          setId(location.id);
        }
      }
    }
    getTva();
  }, [location.id, dispatch, navigate]);

  function listeTva() {
    navigate("/listTva");
  }
  return (
    <>
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
                  onClick={listeTva}
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
                        <Card.Title as="h4">
                          {typeof location.id == "undefined"
                            ? "Ajouter tva"
                            : "Modifier tva"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Tva * </label>
                            <Form.Control
                              value={tva}
                              placeholder="Tva"
                              type="text"
                              onChange={(value) => {
                                setTva(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Annee * </label>
                            <Form.Control
                              value={annee}
                              placeholder="Annee"
                              type="text"
                              onChange={(value) => {
                                setAnnee(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
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

export default AjouterTva;
