import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./assets/scss/style.scss?v=2.0.0";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import store from "./store";
import routes from "./routes.js";
import Sidebar from "./components/Sidebar/Sidebar.js";
import AdminNavbar from "./components/Navbars/AdminNavbar.js";
import LoginPage from "./Pages/Settings/User/LoginPage.js";
import AdminFooter from "./components/Footers/AdminFooter.js";
import jwt_decode from "jwt-decode";
import { getSettings } from "./Redux/settingsReduce";
import { getRootByRole } from "./Redux/rootBaseReduce";
/* import { getNotification } from "./Redux/notificationReduce"; */
import RootBase from "./RootBase";

var token = "";
var loginStorage = null;
var idrole = null;
var type = null;
/* var line = null; */
var hrefURL = window.location.pathname;
token = localStorage.getItem("x-access-token");
if(token !== null){
  var decoded = jwt_decode(token);
  loginStorage = decoded.userauth.login;
  idrole = decoded.userauth.idrole;
  type = decoded.userauth.type;
  /* line = decoded.userauth.line; */
  /* store.dispatch(getNotification(line)); */
  //get root by role
  store.dispatch(getRootByRole({idrole,type}));
}
if(hrefURL==="/login"){
  document.title = "login";
}
store.dispatch(getSettings(1));
/* document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
document.onkeydown = function(e) {
  if(e.keyCode === 123) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode === 'C'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.keyCode === 'S'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
    e.preventDefault();
  }
} */
/* const getRoutes = (routes) => {
  return routes.map((prop, key) => {
    if (prop.collapse) {
      return getRoutes(prop.views);
    }
      if(prop.role.includes(idrole) || prop.role.includes(20)){
        console.log(prop.componentStr)
        console.log(prop)
        var component = React.createElement(Components[prop.componentStr],null,null);
        return (
          <Route
            path={prop.path}
            key={key}
            element={component}
          />
        );
      }
    return null;
  });
}; */
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {loginStorage !==null?
        <div className="wrapper">
          <Sidebar routes={routes} />
          <div className="main-panel">
            <AdminNavbar />
            <div className={"content display-"+hrefURL.replace('/', '')}>
              <RootBase idRole={idrole}/>
            </div>
            <AdminFooter />
            <div className="close-layer"
              onClick={() =>
                document.documentElement.classList.toggle("nav-open")
              }
            />
          </div>
        </div>
      :
      
      <div className="wrapper wrapper-full-page">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path='/*' element={<Navigate replace to="/login" />} />
        </Routes>
      </div> 
      }
        
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
