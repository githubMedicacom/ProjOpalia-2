import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { getProduitsByMarche, veilleAdded } from "../../../Redux/veilleReduce";
import { getActiveFournisseur } from "../../../Redux/fournisseurReduce";
import { fetchMarcheIms } from "../../../Redux/marcheImsReduce";
import ReactTable from "../../../components/ReactTable/ReactTable.js";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

function AjouterVeille() {
  document.title = "Liste des veilles";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = React.useState([]);
  const [marche, setMarche] = React.useState([]);
  const [titre, setTitre] = React.useState("");
  const notificationAlertRef = React.useRef(null);
  const annee = localStorage.getItem("annee");

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

  const [mois, setMois] = React.useState({
    value: 0,
    label: "Mois",
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

  const getMarche = useCallback(async () => {
    var marche = await dispatch(fetchMarcheIms());

    var obj = {};

    marche.payload.forEach((element) => {
      obj[element.id] = element.lib;
    });

    setMarche(obj);
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

  const listProduits = useCallback(
    async (fournisseurSelect, mois, annee) => {
      console.log(fournisseurSelect, mois, annee);
      var valFour = fournisseurSelect.value;
      var mm = mois.value;

      if (valFour !== 0 && mm !== 0) {
        var list = await dispatch(
          getProduitsByMarche({
            idMarche: 1,
            annee: annee,
            mois: mm,
            id_fournisseur: valFour,
          })
        );
        var res = list.payload;

        setData(res);
      }
    },
    [dispatch]
  );

  function submitForm(event) {
    var verif = true;
    var mm = mois.value;
    var valFour = fournisseurSelect.value;

    if (titre === "" || verif === false || mm === 0)
      notify("tr", "Vérifier vos donnée", "danger");
    else {
      dispatch(
        veilleAdded({
          mois: mois,
          ligneVeille: data,
          titre: titre,
          annee: annee,
          id_fournisseur: valFour,
        })
      );
    }
  }

  useEffect(() => {
    listProduits(fournisseurSelect, mois, annee);
    getMarche();
    getFournisseur();
  }, [getMarche, fournisseurSelect, mois, annee]);

  function listeveilles() {
    navigate("/ListVeille");
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Button
              id="saveBL"
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={listeveilles}
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
            <h4 className="title">Ajouter une veille</h4>
            <Card>
              <Card.Body>
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group>
                      <label>Titre* </label>
                      <Form.Control
                        className="bold"
                        value={titre}
                        placeholder="Titre"
                        type="text"
                        onChange={(value) => {
                          setTitre(value.target.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="6">
                    <label>Mois* </label>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      value={mois}
                      onChange={(value) => {
                        setMois(value);

                        listProduits(fournisseurSelect, mois, annee);
                      }}
                      options={optionsMois}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="pl-1" md="6">
                    <label>Grossiste* </label>

                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      value={fournisseurSelect}
                      placeholder="Grossiste"
                      onChange={(val) => {
                        setFournisseurSelect(val);

                        listProduits(fournisseurSelect, mois, annee);
                      }}
                      options={optionFournisseur}
                    />
                  </Col>
                </Row>

                {fournisseurSelect.value !== 0 && mois.value !== 0
                  ? Object.keys(data).map((e) => (
                      <div>
                        <h3>Marché :{marche[e]}</h3>
                        <ReactTable
                          data={Object.values(data[e])}
                          columns={[
                            {
                              Header: "produit",
                              accessor: "nom_produit",
                            },
                            {
                              Header: "Stock",
                              accessor: "stock",
                              Cell: ({ cell }) => (
                                <div>
                                  <Form.Group>
                                    <Form.Control
                                      readOnly={
                                        cell.row.original.type == 1
                                          ? true
                                          : false
                                      }
                                      defaultValue={cell.row.values.stock}
                                      placeholder="stock"
                                      type="number"
                                      onBlur={(val) => {
                                        var e = [];
                                        e = [...data];
                                        e[cell.row.id] = {
                                          ...e[cell.row.id],
                                          stock: val.target.value,
                                        };
                                        setData(e);
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
                                      defaultValue={cell.row.values.vente}
                                      readOnly={
                                        cell.row.original.type == 1
                                          ? true
                                          : false
                                      }
                                      placeholder="vente"
                                      type="number"
                                      onBlur={(val) => {
                                        var e = [];
                                        e = [...data];
                                        e[cell.row.id] = {
                                          ...e[cell.row.id],
                                          vente: val.target.value,
                                        };
                                        setData(e);
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
                        <hr></hr>{" "}
                      </div>
                    ))
                  : ""}
                <Button
                  className="btn-fill pull-right"
                  type="button"
                  variant="info"
                  onClick={submitForm}
                >
                  Enregistrer
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AjouterVeille;
