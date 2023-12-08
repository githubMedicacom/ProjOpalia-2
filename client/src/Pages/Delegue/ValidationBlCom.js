import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import {
  getBlComm,
  blChangeEtat,
  blDeleted,
  getDetailBl,
  getAllDelegueBl,
} from "../../Redux/blReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";

function ValidationBlCom() {
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var year = localStorage.getItem("annee");
  localStorage.removeItem("bonification");
  localStorage.removeItem("commentaire");
  var decoded = jwt_decode(token);
  const idLine = decoded.userauth.line;
  const idRole = decoded.userauth.idrole;
  const [data, setData] = React.useState([]);

  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Délégué",
      isDisabled: true,
    },
  ]);
  const [delegueSelect, setDelegueSelect] = React.useState({
    value: 0,
    label: "Délégué",
  });

  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
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
  const confirmMessage = (id, boni, etat, idRow) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={
          etat === 1
            ? "Étes vous sure d'accepter Bl?"
            : etat === 2
            ? "Étes vous sure d'annuler Bl?"
            : "Étes vous sure de supprimer Bl?"
        }
        onConfirm={() => changeEtat(id, etat, idRow)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  function changeEtat(id, etat, idRow) {
    var bonification = etat === 1 ? localStorage.getItem("bonification") : null;
    var commentaire = null;
    var verifComm = true;
    if (etat === 2) {
      commentaire = localStorage.getItem("commentaire");
      if (commentaire === "" || commentaire === null) {
        verifComm = false;
        notify("tr", "Commentaire est obligatoire", "danger");
      }
    }
    if (etat !== 3 && verifComm) {
      dispatch(blChangeEtat({ id, etat, bonification, commentaire })).then(
        (e1) => {
          listeBl(0);
          switch (etat) {
            case 1:
              notify("tr", "Bl valider avec succes", "success");
              break;
            case 2:
              notify("tr", "Bl refusé avec succes", "success");
              break;
            default:
              break;
          }
        }
      );
      hideAlert();
    } else if (etat === 3) {
      var list = data;
      list.splice(idRow, 1);
      setData(list);
      dispatch(blDeleted({ id }));
      notify("tr", "Supprimer avec succès", "success");
      hideAlert();
    }
  }
  const hideAlert = () => {
    setAlert(null);
  };
  /* detailBl */
  const detailBl = useCallback(
    async (p) => {
      var det = await dispatch(getDetailBl(p.id));
      var data = await det.payload;
      setAlert(
        <SweetAlert
          customClass="pop-up-bl"
          style={{ display: "block", marginTop: "-100px" }}
          title={"Détail BL"}
          onConfirm={() => hideAlert()}
          cancelBtnBsStyle="danger"
        >
          <table className="table table-bordered">
            <thead>
              <tr className="table-info">
                <th>Nom délégue</th>
                <th>Numéro BL</th>
                <th>Date BL</th>
                <th>Pharmacie</th>
                <th>Grossiste</th>
                <th>Bricks</th>
                <th>Pack</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{p.users}</td>
                <td>{p.numeroBl}</td>
                <td>{p.date}</td>
                <td>{p.pharmacie}</td>
                <td>Opalia</td>
                <td>{p.ims}</td>
                <td>Vente direct</td>
              </tr>
            </tbody>
          </table>
          <table className="table table-bordered">
            <thead>
              <tr className="table-info">
                <th>Quantité</th>
                <th>Produit</th>
                <th>Code PCT</th>
                <th>PU</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {data.map((e) => {
                return (
                  <tr key={"ligne-" + e.id}>
                    <td>{e.quantite}</td>
                    <td>{e.produits.designation}</td>
                    <td>{e.produits.code}</td>
                    <td>{(e.montant / e.quantite).toFixed(3)}</td>
                    <td>{e.montant.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SweetAlert>
      );
    },
    [dispatch]
  );

  const getDelegue = useCallback(
    async (p) => {
      var delegueBD = await dispatch(getAllDelegueBl({ idLine, idRole, year }));
      var entities = delegueBD.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({
          value: e.users.id,
          label: e.users.nomU + " " + e.users.prenomU,
        });
        if (e.id === p) {
          setDelegueSelect({
            value: e.users.id,
            label: e.users.nomU + " " + e.users.prenomU,
          });
        }
      });
      setOptions(arrayOption);
    },
    [dispatch, idLine, idRole, year]
  );
  
  const listeBl = useCallback(async () => {
    var list = await dispatch(
      getBlComm({
        year: year,
      })
    );
    var res = list.payload;
    setData(res);
  }, [dispatch, year]);
  React.useEffect(() => {
    listeBl(0);
    if (idRole === 1) getDelegue();
  }, [listeBl, idRole, getDelegue]);

  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          {idRole === 1 ? (
            <Col md="6">
              <label>Délégué </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={delegueSelect}
                onChange={(value) => {
                  setDelegueSelect(value);
                  listeBl(value.value);
                }}
                options={options}
              />
            </Col>
          ) : (
            ""
          )}
          <Col md="12">
            <h4 className="title">Validation BL</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Numéro BL",
                      accessor: "numeroBl",
                    },
                    {
                      Header: "Pharmacies",
                      accessor: "pharmacie",
                    },
                    {
                      Header: "Total",
                      accessor: "mnt",
                    },
                    {
                      Header: "Date",
                      accessor: "date",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          {cell.row.values.date !== null
                            ? new Date(cell.row.values.date)
                                .toISOString()
                                .slice(0, 10)
                            : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            id={"idLigneV_" + cell.row.values.id}
                            onClick={(e) => {
                              detailBl(cell.row.original);
                            }}
                            className="delete btn btn-success"
                          >
                            <i
                              className="fa fa-eye"
                              id={"idLigneV_" + cell.row.values.id}
                            />
                          </Button>
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            onClick={(e) => {
                              confirmMessage(
                                cell.row.values.id,
                                cell.row.original.bonification,
                                1,
                                cell.row.id
                              );
                            }}
                            className="delete btn btn-success ml-1"
                          >
                            <i
                              className="fa fa-check"
                              id={"idLigneC_" + cell.row.values.id}
                            />
                          </Button>
                          <Button
                            id={"idLigne_" + cell.row.values.id}
                            onClick={(e) => {
                              confirmMessage(
                                cell.row.values.id,
                                cell.row.original.bonification,
                                3,
                                cell.row.id
                              );
                            }}
                            className="delete btn btn-danger ml-1 float-right"
                          >
                            <i
                              className="fa fa-trash"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {data.length === 0 ? (
                  <div className="text-center">Aucun bl trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ValidationBlCom;
