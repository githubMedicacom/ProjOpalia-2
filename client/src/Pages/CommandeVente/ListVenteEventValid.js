import ReactTable from "../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import {
  deleteCmd,
  getCmdValider,
  getDetail,
} from "../../Redux/commandeVenteReduce";
import SweetAlert from "react-bootstrap-sweetalert";
import { getActiveDelegue } from "../../Redux/usersReduce";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// core components
function ListVenteEventValid() {
  document.title = "Liste des document";
  var dateToday = new Date();
  var eventDate = dateToday.getDate() + "/" + (dateToday.getMonth() + 1) + "/" + dateToday.getFullYear();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var annee = localStorage.getItem("annee");
  var idUser = decoded.userauth.id;
  var idLine = decoded.userauth.line;
  var idRole = decoded.userauth.idrole;
  const dispatch = useDispatch();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);
  const [entitiesE, setEntitiesE] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const [delegueSelect, setDelegueSelect] = React.useState({
    value: 0,
    label: "Délégué",
  });

  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Délégué",
      isDisabled: true,
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

  const getAllCommande = useCallback(
    async (u) => {
      var id = idRole === 2 ? idUser : u;
      var document = await dispatch(
        getCmdValider({
          annee: annee,
          idUser: id,
          idLine: idLine,
          idRole: idRole,
        })
      );
      var res = await document.payload;
      setEntities(res);

      var array = []
      res.forEach(val=>{
        array.push({
          numero:val.numero,
          user:val.users.nomU,
          pharmacies:val.pharmacies.nom,
          date:val.date,
          total:val.total,
          createdAt:new Date(new Date(val.createdAt).getTime() - new Date(val.createdAt).getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
            .replace("T", " à "),
        })
      })
      setEntitiesE(array);
    },
    [dispatch, annee, idUser, idLine, idRole]
  );

  const getDelegue = useCallback(async () => {
    var delegueBD = await dispatch(getActiveDelegue());
    var entities = delegueBD.payload;
    var arrayOption = [
      {
        value: 0,
        label: "Tous",
      },
    ];
    entities.forEach((e) => {
      arrayOption.push({
        value: e.id,
        label: e.nomU + " " + e.prenomU,
      });
      /* if (e.id === p) {
          setDelegueSelect({ value: e.users.id, label: e.users.nomU + " " + e.users.prenomU });
        } */
    });
    setOptions(arrayOption);
  }, [dispatch]);

  useEffect(() => {
    getAllCommande(0);
    getDelegue();
  }, [getAllCommande, getDelegue]); //now shut up eslint

  const deleteMessage = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sure de supprimer cette ligne?"}
        onConfirm={() => deleteLigne(id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  function deleteLigne(id) {
    dispatch(deleteCmd(id)).then(() => {
      getAllCommande(0);
      notify("tr", "Supprimer avec succès", "success");
      hideAlert();
    });
  }
  const hideAlert = () => {
    setAlert(null);
  };
  const detail = useCallback(
    async (p) => {
      var det = await dispatch(getDetail(p.id));
      var data = await det.payload;
      setAlert(
        <SweetAlert
          customClass="pop-up-bl"
          style={{ display: "block", marginTop: "-100px" }}
          title={"Détail"}
          onConfirm={() => hideAlert()}
          cancelBtnBsStyle="danger"
        >
          {
            <table className="table table-bordered">
              <thead>
                <tr className="table-info">
                  <th>Numéro</th>
                  <th>Nom délégue</th>
                  <th>Date</th>
                  <th>Pharmacie</th>
                  <th>Grossiste</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{p.numero}</td>
                  <td>
                    {p.users.nomU} {p.users.prenomU}
                  </td>
                  <td>{p.date}</td>
                  <td>{p.pharmacies.nom}</td>
                  <td>{p.fournisseur}</td>
                </tr>
              </tbody>
            </table>
          }
          <table className="table table-bordered">
            <thead>
              <tr className="table-info">
                <th>Quantité</th>
                <th>Produit</th>
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
                    <td>{(e.montant / e.quantite).toFixed(3)}</td>
                    <td>{e.montant.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h2>{"Total: " + p.total.toFixed(3)}</h2>
        </SweetAlert>
      );
    },
    [dispatch]
  );
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>

        {idRole <= 1 ? (
          <Row>
            <Col md="6">
              <label>Délégué </label>
              <Select
                className="react-select primary"
                classNamePrefix="react-select"
                value={delegueSelect}
                onChange={(value) => {
                  setDelegueSelect(value);
                  getAllCommande(value.value);
                }}
                options={options}
              />
            </Col>
            <Col md="6" className="pdfExcel">
              <ExcelFile
                element={<button id="export">Export Excel</button>}
                filename={"Event validé "+eventDate}
              >
                <ExcelSheet data={entitiesE} name="Produits">
                  <ExcelColumn label="Numero" value="numero" />
                  <ExcelColumn label="Délégué" value="user" />
                  <ExcelColumn label="Pharmacie" value="pharmacies" />
                  <ExcelColumn label="Date commande" value="date" />
                  <ExcelColumn label="Date insertion" value="createdAt" />
                  <ExcelColumn label="total" value="total" />
                  {/* 
                        <ExcelColumn label="idBl" value="idBl" /> */}
                </ExcelSheet>
              </ExcelFile>
            </Col>
          </Row>
        ) : ""}

        <Row>
          <Col md="12">
            <h4 className="title">Liste des commandes</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "numero",
                      accessor: "numero",
                    },
                    {
                      Header: "Délégué",
                      accessor: "users.nomU",
                      Cell: ({ cell }) =>
                        cell.row.original.users.nomU +
                        " " +
                        cell.row.original.users.prenomU,
                    },
                    {
                      Header: "Pharmacie",
                      accessor: "pharmacies.nom",
                    },
                    {
                      Header: "Date commande",
                      accessor: "date",
                    },
                    {
                      Header: "Date insertion",
                      accessor: "createdAt",
                      Cell: ({ cell }) => (
                        <div>
                          {new Date(
                            new Date(cell.row.original.createdAt).getTime() -
                              new Date(
                                cell.row.original.createdAt
                              ).getTimezoneOffset() *
                                60000
                          )
                            .toISOString()
                            .slice(0, 16)
                            .replace("T", " à ")}
                        </div>
                      ),
                    },
                    {
                      Header: "Total",
                      accessor: "total",
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            id={"idLigneV_" + cell.row.values.id}
                            onClick={(e) => {
                              detail(cell.row.original);
                            }}
                            className="delete btn btn-success"
                          >
                            <i
                              className="fa fa-eye"
                              id={"idLigneV_" + cell.row.values.id}
                            />
                          </Button>
                          {idRole <= 1 ? (
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={(e) => {
                                deleteMessage(cell.row.values.id);
                              }}
                              className="delete btn btn-danger ml-1 float-right"
                            >
                              <i
                                className="fa fa-trash"
                                id={"idLigne_" + cell.row.values.id}
                              />
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {entities.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
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

export default ListVenteEventValid;
