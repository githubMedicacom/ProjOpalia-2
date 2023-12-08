import React,{useCallback}  from "react";
import { Button, Container, Row, Col,Card } from "react-bootstrap";
import TodoList from "./TodoList.js";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { getDelegueByLine } from "../../../../Redux/usersReduce";
import { getActionById } from "../../../../Redux/actionReduce";
import { saveTodo,getTodoByAction } from "../../../../Redux/todoListReduce";
import NotificationAlert from "react-notification-alert";

function ListTodo() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  var idAction = location.id;
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idLine = decoded.userauth.line;
  var idRole = decoded.userauth.idrole;
  var idUser = decoded.userauth.id;
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
  const [nom, setNom] = React.useState("");
  const [objectif, setObjectif] = React.useState(0);
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [pack, setPack] = React.useState([]);
  const [array, setArray] = React.useState([]);

  const [optionsDelegue, setOptionsDelegue] = React.useState([
    {
      value: 0,
      label: "Delegue",
      isDisabled: true,
    },
  ]);
  //get utilisateur
  const getDelegue = useCallback(async () => {
    var utilisateur = await dispatch(getDelegueByLine(idLine));
    var entities = utilisateur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nomU + " " + e.prenomU });
    });
    setOptionsDelegue(arrayOption);
  }, [dispatch,idLine]);
  const getTodo = useCallback(async () => {
    var req = await dispatch(getTodoByAction({idAction,idUser,idRole}));
    var data = req.payload.array;
    setArray(data)
  }, [dispatch,idAction,idRole,idUser]);

  React.useEffect(() => {
    getDelegue();
    getTodo();
  }, [getDelegue,getTodo]);
  function ajoutToDo() {
    setArray([...array, []]);
  }
  async function removeToDo(key) {
    const newArray = await array.filter((val, id, array) => {
      return key !== id;  
   });
   setArray([])
   setArray(newArray)
  }
  function save() {
    dispatch(saveTodo({ array,idAction }));
    notify("tr", "Insertion avec succes", "success");
  }
  /**
   * bech na3mlo affichage lil todolist fiha list delegue w date debut w date fin
   * bil nasba super viseur yasne3 new todolist lil delegue illi teb3ini hasb action illi t5el fiha
   * bil nasba delegue bech yodherlo todolist illi 3amelhom superviseur mte3o
   **/
  function showToDo(list){
    var arrayF= [];
    list.forEach((val, key) => {
      var idDelegue = val.length !== 0 ? val[0].idDelegue : 0;
      var nomDelegue = val.length !== 0 ? val[0].nomDelegue : "Delegue";
      
      arrayF.push(<Col lg="6" md="12" key={key}>
          {parseInt(idRole) ===1?
            <div className="delegueSelect" onClick={()=>removeToDo(key)}>
              <i className="fa fa-trash"/>            
            </div>
          :<div className="div-empty"></div>}
          <div className="clearfix"></div>
          <TodoList
            list={array}
            array={val}
            setArray={setArray}
            i={key}
            idDelegue={idDelegue}
            nomDelegue={nomDelegue}
            optionsDelegue={optionsDelegue}
          ></TodoList>
          <br></br>
        </Col>)
      
    });
    return arrayF;
  }
  const getAction = useCallback(async () => {
    var action = await dispatch(getActionById(idAction));
    var result = action.payload.findAction;
    if(result.length === 0){
      setTimeout(() => {
        navigate("/listAction");
      }, 1000);
    }
    else {
      var entities = result[0];
      var dateD = new Date(entities.date_debut); // Or the date you'd like converted.
      var dateDD = new Date(dateD.getTime() - (dateD.getTimezoneOffset() * 60000)).toISOString().slice(0, 10)
      var dateF = new Date(entities.date_fin); // Or the date you'd like converted.
      var dateFF = new Date(dateF.getTime() - (dateF.getTimezoneOffset() * 60000)).toISOString().slice(0, 10)
      setNom(entities.nom);
      setObjectif(entities.objectif);
      setDateDebut(dateDD);
      setDateFin(dateFF);
      setPack(entities.libPack);
    }
  }, [dispatch,idAction,navigate]);
  React.useEffect(() => {
    getAction();
  }, [getAction]);
  function listActions() {
    navigate("/listAction");
  }
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
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
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-signature"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Nom d'objectif</p>
                      <Card.Title as="h4">{nom}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  {pack}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-bullseye"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Objectif à atteindre</p>
                      <Card.Title as="h4">{objectif}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats block-invisible">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Date debut</p>
                      <Card.Title as="h4">{dateDebut}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats block-invisible">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Date fin</p>
                      <Card.Title as="h4">{dateFin}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats block-invisible">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Body>
          {parseInt(idRole) ===1?
            <Row>
              <Col md="4" className="pr-1">
                <br></br>
                <Button
                  className="btn-fill pull-left"
                  type="button"
                  variant="info"
                  onClick={ajoutToDo}
                >
                  Ajouter nouvelle tache
                </Button>
              </Col>
            </Row>
          :<div className="div-empty"></div>}
            <br></br>
            <Row>
              {showToDo(array)}
            </Row>
            {parseInt(idRole) ===1?
            <Row>
              <Col md="12">
                <br></br>
                <Button
                  className="btn-fill pull-right"
                  type="button"
                  variant="info"
                  onClick={save}
                >
                  Enregistrer
                </Button>
              </Col>
            </Row>
            :<div className="div-empty"></div>}
            <div className="clearfix"></div>

          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default ListTodo;
