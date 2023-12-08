import React,{useCallback} from "react";
import Select from "react-select";
// react-bootstrap components
import { Button, Navbar, Nav, Container, Dropdown,Col } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { getAllAnneeLignesBL } from "../../Redux/blReduce";
import { getNotification, updateNotif } from "../../Redux/notificationReduce";
import { getMessageByLine } from "../../Redux/messageriesReduce";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  var date = new Date().getFullYear();
  var token = localStorage.getItem("x-access-token");
  var anneeLocal =localStorage.getItem("annee");
  if(anneeLocal===null){
    localStorage.setItem("annee",date);
    anneeLocal =localStorage.getItem("annee");
  }
  const navigate = useNavigate();
  /* const {entities} = useSelector((state) => state.notification); */
  const [notification, setNotification] = React.useState([]);
  const [messageries, setMessageries] = React.useState([]);
  const [nb, setNb] = React.useState(0);
  const [nbMsg, setNbMesg] = React.useState(0);
  const [annee, setAnnee] = React.useState();
  const dispatch = useDispatch();
  const [optionsAnnee, setOptionsAnnee] = React.useState([
    {
      value: "",
      label: "Annee",
      isDisabled: true,
    },
  ]);
  var decoded = null;
  var nom = "";
  var line = "";
  var idRole = null;
  var idUser = null;
  if (token != null) {
    decoded = jwt_decode(token); 
    if (typeof decoded.userauth.idrole != "undefined") {
      /* nom = decoded.userauth.nomU+" "+decoded.userauth.prenomU+" ("+decoded.userauth.roles.nom+")"; */
      nom = decoded.userauth.nomU+" "+decoded.userauth.prenomU;
      line=decoded.userauth.line;
      idRole = decoded.userauth.idrole;
      idUser = decoded.userauth.id;
      //role = decoded.userauth.role.nom;
    }
  } 
  const getAnnes = useCallback(async (anneeLocal) => {
    var year = await dispatch(getAllAnneeLignesBL());
    var arrayOption = [];
    var testA = false;
    year.payload.forEach(element => {
      arrayOption.push({ value: element.annee, label: element.annee })
      if(date === element.annee)
        testA = true;
      if(parseInt(anneeLocal)=== element.annee){setAnnee({ value: element.annee, label: element.annee })}
    });
    if(!testA)
     { arrayOption.push({ value: date, label: date })
       if(parseInt(anneeLocal)=== date){setAnnee({ value: date, label: date })}
    }
    setOptionsAnnee(arrayOption);
  }, [dispatch,date]);
  const changeEtat = useCallback(async (id,etat) => {
    dispatch(updateNotif({
      id:id,
      idUser:idUser
    })).then(e=>{
      switch(etat){
        case 1:case 3:window.location.replace("/ValidationBl");break;
        case 2:window.location.replace("/visualisationBl");break;
        case 4:window.location.replace("/produitListFour");break;
        case 5:case 6:case 7:case 8:case 9:case 10:case 11:window.location.replace("/listAction");break;
        default:getAction();break;
      }
      /* switch(etat){
        case 1:case 3:navigate("/ValidationBl");break;
        case 2:navigate("/visualisationBl");break;
        case 4:navigate("/produitListFour");break;
        case 5:case 6:case 7:case 8:case 9:case 10:case 11:navigate("/listAction");break;
        default:break;
      }      
      getAction(); */
    });
    
  }, [dispatch,idUser,navigate]);
  const getAction = useCallback(async () => {
    var res = await dispatch(getNotification(line));
    var notif = res.payload;
    var array = [];
    array.push(
      <Dropdown.Item
        className="enteteDropDown"
        href="#"
        key={"entet"+notif.length}
      >
        {notif.length} notification 
      </Dropdown.Item>
    );
    var arrayDiv=[];
    notif.forEach(element => {
      arrayDiv.push(
        <Dropdown.Item
          className={element.lu === 0 ? "nonlu" : ""}
          href="#"
          key={"notif"+element.id}
          onClick={()=>{changeEtat(element.id,element.etat)}}
        >
          {element.text}
        </Dropdown.Item>
      );
    });
    array.push(<div key="onScroll" className={arrayDiv.length>7?"onScroll":""}>{arrayDiv}</div>)
    if(notif.length===0){
      array.push(
        <Dropdown.Item
          href="#"
          key={0}
        >
         Aucun notification trouver
        </Dropdown.Item>
      );
    }
    array.push(
      <Dropdown.Item
        className="footerDropDown"
        href="#"
        key={"footer"+array.length}
        onClick={(event) => {
          changeEtat(0,-1)
          /* dispatch(updateNotif({id:0,idUser:idUser})); */
          /* window.location.reload() */
        }}
      >
        Lire toutes les notifications
      </Dropdown.Item>
    );
    setNb(notif.length);
    setNotification(array);
  }, [dispatch,line,changeEtat]);
  const getMessage = useCallback(async () => {
    var res = await dispatch(getMessageByLine({line}));
    var objectif = res.payload;
    var n = 0;
    var array = [];
    if(objectif){
      objectif.forEach(element => {
        if(element.libPack !== null){
          n++;
          array.push(
            <Dropdown.Item
              href="#"
              key={element.id}
              onClick={()=>{
                navigate("/discution/"+element.id);
                /* window.location.replace("/discution/"+element.id) */
              }}
            >
              Objectif: {element.nom} ({element.nb})
            </Dropdown.Item>
          );
        }
      });
    }
    if(n===0){
      array.push(
        <Dropdown.Item
          href="#"
          key={0}
        >
         Aucun message trouver
        </Dropdown.Item>
      );
    }
    setNbMesg(n);
    setMessageries(array);
  }, [dispatch,line,navigate]);
  function LogOut(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.replace("/login");
  }
  React.useEffect(() => {
    /* if(anneeLocal===null){
      localStorage.setItem("annee",date);
      anneeLocal =localStorage.getItem("annee");
    } */
    if((idRole ===1)||(idRole ===2))
      getMessage();
    getAction();
    getAnnes(anneeLocal);
  }, [getAnnes,date,getAction,getMessage,idRole,anneeLocal]);
  return (
    <>
      <Navbar expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              <Button
                className="btn-fill btn-round btn-icon d-none d-lg-block bg-dark border-dark"
                variant="dark"
                onClick={() => document.body.classList.toggle("sidebar-mini")}
              >
                <i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
                <i className="fas fa-bars visible-on-sidebar-mini"></i>
              </Button>
              <Button
                className="btn-fill btn-round btn-icon d-block d-lg-none bg-dark border-dark"
                variant="dark"
                onClick={() =>
                  document.documentElement.classList.toggle("nav-open")
                }
              >
                <i className="fas fa-list"></i>
                <i className="fas fa-bars visible-on-sidebar-mini"></i>
              </Button>
            </div>
            <Navbar.Brand
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            ></Navbar.Brand>
          </div>
          <Col md="3">
            <Select
              className="react-select primary"
              classNamePrefix="react-select"
              name="singleSelect"
              value={annee}
              onChange={(value) => {
                setAnnee(value);
                localStorage.setItem("annee",value.value)
                window.location.reload();
              }}
              options={optionsAnnee}
              placeholder="Annee"
            />
          </Col>
          <Col md="7">
            <Dropdown as={Nav.Item} className="dropdown-profile">
              <Dropdown.Toggle
                as={Nav.Link}
                id="dropdown-41471887333"
                variant="default"
              >
                <span className="float-left">
                  <i className="nc-icon nc-single-02"></i>
                  <span className="hidden-header">{nom}</span>                
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                <Dropdown.Item
                  href="#"
                  onClick={(e) => {
                    navigate("/profile");
                    /* window.location.replace("/profile") */
                  }}
                >
                  <i className="fas fa-user"></i>
                  profile
                </Dropdown.Item>
                {idRole===0?
                  <Dropdown.Item
                        href="#"
                        onClick={(e) => {
                          navigate("/settings");
                          /* window.location.replace("/settings") */
                        }}
                      >
                      <i className="fas fa-cog"></i>
                  Paramétre
                  </Dropdown.Item>
                :""} 
                <div className="divider"></div>
                <Dropdown.Item className="text-danger" href="#" onClick={LogOut}>
                  <i className="nc-icon nc-button-power"></i>
                  Déconnecter
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {(idRole === 1 || idRole === 2)?
              <Dropdown as={Nav.Item} className="dropdown-msg">
                <Dropdown.Toggle
                  as={Nav.Link}
                  id="dropdown-1"
                  variant="default"
                >
                  <i className="fa fa-comments mr-1"></i>
                  <span className="notification">{nbMsg}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {messageries}
                </Dropdown.Menu>
              </Dropdown>
            :""}
              <Dropdown as={Nav.Item} className="dropdown-notification">
                <Dropdown.Toggle
                  as={Nav.Link}
                  id="dropdown-1"
                  variant="default"
                >
                  <i className="fas fa-bell"></i>
                  <span className="notification">{nb}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="noScroll">
                  {notification}
                  {/* <Notification data={data} /> */}
                </Dropdown.Menu>
              </Dropdown>
          </Col>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
