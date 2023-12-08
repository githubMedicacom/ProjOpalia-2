import React, { useCallback, useEffect } from "react";
import { getDetailCommande } from "../../../../Redux/blReduce";
import { getCommandeById } from "../../../../Redux/commandesReduce";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Card, Container, Row, Col, Button } from "react-bootstrap";

// core components
function DetailValider() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var id = location.idCmd;

  const [loader, setLoader] = React.useState(true);
  const [entitiesProduit, setEntitiesProduit] = React.useState([]);
  const [entitiesProdZero, setEntitiesProdZero] = React.useState([]);
  const [entitiesPack, setEntitiesPack] = React.useState([]);
  const [montantBlAmc, setMontantBlAmc] = React.useState(0);
  const [montantBlAmm, setMontantBlAmm] = React.useState(0);
  const [caAmc, setCaAmc] = React.useState(0);
  const [caAmm, setCaAmm] = React.useState(0);
  const [bonificationAmc, setBonificationAmc] = React.useState(0);
  const [bonificationAmm, setBonificationAmm] = React.useState(0);
  const [boniAmcAction, setBoniAmcAction] = React.useState(0);
  const [boniAmmAction, setBoniAmmAction] = React.useState(0);
  const [pourcentAmcAction, setPourcentAmcAction] = React.useState(0);
  const [pourcentAmmAction, setPourcentAmmAction] = React.useState(0);
  const [seuilAmc, setSeuilAmc] = React.useState(0);
  const [seuilAmm, setSeuilAmm] = React.useState(0);
  const [cmd, setCmd] = React.useState(null);
  const [objectif, setObjectif] = React.useState(0);
  const [objProduit, setObjProduit] = React.useState({});
  const [objProduitUg, setObjProduitUg] = React.useState({});
  const [typePack, setTypePack] = React.useState(0);
  const [entitiesProduitZero, setEntitiesProduitZero] = React.useState({});
  const [objPack, setObjPack] = React.useState({});

  const getDetails = useCallback(async () => {
    var action = await dispatch(getCommandeById(id));
    var result = await action.payload;
    console.log(action);
    setCmd(result);
    if (result.length !== 0) {
      setCaAmc(result.actions.ca_amc);
      setCaAmm(result.actions.ca_amm);
      setObjectif(result.actions.objectif);
      setBoniAmmAction(result.actions.unite_boni_amm / 100);
      setBoniAmcAction(result.actions.unite_boni_amc / 100);
    }
    var detail = await dispatch(
      getDetailCommande({
        id: id,
        mnt: result.actions.objectif,
        idAction: result.actions.id,
        idClient: result.id_pharmacie,
        idUser: result.id_user,
        idRole: result.users.idrole,
      })
    );

    //hiya sum quantite w montant selon produit
    var res_p = await detail.payload.qte_p;
    //hiya sum quantite w montant selon type produit
    var bonification = await detail.payload.bonification;
    //seuilAmc
    var action_amc = await detail.payload.action_amc;
    //seuilAmm
    var action_amm = await detail.payload.action_amm;
    setSeuilAmc(action_amc.toFixed(3));
    setSeuilAmm(action_amm.toFixed(3));
    setEntitiesProduit(res_p);

    /// type pack
    var typePack = await detail.payload.typePack;
    setTypePack(typePack);

    var allProdZero = await detail.payload.objProduitZero;
    setEntitiesProduitZero(allProdZero);

    var getPackk = await detail.payload.fetchPack;
    setObjPack(getPackk);

    //hiya sum quantite w montant selon pack
    var qte_pack = await detail.payload.qte_pack;
    setEntitiesPack(qte_pack);
    //bech najbdo produit illi mat3adawech fil BL
    var produitZero = await detail.payload.produitZero;
    //bech najbdo produit illi mawjoudine fil packs
    var objProduits = await detail.payload.objProduit;
    setObjProduit(objProduits);
    setEntitiesProdZero(produitZero);
    var boni = 0;
    var boniFinal = 0;

    // fecth all products with qteUg
    var objProduitsQUg = await detail.payload.objProduitUg;
    setObjProduitUg(objProduitsQUg);

    //bech nahsbo bonification seuille amm et bonification seuille amc
    bonification.forEach((element) => {
      if (element.produits.type === 1) {
        setMontantBlAmc(element.mnt.toFixed(3));
        if (result.length !== 0) {
          boni = action_amc * (result.actions.unite_boni_amc / 100);
          boniFinal = result.actions.objectif;
          setBonificationAmc(boni.toFixed(3));
          setPourcentAmcAction(boniFinal.toFixed(3));
        }
      } else {
        setMontantBlAmm(element.mnt.toFixed(3));
        if (result.length !== 0) {
          boni = action_amm * (result.actions.unite_boni_amm / 100);
          boniFinal = result.actions.objectif;
          setBonificationAmm(boni.toFixed(3));
          setPourcentAmmAction(boniFinal.toFixed(3));
        }
      }
    });
    setLoader(false);
  }, [dispatch, id]);

  const getCmd = useCallback(
    async (cmd) => {
      navigate("/telechargerFichier/" + cmd.payer + "/" + cmd.id);
      localStorage.setItem("file", cmd.decharge);
      localStorage.setItem("returnList", "detailValider/" + cmd.id);
    },
    [dispatch, id]
  );
  useEffect(() => {
    getDetails();
    /* getCmd(); */
  }, [getDetails]); //now shut up eslint
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
                    <tr className={"color"}>
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
                    <th key={"pack-02"}>
                      <td className="center" colSpan={2}></td>
                    </th>
                  )} */}
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
                    : Object.values(entitiesProduitZero).map((e, k) => {
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
          <Card className="detail-payment">
            <Card.Body>
              <Row>
                <Col md="6">
                  <h2>Liste des payments</h2>
                </Col>
                <Col md="6">
                  <Button
                    className="btn-wd btn-outline mr-1 float-right"
                    type="button"
                    variant="info"
                    onClick={() => {
                      getCmd(cmd);
                    }}
                  >
                    <span className="btn-label">
                      <i className="fa fa-money-check"></i>
                    </span>
                    Décharge
                  </Button>
                </Col>
              </Row>
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

export default DetailValider;
