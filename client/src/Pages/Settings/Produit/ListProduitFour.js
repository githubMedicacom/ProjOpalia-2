import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { getProduitFour,produitDeleted } from "../../../Redux/produitReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";

// core components
function ListUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null); 
  const [entities, setEntities] = React.useState([]);
  const notify = (place, msg, type) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {msg}
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  function ajouter(value) {
    localStorage.setItem("nomProd",value.designation)
    localStorage.setItem("idProd",value.id)
    navigate('/ajouterProduit');
  }
  
  function deleteProduit(id) {
    dispatch(produitDeleted( {id} ));   
    setTimeout(async () => {
      notify("tr", "Suppression avec succes", "success");
      getProduit();
    }, 500);
  }
  
  const getProduit = useCallback(async (titre) => {
    var marche = await dispatch(getProduitFour());
    setEntities(marche.payload);
  }, [dispatch]);
  useEffect(() => {
    getProduit();
  }, [getProduit]) //now shut up eslint
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <h4 className="title">Liste des produits</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "designation",
                      accessor: "designation",
                    },
                    {
                      Header: "code",
                      accessor: "code",
                    },
                    {
                      Header: "prix",
                      accessor: "prix",
                    },

                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={()=>ajouter(cell.row.values)}
                            variant="info"
                            size="sm"
                            className="text-info btn-link edit"
                          >
                            Ajouter un produit <i className="fa fa-plus" />
                          </Button>
                          <Button
                            id={"idLigne_" + cell.row.values.id}
                            onClick={(event) => {
                              deleteProduit(cell.row.values.id);
                            }}
                            variant="danger"
                            size="sm"
                            className={"text-danger btn-link"}
                          >
                            Delete <i className={"fa fa-trash"} id={"idLigne_" + cell.row.values.id}/>
                          </Button>
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

export default ListUser;
