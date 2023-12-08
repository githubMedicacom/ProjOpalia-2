import { useSelector } from "react-redux";
import React from "react";
import Components from "./components";
import { Route, Routes, Navigate } from "react-router-dom";

//get root from DB by role
function RootBase({ idRole }) {
  const { rootBase } = useSelector((state) => state.rootBase);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.role.includes(idRole) || prop.role.includes(20)) {
        var component = React.createElement(
          Components[prop.componentStr],
          null,
          null
        );
        return <Route path={prop.path} key={key} element={component} />;
      }
      return null;
    });
  };

  return (
    <>
      {rootBase ?
        <Routes>
          {getRoutes(rootBase[0])}
          <Route path="/login" element={<Navigate replace to="/profile" />} />
          <Route path="/" element={<Navigate replace to="/profile" />} />
        </Routes>
      : ""}
    </>
  );
}

export default RootBase;
