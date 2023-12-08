import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import validator from "validator";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import {
  marche_concurentAdded,
  marche_concurentGetById,
  getParent,
  marche_concurentDeleted,
  verifCode,
} from "../../../Redux/marche_concurentReduce";
import { getActiveLigne } from "../../../Redux/ligneImsReduce";
import { getActiveMarche } from "../../../Redux/marcheImsReduce";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";

function AjouterMarche_concurent() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  //input
  const [designation, setDesignation] = React.useState("");
  const [pole, setPole] = React.useState("");
  const [id, setId] = React.useState(0);
  const notificationAlertRef = React.useRef(null);
  //Marché
  const [optionsMarche, setOptionsMarche] = React.useState([
    {
      value: "",
      label: "Marché",
      isDisabled: true,
    },
  ]);
  const [marcheSelect, setMarcheSelect] = React.useState({
    value: 0,
    label: "Marché",
  });
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
    var id_marche = marcheSelect.value;
    if (id_marche === 0) {
      notify("tr", "Marché doit être non vide", "danger");
    }
    if (!validator.isEmpty(designation) && parseInt(id_marche) > 0) {
      dispatch(
        marche_concurentAdded({
          designation,
          id,
          id_marche,
          pole,
        })
      ).then((e) => {
        /* if (e.payload === true) {
          if (isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success");
          else notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listeMarche_concurent();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");
        } */
      });
    }
  }

  const getMarche = useCallback(
    async (p) => {
      var type = await dispatch(getActiveMarche());
      var entities = type.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.lib });
        if (e.id === p) {
          setMarcheSelect({ value: e.id, label: e.lib });
        }
      });
      setOptionsMarche(arrayOption);
    },
    [dispatch]
  );

  useEffect(() => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var marche_concurent = await dispatch(
            marche_concurentGetById(location.id)
          );
          var entities = marche_concurent.payload;
          if (entities === false) {
            navigate("/marche_concurentList");
          } else {
            setId(location.id);
            setDesignation(entities.designation);
            setPole(entities.pole);
            resolve(entities);
          }
        } else {
          resolve(0);
        }
      }, 300);
    });

    promise.then((value) => {
      var id_marche = 0;
      if (value) {
        id_marche = value.id_marche;
      }
      getMarche(id_marche);
    });
  }, [dispatch, getMarche, location.id, navigate]);

  function listeMarche_concurent() {
    navigate("/marche_concurentList");
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
                  onClick={listeMarche_concurent}
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
                            ? "Ajouter marche concurent"
                            : "Modifier marche concurent"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Designation* </label>
                            <Form.Control
                              value={designation}
                              placeholder="Designation"
                              name="Designation"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setDesignation(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Marché* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={marcheSelect}
                              onChange={(value) => {
                                setMarcheSelect(value);
                              }}
                              options={optionsMarche}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      {/* <Row>
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
                      </Row> */}
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

export default AjouterMarche_concurent;
