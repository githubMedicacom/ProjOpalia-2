import React from "react";
// react component used to create alerts
// react-bootstrap components
import {
  Container, 
} from "react-bootstrap";

function NotFound() {
  return (
    <>
     
      <Container fluid className="page404">
      <div>404</div><div>Page introuvable</div>
      </Container>
    </>
  );
}

export default NotFound;
