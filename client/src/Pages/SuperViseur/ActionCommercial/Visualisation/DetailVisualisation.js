import React, { useCallback, useEffect } from "react";
import { getBlByPackClient } from "../../../../Redux/blReduce";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { getActionById } from "../../../../Redux/actionReduce";

// core components
function DetailVisualisation() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idUser = decoded.userauth.id;
  var idRole = decoded.userauth.idrole;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var idClient = location.idClient;
  var root = parseInt(location.root);
  var month_d = root === 1 ? localStorage.getItem("month_d") : 0;
  var month_f = root === 1 ? localStorage.getItem("month_f") : 0;
  var year_d = root === 1 ? localStorage.getItem("year_d") : 0;
  var year_f = root === 1 ? localStorage.getItem("year_f") : 0;
  var id = location.id;
  const [loader, setLoader] = React.useState(true);
  const [entitiesProduit, setEntitiesProduit] = React.useState([]);
  const [entitiesProduitZero, setEntitiesProduitZero] = React.useState({});
  const [entitiesProdZero, setEntitiesProdZero] = React.useState([]);
  const [entitiesPack, setEntitiesPack] = React.useState([]);
  const [montantBlAmc, setMontantBlAmc] = React.useState(0);
  const [montantBlAmm, setMontantBlAmm] = React.useState(0);
  const [objectif, setObjectif] = React.useState(0);
  const [caAmc, setCaAmc] = React.useState(0);
  const [caAmm, setCaAmm] = React.useState(0);
  const [seuilAmc, setSeuilAmc] = React.useState(0);
  const [seuilAmm, setSeuilAmm] = React.useState(0);
  const [bonificationAmc, setBonificationAmc] = React.useState(0);
  const [bonificationAmm, setBonificationAmm] = React.useState(0);
  const [boniAmcAction, setBoniAmcAction] = React.useState(0);
  const [boniAmmAction, setBoniAmmAction] = React.useState(0);
  const [pourcentAmcAction, setPourcentAmcAction] = React.useState(0);
  const [pourcentAmmAction, setPourcentAmmAction] = React.useState(0);
  const [objProduit, setObjProduit] = React.useState({});
  const [objProduitUg, setObjProduitUg] = React.useState({});
  const [objPack, setObjPack] = React.useState({});
  const [typePack, setTypePack] = React.useState(0);

  const getPackProduit = useCallback(
    async (idClient) => {
      var action = await dispatch(getActionById(id));
      var result = await action.payload.findAction;
      if (result.length !== 0) {
        setCaAmc(result[0].ca_amc);
        setCaAmm(result[0].ca_amm);
        setObjectif(result[0].objectif);
        setBoniAmmAction(result[0].unite_boni_amm / 100);
        setBoniAmcAction(result[0].unite_boni_amc / 100);
      }
      var pack = await dispatch(
        getBlByPackClient({
          idUser: idUser,
          idRole: idRole,
          idClient: idClient,
          idAction: id,
          root: root,
          year_d: year_d,
          year_f: year_f,
          month_d: month_d,
          month_f: month_f,
          mnt: result[0].objectif,
        })
      );
      //hiya sum quantite w montant selon produit
      var res_p = await pack.payload.qte_p;
      //hiya sum quantite w montant selon type produit
      var bonification = await pack.payload.bonification;
      //seuilAmc
      var action_amc = await pack.payload.action_amc;
      //seuilAmm
      var action_amm = await pack.payload.action_amm;
      //bech najbdo produit illi mawjoudine fil packs
      var objProduits = await pack.payload.objProduit;

      // type pack
      var typePack = await pack.payload.typePack;
      setTypePack(typePack);

      // bech nekhdho esm el pack
      var getPackk = await pack.payload.fetchPack;
      setObjPack(getPackk);

      var allProdZero = await pack.payload.objProduitZero;
      console.log(allProdZero);
      setEntitiesProduitZero(allProdZero);

      setObjProduit(objProduits);
      setSeuilAmc(action_amc.toFixed(3));
      setSeuilAmm(action_amm.toFixed(3));
      setEntitiesProduit(res_p);
      var boni = 0;
      var boniFinal = 0;
      // fecth all products with qteUg
      var objProduitsQUg = await pack.payload.objProduitUg;
      setObjProduitUg(objProduitsQUg);

      // fecth all products with qteUg
      // var objProduitsQUg = await pack.payload.objProduitUg;
      // setObjProduitUg(objProduitsQUg);

      //bech nahsbo bonification seuille amm et bonification seuille amc
      bonification.forEach((element) => {
        if (element.produits.type === 1) {
          setMontantBlAmc(element.mnt.toFixed(3));
          if (result.length !== 0) {
            /* boni = result[0].objectif * (result[0].unite_boni_amc / 100); */
            /* if (somme <= result[0].objectif)
              boni = element.mnt * (result[0].unite_boni_amc / 100); */
            boni = action_amc * (result[0].unite_boni_amc / 100);
            boniFinal = result[0].objectif;
            setBonificationAmc(boni.toFixed(3));
            setPourcentAmcAction(boniFinal.toFixed(3));
          }
        } else {
          setMontantBlAmm(element.mnt.toFixed(3));
          if (result.length !== 0) {
            /* boni = result[0].objectif * (result[0].unite_boni_amm / 100); */
            /* if (somme <= result[0].objectif)
              boni = element.mnt * (result[0].unite_boni_amm / 100); */
            boni = action_amm * (result[0].unite_boni_amm / 100);
            boniFinal = result[0].objectif;
            setBonificationAmm(boni.toFixed(3));
            setPourcentAmmAction(boniFinal.toFixed(3));
          }
        }
      });
      var qte_pack = await pack.payload.qte_pack;
      setEntitiesPack(qte_pack);
      var produitZero = await pack.payload.produitZero;
      setEntitiesProdZero(produitZero);
      setLoader(false);
      /* setEntitiesBonification(bonification); */
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
                  {entitiesPack.length !== 0 ? (
                    entitiesPack.map((e, k) => {
                      return (
                        <tr
                          key={"pack-" + k}
                          className={e.mnt < objectif ? "color" : ""}
                        >
                          <td>{e.packs.nom}</td>
                          <td>
                            {e.mnt ? e.mnt.toFixed(3) + " / " + objectif : ""}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr  className={"color"}>
                      <td>{objPack.nom}</td>
                      <td>
                        {" "}
                        {"0"} / {objectif}
                      </td>
                    </tr>
                  )}
                  {/* {entitiesPack.length === 0 ? (
                    <tr key={"pack-02"}>
                      <th className="center" colSpan={2}>
                        Aucun détail
                      </th>
                    </tr>
                  ) : (
                    <tr key={"pack-02"}>
                      <td className="center" colSpan={2}></td>
                    </tr>
                  )} */}
                </tbody>
              </table>
            </Card.Body>
          </Card>
          <Card className="detail-vis">
            <Card.Body>
              {/* {entitiesProduit.map((e, k) => {
              return (
                <tr
                  key={"pack-" + k}
                  className={e.mnt < e.montant_rest_p ? "color" : ""}
                >
                  <td>{e.produits ? e.produits.designation : ""}</td>
                  <td>
                    {e.produits
                      ? e.produits.type === 0
                        ? "AMM"
                        : "AMC"
                      : ""}
                  </td>
                  <td>{e.packs.nom}</td>
                  <td>
                    {e.mnt.toFixed(3)} / {e.montant_rest_p.toFixed(3)}
                  </td>
                </tr>
              );
            })} */}
              <h2>Liste des produits</h2>
              <table className="table-hover table table-vis">
                <thead>
                  <tr className="info">
                    <th>Produit</th>
                    <th>Type</th>
                    {/* <th>Marche</th> */}
                    <th>Pack</th>
                    <th>Montant BL</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {entitiesProduit.length !== 0
                    ? typePack == 1
                      ? entitiesProduit.map((e, k) => {
                          return objProduit[e.produits.id] ? (
                            <tr
                              key={"pack-" + k}
                              className={
                                parseInt(
                                  parseFloat(e.mnt) -
                                    parseFloat(
                                      objProduit[e.produits.id].montant
                                    )
                                ) < 0
                                  ? "color"
                                  : ""
                              }
                            >
                              <td>
                                {e.produits ? e.produits.designation : ""}
                              </td>
                              <td>
                                {e.produits
                                  ? e.produits.type === 0
                                    ? "AMM"
                                    : "AMC"
                                  : ""}
                              </td>
                              {/* <td>
                        {e.produits.marcheims ? e.produits.marcheims.lib : ""}
                      </td> */}
                              <td>{e.packs.nom}</td>
                              <td>
                                {Object.keys(objProduit).length > 0 &&
                                objProduit[e.produits.id]
                                  ? e.mnt.toFixed(3) +
                                    " / " +
                                    objProduit[e.produits.id].montant.toFixed(3)
                                  : 0}
                              </td>
                              <td>
                                {Object.keys(objProduit).length > 0 &&
                                objProduit[e.produits.id]
                                  ? e.quantite.toFixed(3) +
                                    " / " +
                                    objProduit[e.produits.id].quantite.toFixed(
                                      3
                                    )
                                  : 0}
                              </td>
                            </tr>
                          ) : (
                            <tr key={"pack-" + k}></tr>
                          );
                        })
                      : entitiesProduit.map((e, k) => {
                          return objProduit[e.produits.id] ? (
                            <tr key={"pack-" + k}>
                              <td>
                                {e.produits ? e.produits.designation : ""}
                              </td>
                              <td>
                                {e.produits
                                  ? e.produits.type === 0
                                    ? "AMM"
                                    : "AMC"
                                  : ""}
                              </td>
                              {/* <td>
                        {e.produits.marcheims ? e.produits.marcheims.lib : ""}
                      </td> */}
                              <td>{e.packs.nom}</td>
                              <td>
                                {Object.keys(objProduit).length > 0 &&
                                objProduit[e.produits.id]
                                  ? e.mnt.toFixed(3)
                                  : 0}
                              </td>
                              <td>
                                {Object.keys(objProduit).length > 0 &&
                                objProduit[e.produits.id]
                                  ? e.quantite.toFixed(3)
                                  : 0}
                              </td>
                            </tr>
                          ) : (
                            <tr key={"pack-" + k}></tr>
                          );
                        })
                    : // les produits eli mawjoudine fl les bls win el pach commande spontannee
                      Object.values(entitiesProduitZero).map((e, k) => {
                        return (
                          <tr key={"pack-" + k} className={"color"}>
                            <td>{e.produits ? e.produits.designation : ""}</td>
                            <td>
                              {e.produits
                                ? e.produits.type === 0
                                  ? "AMM"
                                  : "AMC"
                                : ""}
                            </td>
                            <td>{objPack.nom}</td>
                            <td>
                              {"0"} / {e.montant ? e.montant : 0}
                            </td>{" "}
                            <td>
                              {"0"} / {e.quantite ? e.quantite : 0}
                            </td>
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
                        {/* <td>
                        {e.produits.marcheims ? e.produits.marcheims.lib : ""}
                      </td> */}
                        <td>{e.packs.nom}</td>
                        <td>
                          {"0"} / {e.montant.toFixed(3)}
                        </td>
                        <td>
                          {"0"} / {e.quantite.toFixed(3)}
                        </td>
                      </tr>
                    );
                  })}
                  {/* {entitiesProduit.length === 0 &&
                  entitiesProdZero.length === 0 ? (
                    <tr key={"pack-02"}>
                      <th className="center" colSpan={6}>
                        Aucun détail
                      </th>
                    </tr>
                  ) : (
                    <tr key={"pack-02"}>
                      <td className="center" colSpan={6}></td>
                    </tr>
                  )} */}
                </tbody>
              </table>
            </Card.Body>
          </Card>
          {Object.keys(objProduitUg).length != 0 ? (
            <Card className="detail-payment">
              <Card.Body>
                <Row>
                  <Col md="6">
                    <h2>Détail UG</h2>
                  </Col>
                </Row>
                <table className="table-hover table table-vis">
                  <thead>
                    <tr className="info">
                      <th>Produit</th>
                      <th>Quantite</th>
                      <th>%</th>
                      <th>Bonification</th>
                    </tr>
                  </thead>
                  {Object.keys(objProduitUg).map((e) => {
                    return (
                      <tr key={e}>
                        <td>{objProduitUg[e].produits.designation}</td>
                        <td>
                          {" "}
                          {objProduitUg[e].quantite === undefined
                            ? "0"
                            : objProduitUg[e].quantite.toFixed(3)}{" "}
                        </td>
                        <td>{objProduitUg[e].quantiteUg.toFixed(3)}</td>
                        <td>
                          {" "}
                          {objProduitUg[e].quantite !== undefined
                            ? (
                                (objProduitUg[e].quantite *
                                  objProduitUg[e].quantiteUg) /
                                100
                              ).toFixed(3)
                            : "0"}{" "}
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </Card.Body>
            </Card>
          ) : (
            ""
          )}

          <Card className="detail-vis">
            <Card.Body>
              <h2>Liste des payments</h2>
              <table className="table-hover table table-vis">
                <thead>
                  <tr className="info">
                    <th>Type</th>
                    <th>Montant</th>
                    <th>%</th>
                    {/* <th>Montant Seuil</th>
                  <th>Bonification Seuil</th> */}
                    <th>Bonification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AMM</td>
                    <td>{montantBlAmm + " / " + caAmm}</td>
                    <td>
                      {pourcentAmmAction > 0
                        ? ((montantBlAmm / pourcentAmmAction) * 100).toFixed(3)
                        : "0.000"}
                    </td>
                    {/* <td>{seuilAmm}</td>
                  <td>{bonificationAmm}</td> */}
                    <td>
                      {parseFloat(boniAmmAction * montantBlAmm).toFixed(3)}
                    </td>
                  </tr>
                  <tr>
                    <td>AMC</td>
                    <td>{montantBlAmc + " / " + caAmc}</td>
                    <td>
                      {pourcentAmcAction > 0
                        ? ((montantBlAmc / pourcentAmcAction) * 100).toFixed(3)
                        : "0.000"}
                    </td>
                    {/* <td>{seuilAmc}</td>
                  <td>{bonificationAmc}</td> */}
                    <td>
                      {parseFloat(boniAmcAction * montantBlAmc).toFixed(3)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
}

export default DetailVisualisation;
