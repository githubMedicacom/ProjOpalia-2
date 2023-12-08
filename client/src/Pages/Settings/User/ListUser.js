import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { fetchUsers,userChangeEtat } from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

// core components
function ListUser() {
  document.title = "Liste des utilisateurs";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null); 
  const [entities, setEntities] = React.useState([]);
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idrole = decoded.userauth.idrole;
  var id = decoded.userauth.id;
  var line = decoded.userauth.line;
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
    navigate('/ajouterUtilisateur');
   /*  window.location.href = "/ajouterUtilisateur"; */
  }
  function changeEtat(id,e) {
    dispatch(userChangeEtat( id )).then(e1=>{
      getUser();
      switch(e){
        case 0: notify("tr", "Utilisateur activer avec succes", "success");break; 
        case 1:notify("tr", "Utilisateur désactiver avec succes", "success");break;
        default:break;
      }  
    }); 
  }

  const getUser = useCallback(async () => {
    var user = await dispatch(fetchUsers({idrole,line,id}));
    setEntities(user.payload);
  }, [dispatch,idrole,line,id]);
  useEffect(() => {
    getUser()
  }, [getUser]) //now shut up eslint
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
              Ajouter un utilisateur
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des utilisateurs</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Nom",
                      accessor: "nomU",
                    },
                    {
                      Header: "Prenom",
                      accessor: "prenomU",
                    },
                    {
                      Header: "Login",
                      accessor: "login",
                    },
                    {
                      Header: "e-mail",
                      accessor: "email",
                    },
                    {
                      Header: "téléphone",
                      accessor: "tel",
                    },
                    {
                      Header: "Etat",
                      accessor: "etat",
                      Cell: ({ cell }) => (cell.row.values.etat === 1?"Activé":"Désactive"),
                    },
                    {
                      Header: "role",
                      accessor: "roles.nom",
                    },

                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/utilisateur/update/" + cell.row.values.id);
                            }}
                            variant="warning"
                            size="sm"
                            className="text-warning btn-link edit"
                          >
                            <i className="fa fa-edit" />
                          </Button>
                          <Button
                            id={"idLigne_" + cell.row.values.id}
                            onClick={(event) => {
                              changeEtat(cell.row.values.id,cell.row.values.etat);
                            }}
                            variant="danger"
                            size="sm"
                            className={cell.row.values.etat === 1?"text-success btn-link delete":"text-danger btn-link delete"}
                          >
                            <i className={cell.row.values.etat === 1?"fa fa-check":"fa fa-times"} id={"idLigne_" + cell.row.values.id}/>
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
