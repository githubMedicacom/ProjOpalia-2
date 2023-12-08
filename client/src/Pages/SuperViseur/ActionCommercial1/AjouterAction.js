import React,{useCallback,useEffect} from "react";

import Select from "react-select";

import NotificationAlert from "react-notification-alert";
import { getActivePack } from "../../../Redux/packReduce";
import { actionAdded } from "../../../Redux/actionReduce";
import { fetchLigneIms } from "../../../Redux/ligneImsReduce";
import validator from "validator";
import { useParams,useNavigate } from "react-router-dom";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
function AjouterProduit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  const [nom, setNom] = React.useState("");
  const [objectif, setObjectif] = React.useState("");
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [pack, setPack] = React.useState([]);
  const [idLine, setIdLine] = React.useState({value: 0,label: "Ligne"});
  const [id] = React.useState(0);
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
  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Pack",
      isDisabled: true,
    },
  ]);
  const [optionLigne, setOptionLigne] = React.useState([
    {
      value: 0,
      label: "Ligne",
      isDisabled: true,
    },
  ]);
  const getPack = useCallback(async () => {
    var pack = await dispatch(getActivePack());
    var entities = pack.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      if(e.id!==0)
        arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptions(arrayOption);
  }, [dispatch]);

  const getLigne = useCallback(
    async () => {
      var superviseur = await dispatch(fetchLigneIms());
      var entities = superviseur.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.nom });
      });
      setOptionLigne(arrayOption);
    },
    [dispatch]
  );
  function listActions() {
    navigate('/listAction');
    /* window.location.replace("/listAction"); */
  }
  function submitForm(event) {
    
    var required = document.getElementsByClassName("required");
    for (var i = 0; i < required.length+1; i++) {  
      if(required[i] !== undefined){
        document.getElementsByClassName("error")[i].innerHTML="";  
        //condition required      
        if (validator.isEmpty(required[i].value)) {
          document.getElementsByClassName("error")[i].innerHTML=required[i].name+" est obligatoire";
          notify("tr", required[i].name + " doit être non vide", "danger");     
        }
      }
    }
    if(pack.length === 0) {
      notify("tr", "Il faut selection au moin un pack", "danger"); 
    }
    if(idLine.value === 0) {
      notify("tr", "Il faut selection au moin une ligne", "danger"); 
    }
    if(parseInt(objectif) === 0) {
      notify("tr", "Objectif doit etre superieur à 0", "danger"); 
    }
    var valLine = idLine.value ;
    if (
      !validator.isEmpty(nom) &&
      !validator.isEmpty(objectif) &&
      parseInt(objectif) !== 0 && 
      !validator.isEmpty(dateDebut) &&
      !validator.isEmpty(dateFin) &&
      (pack.length !== 0)&&
      (idLine.value !== 0)
    ){
      dispatch(actionAdded({ pack,nom,valLine, objectif, dateDebut, dateFin, id }));
      notify("tr", "Insertion avec succes", "success");
      setTimeout(async () => {
        listActions();
      }, 1500);

    }
  }

  useEffect(() => {
    getPack();
    getLigne()
  }, [getPack,getLigne]);
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <div>
          <Container>
            <Row>
              <Col md="12">
                <Button
                  id="saveBL"
                  className="btn-wd btn-outline mr-1 float-left"
                  type="button"
                  variant="info"
                  onClick={listActions}
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
                        <Card.Title as="h4">{typeof location.id == "undefined" ? "Ajouter nouvelle action" : "Modifier action"}</Card.Title>

                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Nom action* </label>
                            <Form.Control
                              className="required"
                              defaultValue={nom}
                              placeholder="Nom"
                              name="nom action"
                              type="text"
                              onChange={(value) => { setNom(value.target.value); }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Objectif* </label>
                            <Form.Control
                              className="required"
                              defaultValue={objectif}
                              placeholder="Objectif"
                              type="number"
                              name="Objectif"
                              onChange={(value) => { setObjectif(value.target.value); }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6" className="pr-1">
                          <label>Date debut*</label>
                            <Form.Control
                              className="required"
                              defaultValue={dateDebut}
                              placeholder="Date debut"
                              type="date"
                              name="Date debut"
                              onChange={(value) => { setDateDebut(value.target.value); }}
                            ></Form.Control>
                            <div className="error"></div>
                        </Col>
                        <Col md="6" className="pl-1">
                          <label>Date fin*</label>
                            <Form.Control
                              className="required"
                              defaultValue={dateFin}
                              placeholder="Date fin"
                              type="date"
                              name="Date fin"
                              onChange={(value) => { setDateFin(value.target.value); }}
                            ></Form.Control>
                            <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6" className="pr-1">
                          <label>Pack*</label>
                          <Select 
                            isMulti
                            className="react-select primary"
                            classNamePrefix="react-select"
                            name="singleSelect"
                            value={pack}
                            onChange={(value) => { setPack(value); }}
                            options={options}
                            placeholder="Pack"
                          />
                          <br></br>
                        </Col>
                        <Col md="6" className="pl-1">
                          <label>Ligne*</label>
                          <Select 
                            className="react-select primary"
                            classNamePrefix="react-select"
                            name="singleSelect"
                            value={idLine}
                            onChange={(value) => { setIdLine(value); }}
                            options={optionLigne}
                            placeholder="Ligne"
                          />
                          <br></br>
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

export default AjouterProduit;
