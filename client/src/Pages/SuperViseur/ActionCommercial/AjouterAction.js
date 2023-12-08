import React, { useCallback, useEffect , useState } from "react";

import Select from "react-select";

import NotificationAlert from "react-notification-alert";
import { getActivePack } from "../../../Redux/packReduce";
import { actionAdded } from "../../../Redux/actionReduce";
import { fetchSegment } from "../../../Redux/segmentReduce";
import { getActiveLigne } from "../../../Redux/ligneImsReduce";
import validator from "validator";
import { useParams, useNavigate } from "react-router-dom";
import { getActiveProduit } from "../../../Redux/produitReduce";
import ReactTable from "../../../components/ReactTable/ReactTableBl.js";

import SweetAlert from "react-bootstrap-sweetalert";



// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";

function AjouterProduit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  const [nom, setNom] = React.useState("");
  const [objectif, setObjectif] = React.useState(0);
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [pack, setPack] = React.useState([]);
  const [unite_amc, setUnite_amc] = React.useState(0);
  const [unite_amm, setUnite_amm] = React.useState(0);
  const [unite_boni_amc, setUniteBoni_amc] = React.useState(0);
  const [unite_boni_amm, setUniteBoni_amm] = React.useState(0);
  const [ca_amc, setCa_amc] = React.useState(0);
  const [ca_amm, setCa_amm] = React.useState(0);
  const [idSegment, setIdSegment] = React.useState({ value: 0, label: "Segment Commmun" });
  const [idLigne, setIdLigne] = React.useState({ value: 0, label: "Ligne" });
  const [id] = React.useState(0);
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
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
  const [optionSegment, setOptionSegment] = React.useState([
    {
      value: 0,
      label: "Segment",
      isDisabled: true,
    },
  ]);
  const [produitSelect, setProduitSelect] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
    },
  ]);
  const [entities, setEntities] = useState([]);

  // hide and show table / btn ajouter ligne 
  const [showTable, setShowTable] = useState(false);
  const [showBtn, setShowBtn] = useState(false);



 
  /*  const [optionsType] = React.useState([
    {
      value: "",
      label: "-Selectioner-",
      isDisabled: true,
    },
    {
      value: 1,
      label: "Commande groupé 1",
    },
    {
      value: 2,
      label: "Commande groupé 2",
    },
    {
      value: 3,
      label: "Commande groupé 3",
    },
  ]);
  const [typeSelect, setTypeSelect] = React.useState({
    value: 0,
    label: "-Selectioner-",
  });
  const [type_group, setType_group] = React.useState(0); */

  const confirmMessage = (id, nb) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes vous sure de supprimers?"
        onConfirm={() => deleteActionProd(id, nb)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };

  function deleteActionProd(id, nb) {
    var list = [...entities];
    var list1 = [...produitSelect];
    if (entities.length > 1) {
      list.splice(parseInt(nb), 1);
      list1.splice(parseInt(nb), 1);
      setEntities(list);
      setProduitSelect(list1);
      notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
    hideAlert();
  }

  const getPack = useCallback(async () => {
    var pack = await dispatch(getActivePack());
    var entities = pack.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      if (e.id !== 0) arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptions(arrayOption);
  }, [dispatch]);

  const getSegment = useCallback(async () => {
    var superviseur = await dispatch(fetchSegment());
    var entities = superviseur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionSegment(arrayOption);
  }, [dispatch]);


  const getProduit = useCallback(async () => {
    var type = await dispatch(getActiveProduit());
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.parent, label: e.designation, type: e.type });
    });
    setOptionProduit(arrayOption);
  }, [dispatch]);

  const getLigne = useCallback(async () => {
    var superviseur = await dispatch(getActiveLigne());
    var entities = superviseur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionLigne(arrayOption);
  }, [dispatch]);

  function listActions() {
    navigate("/listAction");
    /* window.location.replace("/listAction"); */
  }
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

    if (pack.length === 0) {
      notify("tr", "Il faut selection au moin un pack", "danger");
    }
    if (parseInt(objectif) === 0) {
      notify("tr", "Objectif doit etre superieur à 0", "danger");
    }
    var valSegment = idSegment.value;
    var valLigne = idLigne.value;
    if (valLigne === 0) {
      notify("tr", "Il faut selection au moin un ligne", "danger");
    }
    if (
      !validator.isEmpty(nom) &&
      parseInt(objectif) !== 0 &&
      !validator.isEmpty(dateDebut) &&
      !validator.isEmpty(dateFin) &&
      pack.length !== 0 &&
      valLigne !== 0
    ) {
      dispatch(
        actionAdded({
          pack,
          nom,
          valSegment,
          objectif,
          dateDebut,
          dateFin,
          id,
          unite_amm,
          unite_amc,
          unite_boni_amm,
          unite_boni_amc,
          ca_amm,
          ca_amc,
          valLigne , 
          entities
        })
      );
      notify("tr", "Insertion avec succes", "success");
      setTimeout(async () => {
        listActions();
      }, 1500);
    }
  }

  useEffect(() => {
    getPack();
    getSegment();
    getLigne();
    getProduit() ;

  }, [getPack, getSegment,getLigne ,getProduit]);

  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      id: null,
      produitId: null,
      quantiteUg: null,
      actionId : 0 ,
     
    };
    setEntities(list);
  }

  const showHideTable = () => {
    setShowTable(!showTable);
    setShowBtn(!showBtn);

    if (entities.length !== 0) {
     setEntities([])
     console.log(entities)
    } 

  };

  return (
    <>

     {alert}
      <Container fluid className="responsive-BL table-dynamique">
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
                        <Card.Title as="h4">
                          {typeof location.id == "undefined"
                            ? "Ajouter nouvelle action"
                            : "Modifier action"}
                        </Card.Title>
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
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Objectif CA par pharmacie* </label>
                            <Form.Control
                              className="required"
                              defaultValue={objectif}
                              placeholder="Objectif"
                              type="number"
                              name="Objectif"
                              onChange={(value) => {
                                setObjectif(value.target.value);
                                if (parseInt(unite_amc) !== 0) {
                                  var ca =
                                    (parseInt(unite_amc) / 100) *
                                    parseInt(value.target.value);
                                  setCa_amc(ca);
                                }
                                if (parseInt(unite_amm) !== 0) {
                                  var ca =
                                    (parseInt(unite_amm) / 100) *
                                    parseInt(value.target.value);
                                  setCa_amm(ca);
                                }
                              }}
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
                            onChange={(value) => {
                              setDateDebut(value.target.value);
                            }}
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
                            onChange={(value) => {
                              setDateFin(value.target.value);
                            }}
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
                            onChange={(value) => {
                              setPack(value);
                            }}
                            options={options}
                            placeholder="Pack"
                          />
                        </Col>
                        <Col md="6" className="pl-1">
                          <label>Segment*</label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            name="singleSelect"
                            value={idSegment}
                            onChange={(value) => {
                              setIdSegment(value);
                            }}
                            options={optionSegment}
                            placeholder="Segment"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6" className="pr-1">
                          <label>Ligne*</label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            name="singleSelect"
                            value={idLigne}
                            onChange={(value) => {
                              setIdLigne(value);
                            }}
                            options={optionLigne}
                            placeholder="Ligne"
                          />
                        </Col>
                      </Row>
                      <table className="table table-bordered">
                        <thead>
                          <tr className="table-info">
                            <th>Type</th>
                            <th>Pourcentage CA</th>
                            <th>CA</th>
                            <th>Pourcentage Bonification</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>AMC</td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={unite_amc}
                                  placeholder="Unité"
                                  name="unite_amc"
                                  type="number"
                                  onChange={(value) => {
                                    setUnite_amc(value.target.value);
                                    var ca =
                                      (parseInt(value.target.value) / 100) *
                                      parseInt(objectif);
                                    setCa_amc(ca);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  readOnly
                                  value={ca_amc}
                                  placeholder="CA"
                                  name="ca_amc"
                                  type="text"
                                  /* onChange={(value) => {
                                    setCa_amc(value.target.value);
                                  }} */
                                ></Form.Control>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={unite_boni_amc}
                                  placeholder="Unité"
                                  name="unite_boni_amc"
                                  type="number"
                                  onChange={(value) => {
                                    setUniteBoni_amc(value.target.value);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </td>
                          </tr>
                          <tr>
                            <td>AMM</td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  value={unite_amm}
                                  placeholder="Unité"
                                  name="unite_amm"
                                  type="number"
                                  onChange={(value) => {
                                    setUnite_amm(value.target.value);
                                    var ca =
                                      (parseInt(value.target.value) / 100) *
                                      parseInt(objectif);
                                    setCa_amm(ca);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  readOnly
                                  value={ca_amm}
                                  placeholder="CA"
                                  name="ca_amm"
                                  type="text"
                                  /* onChange={(value) => {
                                    setCa_amm(value.target.value);
                                  }} */
                                ></Form.Control>
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={unite_boni_amm}
                                  placeholder="Unité"
                                  name="unite_boni_amm"
                                  type="number"
                                  onChange={(value) => {
                                    setUniteBoni_amm(value.target.value);
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Button
                            className="btn-fill pull-left"
                            type="button"
                            variant="info"
                            nom="redac"
                            onClick={(ev) => showHideTable()}
                          >
                            Detail UG
                          </Button>
                      <Row>
                        <Col md="12">
                          <hr></hr>
                          <br></br>
                          {showTable && (
                      <ReactTable
                            data={entities}
                            columns={[
                              {
                                Header: "produit",
                                accessor: "produit",
                                Cell: ({ cell }) => (
                                  <div>
                                    {cell.row.original.id === null ? (
                                      <div className="table-produit">
                                        <div>
                                          <Select
                                            className="react-select primary"
                                            classNamePrefix="react-select"
                                            placeholder="produit"
                                            value={produitSelect[cell.row.id]}
                                            onChange={(v) => {
                                              var e = [...entities];
                                              var select = produitSelect;
                                              e[cell.row.id].produitId =
                                                v.value;
                                              select[cell.row.id] = v;
                                              setProduitSelect(select);
                                              setEntities(e);
                                            }}
                                            options={optionProduit}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      cell.row.original.produits.designation
                                    )}
                                  </div>
                                ),
                              },
                          
                              {
                                Header: "Pourcentage %",
                                accessor: "quantiteUg",
                                Cell: ({ cell }) => (
                                  <div>
                                    <Form.Group>
                                      <Form.Control
                                        defaultValue={cell.row.values.quantiteUg}
                                        placeholder="%"
                                        type="number"
                                        onBlur={(val) => {
                                          var e = [];
                                          e = [...entities];
                                          e[cell.row.id] = {
                                            ...e[cell.row.id],
                                            quantiteUg: val.target.value,
                                          };
                                          setEntities(e);
                                        }}
                                      ></Form.Control>
                                    </Form.Group>
                                  </div>
                                ),
                              },
                              {
                                Header: "Action",
                                accessor: "id",
                                Cell: ({ cell }) => (
                                  <div className="actions-right block_action">
                                    <Button
                                      id={"idLigneR_" + cell.row.id}
                                      onClick={(ev) => {
                                        confirmMessage(
                                          entities[cell.row.id].id,
                                          cell.row.id
                                        );
                                      }}
                                      variant="danger"
                                      size="sm"
                                      className="text-danger btn-link delete"
                                    >
                                      <i
                                        className="fa fa-trash"
                                        id={"idLigneR_" + cell.row.id}
                                      />
                                    </Button>
                                  </div>
                                ),
                              },
                             
                            ]}
                            className="-striped -highlight primary-pagination"
                          />
                          )}
                          </Col>
                      </Row>

                      <br></br>

                      {showBtn && (
                      <Button
                            className="btn-fill pull-left"
                            type="button"
                            variant="info"
                            nom="redac"
                            onClick={(ev) => AjoutLigne()}
                          >
                            Ajouter
                        </Button>   
                          )}
                    
                     
                      <br></br>
                      <br></br>
                    
                       
                         
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
