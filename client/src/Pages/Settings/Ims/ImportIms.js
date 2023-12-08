import React,{useEffect,useCallback} from "react";

import NotificationAlert from "react-notification-alert";

import SweetAlert from "react-bootstrap-sweetalert";

import { CSVReader } from 'react-papaparse';
import Select from "react-select";
import { useDispatch } from "react-redux";

import {
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { addcsvims,getDetailsims,deleteDetailIms,getLastDetail } from "../../../Redux/imsReduce";
// core components
import ReactTable from "../../../components/ReactTable/ReactTable.js";

const buttonRef = React.createRef();

// core components

function ImportIms() {
  var anneeLocal =localStorage.getItem("annee");
  document.title = "Importer IMS";
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
  const [alert, setAlert] = React.useState(null);
  const confirmMessage = (id,nb) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes Vous sure de supprimer cette ligne?"
        onConfirm={() => deleteDetail(id,nb)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const [mois, setMois] = React.useState(null);
  const [lastDate, setLastDate] = React.useState(null);
  const [optionsMois] = React.useState([
    {
      value: "",
      label: "Mois",
      isDisabled: true,
    },
    { value: 0, label: "Tous" },
    { value: 1, label: "janvier" },
    { value: 2, label: "février" },
    { value: 3, label: "mars" },
    { value: 4, label: "avril" },
    { value: 5, label: "mai" },
    { value: 6, label: "juin" },
    { value: 7, label: "juillet" },
    { value: 8, label: "août" },
    { value: 9, label: "septembre" },
    { value: 10, label: "octobre" },
    { value: 11, label: "novembre" },
    { value: 12, label: "décembre" },
  ]);
  const [data, setData] = React.useState([]);

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    var arraImport = [];
    var dataFormat = "";
    Object.keys(data).forEach(element => { 
      if (element !== 0) {
        var dateTrime = data[element].data[5];
        if(typeof dateTrime !== "undefined" && data[element].data.length ===6){
          var dataSplit = dateTrime.split("/");
          dataFormat = dataSplit[2] + "-" + dataSplit[1] + "-" + dataSplit[0];
          arraImport.push({
            ims: data[element].data[0],
            chef_produit: data[element].data[1],
            produit: data[element].data[2],
            volume: data[element].data[3],
            total: data[element].data[4],
            date: dataFormat,
          })
        }
      }
    });
    if(arraImport.length !== 0){
      notify("tr", "Imporation avec succes", "success");
      dispatch(addcsvims(arraImport));
    }
    else {
      notify("tr", "Donné invalide", "danger");
    }
  };

  const handleOnError = (err) => {
    console.log(err);
  };

  const handleOnRemoveFile = () => {
  };

  const handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  const getDetail = useCallback(async (mois,anneeLocal) => {
    var details = await dispatch(getDetailsims({
      year: parseInt(anneeLocal),
      month: mois.value
    }));
    setData(details.payload);
  }, [dispatch,data]); 

  const getLast = useCallback(async () => {
    var last = await dispatch(getLastDetail());
    var array = await last.payload;
    var date = await (array.date);
    var newDate ="";
    if(date!=="")
      newDate = await new Date(date).toISOString().slice(0, 10).replace("T", "");
    setLastDate(newDate)
  }, [dispatch]); 

  const deleteDetail = useCallback((id,nb) => {
    data.splice(nb, 1);
    setData(data);
    dispatch(deleteDetailIms(id));
    hideAlert()
  }, [dispatch,data]);
  useEffect(() => {
    getLast()
  }, [getLast]) //now shut up eslint
  return (
    <>
      {alert}
      <Container fluid>
        <h4 className="title">Import IMS 
          <div className="lastDate">Date de dernière insertion : {lastDate}</div>
        </h4>
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
              <aside className="uploadCSV"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 10,
                }}
              >
                <button
                  type="button"
                  onClick={handleOpenDialog}
                  className="btn-wd btn-line float-left btn btn-info"
                >
                  Importer données IMS (CSV)
                </button>
                <div
                  style={{
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: '#ccc',
                    height: 45,
                    lineHeight: 2.5,
                    marginTop: 5,
                    marginBottom: 5,
                    paddingLeft: 13,
                    paddingTop: 3,
                    width: '60%',
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
        <Row>
          <Col md="4" className="pr-1">
            <label htmlFor="exampleInputEmail1">
              Mois
            </label>
            <Select
              className="react-select primary"
              classNamePrefix="react-select"
              name="singleSelect"
              value={mois}
              onChange={(value) => { setMois(value); getDetail(value,anneeLocal); }}
              options={optionsMois}
              placeholder="Mois"
            />
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "IMS",
                      accessor: "ims.libelle",
                    },
                    {
                      Header: "chef_produit",
                      accessor: "chef_produit",
                    },
                    {
                      Header: "produit",
                      accessor: "produit",
                    },
                    {
                      Header: "volume",
                      accessor: "volume",
                    },
                    {
                      Header: "total",
                      accessor: "total",
                    },
                    {
                      Header: "date",
                      accessor: "date",
                      Cell: ({ cell }) => (new Date(cell.row.values.date).toISOString().slice(0, 10)),
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              confirmMessage(data[cell.row.id].id,cell.row.id)
                            }}
                            variant="warning"
                            size="sm"
                            className="text-danger btn-link edit"
                          >
                            <i className="fa fa-trash" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {
                  data.length === 0 ? <div className="text-center">Aucun donnée trouvé</div> : ""
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ImportIms;
