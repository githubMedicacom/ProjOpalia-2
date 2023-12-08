import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import { getActiveProduit } from "../../Redux/produitReduce";
import { getActivePharmacie } from "../../Redux/pharmacieReduce";
import { getActiveFournisseur } from "../../Redux/fournisseurReduce";
import { addCmd, addLigneCmd, countNum } from "../../Redux/commandeVenteReduce";
import Select from "react-select";
import jwt_decode from "jwt-decode";
function AjouterDocumentGro() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var id = decoded.userauth.id;
  var nom = decoded.userauth.nomU + decoded.userauth.prenomU;
  //input
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);
  const [entitiesEntete, setEntitiesEntete] = React.useState({
    id_user: id,
    id_pharmacie: 0,
    type: 0,
    numero: nom,
    type: -1,
    date: "",
    total: 0,
    fournisseur: "Opalia",
  });
  const [somme, setSomme] = React.useState(0.0);
  //Produit
  const [produitSelect, setProduitSelect] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
      isDisabled: true,
    },
  ]);
  //Pharmacie
  const [pharmacie, setPharmacie] = React.useState({
    value: 0,
    label: "Pharmacie",
  });
  const [optionPharmacie, setOptionPharmacie] = React.useState([
    {
      value: 0,
      label: "Pharmacie",
    },
  ]);
  //fournisseur
  const [fournisseur, setFournisseur] = React.useState({
    value: 0,
    label: "Opalia",
  });
  const [optionFournisseur, setOptionFournisseur] = React.useState([
    {
      value: 0,
      label: "Grossiste",
    },
  ]);

  //type
  const [type, setType] = React.useState({ value: -1, label: "Type" });
  const [optionType] = React.useState([
    {
      value: -1,
      label: "Type",
    },
    {
      value: 0,
      label: "Commande directe",
    },
    {
      value: 1,
      label: "Commande grossiste",
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
      payment: "nc-payment nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const getProduit = useCallback(async () => {
    var type = await dispatch(getActiveProduit());
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      if(e.direct === 1)
        arrayOption.push({
          value: e.id,
          label: e.designation,
          code: e.code,
          prix: e.prix,
          prixConseiller: e.prixConseiller,
        });
    });
    setOptionProduit(arrayOption);
  }, [dispatch]);

  function deleteLigne(nb) {
    if (entities.length > 1) {
      var som = somme;
      som -= parseFloat(entities[nb].montant);
      setSomme(som.toFixed(3));
      var filtered = entities.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });

      var filterprod = produitSelect.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setEntities(filtered);
      setProduitSelect(filterprod);
      notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
  }
  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      id: null,
      Designation: null,
      prix: 0,
      quantite: 0,
      Code: 0,
      montant: 0,
      id_produit: null,
    };
    setEntities(list);
  }

  const saveTable = useCallback(async (entitiesEntete, entities, somme) => {
    entitiesEntete.total = somme;
    var verif = true;
    entities.forEach((data) => {
      var test = Object.keys(data).length;
      if (
        (data.quantite === null ||
          data.quantite === "" ||
          parseInt(data.quantite) === 0 ||
          data.montant === null ||
          data.montant === "" ||
          parseInt(data.montant) === 0 ||
          data.produit_id === null) &&
        test > 0
      )
        verif = false;
    });

    if (
      entitiesEntete.id_pharmacie === 0 ||
      entitiesEntete.date === "" ||
      entitiesEntete.fournisseur === ""
    )
      verif = false;
    if (somme < 1000)
      notify("tr", "Vente doit être supérieur à 1000 TND", "danger");
    else if (!verif) notify("tr", "Vérifier vos donné", "danger");
    else
      dispatch(addCmd({ entitiesEntete })).then((val) => {
        if (val.payload.msg === true) {
          entities.forEach((elem) => {
            elem.id_cmd_vente = val.payload.data.id;
          });
          dispatch(addLigneCmd({ entities })).then((val) => {
            if (val.payload.msg === true) {
              notify("tr", "Insertion avec succes", "success");

              setTimeout(async () => {
                navigate("/venteEvenment");
              }, 1500);
            } else {
              notify("tr", "Problème de connexion", "danger");
            }
          });
        } else {
          notify("tr", "Problème de connexion", "danger");
        }
      });
  }, [dispatch,navigate]);

  const getPharmacie = useCallback(async () => {
    var type = await dispatch(getActivePharmacie());
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionPharmacie(arrayOption);
  }, [dispatch]);

  const getNumero = useCallback(async () => {
    var type = await dispatch(countNum(id));
    var entities = type.payload;
    var list = { ...entitiesEntete };
    var nb = 1;
    if (entities.countNum === "") {
      list.numero += "-" + nb;
    } else {
      var spltiNum = entities.countNum.split("-");
      nb = parseInt(spltiNum[1]) + 1;
      list.numero += "-" + nb;
    }
    /* list.numero += "-" + (entities.countNum + 1) */
    setEntitiesEntete(list);
  }, [dispatch,id]);

  //get fournisseur
  const getFournisseur = useCallback(async () => {
    var fournisseur = await dispatch(getActiveFournisseur());
    var entities = fournisseur.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.nom, label: e.nom });
    });
    setOptionFournisseur(arrayOption);
  }, [dispatch]);

  useEffect(() => {
    getPharmacie();
    getProduit();
    getNumero();
  }, [getPharmacie, getProduit, getNumero]);

  const setTable = useCallback(async (table, init) => {
    //1 => update table ***** 0 => initialiser table
    var arrayBody = [];
    var arrayProduit = [];
    var moy = 0;
    table.forEach((value) => {
      var sommeMnt = parseFloat(value.prix) * parseFloat(value.quantite);
      arrayBody.push({
        id: value.id,
        Designation:
          init === 1 ? value.Designation : value.produits.designation,
        prix: value.prix,
        quantite: value.quantite,
        montant: sommeMnt.toFixed(3),
        id_produit: value.id_produit,
      });
      if (init === 0)
        arrayProduit.push({
          value: value.produits.id,
          label: value.produits.designation,
        });
      moy += parseFloat(sommeMnt);
    });
    setSomme(moy.toFixed(3));
    setEntities(arrayBody);
    if (init === 0) setProduitSelect(arrayProduit);
  }, []);

  return (
    <>
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
                  onClick={() => {
                    navigate("/venteEvenment");
                  }}
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
                        <Card.Title as="h4" className="float-left">
                          Ajouter une commande
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Date* </label>
                            <Form.Control
                              defaultValue={entitiesEntete.date}
                              placeholder="Nom"
                              type="date"
                              onChange={(value) => {
                                var list = { ...entitiesEntete };
                                list.date = value.target.value;
                                setEntitiesEntete(list);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <label>Pharmacie </label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            value={pharmacie}
                            placeholder="pharmacie"
                            onChange={(value) => {
                              var list = { ...entitiesEntete };
                              list.id_pharmacie = value.value;
                              setEntitiesEntete(list);
                              setPharmacie(value);
                            }}
                            options={optionPharmacie}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Numero* </label>
                            <Form.Control
                              readOnly
                              value={entitiesEntete.numero}
                              placeholder="Nom"
                              type="text"
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <label>Type de vente*</label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            value={type}
                            placeholder="Type"
                            onChange={(value) => {
                              var list = { ...entitiesEntete };
                              list.type = value.value;
                              if (value.value === 1) {
                                list.fournisseur = "";
                                getFournisseur();
                                setFournisseur({value:"",label:""});
                              } else {
                                setOptionFournisseur([]);
                                setFournisseur({value:"Opalia",label:"Opalia"});
                              }
                              setEntitiesEntete(list);
                              setType(value);
                              setEntities([]);
                              setProduitSelect([]);
                            }}
                            options={optionType}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <label>Grossiste*</label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            value={fournisseur}
                            placeholder="Grossiste"
                            onChange={(value) => {
                              var list = { ...entitiesEntete };
                              list.fournisseur = value.value;
                              setEntitiesEntete(list);
                              setFournisseur(value);
                            }}
                            options={optionFournisseur}
                          />
                        </Col>
                      </Row>
                      {type.value !== -1 ? (
                        <Row id="table-BL">
                          <Col md="12">
                            <hr></hr>
                            <br></br>
                            <ReactTable
                              data={entities}
                              columns={[
                                {
                                  Header: "Designation",
                                  accessor: "Designation",
                                  Cell: ({ cell }) => (
                                    <div>
                                      <div className="table-produit">
                                        <div>
                                          <Select
                                            className="react-select primary "
                                            classNamePrefix="react-select"
                                            name="Produit"
                                            placeholder="Produit"
                                            value={produitSelect[cell.row.id]}
                                            onChange={(v) => {
                                              var e = [...entities];
                                              var select = produitSelect;
                                              e[cell.row.id] = {
                                                ...e[cell.row.id],
                                                id_produit: v.value,
                                              };
                                              var prix = 0;

                                              if (type.value === 0) {
                                                prix = v.prix;
                                              } else {
                                                prix = v.prixConseiller;
                                              }
                                              e[cell.row.id].prix = prix;

                                              if (prix !== 0) {
                                                var mnt =
                                                  parseFloat(
                                                    e[cell.row.id].quantite
                                                  ) * parseFloat(prix);
                                                e[cell.row.id].montant =
                                                  mnt.toFixed(3);
                                              }
                                              select[cell.row.id] = v;
                                              setProduitSelect(select);
                                              setEntities(e);
                                              setTable(e, 1);
                                            }}
                                            options={optionProduit}
                                          />
                                        </div>
                                      </div>
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
                                          type="Number"
                                          onBlur={(value) => {
                                            var e = entities;
                                            if (e[cell.row.id].prix != null) {
                                              var mnt =
                                                parseFloat(value.target.value) *
                                                parseFloat(e[cell.row.id].prix);
                                              e[cell.row.id].montant =
                                                mnt.toFixed(3);
                                            }
                                            e[cell.row.id].quantite =
                                              parseFloat(value.target.value);
                                            setTable(e, 1);
                                          }}
                                        ></Form.Control>
                                      </Form.Group>
                                    </div>
                                  ),
                                },
                                {
                                  Header: "Prix",
                                  accessor: "prix",
                                  Cell: ({ cell }) => (
                                    <div>
                                      <Form.Group>
                                        <Form.Control
                                          defaultValue={cell.row.values.prix}
                                          placeholder="Prix"
                                          type="Number"
                                          onBlur={(value) => {
                                            var e = entities;
                                            if (
                                              e[cell.row.id].quantite != null
                                            ) {
                                              var mnt =
                                                parseFloat(value.target.value) *
                                                parseFloat(
                                                  e[cell.row.id].quantite
                                                );
                                              e[cell.row.id].montant =
                                                mnt.toFixed(3);
                                            }
                                            e[cell.row.id].prix = parseFloat(
                                              value.target.value
                                            );
                                            setTable(e, 1);
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
                                          placeholder="Montant"
                                          type="Number"
                                          onBlur={(value) => {
                                            var e = entities;
                                            e[cell.row.id].montant =
                                              value.target.value;
                                            setTable(e, 1);
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
                                          deleteLigne(cell.row.id);
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
                          <Col md="12">
                            <div className="totalMax">
                              Total HT : {somme} TND
                            </div>
                            <Button
                              id="saveBL"
                              className="btn-wd btn-outline mr-1 float-right"
                              type="button"
                              variant="success"
                              onClick={() =>
                                saveTable(entitiesEntete, entities, somme)
                              }
                            >
                              <span className="btn-label">
                                <i className="fas fa-check"></i>
                              </span>
                              Enregistrer
                            </Button>
                          </Col>
                        </Row>
                      ) : (
                        ""
                      )}
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

export default AjouterDocumentGro;
