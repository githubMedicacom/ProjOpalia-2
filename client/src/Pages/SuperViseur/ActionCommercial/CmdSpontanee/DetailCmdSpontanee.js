import React, { useCallback, useEffect } from "react";
import { getBlByCmdSpontanee } from "../../../../Redux/blReduce";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { getActionById } from "../../../../Redux/actionReduce";

// core components
function DetailCmdSpontanee() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idUser = decoded.userauth.id;
  var idRole = decoded.userauth.idrole;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var idClient = location.idClient;
  var id = location.id;
  const [loader, setLoader] = React.useState(true);
  const [entitiesProduit, setEntitiesProduit] = React.useState([]);
  const [entitiesProdZero, setEntitiesProdZero] = React.useState([]);
  const [entitiesPack, setEntitiesPack] = React.useState([]);
  const [montantBlAmc, setMontantBlAmc] = React.useState(0);
  const [montantBlAmm, setMontantBlAmm] = React.useState(0);
  const [objectif, setObjectif] = React.useState(0);
  const [caAmc, setCaAmc] = React.useState(0);
  const [caAmm, setCaAmm] = React.useState(0);
  const [bonificationAmc, setBonificationAmc] = React.useState(0);
  const [bonificationAmm, setBonificationAmm] = React.useState(0);
  const getPackProduit = useCallback(
    async (idClient) => {
      var req = await dispatch(getActionById(id));
      var result = (await req.payload) ? req.payload.findAction : [];
      if (result.length !== 0) {
        setCaAmc(result[0].ca_amc);
        setCaAmm(result[0].ca_amm);
        setObjectif(result[0].objectif);
      }
      var pack = await dispatch(
        getBlByCmdSpontanee({
          idUser: idUser,
          idRole: idRole,
          idClient: idClient,
          idAction: id,
        })
      );
      var res_p = await pack.payload.bl.qte_p;
      var bonification = await pack.payload.bl.bonification;
      setEntitiesProduit(res_p);
      var boni = 0;
      bonification.forEach((element) => {
        if (element.produits.type === 1) {
          setMontantBlAmc(element.mnt.toFixed(3));
          if (result.length !== 0) {
            boni = element.mnt * (result[0].unite_boni_amc / 100);
            setBonificationAmc(boni.toFixed(3));
          }
        } else {
          setMontantBlAmm(element.mnt.toFixed(3));
          if (result.length !== 0) {
            boni = element.mnt * (result[0].unite_boni_amm / 100);
            setBonificationAmm(boni.toFixed(3));
          }
        }
      });
      var qte_pack = await pack.payload.bl.qte_pack;
      setEntitiesPack(qte_pack);
      var produitZero = await pack.payload.bl.produitZero;
      setEntitiesProdZero(produitZero);
      setLoader(false);
    },
    [dispatch, id, idRole, idUser]
  );

  useEffect(() => {
    getPackProduit(idClient);
  }, [getPackProduit, idClient]); //now shut up eslint
  return (
    <>
      {loader ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <Container>
          <Row>
            <Col md="12">
              <Button
                className="btn-wd btn-outline mr-1 float-left"
                type="button"
                variant="info"
                onClick={() => {
                  var nav = localStorage.getItem("returnVis");
                  navigate(nav);
                }}
              >
                <span className="btn-label">
                  <i className="fas fa-list"></i>
                </span>
                Retour à la liste
              </Button>
            </Col>
          </Row>
          <Card className="detail-vis">
            <Card.Body>
              <h2>Liste des packs</h2>
              <table className="table-hover table table-vis">
                <thead>
                  <tr className="info">
                    <th>Pack</th>
                    <th>Montant BL</th>
                  </tr>
                </thead>
                <tbody>
                  {entitiesPack.map((e, k) => {
                    return (
                      <tr key={"pack-" + k}>
                        <td>{e.packs.nom}</td>
                        <td>{e.mnt ? e.mnt.toFixed(3) : ""}</td>
                      </tr>
                    );
                  })}
                  {entitiesPack.length === 0 ? (
                    <tr key={"pack-02"}>
                      <td className="center" colSpan={2}>
                        Aucun détail
                      </td>
                    </tr>
                  ) : (
                    <tr key={"pack-02"}>
                      <td className="center" colSpan={2}></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card.Body>
          </Card>
          <Card className="detail-vis">
            <Card.Body>
              <h2>Liste des produits</h2>
              <table className="table-hover table table-vis">
                <thead>
                  <tr className="info">
                    <th>Produit</th>
                    <th>Type</th>
                    <th>Pack</th>
                    <th>Montant BL</th>
                  </tr>
                </thead>
                <tbody>
                  {entitiesProduit.map((e, k) => {
                    return (
                      <tr key={"pack-" + k}>
                        <td>{e.produits ? e.produits.designation : ""}</td>
                        <td>
                          {e.produits
                            ? e.produits.type === 0
                              ? "AMM"
                              : "AMC"
                            : ""}
                        </td>
                        <td>{e.packs.nom}</td>
                        <td>{e.mnt.toFixed(3)}</td>
                      </tr>
                    );
                  })}
                  {entitiesProdZero.map((e, k) => {
                    return (
                      <tr key={"packzero-" + k} className={"color"}>
                        <td>{e.produits ? e.produits.designation : ""}</td>
                        <td>
                          {e.produits
                            ? e.produits.type === 0
                              ? "AMM"
                              : "AMC"
                            : ""}
                        </td>
                        <td>{e.packs.nom}</td>
                        <td>{"0"}</td>
                      </tr>
                    );
                  })}
                  {entitiesProduit.length === 0 &&
                  entitiesProdZero.length === 0 ? (
                    <tr key={"pack-02"}>
                      <td className="center" colSpan={6}>
                        Aucun détail
                      </td>
                    </tr>
                  ) : (
                    <tr key={"pack-02"}>
                      <td className="center" colSpan={6}></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card.Body>
          </Card>
          {/* <Card className="detail-vis">
          <Card.Body>
            <h2>Liste des payments</h2>
            <table className="table-hover table table-vis">
              <thead>
                <tr className="info">
                  <th>Type</th>
                  <th>Montant</th>
                  <th>Bonification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AMM</td>
                  <td>{montantBlAmm}</td>
                  <td>{bonificationAmm}</td>
                </tr>
                <tr>
                  <td>AMC</td>
                  <td>{montantBlAmc}</td>
                  <td>{bonificationAmc}</td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card> */}
        </Container>
      )}
    </>
  );
}

export default DetailCmdSpontanee;
