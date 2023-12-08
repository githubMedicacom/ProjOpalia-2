import React, { useCallback, useEffect } from "react";
import { getBlByClientId, getBlByCmd } from "../../../../Redux/blReduce";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { Card, Container,Row,Col,Button } from "react-bootstrap";
import ReactTable from "../../../../components/ReactTable/ReactTable.js";

// core components
function DetailCmd() {
  document.title = "Détail suivis";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  const path = useLocation();
  var splitPath =(path.pathname.split("/"))
  var idClient = 0;
  var idAction = 0;
  var idCmd = 0;
  if(splitPath[1]==="detailSuivi"){
    idClient = location.idClient;
    idAction = location.idAction;
  } else {
    idCmd = location.idCmd;
  }
  const [entities, setEntities] = React.useState([]);
  const getPackProduit = useCallback(
    async () => {
      var client = null;
      if(splitPath[1]==="detailSuivi")
        client = await dispatch(getBlByClientId({ idClient,idAction }));
      else 
        client = await dispatch(getBlByCmd(idCmd));
      setEntities(client.payload);
    },
    [dispatch,idClient,idAction,idCmd,splitPath]
  );

  useEffect(() => {
    getPackProduit();
  }, []); //now shut up eslint
  
  function paymentBl(id, idBl) {
    /*** 0. save decharge *** 1. get decharge *** 2. get file bl ***/
    navigate("/telechargerFichier/"+idBl+"/"+id);
  }
  return (
    <>
      <Container>
        <Row>
          <Col md="12">
            <Button
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={()=>{
                var nav = localStorage.getItem("returnVis")
                navigate(nav);                
              }}
            >
              <span className="btn-label">
                <i className="fas fa-list"></i>
              </span>
              Retour à la liste
            </Button>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <ReactTable
              data={entities}
              columns={[
                {
                  Header: "Numéro BL",
                  accessor: "numeroBl",
                },
                {
                  Header: "Nom Délégué",
                  accessor: "users",
                },
                {
                  Header: "Pharmacies",
                  accessor: "pharmacie",
                },
                {
                  Header: "Objectif",
                  accessor: "action",
                },
                {
                  Header: "Total",
                  accessor: "mnt",
                },
                {
                  Header: "Date",
                  accessor: "date",
                  Cell: ({ cell }) => (
                    <div className="block_action">
                      {cell.row.values.date !== null
                        ? new Date(cell.row.values.date)
                            .toISOString()
                            .slice(0, 10)
                        : ""}
                    </div>
                  ),
                },
                {
                  Header: "détail",
                  accessor: "id",
                  Cell: ({ cell }) =>
                    (
                    <Button
                      id={"idLigne_" + cell.row.values.id}
                      onClick={(e) => {
                        paymentBl(cell.row.values.id,2);
                        localStorage.setItem("file", cell.row.original.file);
                        if(splitPath[1]==="detailSuivi")
                          localStorage.setItem("returnList", "detailSuivi/"+idClient+"/"+idAction);
                        else
                          localStorage.setItem("returnList", "detailCmd/"+idCmd);
                      }}
                      className="btn btn-info ml-1 visualiser"
                    >
                      <i
                        className="fa fa-eye"
                        id={"idLigne_" + cell.row.values.id}
                      />
                    </Button>),
                },
              ]}
              className="-striped -highlight primary-pagination"
            />
            {entities.length === 0 ? (
              <div className="text-center">Aucun présentations trouvé</div>
            ) : ""}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default DetailCmd;
