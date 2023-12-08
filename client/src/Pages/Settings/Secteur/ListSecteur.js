import NotificationAlert from "react-notification-alert";
import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { fetchSecteur,secteurChangerEtat } from "../../../Redux/secteurReduce";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// core components
function ListSecteur() {
  document.title = "Liste des secteurs";
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
  function ajouter() {
    navigate('/ajouterSecteur');
  }
  function changeEtat(id,e) {
    dispatch(secteurChangerEtat( id )).then(e1=>{
      getSecteur();
      switch(e){
        case 0: notify("tr", "Marché activer avec succes", "success");break; 
        case 1:notify("tr", "Marché désactiver avec succes", "success");break;
        default:break;
      }  
    }); 
  }

  const getSecteur = useCallback(async (titre) => {
    var secteur = await dispatch(fetchSecteur());
    setEntities(secteur.payload);
  }, [dispatch]);
  useEffect(() => {
    getSecteur()
  }, [getSecteur]) //now shut up eslint
  return (
    <>
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
              Ajouter un secteur
            </Button>
          </Col> 
          <Col md="12">
            <h4 className="title">Liste des secteurs</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Secteur",
                      accessor: "secteurs.libelleSect",
                    },
                    {
                      Header: "IMS",
                      accessor: "imsLib",
                    },
                    {
                      Header: "Etat",
                      accessor: "secteurs.etat",
                      Cell: ({ cell }) => (cell.row.original.secteurs.etat === 1?"Activé":"Désactive"),
                    },
                    {
                      Header: "actions",
                      accessor: "secteurs.id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/secteur/update/" + cell.row.original.secteurs.id);
                            }}
                            variant="warning"
                            size="sm"
                            className="text-warning btn-link edit"
                          >
                            <i className="fa fa-edit" />
                          </Button>
                          <Button
                            id={"idLigne_" + cell.row.original.secteurs.id}
                            onClick={(event) => {
                              changeEtat(cell.row.original.secteurs.id,cell.row.original.secteurs.etat);   
                            }}
                            variant="danger"
                            size="sm"
                            className={cell.row.original.secteurs.etat === 1?"text-success btn-link delete":"text-danger btn-link delete"}
                          >
                            <i className={cell.row.original.secteurs.etat === 1?"fa fa-check":"fa fa-times"} id={"idLigne_" + cell.row.original.secteurs.id}/>
                          </Button>
                        </div>
                      ),
                    },
                  ]} 
                  className="-striped -highlight primary-pagination"
                />
                {entities.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : ""}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListSecteur;
