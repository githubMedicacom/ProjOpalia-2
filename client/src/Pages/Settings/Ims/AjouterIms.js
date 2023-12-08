import React, { useEffect } from "react";
import NotificationAlert from "react-notification-alert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams,useNavigate } from "react-router-dom";
import { imsAdded, imsGetById } from "../../../Redux/imsReduce";
import { useDispatch } from "react-redux";

function AjouterIms() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter Bricks";
  else  document.title = "Modifier Bricks";
  const [libelle, setLibelle] = React.useState("");
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
  function submitForm() {
    if(libelle === "")      
      notify("tr", "BRICKS est obligatoire", "danger");
    else {
      dispatch(imsAdded({ libelle, id })).then(e=>{
        if(e.payload ===true){
          if(isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success")
          else  
            notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listeIms();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");          
        }
      });
    }
  }

  useEffect(() => {
    async function getIms() {
      if (isNaN(location.id) === false) {
        var ims = await dispatch(imsGetById(location.id));
        var entities = ims.payload;
        if(entities === false){
          navigate('/bricksList');
        }
        else{
          setLibelle(entities.libelle);
          setId(location.id);
        }
      }
    }
    getIms();
  }, [location.id,dispatch,navigate]);

  function listeIms() {
    navigate('/bricksList');
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
                  onClick={listeIms}
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
                          { typeof location.id == "undefined" ? "Ajouter Bricks" : "Modifier Bricks" }
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Bricks * </label>
                            <Form.Control
                              defaultValue={libelle}
                              placeholder="Bricks"
                              type="text"
                              onChange={(value) => {
                                setLibelle(value.target.value);
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

export default AjouterIms;
