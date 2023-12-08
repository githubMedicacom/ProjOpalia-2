import React, { useEffect } from "react";
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { settingsUpdated, getSettings } from "../Redux/settingsReduce";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
function Settings() {
  const dispatch = useDispatch(); 
  var token = localStorage.getItem("x-access-token");
  const location = useParams();
  //input
  const [icon, setIcon] = React.useState(null);
  const [iconUrl, setIconUrl] = React.useState("");
  const [iconBD, setIconBD] = React.useState(false);
  const [logo, setLogo] = React.useState("");
  const [logoBD, setLogoBD] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState("");
  const [name, setName] = React.useState("");
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
    var logoName=logo;
    const dataArray = new FormData();
    if(typeof logo !== "string") {
    dataArray.append("image", logo);
    dataArray.append("name", logo.name); 
    logoName=logo.name;
    }
      
    const iconArray = new FormData(); 
    if(typeof icon !== "string") {
      iconArray.append("icon", icon);
      iconArray.append("iconname", "favicon.ico");
    }

    var settingsObj = {icon:"favicon.ico",logo:logoName,name:name}
    notify("tr", "Modifier avec succes", "success");
    dispatch(settingsUpdated({ dataArray, iconArray,settingsObj }));
  }

  useEffect(() => {
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        var Settings = await dispatch(getSettings(1));
        var entities = await Settings.payload;
        resolve(entities);
      }, 200);
    });

    promise.then((value) => {
        setName(value.name)
        setLogo(value.logo)
        setIcon(value.icon)
        setLogoBD(true)
        setIconBD(true)
    });
  }, [location.id, dispatch, token]);

  const uploadIcon= (acceptedFiles) => {
    setIconBD(false)
    setIcon(acceptedFiles[0]);
    setIconUrl(URL.createObjectURL(acceptedFiles[0]));
  } 

  const uploadLogo = (acceptedFiles) => {
    setLogoBD(false)
    setLogo(acceptedFiles[0]);
    setLogoUrl(URL.createObjectURL(acceptedFiles[0]));
  };
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
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">Paramètre d'application</Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Title* </label>
                            <Form.Control
                              defaultValue={name}
                              placeholder="Title"
                              name="Title"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setName(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <div className="App">
                            <Dropzone onDrop={uploadLogo}>
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  {...getRootProps({
                                    className: "dropzone",
                                  })}
                                >
                                  <input {...getInputProps()} />                            
                                  <p>
                                    {logoUrl !==""?<img src={logoUrl} className="imgUpload" alt="imgUpload" /> : 
                                    logoBD !== false && logo!=="" ? <img src={require("../assets/img/"+logo).default} alt="imgUpload" className="imgUpload" />:
                                      "Il y a aucun logo selectionner"} 
                                  </p>
                                  <p>Choisissez un logo</p>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        </Col>
                        <Col className="pr-1" md="6">
                          <div className="App">
                            <Dropzone onDrop={uploadIcon} accept="image/x-icon">
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  {...getRootProps({
                                    className: "dropzone",
                                  })}
                                >
                                  <input {...getInputProps()} />
                                  <p>
                                    {iconUrl !== "" ? 
                                      <img src={iconUrl} className="iconeUpload" alt="iconeUpload"/>:
                                      iconBD !== false && icon !==""? <img src={require("../assets/img/"+icon).default} alt="iconeUpload" className="iconeUpload" />:
                                      "Il y a aucun icone selectionner"} 
                                  </p>
                                  <p>Choisissez une icône</p>
                                </div>
                              )}
                            </Dropzone>
                          </div>
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

export default Settings;
