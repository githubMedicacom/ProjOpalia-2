import { Container, Row, Col, Button, Form ,Card} from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { getActionById } from "../../../../Redux/actionReduce";
import { saveMessage,getByAction } from "../../../../Redux/messageriesReduce";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import NotificationAlert from "react-notification-alert";

// core components
function Messagerie() {
  document.title = "Messagerie";
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  var idAction = location.id;
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idUser = decoded.userauth.id;
  var line = decoded.userauth.line;
  const [pack, setPack] = React.useState([]);
  const [nom, setNom] = React.useState("");
  const [objectif, setObjectif] = React.useState("");
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const notificationAlertRef = React.useRef(null);
  const [blockMsg, setBlockMsg] = React.useState([]);
  const [message, setMessage] = React.useState("");
  function submitForm() {
    var date1 = new Date(); // Or the date you'd like converted.
    var date = new Date(date1.getTime() - (date1.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    dispatch(saveMessage({ 
      text: message,
      idUser: idUser,
      idAction: idAction,
      line:line,
      nomAction:nom,
      date: date
    })).then(e=>{
      getMessage()
      getAction();
      setMessage("");

    });
    /* window.location.reload(); */
  }
  function enterKeyPressed(event) {
    if (event.charCode === 13) {
      submitForm();
      return true;
    } else {
      return false;
    }
  }
  
  const getMessage = useCallback(async () => {
    var utilisateur = await dispatch(getByAction({idAction}));
    var entities = utilisateur.payload;
    var arrayMsg = [];
    if (entities.length > 0) {
      entities.forEach((ms) => {
        var date = new Date(ms.date).toISOString().slice(0, 16).replace("T", " à ");
        arrayMsg.push(
          <div key={"msgbody" + ms.id}>
            <span className="discutions">
              <i className="nc-icon nc-stre-right"></i> 
              {ms.nomUser} {parseInt(ms.idrole)===1?"(superviseur)":"(Délégué)"} : {ms.text}
              <span className="discutions-date"> {date}</span>
            </span>
            <hr></hr>
          </div>
        );
      });
    } else {
      arrayMsg.push(
        <div key={"msgbody"}>
          <span className="discutions">Aucun message</span>
          <hr></hr>
        </div>
      );
    }
    setBlockMsg(arrayMsg);
  }, [dispatch,idAction]);
  const getAction = useCallback(async () => {
    var action = await dispatch(getActionById(idAction));
    /* var entities = utilisateur.payload[0]; */
    var result = action.payload
    if(result.length === 0){
      setTimeout(() => {
        navigate("/listAction")
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

  useEffect(() => {
    getMessage()
    getAction();
  }, [getMessage,getAction]);
  function listActions() {
    navigate("/listAction")
    /* window.location.replace("/listAction"); */
  }

  return (
    <>
      <Container fluid className="messagerie">
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <h1 className="title text-center">Messagerie</h1>
        <br></br>
        <Row>
          <Col md="12">
            <Button
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
          <Col lg="4" sm="6">
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
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  {pack}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" sm="6">
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
          <Col lg="4" sm="6">
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
        <Row>
          <Col md="12">
            <div className="panel panel-default">
              <div className="panel-heading">{nom}</div>
              <div className="panel-body">{blockMsg}</div>
              <Form.Group className="input-msg">
                <Form.Control
                  autoFocus
                  value={message}
                  onKeyPress={enterKeyPressed}
                  placeholder="Message"
                  /* id={"message" + val.id} */
                  type="text"
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                ></Form.Control>
                <Button
                  className=""
                  type="button"
                  variant="info"
                  onClick={(val) => {
                    submitForm();
                  }}
                >
                  <i className="nc-icon nc-send"></i>
                </Button>
                <div className="clear"></div>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Messagerie;
