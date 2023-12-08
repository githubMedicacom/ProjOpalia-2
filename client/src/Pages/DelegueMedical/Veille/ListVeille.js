import React, { useCallback } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { allVeille, deleteVeille } from "../../../Redux/veilleReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../../../components/ReactTable/ReactTable.js";
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ListVeille() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var token = localStorage.getItem("x-access-token");
  var year = localStorage.getItem("annee");
  localStorage.removeItem("bonification");
  var decoded = jwt_decode(token);
  const id = decoded.userauth.id;
  const idRole = decoded.userauth.idrole;
  var idLine = 0;
  if (idRole !== 0) {
    idLine = decoded.userauth.line;
  }

  const [data, setData] = React.useState([]);
  const [loader, setLoader] = React.useState(true);

 

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

  const confirmMessage = (bl, idRow) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes Vous sure de supprimer ce veille?"}
        onConfirm={() => {
          deleteVeilles(bl.id, idRow);
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  function deleteVeilles(id, idRow) {
    var list = data;
    list.splice(idRow, 1);
    setData(list);
    dispatch(deleteVeille({ id }));
    notify("tr", "Supprimer avec succès", "success");
    hideAlert();
  }
  const hideAlert = () => {
    setAlert(null);
  };


  function ajouter() {
    navigate('/AjouterVeille');
  }



  const listeVeille= useCallback(
    async (year) => {
      var list = await dispatch(
        allVeille({
          annee: year
        })
      );
      var res = list.payload;
      setLoader(false);
      setData(res);
    },
    [dispatch, year]
  );
  React.useEffect(() => {
    
  const annee =localStorage.getItem("annee");
    listeVeille(annee)
  }, [listeVeille]);

  
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
        <Col md="12">
            <Button
              id="saveBL"
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter veille
            </Button>
          </Col>
          </Row> 
        <Row>
          <Col md="12">
            <h4 className="title">Liste des veilles</h4>
            <Card>
              <Card.Body className="table-style">
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Titre",
                      accessor: "titre",
                    },
                    {
                      Header: "Mois",
                      accessor: "mois",
                    },
                    {
                      Header: "annee",
                      accessor: "annee",
                    },
                   
                    // {
                    //   Header: "visualization",
                    //   accessor: "",
                    //   Cell: ({ cell }) => (
                    //     <Button
                    //       id={"idLigne_" + cell.row.original.id}
                        
                    //       className="btn btn-info ml-1 visualiser"
                    //     >
                    //       <i
                    //         className="fa fa-file"
                    //         id={"idLigne_" + cell.row.original.id}
                    //       />
                    //       Visualiser
                    //     </Button>
                    //   ),
                    // },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) =>
                          <Button
                            id={"idLigne_" + cell.row.values.id}
                            onClick={(e) => {
                              confirmMessage(cell.row.original, cell.row.id);
                            }}
                            className="delete btn btn-danger ml-1 float-right"
                          >
                            <i
                              className="fa fa-trash"
                              id={"idLigne_" + cell.row.values.id}
                            />
                          </Button>
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {loader === true ? (
                  <div>
                    <img
                      src={require("../../../assets/img/loader.gif").default}
                      alt="loader"
                    />
                  </div>
                ) : data.length === 0 ? (
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

export default ListVeille;
