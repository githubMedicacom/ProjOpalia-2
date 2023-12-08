import React, { useEffect, useCallback } from "react";

import NotificationAlert from "react-notification-alert";

import { CSVReader } from "react-papaparse";
import { useDispatch } from "react-redux";
import { getActiveProduit } from "../../Redux/produitReduce";
import { getActivePharmacie } from "../../Redux/pharmacieReduce";
import { saveExcel } from "../../Redux/excelReduce";

import { Container } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { Alert } from "react-bootstrap";
const buttonRef = React.createRef();

function ImportIms() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const dispatch = useDispatch();
  const [client, setClient] = React.useState([]);
  const [produit, setProduit] = React.useState([]);
  const [noTrouver, setNoTrouver] = React.useState([]);
  const id = decoded.userauth.id;
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

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };
  //get Produit
  const getProduit = useCallback(async () => {
    var prod = await dispatch(getActiveProduit());
    var entities = prod.payload;
    /* setProduit(entities) */
    var arrayOption = {};
    entities.forEach((e) => {
      if (e.code != null) arrayOption[e.code] = { id: e.id, code: e.code };
    });
    setProduit(arrayOption);
  }, [dispatch]);

  //get pharmacie
  const getPharmacie = useCallback(async () => {
    var entities = [];
    var pharm = await dispatch(getActivePharmacie());
    entities = pharm.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      if (e.code != null) arrayOption[e.code] = { id: e.id, idIms: e.idIms };
    });
    setClient(arrayOption);
  }, [dispatch]);

  const handleOnFileLoad = (data) => {
    var array = [];
    var arraImport = {};
    var dataFormat = "";
    Object.keys(data).forEach((element) => {
      if (parseInt(element) !== 0) {
        console.log(data[element].data)
        var dateTrime = data[element].data[3];
        if (
          typeof dateTrime !== "undefined" &&
          data[element].data.length === 10
        ) {
          if (produit[data[element].data[4]] && client[data[element].data[0]]) {
            let obj = {
              produit: produit[data[element].data[4]].id,
              qte: data[element].data[7],
              mnt: data[element].data[8],
              idBl: null,
            };
            if (!arraImport[data[element].data[2]]) {
              var dataSplit = dateTrime.split("/");
              dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0];

              arraImport[data[element].data[2]] = {
                header: [
                  {
                    client: client[data[element].data[0]].id,
                    numBl: data[element].data[2],
                    numeroBL: data[element].data[2],
                    dateBl: dataFormat,
                    id_pack: 0,
                    id_gouvernorat: client[data[element].data[0]].idIms,
                    etat: 1,
                    iduser:id
                  },
                ],
                ligne: [obj],
              };
            } else {
              arraImport[data[element].data[2]]["ligne"].push(obj);
            }
          } else {
            if(!produit[data[element].data[4]]) array.push("Produit :"+data[element].data[6])
            if(!client[data[element].data[0]]) array.push("Pharmacie :"+data[element].data[1])
          }
        }
      }
    });
    console.log(arraImport)
    setNoTrouver(array)
    if (Object.keys(arraImport).length !== 0) {
      notify("tr", "Imporation avec succes", "success");
      dispatch(saveExcel({insert:arraImport}));
    } else {
      notify("tr", "Vérifier votre fichier", "danger");
    }
  };

  const handleOnError = (err) => {
    console.log(err);
  };

  const handleOnRemoveFile = () => {};

  const handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  useEffect(() => {
    getProduit();
    getPharmacie();
  }, [getProduit, getPharmacie]); //now shut up eslint
  return (
    <>
      <Container fluid>
        <h4 className="title">Import Excel</h4>
        {noTrouver.length !== 0 ? (
          <Alert variant="danger">
            {noTrouver.map((val,key)=>{
              return(<div key={"alert"+key}>{val}</div>)
            })}            
          </Alert>
        ) : ""}
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <div className="importCSV">
          <CSVReader
            ref={buttonRef}
            onFileLoad={handleOnFileLoad}
            onError={handleOnError}
            noClick
            noDrag
            onRemoveFile={handleOnRemoveFile}
          >
            {({ file }) => (
              <aside
                className="uploadCSV"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <button
                  type="button"
                  onClick={handleOpenDialog}
                  className="btn-wd btn-line float-left btn btn-info"
                >
                  Import Excel (CSV)
                </button>
                <div
                  style={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#ccc",
                    height: 45,
                    lineHeight: 2.5,
                    marginTop: 5,
                    marginBottom: 5,
                    paddingLeft: 13,
                    paddingTop: 3,
                    width: "60%",
                  }}
                >
                  {file && file.name}
                </div>
                <button
                  className="btn-wd btn-line float-left btn btn-danger"
                  onClick={handleRemoveFile}
                >
                  Supprimer
                </button>
              </aside>
            )}
          </CSVReader>
        </div>
      </Container>
    </>
  );
}

export default ImportIms;
