import React, { useEffect } from "react";
import NotificationAlert from "react-notification-alert";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { segmentAdded, segmentGetById } from "../../../Redux/segmentReduce";
import { useDispatch } from "react-redux";
import { useParams,useNavigate } from "react-router-dom";

function AjouterSegment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  if (isNaN(location.id) === true) document.title = "Ajouter un segment";
  else  document.title = "Modifier le segment";
  const [nom, setNom] = React.useState("");
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
    if (isNaN(location.id) === true) {
      dispatch(segmentAdded({ nom, id }));
      notify("tr", "Insertion avec succes", "success");
      setTimeout(async () => {
        listeSegment();
      }, 1500);
    } else {
      dispatch(segmentAdded({ nom, id }));
      notify("tr", "Modifier avec succes", "success");
      setTimeout(async () => {
        listeSegment();
      }, 1500);
    }
  }

  useEffect(() => {
    async function getSegment() {
      if (isNaN(location.id) === false) {
        var segment = await dispatch(segmentGetById(location.id));
        var entities = segment.payload;
        if(entities === false){
          navigate('/segmentList');
        } 
        else {
          setNom(entities.nom);
          setId(location.id);
        }
      }
    }
    getSegment();
  }, [location.id,dispatch,navigate]);

  function listeSegment() {
    navigate('/segmentList');
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
                  onClick={listeSegment}
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
                            ? "Ajouter segment"
                            : "Modifier segment"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Nom * </label>
                            <Form.Control
                              defaultValue={nom}
                              placeholder="Nom"
                              type="text"
                              onChange={(value) => {
                                setNom(value.target.value);
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

export default AjouterSegment;
