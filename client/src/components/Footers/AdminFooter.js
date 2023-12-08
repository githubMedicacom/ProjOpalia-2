import React from "react";

// react-bootstrap components
import {
  Container,
} from "react-bootstrap";

function AdminFooter() {
  return (
    <>
      <footer className="footer">
        <Container fluid className="">
          <nav>
            <p className="copyright text-center">
              ©
              <a href="https://www.medicacom.tn/fr/"> 2022 medicacom</a>
            </p>
          </nav>
        </Container>
      </footer>
    </>
  );
}

export default AdminFooter;
