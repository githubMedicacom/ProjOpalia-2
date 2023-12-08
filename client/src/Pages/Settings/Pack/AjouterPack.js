import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getActiveProduit } from "../../../Redux/produitReduce";
import { fetchSegment } from "../../../Redux/segmentReduce";
import { packAdded, packGetById } from "../../../Redux/packReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../../components/ReactTable/ReactTableBl.js";

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

  //Segment
  const [segment, setSegment] = React.useState(null);
  const [optionSegment, setOptionSegment] = React.useState([
    {
      value: 0,
      label: "Segment",
    },
  ]);

  //type
  const [typePack, setTypePack] = React.useState([]);
  const [optionTypePack] = React.useState([
    {
      value: "0",
      label: "Type",
      isDisabled: true,
    },
    {
      value: "1",
      label: "Par produit",
    },
    {
      value: "2",
      label: "Tous les produits",
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
  function submitForm(event) {
    var valSeg = segment === null ? null : segment.value;
    var valPharmacie = pharmacie === null ? null : pharmacie.value;
    var valType = typePack === null ? null : typePack.value;


    var verif = true;
    entities.forEach((data) => {
      var test = Object.keys(data).length;
      if (
        (data.quantite === null ||
          data.quantite === "" ||
          data.montant === null ||
          data.montant === "" ||
          parseInt(data.quantite) === 0 ||
          data.produitId === null) &&
        test > 0
      )
        verif = false;
    });
    if (
      nom === "" ||
      valSeg === null ||
      verif === false ||
      valType == undefined
    )
      notify("tr", "Vérifier vos donnée", "danger");
    else if (entities.length === 0 && valType == 1)
      notify("tr", "Il faut selectionner au moin un produit", "danger");
    else {
      dispatch(
        packAdded({
          nom: nom,
          bonification: bonification,
          packproduit: entities,
          segment: valSeg,
          idPharmacie: valPharmacie,
          type: valType,
          id,
        })
      ).then((e) => {
        if (e.payload === true) {
          if (isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success");
          else notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listePack();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");
        }
      });
    }
  }

  const getProduit = useCallback(async () => {
    var type = await dispatch(getActiveProduit());
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.parent, label: e.designation, type: e.type });
    });
    setOptionProduit(arrayOption);
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
          if (entities === false) {
            navigate("/listPack");
          } else {
            setId(location.id);
            resolve(entities);
          }
        } else {
          resolve(0);
        }
      }, 300);
    });

    promise.then((value) => {

      if (value !== 0) {
        var array = [];
        value.table.forEach((val) => {
          var newVal = { ...val };
          newVal.type = val.produits.type;
          array.push(newVal);
        });

        setEntities(array);
        ///  console.log(array)
        setBonification(value.header.bonification);
        setNom(value.header.nom);
        if (value.header.pharmacies !== null)
          setPharmacie({
            value: value.header.pharmacies.id,
            label: value.header.pharmacies.nom,
          });
        if (value.header.segments !== null)
          setSegment({
            value: value.header.segments.id,
            label: value.header.segments.nom,
          });
        else {
          setSegment({
            value: 0,
            label: "Segment commun",
          });
        }

        if (value.header.type !== null)
          setTypePack({
            value: value.header.type,
            label: value.header.type == 1 ? "Par produit" : "Tous les produits",
          });
        else {
          setTypePack({
            value: 0,
            label: "Type",
          });
        }
      }
    });
    getProduit();
    getSegment();
  }, [getProduit, getSegment, dispatch, location.id, navigate]);

  function listePack() {
    navigate("/listPack");
  }
  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      id: null,
      produitId: null,
      quantite: 0,
      montant: 0,
      quantiteUg: 0,
      type: null,
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
                      </Row>
                      <Row>
                        <Col className="pl-3" md="6">
                          <label>Type* </label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            value={typePack}
                            placeholder="Type"
                            onChange={(v) => {
                              setTypePack(v);
                            }}
                            options={optionTypePack}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <hr></hr>
                          <br></br>
                          {typePack.value == 1 && (
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
                                                e[cell.row.id].type = v.type;
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
                                          defaultValue={
                                            cell.row.values.quantite
                                          }
                                          placeholder="quantité"
                                          type="number"
                                          onBlur={(val) => {
                                            var e = [];
                                            e = [...entities];
                                            e[cell.row.id] = {
                                              ...e[cell.row.id],
                                              quantite: val.target.value,
                                            };
                                            setEntities(e);
                                          }}
                                        ></Form.Control>
                                      </Form.Group>
                                    </div>
                                  ),
                                },
                                {
                                  Header: "Montant",
                                  accessor: "montant",
                                  Cell: ({ cell }) => (
                                    <div>
                                      <Form.Group>
                                        <Form.Control
                                          defaultValue={cell.row.values.montant}
                                          placeholder="montant"
                                          type="number"
                                          onBlur={(val) => {
                                            var e = [];
                                            e = [...entities];
                                            e[cell.row.id] = {
                                              ...e[cell.row.id],
                                              montant: val.target.value,
                                            };
                                            setEntities(e);
                                          }}
                                        ></Form.Control>
                                      </Form.Group>
                                    </div>
                                  ),
                                },
                                {
                                  Header: "quantite Ug",
                                  accessor: "quantiteUg",
                                  Cell: ({ cell }) => (
                                    <div>
                                      <Form.Group>
                                        <Form.Control
                                          defaultValue={
                                            cell.row.values.quantiteUg
                                          }
                                          placeholder="quantité UG"
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
                          <br></br>
                          {typePack.value == 1 ? (
                            <Button
                              className="btn-fill pull-left"
                              type="button"
                              variant="info"
                              nom="redac"
                              onClick={(ev) => AjoutLigne()}
                            >
                              Ajouter
                            </Button>
                          ) : (
                            ""
                          )}
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
