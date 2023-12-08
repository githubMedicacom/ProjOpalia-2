import React, { useEffect , useCallback } from "react";
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  marcheImsAdded,
  marcheImsGetById,
} from "../../../Redux/marcheImsReduce";
import { fetchPoles } from "../../../Redux/poleReduce.js";
import Select from "react-select";



import { useDispatch } from "react-redux";

function AjouterMarcheIms() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un marché";
  else document.title = "Modifier le marché";
  const [lib, setLib] = React.useState("");
  const [pole, setPole] = React.useState("");
  const [afficher, setAfficher] = React.useState(0);
  const [id, setId] = React.useState(0);


  const [optionsPole, setOptionsPole] = React.useState([
    {
      value: "",
      label: "Pole",
      isDisabled: true,
    },
  ]);
  const [poleSelect, setPoleSelect] = React.useState({
    value: 0,
    label: "Pole",
  });
  const [idPole, setIdPole] = React.useState(0);


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
    var id_pole = poleSelect.value  ; 
    if (lib === "") notify("tr", "Marché est obligatoire", "danger");
    else {
      dispatch(marcheImsAdded({ lib, afficher, pole, id ,id_pole})).then((e) => {
        if (e.payload === true) {
          if (isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success");
          else notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listeMarcheIms();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");
        }
      });
    }
  }

  const getPoles = useCallback(
    async (p) => {
      var poless = await dispatch(fetchPoles());
      var entities = poless.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.nom });
        if (e.id === p) {
          setPoleSelect({ value: e.id, label: e.nom });
        }
      });
      setOptionsPole(arrayOption);
    },
    [dispatch]
  );

  // useEffect(() => {
  //   async function getMarcheIms() {
  //     if (isNaN(location.id) === false) {
  //       var marcheIms = await dispatch(marcheImsGetById(location.id));
  //       var entities = marcheIms.payload;
  //       if (entities === false) {
  //         navigate("/listMarcheIms");
  //       } else {
  //         setLib(entities.lib);
  //         setAfficher(entities.afficher);
  //         setPole(entities.pole);
  //         setId(location.id);
  //       }
  //     }
  //   }
  //   getMarcheIms();
  // }, [location.id, dispatch, navigate]);

  useEffect(() => {
   
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var marcheIms = await dispatch(marcheImsGetById(location.id));
          var entities = marcheIms.payload;
          if (entities === false) {
            navigate("/listFournisseur");
          } else {
            setLib(entities.lib);
            setAfficher(entities.afficher);
            setPole(entities.pole);
            setId(location.id);
            setIdPole(entities.poleId);
            resolve(entities);
          }
        } else {
          resolve(0);
        }
      }, 300);
    });

      promise.then((value) => {
      var id_pole =  0  ; 
      if (value) {
       
        id_pole = value.poleId;

      }
      getPoles(id_pole)

    });
  }, [location.id, dispatch, navigate]);
 

  function listeMarcheIms() {
    navigate("/listMarcheIms");
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
                  onClick={listeMarcheIms}
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
                            ? "Ajouter marché"
                            : "Modifier marché"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Marché * </label>
                            <Form.Control
                              defaultValue={lib}
                              placeholder="Marché"
                              type="text"
                              onChange={(value) => {
                                setLib(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <br></br>

                          <Form.Group className="pull-left">
                            <Form.Check className="pull-right">
                              <Form.Check.Label>
                                <Form.Check.Input
                                  type="checkbox"
                                  checked={afficher === 1 ? true : false}
                                  onClick={(value) => {
                                    if (value.target.checked) {
                                      setAfficher(1);
                                    } else {
                                      setAfficher(0);
                                    }
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                <label>Afficher</label>
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Pôle* </label>
                            <Form.Control
                              value={pole}
                              placeholder="Pôle"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setPole(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Pole* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={poleSelect}
                              onChange={(value) => {
                                setPoleSelect(value);
                                
                              }}
                              options={optionsPole}
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

export default AjouterMarcheIms;
