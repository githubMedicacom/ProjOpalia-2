import React from "react";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
// react-bootstrap components
import { Collapse, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";

function Sidebar({ background }) {
  let location = useLocation();
  const [state, setState] = React.useState({});
  const { entities } = useSelector((state) => state.settings);
  const { rootBase } = useSelector((state) => state.rootBase);
  var routes = rootBase?rootBase[0]:[];
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idrole = decoded.userauth.idrole;
  React.useEffect(() => {
    /* setState(getCollapseStates(routes)); */
  }, []);
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (location.pathname === routes[i].layout + routes[i].path) {
        return true;
      }
    }
    return false;
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if ((prop.role.includes(idrole)) || prop.role.includes(20)) {
        if (prop.redirect) {
          return null;
        }
        if (prop.collapse) {
          var st = {};
          st[prop["state"]] = !state[prop.state];
          return (
            <Nav.Item
              className={getCollapseInitialState(prop.views) ? "active" : ""}
              as="li"
              key={key}
            >
              <Nav.Link
                className={state[prop.state] ? "collapsed" : ""}
                data-toggle="collapse"
                onClick={(e) => {
                  e.preventDefault();
                  setState({ ...state, ...st });
                }}
                aria-expanded={state[prop.state]}
              >
                <i className={prop.icon}></i>
                <p>
                  {prop.name} <b className="caret"></b>
                </p>
              </Nav.Link>
              <Collapse in={state[prop.state]}>
                <div>
                  <Nav as="ul">{createLinks(prop.views)}</Nav>
                </div>
              </Collapse>
            </Nav.Item>
          );
        }
        return (
          <Nav.Item className={activeRoute(prop.path)} key={key} as="li">
            {getTitle(prop.path, prop.name)}
            <Nav.Link className={prop.className} to={prop.path} as={Link}>
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <p>{prop.name}</p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini">{prop.mini}</span>
                  <span className="sidebar-normal">{prop.name}</span>
                </>
              )}
            </Nav.Link>
          </Nav.Item>
        );
      } else {
        return null;
      }
    });
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  function getTitle(routeName, name) {
    if (location.pathname.toUpperCase() === routeName.toUpperCase()) {
      if (routeName !== "/telechargerFichier/:id/:idBl") {
        localStorage.removeItem("file");
        localStorage.removeItem("returnList");
      }
      if (routeName !== "/ajouterProduit") {
        localStorage.removeItem("nomProd");
        localStorage.removeItem("idProd");
      }
      document.title = name;
      //return location.pathname === routeName ? routeName : "";
    }
  }
  return (
    <>
      <div className="sidebar" data-color={background}>
        <div className="sidebar-wrapper">
          <div className="logo">
            <div className="bglogo">
              {entities.length > 0 ? (
                <img
                  src={require("../../assets/img/" + entities[0].logo).default}
                  alt="medicacom"
                />
              ) : (
                ""
              )}
            </div>
          </div>

          <Nav as="ul">{createLinks(routes)}</Nav>
        </div>
      </div>
    </>
  );
}

Sidebar.defaultProps = {
  image: "",
  background: "black",
  routes: [],
};

export default Sidebar;
