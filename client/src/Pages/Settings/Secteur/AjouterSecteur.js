import React, { useEffect,useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { secteurAdded, secteurGetById,getSecteurIms } from "../../../Redux/secteurReduce";
import { getActiveIms } from "../../../Redux/imsReduce";
import Select from "react-select";
import { useParams,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function AjouterSecteur() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un marché";
  else  document.title = "Modifier le marché";
  const [libelleSect, setLibelleSect] = React.useState("");
  const [id, setId] = React.useState(0);

  const [optionsIms, setOptionsIms] = React.useState([
    {
      value: "",
      label: "Bricks",
      isDisabled: true,
    },
  ]);
  const [imsSelect, setImsSelect] = React.useState([]);

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
    if(libelleSect === "" || imsSelect.length === 0)      
      notify("tr", "Vérifier vos donnée", "danger");
    else {
      dispatch(secteurAdded({ libelleSect, id,imsSelect })).then(e=>{
        if(e.payload ===true){
          if(isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success")
          else  
            notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listeSecteur();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");          
        }
      });
    }
  }
  const getIms = useCallback(async () =>{  
    var type = await dispatch(getActiveIms());  
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.libelle });
    });
    setOptionsIms(arrayOption);
  }, [dispatch])

  useEffect(() => {
    async function getSecteur() {
      if (isNaN(location.id) === false) {
        var secteur = await dispatch(secteurGetById(location.id));
        var secteurIms = await dispatch(getSecteurIms(location.id));
        setImsSelect(secteurIms.payload.arrayOption);
        var entities = secteur.payload;
        if(entities === false){
          navigate('/listSecteur');
        } 
        else {
          setLibelleSect(entities.libelleSect);
          setId(location.id);
        }
      } 
      getIms();
    }
    getSecteur();
  }, [location.id,dispatch,getIms,navigate]);

  function listeSecteur() {
    navigate('/listSecteur');
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
                  onClick={listeSecteur}
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
                          { typeof location.id == "undefined" ? "Ajouter secteur" : "Modifier secteur" }
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Secteur * </label>
                            <Form.Control
                              defaultValue={libelleSect}
                              placeholder="Secteur"
                              type="text"
                              onChange={(value) => {
                                setLibelleSect(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Briks* </label>
                            <Select
                              isMulti
                              placeholder="Choisir un ou plusieurs Bricks"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={imsSelect}
                              onChange={(value) => {
                                setImsSelect(value);
                              }}
                              options={optionsIms}
                            />
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

export default AjouterSecteur;
