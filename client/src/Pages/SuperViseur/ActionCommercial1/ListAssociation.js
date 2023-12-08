import React, { useCallback } from "react";

import NotificationAlert from "react-notification-alert";

import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";

import SweetAlert from "react-bootstrap-sweetalert";

import Select from "react-select";
import {
  getSegmentsApi,
  segmentDeleted,
  getCltSegProd,
  getLigneSegments,
} from "../../../Redux/segmentReduce";
import { useDispatch } from "react-redux";
import { packAdded } from "../../../Redux/packReduce";

function ListAssociation() {
  const dispatch = useDispatch();
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
  //limit
  const [optionsLimit] = React.useState([
    {
      value: "",
      label: "Afficher",
      isDisabled: true,
    },
    { value: "6", label: "6" },
    { value: "12", label: "12" },
    /* { value: "24", label: "24" }, */
  ]);
  const [limit, setLimit] = React.useState({ value: "6", label: "6" });

  //Association
  const [association, setAssociation] = React.useState({
    value: "1",
    label: "Segment",
  });
  const [optionsAssociation] = React.useState([
    {
      value: "",
      label: "Association",
      isDisabled: true,
    },
    { value: "1", label: "Segment" },
    { value: "2", label: "Pharmacie" },
  ]);

  //Pharmacie
  const [pharmacie, setPharmacie] = React.useState({
    value: "",
    label: "Pharmacie",
    segment: 1,
  });
  const [optionsClient, setOptionsClient] = React.useState([
    {
      value: "",
      label: "Pharmacie",
      isDisabled: true,
    },
  ]);

  //Produit
  const [produit, setProduit] = React.useState({
    value: 0,
    label: "Produit",
  });
  const [optionsProduit, setOptionsProduit] = React.useState([
    {
      value: "",
      label: "Produit",
      isDisabled: true,
    },
  ]);

  //Segment
  const [optionsSegment, setOptionsSegment] = React.useState([
    {
      value: "",
      label: "Segment",
      isDisabled: true,
    },
  ]);
  const [idSegment, setIdSegment] = React.useState({
    value: "1",
    label: "Best",
  });

  const [data, setData] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const getAllOptions = useCallback(async () => {
    var req = await dispatch(getCltSegProd());
    var arrayOption = [];
    if(req.payload){
      var pharma = req.payload.reqPharmacie;
      var prod = req.payload.reqProduit;
      var seg = req.payload.reqSegment;
      prod.unshift({value: 0,label: "Tous"})
      setOptionsSegment(seg);
      setOptionsProduit(prod);
      pharma.forEach((element) => {
        arrayOption.push({
          value: element.id_pharmacie,
          label: element.Pharmacie,
          segment: element.Segment,
        });
      });
    }
    setOptionsClient(arrayOption);


  }, [dispatch]);
  const confirmMessage = async (val, afficher, client, idSeg,prod) => {
    var segments = await dispatch(
      getLigneSegments({
        id: val.id,
        idPrincipal: val.id_principal,
      })
    );
    var res = segments.payload.rows;
    var qte_prod = segments.payload.countProd;
    var qte_principal = qte_prod[0];
    var pourcentProd = segments.payload.pourcentProd;
    localStorage.setItem("idSegment", val.Segment);
    localStorage.setItem("id_produit", val.id_principal);
    localStorage.setItem("qte_produit", qte_principal);
    localStorage.setItem("nomPack", "");
    localStorage.setItem("bonification", "0");
    setAlert(
      <SweetAlert
        customClass="pop-up-segment"
        style={{ display: "block", marginTop: "-100px" }}
        title={
          <div>
            Ajout pack
            <span className="close-pack" onClick={hideAlert}>
              x
            </span>
          </div>
        }
        onConfirm={() => save(val.id, afficher, client, idSeg,prod)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Valider"
        cancelBtnText="Non"
      >
        {/* start segment */}
        <Row>
          <Col md="6" className="input-pop-l">
            <br></br>
            <Form.Group>
              <Form.Control
                readOnly
                defaultValue={"Segment"}
                placeholder={"Segment"}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md="6" className="input-pop-r">
            <br></br>
            <Form.Group>
              <Form.Control
                readOnly
                className={"produit" + val.Segment}
                defaultValue={val.nomSegment}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        {/* end segment */}

        {/* start pack */}
        <Row>
          <Col md="6" className="input-pop-l">
            <br></br>
            <Form.Group>
              <Form.Control
                readOnly
                value={"Nom pack*"}
                placeholder={"Nom pack"}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md="6" className="input-pop-r">
            <br></br>
            <Form.Group>
              <Form.Control
                defaultValue={localStorage.getItem("nomPack")}
                placeholder={"Nom pack obligatoire"}
                type="text"
                onChange={(value) => {
                  localStorage.setItem("nomPack", value.target.value);
                }}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        {/* end segment */}

        {/* start produit 0 */}
        <Row>
          <Col md="6" className="input-pop-l">
            <br></br>
            <Form.Group>
              <Form.Control
                readOnly
                defaultValue={val.rhs}
                placeholder={"produit0"}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md="6" className="input-pop-r">
            <br></br>
            <Form.Group>
              <Form.Control
                className="qte_prod"
                defaultValue={qte_principal}
                placeholder={"Qte0"}
                type="text"
                onChange={(value) => {
                  var valProd = value.target.value;
                  localStorage.setItem("qte_produit", valProd);
                  /*
                  var qte_produit = localStorage.getItem("qte_produit"); var split_qte = qte_produit.split(",");
                  split_qte[0] = valProd;
                  var join_qte = split_qte.join(",");
                  localStorage.setItem("qte_produit", join_qte); */

                  /* qte_produit += "," + qte_prod[k];
                  localStorage.setItem("qte_produit", qte_produit); */
                  var som=0;
                  if(pourcentProd[0]>0)
                    som = valProd / pourcentProd[0];
                  var idQteProd = document.getElementsByClassName("qte_prod");
                  for (let i = 1; i < idQteProd.length; i++) {
                    var newValue = Math.round(som * pourcentProd[i]);
                    idQteProd[i].value = newValue;
                    var qte_produit = localStorage.getItem("qte_produit");
                    qte_produit += "," + newValue;
                    localStorage.setItem("qte_produit", qte_produit);
                  }
                }}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        {/* end produit 0 */}

        {/* start Liste produits */}
        {res.map((e, k) => {
          var id_produit = localStorage.getItem("id_produit");
          id_produit += "," + e.id_prod;
          localStorage.setItem("id_produit", id_produit);

          var qte_produit = localStorage.getItem("qte_produit");
          qte_produit += "," + qte_prod[k];
          localStorage.setItem("qte_produit", qte_produit);
          /* localStorage.setItem("id_produit"+k,e.id_prod)
          localStorage.setItem("qte"+k,0) */
          return (
            <Row key={"nput-pop" + k}>
              <Col md="6" className="input-pop-l">
                <br></br>
                <Form.Group>
                  <Form.Control
                    className={"produit" + e.id}
                    readOnly
                    defaultValue={e.nomProd}
                    placeholder={"produit" + (k + 1)}
                    id={"produit" + (k + 1)}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col md="6" className="input-pop-r">
                <br></br>
                <Form.Group>
                  <Form.Control
                    className="qte_prod"
                    defaultValue={qte_prod[k + 1]}
                    placeholder={"Qte" + (k + 1)}
                    id={"Qte" + (k + 1)}
                    type="text"
                    onChange={(value) => {
                      var qte_produit = localStorage.getItem("qte_produit");
                      var split_qte = qte_produit.split(",");
                      split_qte[k + 1] = value.target.value;
                      var join_qte = split_qte.join(",");
                      localStorage.setItem("qte_produit", join_qte);
                    }}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          );
        })}
        {/* end Liste produits */}

        {/* start Bonification */}
        <Row>
          <Col md="6" className="input-pop-l">
            <br></br>
            <Form.Group>
              <Form.Control
                readOnly
                defaultValue={"Bonification"}
                placeholder={"Bonification"}
                type="text"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md="6" className="input-pop-r">
            <br></br>
            <Form.Group>
              <Form.Control
                defaultValue={localStorage.getItem("bonification")}
                placeholder={"Bonification"}
                type="text"
                onChange={(value) => {
                  localStorage.setItem("bonification", value.target.value);
                }}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        {/* end Bonification */}
      </SweetAlert>
    );
  };
  const save = useCallback(
    async (id, afficher, client, idSeg,prod) => {
      var idSegment = localStorage.getItem("idSegment");
      var bonification = localStorage.getItem("bonification");
      var nomPack = localStorage.getItem("nomPack");

      var qte_produit = localStorage.getItem("qte_produit");
      var split_qte = qte_produit.split(",");
      var id_produit = localStorage.getItem("id_produit");
      var split_id = id_produit.split(",");

      /** liste produit et leur qte **/
      var verif = true;
      if (nomPack === "") {
        notify("tr", "Nom pack est obligatoire", "danger");
        verif = false;
      }
      if (bonification === "") {
        notify("tr", "Bonification est obligatoire", "danger");
        verif = false;
      }
      if (verif) {
        var idPack = 0;
        var arrayData = [];
        split_id.forEach((e, k) =>
          arrayData.push({
            produitId: split_id[k],
            quantite: split_qte[k],
          })
        );
        var valPharmacie = null;
        var valSegment = idSegment;
        if (client.value !== "") {
          valPharmacie = client.value;
          valSegment = client.segment;
        }
        dispatch(
          packAdded({
            nom: nomPack,
            bonification: bonification,
            packproduit: arrayData,
            segment: valSegment,
            idPharmacie: valPharmacie,
            id: idPack,
          })
        );
        notify("tr", "Insersion avec succès", "success");
        deleteSegment(id, afficher, client, idSeg, 0,prod);
        hideAlert();
      }
    },
    [dispatch]
  );
  const hideAlert = () => {
    localStorage.removeItem("idSegment");
    localStorage.removeItem("bonification");
    localStorage.removeItem("nomPack");

    /** liste produit et leur qte **/
    localStorage.removeItem("qte_produit");
    localStorage.removeItem("id_produit");
    setAlert(null);
  };
  const getSegmentsApis = useCallback(
    async (afficher, client, idSeg,prod) => {
      var segment = await dispatch(
        getSegmentsApi({
          limit: afficher.value,
          pharmacie: client.value,
          idSegment: idSeg.value,
          prod:prod.value
        })
      );
      var seg = segment.payload;
      var array = [];
      seg.forEach((val, key) => {
        array.push(
          <Col sm="12" lg="4" md="6" key={"Col" + key} className="list-association">
            <div className="panel panel-default panel-association">
              <div className="panel-heading">
                Pack {key + 1}
                <span
                  className="close-pack"
                  onClick={() =>
                    deleteSegment(val.id, afficher, client, idSeg, 1,prod)
                  }
                >
                  x
                </span>
              </div>
              <div className="panel-body">
                <p>{val.rhs}</p>
                <ul>
                  <li>
                    <i className="far fa-star"></i>
                    {val.lhs_1}
                  </li>
                  {val.lhs_2 !== null ? (
                    <li>
                      <i className="far fa-star"></i>
                      {val.lhs_2}
                    </li>
                  ) : ""}
                  {val.lhs_3 !== null ? (
                    <li>
                      <i className="far fa-star"></i>
                      {val.lhs_3}
                    </li>
                  ) : ""}

                  {val.lhs_4 !== null ? (
                    <li>
                      <i className="far fa-star"></i>
                      {val.lhs_4}
                    </li>
                  ) : ""}

                  {val.lhs_5 !== null ? (
                    <li>
                      <i className="far fa-star"></i>
                      {val.lhs_5}
                    </li>
                  ) : ""}
                </ul>
                <table>
                  <thead>
                    <tr>
                      <th>Lift </th>
                      <th>Support </th>
                      <th>Confidence </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{val.lift}</td>
                      <td>{val.support}</td>
                      <td>{val.confidence}</td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className="btn-wd btn-outline btn-blue"
                  type="button"
                  onClick={() => confirmMessage(val, afficher, client, idSeg,prod)}
                >
                  Enregistrer Pack
                </button>
              </div>
            </div>
          </Col>
        );
      });
      setData(array);
    },
    [dispatch]
  );
  const deleteSegment = useCallback(
    (id, afficher, client, seg, etat,prod) => {
      dispatch(segmentDeleted(id)).then(() => {
        if (etat === 1) notify("tr", "success", "Suppression avec succès");
        getSegmentsApis(afficher, client, seg,prod);
      });
    },
    [dispatch,getSegmentsApis]
  );

  React.useEffect(() => {
    localStorage.removeItem("idSegment");
    localStorage.removeItem("bonification");
    localStorage.removeItem("nomPack");

    /** liste produit et leur qte **/
    localStorage.removeItem("qte_produit");
    localStorage.removeItem("id_produit");

    getAllOptions();
    getSegmentsApis(limit, pharmacie, idSegment,produit);
  }, [getSegmentsApis, getAllOptions,limit, pharmacie, idSegment,produit]);
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>

        <Card>
          <h4 className="title-blue">Block de recherche</h4>
          <Card.Body>
            <Row>
              <Col md="2" className="pr-1">
                <label>Afficher</label>
                <Select
                  className="react-select primary"
                  classNamePrefix="react-select"
                  name="singleSelect"
                  value={limit}
                  onChange={(value) => {
                    setLimit(value);
                  }}
                  options={optionsLimit}
                  placeholder="Afficher"
                />
                <br></br>
              </Col>
              <Col md="2" className="pr-1">
                <label>Association</label>
                <Select
                  className="react-select primary"
                  classNamePrefix="react-select"
                  name="singleSelect"
                  value={association}
                  onChange={(value) => {
                    setAssociation(value);
                    setPharmacie({
                      value: "",
                      label: "Pharmacie",
                      segment: 1,
                    });
                  }}
                  options={optionsAssociation}
                  placeholder="Association"
                />
                <br></br>
              </Col>
              <Col md="3" className="pr-1">
                <label>
                  {parseInt(association.value) === 1 ? "Segment" : "Pharmacie"}
                </label>
                {parseInt(association.value) === 1 ? (
                  <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="singleSelect"
                    value={idSegment}
                    onChange={(value) => {
                      setIdSegment(value);
                    }}
                    options={optionsSegment}
                    placeholder="Segment"
                  />
                ) : (
                  <Select
                    className="react-select primary"
                    classNamePrefix="react-select"
                    name="singleSelect"
                    value={pharmacie}
                    onChange={(value) => {
                      setPharmacie(value);
                    }}
                    options={optionsClient}
                    placeholder="Pharmacie"
                  />
                )}
                <br></br>
              </Col>
              <Col md="3" className="pr-1">
                <label>Produit</label>
                <Select
                  className="react-select primary"
                  classNamePrefix="react-select"
                  name="singleSelect"
                  value={produit}
                  onChange={(value) => {
                    setProduit(value);
                  }}
                  options={optionsProduit}
                  placeholder="Produit"
                />
                <br></br>
              </Col>
              <Col md="2" className="pr-1">
                <br></br>
                <Button
                  className="btn-fill pull-right"
                  type="button"
                  variant="info"
                  onClick={() => {getSegmentsApis(limit, pharmacie, idSegment,produit)}}
                >
                  Rechercher
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Row>
          <Col md="12">
            <h4 className="title">Liste des packs</h4>
            {data.length === 0 ? (
              <Card>
                <Card.Body>
                  <div className="text-center">Aucun donnée trouvé</div>
                </Card.Body>
              </Card>
            ) : (
              <Row>
                {data}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListAssociation;
