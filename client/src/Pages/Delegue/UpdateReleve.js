import React, { useEffect, useCallback, useState } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";

import {
  getDetailReleve,
  getFileReleve,
  updateReleve,
  verifReleve,
} from "../../Redux/releveReduce";
import { getActiveProduit } from "../../Redux/produitReduce";
import { useDispatch } from "react-redux";
import ReactTable from "../../components/ReactTable/ReactTableBl.js";
import jwt_decode from "jwt-decode";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import "cropperjs/dist/cropper.css";
import { useNavigate, useParams } from "react-router";

function UpdateReleve() {
  var token = localStorage.getItem("x-access-token");
  var annee = localStorage.getItem("annee");
  var decoded = jwt_decode(token);
  const idUser = decoded.userauth.id;
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
  const location = useParams();
  const navigate = useNavigate();

  var idBl = location.idR;

  //Produit
  const [produitSelect, setProduitSelect] = React.useState([]);
  const [optionProduit, setOptionProduit] = React.useState([
    {
      value: "",
      label: "Produit",
      isDisabled: true,
    },
  ]);

  //type
  const [typeSelect, setTypeSelect] = React.useState([]);
  const [optionType] = React.useState([
    {
      value: "",
      label: "Type",
      isDisabled: true,
    },
    {
      value: "1",
      label: "Stock",
    },
    {
      value: "2",
      label: "Vente",
    },
  ]);

  //table body
  const [entities, setEntities] = useState([]);
  const [date, setDate] = useState();

  /** start crop img**/
  const [loader, setLoader] = React.useState(true);
  const [fileURL, setFileURL] = React.useState(null);
  const [ext, setExt] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  /** end crop img**/

  const [objProduit, setObjProduit] = React.useState({});

  // Mois
  const [mois, setMois] = React.useState(null);
  const [moisSelect, setMoisSelect] = React.useState([]);
  const [optionsMois] = React.useState([
    {
      value: "",
      label: "Mois",
      isDisabled: true,
    },
    { value: "1", label: "janvier" },
    { value: "2", label: "février" },
    { value: "3", label: "mars" },
    { value: "4", label: "avril" },
    { value: "5", label: "mai" },
    { value: "6", label: "juin" },
    { value: "7", label: "juillet" },
    { value: "8", label: "août" },
    { value: "9", label: "septembre" },
    { value: "10", label: "octobre" },
    { value: "11", label: "novembre" },
    { value: "12", label: "décembre" },
  ]);

  const getFile = React.useCallback(
    async (file) => {
      var fileLocal = localStorage.getItem("file");
      if (fileLocal !== "null") {
        setFileName(fileLocal);
        var splitFile = fileLocal.split(".");
        var ext1 = splitFile[splitFile.length - 1];
        setExt(ext1);
        dispatch(getFileReleve(idBl)).then(async (e1) => {
          var ff = null;
          if (ext1.toLowerCase() === "pdf") {
            ff = new Blob([e1.payload], {
              type: "application/pdf",
            });
          } else {
            ff = new Blob([e1.payload], {
              type: "application/*",
            });
          }

          const f = URL.createObjectURL(ff);
          setFileURL(f);
        });
      }
    },
    [dispatch, idBl]
  );

  const setTable = useCallback(async (table, init) => {
    var arrayBody = [];
    if (init === 0) {
      table.forEach((value) => {
        arrayBody.push({
          Designation: value.produits.designation,
          Mesure: value.mesure.toFixed(3),
          Code: value.produits.code,
          Type: value.type,
          Mois: value.mois,
          idProduit: value.produits.id,
          annee: annee,
          createdAt : value.releves.createdAt ,
        });
        var date = new Date(
          new Date(value.releves.createdAt).getTime() -
            new Date(value.releves.createdAt).getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10);
        setDate(date);
      });
      setEntities(arrayBody);
    } else {
      table.forEach((value) => {
        arrayBody.push({
          Designation: value.Designation,
          Mesure: parseInt(value.Mesure).toFixed(3),
          Code: value.Code,
          Type: value.Type,
          Mois: value.Mois,
          idProduit: value.idProduit,
          annee: annee,
          createdAt : value.createdAt ,
        });
        var date = new Date(
          new Date(value.createdAt).getTime() -
            new Date(value.createdAt).getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 10);
        setDate(date);
      });
      setEntities(arrayBody);
    }
  }, []);
  const detailBl = useCallback(async () => {
    var det = await dispatch(getDetailReleve(idBl));
    var detail = await det.payload;
    console.log(detail)
    setTable(detail, 0, {}, {}, {});
  }, [dispatch, idBl]);

  //get Produit
  // bech najbdo produit etat mtehom 1
  const getproduit = useCallback(async () => {
    var type = await dispatch(getActiveProduit());
    var entities = type.payload;
    var arrayOption = [];
    var obj = {};
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.designation, code: e.code });
      obj[e.id] = e;
    });
    setOptionProduit(arrayOption);
    setObjProduit(obj);
  }, [dispatch]);

  const removeProduit = useCallback(
    async (list, select, id) => {
      list[id].idProduit = null;
      list[id].Designation = null;
      select[id] = null;
      console.log(list)
      setProduitSelect(select);
      setEntities(list);
      setTable(list, 1, {}, {}, {});
    },
    [setTable]
  );

  // ajouter nouveau ligne entities
  function AjoutLigne(event) {
    var list = [];
    if (entities.length > 0) list = [...entities];
    list[list.length] = {
      Designation: null,
      Mesure: 0,
      Type: 0,
      Code: 0,
      Mois: 0,
      idProduit: null,
    };
    setEntities(list);
  }

  // Effacer les lignes
  function deleteLigne(nb) {
    if (entities.length > 1) {
      var list1 = [...produitSelect];
      list1.splice(parseInt(nb), 1);
      setProduitSelect(list1);
      var filtered = entities.filter(function (value, index, arr) {
        return index !== parseInt(nb);
      });
      setEntities(filtered);
      notify("tr", "Supprimer avec succes", "success");
    } else {
      notify("tr", "il faut contient au moins une ligne", "warning");
    }
  }

  //sauvgarder les données dans la BD
  const saveTable = useCallback(
    async (entities , date ) => {
      var verif = true;
      if (entities.length > 0) {
        entities.forEach((data) => {
          if (data.idProduit === null) verif = false;
          // if (data.Mesure === "" || parseInt(data.Mesure) === 0) verif = false;
          if (data.Type === "" || data.Type === 0) verif = false;
          if (data.Mois === "" || data.Mois === 0) verif = false;
        });
      } else {
        verif = false;
      }

      if (verif === false) {
        notify("tr", "Vérifier vos données!", "danger");
      } else {
        dispatch(updateReleve({ ligne: entities, idBl: idBl , date : date })).then((e) => {
          if (e.payload === true) {
            notify("tr", "Modifier avec succes", "success");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            notify("tr", "Vérifier vos données!", "danger");
          }
        });
      }
    },
    [dispatch]
  );


  useEffect(() => {
    getproduit();
    detailBl();
    getFile(idBl);
  }, [getproduit, getFile, idBl]);

  return (
    <>
      <Container  fluid className="responsive-BL table-dynamique update-releve">
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
                    navigate("/visualisationReleve");
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
                        <Card.Title as="h4">Modifier Relevé</Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      {ext.toLowerCase() === "pdf" ? (
                        <div className="visualiser">
                          <iframe
                            title="Transition"
                            width="100%"
                            height="500px"
                            src={`${fileURL}#toolbar=0`}
                          ></iframe>
                          <br></br>
                          <a
                            className="btn btn-info"
                            download={fileName}
                            rel="noreferrer"
                            href={fileURL}
                            target="_blank"
                          >
                            <i className="fas fa-file"></i> Télécharger
                          </a>
                        </div>
                      ) : (
                        <div className="visualiser">
                          <img src={fileURL} className="img-file" alt=""></img>
                          <br></br>
                          {localStorage.getItem("file") !== "null" ? (
                            <a
                              download={fileName}
                              rel="noreferrer"
                              href={fileURL}
                              target="_blank"
                              className="btn btn-info"
                            >
                              <i className="fas fa-download"></i> Télécharger
                            </a>
                          ) : (
                            ""
                          )}
                        </div>
                      )}

                      <Col md="6">
                        <label>Date d'insertion</label>
                        <Form.Group>
                          <Form.Control
                            defaultValue={date}
                            type="date"
                            onChange={(d) => {
                              setDate(d.target.value);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </Col>

                      <Row>
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
                                    {entities[cell.row.id].idProduit !==
                                    null ? (
                                      <Form.Group className="desinationProduit">
                                        <Form.Control
                                          className="green"
                                          readOnly
                                          defaultValue={
                                            cell.row.values.Designation
                                          }
                                          placeholder="Designation"
                                          type="text"
                                        ></Form.Control>
                                        <Button
                                          onClick={() => {
                                            removeProduit(
                                              entities,
                                              produitSelect,
                                              cell.row.id
                                            );
                                          }}
                                        >
                                          <i className="fa fa-trash" />
                                        </Button>
                                      </Form.Group>
                                    ) : (
                                      <div className="table-bl">
                                        {cell.row.values.Designation != null ? (
                                          <Form.Group className="desinationProduit">
                                            <Form.Control
                                              className="red"
                                              readOnly
                                              defaultValue={
                                                cell.row.values.Designation
                                              }
                                              placeholder="Designation"
                                              type="text"
                                            ></Form.Control>
                                            <Button
                                              onClick={() => {
                                                removeProduit(
                                                  entities,
                                                  produitSelect,
                                                  cell.row.id
                                                );
                                              }}
                                            >
                                              <i className="fa fa-trash" />
                                            </Button>
                                          </Form.Group>
                                        ) : (
                                          ""
                                        )}
                                        <Select
                                          className="react-select primary "
                                          classNamePrefix="react-select"
                                          name="Produit"
                                          placeholder="Produit"
                                          value={produitSelect[cell.row.id]}
                                          onChange={(v) => {
                                            var e = [...entities];
                                            var select = produitSelect;
                                            e[cell.row.id].idProduit = v.value;
                                            e[cell.row.id].Designation =
                                              v.label;
                                            e[cell.row.id].Code = v.code;
                                            select[cell.row.id] = v;
                                            setProduitSelect(select);
                                            setEntities(e);
                                          }}
                                          options={optionProduit}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ),
                              },
                              {
                                Header: "Mesure",
                                accessor: "Mesure",
                                Cell: ({ cell }) => (
                                  <div>
                                    <Form.Group>
                                      <Form.Control
                                        className="Mesure"
                                        defaultValue={cell.row.values.Mesure}
                                        placeholder="Mesure"
                                        type="number"
                                        onBlur={(val) => {
                                          var e = [];
                                          e = [...entities];
                                          e[cell.row.id] = {
                                            ...e[cell.row.id],
                                            Mesure: val.target.value,
                                          };
                                          setEntities(e);
                                        }}
                                      ></Form.Control>
                                    </Form.Group>
                                  </div>
                                ),
                              },
                              {
                                Header: "Type",
                                accessor: "Type",
                                Cell: ({ cell }) => (
                                  <div>
                                    {entities[cell.row.id].Type !== 0 ? (
                                      cell.row.values.Type == 1 ? (
                                        "stock"
                                      ) : (
                                        "vente"
                                      )
                                    ) : (
                                      <div className="table-bl">
                                        <Select
                                          className="react-select primary "
                                          classNamePrefix="react-select"
                                          name="Produit"
                                          placeholder="Type"
                                          value={typeSelect[cell.row.id]}
                                          onChange={(v) => {
                                            var e = [...entities];
                                            var select = typeSelect;
                                            e[cell.row.id].Type = v.value;
                                            select[cell.row.id] = v;
                                            setTypeSelect(select);
                                          }}
                                          options={optionType}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ),
                              },
                              {
                                Header: "Mois",
                                accessor: "Mois",
                                Cell: ({ cell }) => (
                                  <div>
                                    {entities[cell.row.id].Mois !== 0 ? (
                                      cell.row.values.Mois
                                    ) : (
                                      <div className="table-bl">
                                        <Select
                                          className="react-select primary "
                                          classNamePrefix="react-select"
                                          name="Produit"
                                          placeholder="Mois"
                                          value={moisSelect[cell.row.id]}
                                          onChange={(v) => {
                                            var e = [...entities];
                                            var select = moisSelect;
                                            e[cell.row.id].Mois = v.value;
                                            select[cell.row.id] = v;
                                            setMoisSelect(select);
                                          }}
                                          options={optionsMois}
                                        />
                                      </div>
                                    )}
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
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="info"
                        onClick={() => saveTable(entities,date)}
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
export default UpdateReleve;
