import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getActiveProduit } from "../../../Redux/produitReduce";
import { getActivePharmacie } from "../../../Redux/pharmacieReduce";
import { fetchSegment } from "../../../Redux/segmentReduce";
import { packAdded, packGetById } from "../../../Redux/packReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../../components/ReactTable/ReactTable.js";

function AjouterPack() {
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  //input
  const [nom, setNom] = React.useState("");
  const [bonification, setBonification] = React.useState("");
  const [id, setId] = React.useState(0);
  const [entities, setEntities] = useState([]);
  //produit
  const [produitSelect, setProduitSelect] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
    },
  ]);
  //Pharmacie
  const [pharmacie, setPharmacie] = React.useState({ value: 0, label: "Tous" });
  const [optionPharmacie, setOptionPharmacie] = React.useState([
    {
      value: 0,
      label: "Pharmacie",
    },
  ]);

  //Segment
  const [segment, setSegment] = React.useState(null);
  const [optionSegment, setOptionSegment] = React.useState([
    {
      value: 0,
      label: "Segment",
    },
  ]);



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
  const hideAlert = () => {
    setAlert(null);
  };
  const confirmMessage = (id, nb) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes vous sure de supprimers?"
        onConfirm={() => deletePackProd(id, nb)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  function deletePackProd(id, nb) {
    if (entities.length > 1) {
      /* entities.splice(nb, 1);
      setEntities(entities); */
      var filtered = entities.filter(function(value, index, arr){
          return index !== parseInt(nb);
      });
      setEntities(filtered);
      notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
    hideAlert();
  }
  function submitForm(event) {
    var valSeg = segment === null ? null : segment.value;
    var valPharmacie = pharmacie === null ? null : pharmacie.value;
    if(nom === "" || bonification === "" || valSeg === null)
      notify("tr", "Vérifier vos donnée", "danger");
    else if(entities.length === 0)
        notify("tr", "Il faut selectionner au moin un produit", "danger");
    else{
      dispatch(
        packAdded({
          nom: nom,
          bonification: bonification,
          packproduit: entities,
          segment: valSeg,
          idPharmacie: valPharmacie,
          id,
        })
      ).then(e=>{
        if(e.payload ===true){
          if(isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success")
          else  
            notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listePack();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");          
        }
      });
      /* dispatch(
        packAdded({
          nom: nom,
          bonification: bonification,
          packproduit: entities,
          segment:valSeg,
          idPharmacie:valPharmacie,
          id,
        })
      ); */
    }
  }

  const getProduit = useCallback(async () => {
    var type = await dispatch(getActiveProduit());
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.designation });
    });
    setOptionProduit(arrayOption);
  }, [dispatch]);

  const getPharmacie = useCallback(async () => {
    var type = await dispatch(getActivePharmacie());
    var entities = type.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Tous" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionPharmacie(arrayOption);
  }, [dispatch]);

  const getSegment = useCallback(async () => {
    var type = await dispatch(fetchSegment());
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionSegment(arrayOption);
  }, [dispatch]);

  useEffect(() => {
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var produit = await dispatch(packGetById(location.id));
          var entities = produit.payload;
          if(entities === false){
            navigate('/listPack');
          }
          else{
            setId(location.id);
            resolve(entities);
          }
        } else {
          resolve(0);
        }
      }, 300);
    });

    promise.then((value) => {
      if(value!==0){
        setEntities(value.table);
        setBonification(value.header.bonification);
        setNom(value.header.nom);
        if(value.header.pharmacies !== null)
          setPharmacie({
            value: value.header.pharmacies.id,
            label: value.header.pharmacies.nom
          });
        if(value.header.segments !== null)
          setSegment({
            value: value.header.segments.id,
            label: value.header.segments.nom
          })
        else {
          setSegment({
            value: 0,
            label: "Segment commun"
          })
        }
      }
      else {
        setSegment({
          value: 0,
          label: "Segment commun"
        })
      }
    });
    getProduit();
    getSegment();
    getPharmacie();
  }, [getProduit,getSegment,getPharmacie,dispatch,location.id,navigate]);

  function listePack() {
    navigate('/listPack');
    /* window.location.replace("/listPack"); */
  }
  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      id: null,
      produitId: null,
      quantite: null,
    };
    setEntities(list);
  }

  return (
    <>
      {alert}
      <Container fluid className="table-dynamique">
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
                  onClick={listePack}
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
                            ? "Ajouter Pack"
                            : "Modifier pack"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Nom* </label>
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
                            <label>Bonification* </label>
                            <Form.Control
                              defaultValue={bonification}
                              placeholder="Bonification"
                              type="text"
                              onChange={(value) => {
                                setBonification(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <label>Segment* </label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            value={segment}
                            placeholder="segment"
                            onChange={(v) => {
                              setSegment(v);
                            }}
                            options={optionSegment}
                          />
                        </Col>
                        <Col className="pl-1" md="6">
                          <label>Pharmacie </label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            value={pharmacie}
                            placeholder="pharmacie"
                            onChange={(v) => {
                              setPharmacie(v);
                            }}
                            options={optionPharmacie}
                          />
                        </Col>
                        
                      </Row>
                      <Row>
                        <Col md="12">
                          <hr></hr>
                          <br></br>
                          <ReactTable
                            data={entities}
                            columns={[
                              {
                                Header: "produit",
                                accessor: "produit",
                                Cell: ({ cell }) => (
                                  <div>
                                    {cell.row.original.id === null ? (
                                      <div className="table-bl">
                                        <div>
                                        <Select
                                          className="react-select primary"
                                          classNamePrefix="react-select"
                                          placeholder="produit"
                                          value={produitSelect[cell.row.id]}
                                          onChange={(v) => {
                                            var e = entities;
                                            var select = produitSelect;
                                            e[cell.row.id].produitId = v.value;
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
                                Header: "Quantite",
                                accessor: "quantite",
                                Cell: ({ cell }) => (
                                  <div>
                                    <Form.Group>
                                      <Form.Control
                                        defaultValue={cell.row.values.quantite}
                                        placeholder="quantité"
                                        type="number"
                                        onChange={(value) => {
                                          var e = entities;
                                          e[cell.row.id].quantite =
                                            value.target.value;
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
                                        confirmMessage(entities[cell.row.id].id,cell.row.id);
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
                          <br></br>
                          <Button
                            className="btn-fill pull-left"
                            type="button"
                            variant="info"
                            nom="redac"
                            onClick={(ev) => AjoutLigne()}
                          >
                            Ajouter
                          </Button>
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

export default AjouterPack;
