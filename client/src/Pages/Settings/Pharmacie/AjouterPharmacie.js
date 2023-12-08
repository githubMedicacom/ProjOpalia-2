import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import validator from "validator";
import Select from "react-select";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  pharmacieAdded,
  pharmacieGetById,
  getPharmacieByNum,
} from "../../../Redux/pharmacieReduce";
import { getActiveIms } from "../../../Redux/imsReduce";
import { fetchSegment } from "../../../Redux/segmentReduce";
import { useDispatch } from "react-redux";

function AjouterPharmacie() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un pharmacie";
  else document.title = "Modifier le pharmacie";
  const [nom, setNom] = React.useState("");
  const [adresse, setAdresse] = React.useState("");
  const [code, setCode] = React.useState("");
  const [lng, setLng] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [idIms, setIdIms] = React.useState(0);
  const [telephone, setTelephone] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [id, setId] = React.useState(0);

  const [optionsIms, setOptionsIms] = React.useState([
    {
      value: "",
      label: "Bricks",
      isDisabled: true,
    },
  ]);
  const [imsSelect, setImsSelect] = React.useState({
    value: 0,
    label: "Bricks",
  });

  const [optionsSegment, setOptionsSegment] = React.useState([
    {
      value: "",
      label: "Segment",
      isDisabled: true,
    },
  ]);
  const [segmentSelect, setSegmentSelect] = React.useState({
    value: 0,
    label: "Segment",
  });
  const [idSegment, setIdSegment] = React.useState(0);

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
    var required = document.getElementsByClassName("required");
    for (var i = 0; i < required.length + 1; i++) {
      if (required[i] !== undefined) {
        document.getElementsByClassName("error")[i].innerHTML = "";
        //condition required
        if (validator.isEmpty(required[i].value)) {
          document.getElementsByClassName("error")[i].innerHTML =
            required[i].name + " est obligatoire";
          notify("tr", required[i].name + " doit être non vide", "danger");
        }
      }
    }

    if (idIms === 0) {
      notify("tr", "Bricks doit être non vide", "danger");
    }

    var testCode = true;
    if (code === "" || code === null) testCode = false;

    if (!testCode) {
      notify("tr", "Code doit être non vide", "danger");
    }
    if (
      !validator.isEmpty(nom) &&
      testCode === true &&
      parseInt(idIms) > 0
    ) {
      dispatch(getPharmacieByNum({ id: id, code: code })).then((e) => {
        if (e.payload !== true) {
          dispatch(
            pharmacieAdded({
              nom,
              adresse,
              idIms,
              telephone,
              email,
              id,
              code,
              lng,
              lat,
              idSegment,
            })
          ).then((e) => {
            if (e.payload === true) {
              if (isNaN(location.id) === true)
                notify("tr", "Insertion avec succes", "success");
              else notify("tr", "Modifier avec succes", "success");
              setTimeout(async () => {
                listePharmacie();
              }, 1500);
            } else {
              notify("tr", "Problème de connexion", "danger");
            }
          });
        } else {
          notify("tr", "Code existe déjà ", "danger");
        }
      });
    }
  }

  const getIms = useCallback(
    async (p) => {
      var type = await dispatch(getActiveIms());
      var entities = type.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.libelle });
        if (e.id === p) {
          setImsSelect({ value: e.id, label: e.libelle });
        }
      });
      setOptionsIms(arrayOption);
    },
    [dispatch]
  );

  const getSegment = useCallback(
    async (p) => {
      var type = await dispatch(fetchSegment());
      var entities = type.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.nom });
        if (e.id === p) {
          setSegmentSelect({ value: e.id, label: e.nom });
        }
      });
      setOptionsSegment(arrayOption);
    },
    [dispatch]
  );

  useEffect(() => {
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var produit = await dispatch(pharmacieGetById(location.id));
          var entities = produit.payload;
          if (entities === false) {
            navigate("/listPharmacie");
          } else {
            setId(location.id);
            setAdresse(entities.adresse);
            setEmail(entities.email);
            setTelephone(entities.telephone);
            setNom(entities.nom);
            setIdIms(entities.idIms);
            setIdSegment(entities.id_segment);
            setCode(entities.code);
            setLat(entities.lat);
            setLng(entities.lng);
            resolve(entities);
          }
        } else {
          resolve(false);
        }
      }, 300);
    });

    promise.then((value) => {
      var i = 0;
      var s = 0;
      if (value) {
        i = value.idIms;
        s = value.id_segment;
      }
      getIms(i);
      getSegment(s);
    });
  }, [location.id, dispatch, getIms, navigate]);

  function listePharmacie() {
    navigate("/listPharmacie");
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
                  onClick={listePharmacie}
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
                            ? "Ajouter pharmacie"
                            : "Modifier pharmacie"}
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
                              placeholder="pharmacie"
                              type="text"
                              name="nom"
                              className="required"
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Adressee </label>
                            <Form.Control
                              value={adresse}
                              placeholder="adresse"
                              type="text"
                              name="adresse"
                              onChange={(value) => {
                                setAdresse(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Téléphone </label>
                            <Form.Control
                              defaultValue={telephone}
                              placeholder="telephone"
                              type="text"
                              onChange={(value) => {
                                setTelephone(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Email </label>
                            <Form.Control
                              defaultValue={email}
                              placeholder="email"
                              type="email"
                              onChange={(value) => {
                                setEmail(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Latitudee</label>
                            <Form.Control
                              defaultValue={lat}
                              placeholder="Latitude"
                              type="text"
                              onChange={(value) => {
                                setLat(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Longitude</label>
                            <Form.Control
                              defaultValue={lng}
                              placeholder="Longitude"
                              type="text"
                              onChange={(value) => {
                                setLng(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Briks* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={imsSelect}
                              onChange={(value) => {
                                setImsSelect(value);
                                setIdIms(value.value);
                              }}
                              options={optionsIms}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Code OneKey* </label>
                            <Form.Control
                              defaultValue={code}
                              placeholder="Code OneKey"
                              type="text"
                              name="Code OneKey"
                              onChange={(value) => {
                                setCode(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Segment* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={segmentSelect}
                              onChange={(value) => {
                                setSegmentSelect(value);
                                setIdSegment(value.value);
                              }}
                              options={optionsSegment}
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

export default AjouterPharmacie;
