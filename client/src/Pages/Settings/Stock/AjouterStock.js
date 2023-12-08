import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getProduitLbr } from "../../../Redux/produitReduce";
import { getActiveFournisseur } from "../../../Redux/fournisseurReduce";
import {
  stockAdded,
  stockGetById,
  verifStock,
} from "../../../Redux/stockReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../../components/ReactTable/ReactTableBl.js";
import jwt_decode from "jwt-decode";

function AjouterStock() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idRole = decoded.userauth.idrole;
  var annee = localStorage.getItem("annee");
  const notificationAlertRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  //input
  const [titre, setTitre] = React.useState("LBR " + annee);
  const [id, setId] = React.useState(0);
  const [entities, setEntities] = useState([]);

  //Grossiste
  const [fournisseurSelect, setFournisseurSelect] = React.useState({
    value: 0,
    label: "Grossiste",
  });
  const [optionFournisseur, setOptionFournisseur] = React.useState([
    {
      value: 0,
      label: "Grossiste",
    },
  ]);

  //Mois
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
  const [objMois] = React.useState({
    "01": { value: "01", label: "janvier" },
    "02": { value: "02", label: "février" },
    "03": { value: "03", label: "mars" },
    "04": { value: "04", label: "avril" },
    "05": { value: "05", label: "mai" },
    "06": { value: "06", label: "juin" },
    "07": { value: "07", label: "juillet" },
    "08": { value: "08", label: "août" },
    "09": { value: "09", label: "septembre" },
    10: { value: "10", label: "octobre" },
    11: { value: "11", label: "novembre" },
    12: { value: "12", label: "décembre" },
  });
  const [mois, setMois] = React.useState({
    value: 0,
    label: "Mois",
  });


  // Extraction
  const [type, setType] = React.useState({
    value: 0,
    label: "Extraction",
  });
  const [optionType] = React.useState([
    {
      value: "",
      label: "Extraction",
      isDisabled: true,
    },
    {
      value: "1",
      label: "Fin mois",
    },
    {
      value: "2",
      label: "Mi-mois",
    },
  ]);
  const [objType] = React.useState({
    "1": { value: "1", label: "Fin mois" },
    "2": { value: "2", label: "Mi-mois" },

  });

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
    var verif = true;
    var valFour = fournisseurSelect.value;
    var mm = mois.value;
    var typee = type.value ;
    if (titre === "" || verif === false || mm === 0 || valFour === 0 || typee === 0  )   
      notify("tr", "Vérifier vos donnée", "danger");
    else {
      dispatch(
        verifStock({
          mois: mm,
          id_fournisseur: valFour,
          annee: annee,
          id: id,
          type:typee
        })
      ).then((v) => {
        if (v.payload.length === 0) {
          dispatch(
            stockAdded({
              titre: titre,
              ligneStock: entities,
              mois: mm,
              id_fournisseur: valFour,
              annee: annee,
              id: id,
              type:type.value
            })
          ).then((e) => {
            if (e.payload === true) {
              if (isNaN(location.id) === true)
                notify("tr", "Insertion avec succes", "success");
              else notify("tr", "Modifier avec succes", "success");
              setTimeout(async () => {
                listeStock();
              }, 1500);
            } else {
              notify("tr", "Problème de connexion", "danger");
            }
          });
        } else {
          notify("tr", "Le gorssiste déja existe dans ce mois", "danger");
        }
      });
    }
  }

  const getProduit = useCallback(async () => {
    var prod = await dispatch(getProduitLbr());
    var data = prod.payload;
    var array = [];
    data.forEach((e) => {
      array.push({
        id_stock: null,
        id_produit: e.parent,
        designation: e.designation,
        stock: 0,
        vente: 0,
      });
    });
    setEntities(array);
  }, [dispatch]);

  const getFournisseur = useCallback(async () => {
    var req = await dispatch(getActiveFournisseur());
    var res = req.payload;
    var arrayOption = [];
    res.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionFournisseur(arrayOption);
  }, [dispatch]);

  const getStock = useCallback(async () => {
    var req = await dispatch(stockGetById(location.id));
    var rep = await req.payload;
    var header = await rep.header;
    var table = await rep.table;
    var array = [];
    setId(location.id);
    table.forEach((e) => {
      array.push({
        id_stock: location.id,
        id_produit: e.produits.parent,
        designation: e.produits.designation,
        stock: e.stock,
        vente: e.vente,
      });
    });
    setTitre(header.titre);
    if (header.mois) {
      setMois(objMois[header.mois]);
    }
    if (header.fournisseurs) {
      setFournisseurSelect({
        value: header.fournisseurs.id,
        label: header.fournisseurs.nom,
      });
    }
    if (header.type) {
      setType(objType[header.type]);
    }
    setEntities(array);
  }, [dispatch]);

  useEffect(() => {
    if (isNaN(location.id) === false) {
      getStock();
    } else {
      getProduit();
    }
    getFournisseur();
  }, [getProduit, getStock, getFournisseur]);

  function listeStock() {
    navigate("/listStock");
  }

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
                  onClick={listeStock}
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
                            ? "Ajouter LBR"
                            : "Modifier LBR"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Titre* </label>
                            <Form.Control
                              className="bold"
                              readOnly
                              value={titre}
                              placeholder="Titre"
                              type="text"
                              onChange={(value) => {
                                setTitre(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <label>Grossiste* </label>
                          {idRole === 2 ? (
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={fournisseurSelect}
                              placeholder="Grossiste"
                              onChange={(val) => {
                                var text = "";
                                if (mois.value !== 0) {
                                  text =
                                    "LBR " +
                                    val.label +
                                    " " +
                                    mois.label +
                                    " " +
                                    annee;
                                } else {
                                  text = "LBR " + val.label + " " + annee;
                                }
                                setTitre(text);
                                setFournisseurSelect(val);
                              }}
                              options={optionFournisseur}
                            />
                          ) : (
                            <Form.Control
                              readOnly
                              value={fournisseurSelect.label}
                              placeholder="Grossiste"
                              type="text"
                            ></Form.Control>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <label>Mois* </label>
                          {idRole === 2 ? (
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={mois}
                              placeholder="Mois"
                              onChange={(val) => {
                                var text = "";
                                if (fournisseurSelect.value !== 0) {
                                  text =
                                    "LBR " +
                                    fournisseurSelect.label +
                                    " " +
                                    val.label +
                                    " " +
                                    annee;
                                } else {
                                  text = "LBR " + val.label + " " + annee;
                                }
                                setTitre(text);
                                setMois(val);
                              }}
                              options={optionsMois}
                            />
                          ) : (
                            <Form.Control
                              readOnly
                              value={mois.label}
                              placeholder="mois"
                              type="text"
                            ></Form.Control>
                          )}
                        </Col>
                        <Col className="pr-1" md="6">
                          <label>Extraction * </label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            name="Type"
                            placeholder="Extraction"
                            value={type}
                            onChange={(v) => {
                              setType(v);
                            }}
                            options={optionType}
                          />
                        </Col>
                      </Row>
                      <Row className="ta">
                        <Col md="12">
                          <hr></hr>
                          <br></br>
                          <ReactTable
                            data={entities}
                            columns={[
                              {
                                Header: "produit",
                                accessor: "designation",
                              },
                              {
                                Header: "Stock",
                                accessor: "stock",
                                Cell: ({ cell }) => (
                                  <div>
                                    <Form.Group>
                                      <Form.Control
                                        readOnly={idRole === 2 ? false : true}
                                        defaultValue={cell.row.values.stock}
                                        placeholder="stock"
                                        type="number"
                                        onBlur={(val) => {
                                          var e = [];
                                          e = [...entities];
                                          e[cell.row.id] = {
                                            ...e[cell.row.id],
                                            stock: val.target.value,
                                          };
                                          setEntities(e);
                                        }}
                                      ></Form.Control>
                                    </Form.Group>
                                  </div>
                                ),
                              },
                              {
                                Header: "Vente",
                                accessor: "vente",
                                Cell: ({ cell }) => (
                                  <div>
                                    <Form.Group>
                                      <Form.Control
                                        readOnly={idRole === 2 ? false : true}
                                        defaultValue={cell.row.values.vente}
                                        placeholder="vente"
                                        type="number"
                                        onBlur={(val) => {
                                          var e = [];
                                          e = [...entities];
                                          e[cell.row.id] = {
                                            ...e[cell.row.id],
                                            vente: val.target.value,
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
                                accessor: "",
                              },
                            ]}
                            className="-striped -highlight primary-pagination"
                          />
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

export default AjouterStock;
