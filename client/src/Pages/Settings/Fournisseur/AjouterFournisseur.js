import React, { useEffect , useCallback } from "react";
import NotificationAlert from "react-notification-alert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  fournisseurAdded,
  fournisseurGetById,
} from "../../../Redux/fournisseurReduce";
import { useDispatch } from "react-redux";
import { fetchRegions } from "../../../Redux/regionsReduce.js";
import { fetchPoles } from "../../../Redux/poleReduce.js";
import { fetchUsers } from "../../../Redux/usersReduce";
import Select from "react-select";



function AjouterFournisseur() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un Grossiste";
  else document.title = "Modifier le Grossiste";
  const [nom, setNom] = React.useState("");
  const [tva, setTva] = React.useState(0);
  const [code, setCode] = React.useState("");


  const [optionsRegion, setOptionsRegion] = React.useState([
    {
      value: "",
      label: "Region",
      isDisabled: true,
    },
  ]);
  const [regionSelect, setRegionSelect] = React.useState({
    value: 0,
    label: "Region",
  });

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



  const [optionsUser, setOptionsUser] = React.useState([
    {
      value: "",
      label: "Utilisateur",
      isDisabled: true,
    },
  ]);
  const [userSelect, setUserSelect] = React.useState({
    value: 0,
    label: "Utilisateur",
  });

  const [id, setId] = React.useState(0);

  const [idRegion, setIdRegion] = React.useState(0);
  const [idPole, setIdPole] = React.useState(0);

  const [idUser, setIdUser] = React.useState(0);


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
    var id_region = regionSelect.value;
    var id_user = userSelect.value  ; 
    var id_pole = poleSelect.value  ; 
    if (nom === "") notify("tr", "Grossiste est obligatoire", "danger");
    else {
    var id_user = userSelect.value  ; 
    dispatch(fournisseurAdded({ nom, code, tva, id , id_region , id_user , id_pole })).then((e) => {
        if (e.payload === true) {
          if (isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success");
          else notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listeFournisseur();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");
        }
      });
    }
  }



  const getRegion = useCallback(
    async (p) => {
      var regionn = await dispatch(fetchRegions());
      var entities = regionn.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.nom });
        if (e.id === p) {
          setRegionSelect({ value: e.id, label: e.nom });
        }
      });
      setOptionsRegion(arrayOption);
    },
    [dispatch]
  );


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

  const getUser = useCallback(
    async (p) => {
      var type = await dispatch(fetchUsers());
      var entities = type.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.nomU + " " + e.prenomU});
        if (e.id === p) {
          setUserSelect({ value: e.id, label: e.nomU + " " + e.prenomU});
        }
      });
      setOptionsUser(arrayOption);
    },
    [dispatch]
  );





  useEffect(() => {
   
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var fournisseur = await dispatch(fournisseurGetById(location.id));
          var entities = fournisseur.payload;
          if (entities === false) {
            navigate("/listFournisseur");
          } else {
            setNom(entities.nom);
            setCode(entities.code);
            setTva(entities.tva)
            setId(location.id);
            setIdRegion(entities.regionId);
            setIdPole(entities.poleId);
            setIdUser(entities.userId);
            resolve(entities);
          }
        } else {
          resolve(0);
        }
      }, 300);
    });

      promise.then((value) => {
      var id_region = 0;
      var id_user =  0  ; 
      var id_pole =  0  ; 
      if (value) {
        id_region = value.regionId;
        id_user = value.userId;
        id_pole = value.poleId;


      }
      getRegion(id_region);
      getUser(id_user);
      getPoles(id_pole)

    });
  }, [dispatch,getRegion,getPoles]);
 

  
  function listeFournisseur() {
    navigate("/listFournisseur");
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
                  onClick={listeFournisseur}
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
                            ? "Ajouter grossiste"
                            : "Modifier grossiste"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group className="pull-left">
                            <Form.Check className="pull-left">
                              <Form.Check.Label>
                                <Form.Check.Input
                                  type="checkbox"
                                  checked={tva === 1 ? true : false}
                                  onChange={(value) => {
                                    if (value.target.checked) {
                                      setTva(1);
                                    } else {
                                      setTva(0);
                                    }
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                <label>Tva</label>
                              </Form.Check.Label>
                            </Form.Check>
                          </Form.Group>
                        </Col>
                      </Row>
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
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Code adonix </label>
                            <Form.Control
                              defaultValue={code}
                              placeholder="Code adonix"
                              type="text"
                              onChange={(value) => {
                                setCode(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                      <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Region* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={regionSelect}
                              onChange={(value) => {
                                setRegionSelect(value);
                                
                              }}
                              options={optionsRegion}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Utilisateur* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={userSelect}
                              onChange={(value) => {
                                setUserSelect(value);
                                
                              }}
                              options={optionsUser}
                            />
                          </Form.Group>
                        </Col>
                        </Row>
                        <Row>
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

export default AjouterFournisseur;
