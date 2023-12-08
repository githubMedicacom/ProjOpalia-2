import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
import { ExcelRenderer } from "react-excel-renderer";
import {  itmAdded,  saveFile} from "../../Redux/itmReduce";
import { useDispatch } from "react-redux";
import { Alert } from "react-bootstrap";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import "cropperjs/dist/cropper.css";

function ItmExcel() {
  /* const str = "Karray-feěvrier-2023.xlsx";
  console.log(str.replace(/[^a-zA-Z0-9,;\-.!? ]/g, ''),str); */
  var date = new Date().getFullYear();
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
  const dispatch = useDispatch();
  const anneeLocal =localStorage.getItem("annee");
  const [titre, setTitre] = React.useState("");
  const [type, setType] = React.useState({});
  const [mois, setMois] = React.useState({});


  //table body
  const [uploadFile, setUploadFile] = React.useState();
  const [typeSelect, setTypeSelect] = React.useState([]);
  const [optionType] = React.useState([
    {
      value: "",
      label: "Type",
      isDisabled: true,
    },
    {
      value: "1",
      label: "Current",
    },
    {
      value: "2",
      label: "Fin mois",
    }
  ]);
  const [optionsMois] = React.useState([
    {
      value: "",
      label: "Mois",
      isDisabled: true,
    },
    { value: "01", label: "janvier" },
    { value: "02", label: "février" },
    { value: "03", label: "mars" },
    { value: "04", label: "avril" },
    { value: "05", label: "mai" },
    { value: "06", label: "juin" },
    { value: "07", label: "juillet" },
    { value: "08", label: "août" },
    { value: "09", label: "septembre" },
    { value: "10", label: "octobre" },
    { value: "11", label: "novembre" },
    { value: "12", label: "décembre" },
  ]);

  /** start crop img**/
  const [fileName, setFileName] = useState("");

  const fileHandler = (e) => {
    let fileObj = e.target.files[0];
    if (fileObj) {
      
        setUploadFile(fileObj);
        var str = fileObj.name.replace(/[^a-zA-Z0-9,;\-.!? ]/g, "");
        setFileName(str);
        //just pass the fileObj as parameter
      
      
    }
  };
  const saveTable = useCallback(
    async ( uploadFile ,type,titre,mois) => {
      var verif = true;
      const dataArray = new FormData();
      dataArray.append("file", uploadFile);
      dataArray.append("name", uploadFile.name);
      if (uploadFile) {
        dispatch(saveFile(dataArray)).then((e) => {
          var filename = e.payload.filename;
          dispatch(
            itmAdded({type:type.value,titre:titre,mois:mois.value,annee:anneeLocal,file:filename })
            ).then((e) => {
              if (e.payload === true) {
                notify("tr", "Insertion avec succes", "success");
                setTimeout(() => {
                  window.location.reload();
                }, 1300);
              } else {
                notify("tr", "Vérifier vos données!", "danger");
              }
            })
         })
        }
    },
    [dispatch]
  );

  

 

  return (
    <>
      <Container fluid className="responsive-BL table-dynamique releve-class">   
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Itm</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row> 
                  <Col className="pr-1" md="3">
                          <Form.Group>
                            <label>Titre * </label>
                            <Form.Control
                              defaultValue={titre}
                              placeholder="titre"
                              type="text"
                              onChange={(value) => {
                                setTitre(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                    </Col>
                    
                   <Col md="2">
                      <span>Mois * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="mois"
                        value={mois}
                        onChange={(value) => {
                          setMois(value);
                        }}
                        options={optionsMois}
                        placeholder="Mois"
                      />
                      <br></br>
                  </Col>
                  <Col md="3">
                      <span>Type * </span>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="Type"
                        placeholder="Type"
                        value={type}
                        onChange={(v) => {
                          setType(v);
                        }}
                        options={optionType}
                      />
                    </Col>
                    
                </Row>
                <div className="text-center">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroupFileAddon01"
                        >
                          Import fichier
                        </span>
                      </div>
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile01"
                          aria-describedby="inputGroupFileAddon01"
                          onChange={(e) => {
                            fileHandler(e);
                          }}
                        />
                        <label className="custom-file-label">{fileName}</label>
                      </div>
                    </div>
                 
               
                  <br />
                  <Button
                    className="btn-wd btn-outline mr-1 float-right extraction"
                    id="blExt"
                    type="button"
                    variant="info"
                    onClick={(v) => {
                      saveTable(uploadFile,type,titre,mois);
                    }}
                  >
                    <span className="btn-label">
                      <i className="fas fa-cogs"></i>
                    </span>
                    Enregistrer
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default ItmExcel;
