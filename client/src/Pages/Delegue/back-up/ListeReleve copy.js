import React,{useCallback} from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import {
  Card,
  Container,
  Row,
  Col,
  Button
} from "react-bootstrap";
import ReactExport from "react-export-excel";
import { allReleve } from "../../Redux/releveReduce";
import jwt_decode from "jwt-decode";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import SweetAlert from "react-bootstrap-sweetalert";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ListeReleve() {
  document.title = "Liste des reléves grossistes";
  const dispatch = useDispatch();
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  const id = decoded.userauth.id;   
  var dateToday = new Date();
  var releveDate = dateToday.getDate() + "/" + (dateToday.getMonth() + 1) + "/" + dateToday.getFullYear();
  var dateToday = new Date();
  var anneeLocal =localStorage.getItem("annee");
  const [alert, setAlert] = React.useState(null);

  const confirmMessage = (trimestre,anneeLocal) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(anneeLocal)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
 
  const [data, setData] = React.useState([]);
  const [dataExport, setDataExport] = React.useState([]);



 
  const ListeReleve = useCallback(async (anneeLocal) => {
    var prod = await dispatch(allReleve({
      id: id,
      annee: parseInt(anneeLocal),
    }));
    var res = prod.payload;
    var array = [];
    res.forEach(element => {
      var val = {
        designation: element.produits.designation,
        fournisseur:element.releves.fournisseurs.nom,
        delegue:element.releves.users.nomU+' '+element.releves.users.prenomU,
        stock: element.stock,
        total: element.total,
        jan: element.jan,
        fev: element.fev,
        mars: element.mars,
        avr: element.avr,
        mai: element.mai,
        juin: element.juin,
        juillet: element.juillet,
        aout: element.aout,
        sep: element.sep,
        oct: element.oct,
        nov: element.nov,
        dec: element.dec,
        na: 'N/A'
      };
      array.push(val);
    });
    setData(array);
    
  }, [dispatch,id]);

   const exporter = useCallback(async (anneeLocal) => {
   
      document.getElementById("export").click();
      hideAlert();
    
  
  }, [dispatch,ListeReleve]); 
  React.useEffect(() => {
    ListeReleve(anneeLocal);
  }, [ListeReleve,anneeLocal]);

  return (
    <>
      {alert}
      <Container fluid>
       
        <Row>
        
          <Col md="12">
            <h4 className="title">Tableau recupulatif des donnèes Reléve grossiste</h4>
            <Card>
              <Card.Body>
<Row>
        <Col md="12" className="pdfExcel">
                    <span>
                      <Button onClick={()=>confirmMessage(anneeLocal)}>
                        Export Excel<i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                  </Col> 
                  
                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export">Export Excel</button>}
                      filename={releveDate + "Releve"}
                    >
                      <ExcelSheet data={data} name="Releves">
                        <ExcelColumn label="Nom délegeue" value="delegue" />
                        <ExcelColumn label="Fournisseur" value="fournisseur" />
                        <ExcelColumn label="Désignation" value="designation" />
                        <ExcelColumn label="Stock" value="stock" />
                        <ExcelColumn label="Jan" value="jan" />
                        <ExcelColumn label="Fev" value="fev" />
                        <ExcelColumn label="Mars" value="mars" />
                        <ExcelColumn label="Avr" value="avr" />
                        <ExcelColumn label="Mai" value="mai" />
                        <ExcelColumn label="Juin" value="juin" />
                        <ExcelColumn label="Juillet" value="juillet" />
                        <ExcelColumn label="Aout" value="aout" />
                        <ExcelColumn label="Sep" value="sep" />
                        <ExcelColumn label="Oct" value="oct" />
                        <ExcelColumn label="Nov" value="nov" />
                        <ExcelColumn label="Dec" value="dec" />
                        <ExcelColumn label="Total" value="total" />
                        <ExcelColumn label="Date limite" value="na" />
                      </ExcelSheet>
                    </ExcelFile>
                  </Col>
                  
                  </Row> 
                <ReactTable
                  data={data}
                  columns={[
                    {
                      Header: "Delegue",
                      accessor: "delegue",
                    },
                    {
                      Header: "Grossiste",
                      accessor: "fournisseur",
                    },
                    {
                      Header: "Designation",
                      accessor: "designation",
                    },   
                    {
                      Header: "Stock",
                      accessor: "stock",
                    },                        
                    {
                      Header: "Jan",
                      accessor: "jan",
                    },                        
                    {
                      Header: "Fev",
                      accessor: "fev",
                    },                        
                    {
                      Header: "Mars",
                      accessor: "mars",
                    },                        
                    {
                      Header: "Avr",
                      accessor: "avr",
                    },                        
                    {
                      Header: "Mai",
                      accessor: "mai",
                    },                        
                    {
                      Header: "Juin",
                      accessor: "juin",
                    },                        
                    {
                      Header: "Juillet",
                      accessor: "juillet",
                    },                        
                    {
                      Header: "Aout",
                      accessor: "aout",
                    },                        
                    {
                      Header: "Sep",
                      accessor: "sep",
                    },                        
                    {
                      Header: "Oct",
                      accessor: "oct",
                    },                       
                    {
                      Header: "Nov",
                      accessor: "nov",
                    },                       
                    {
                      Header: "dec",
                      accessor: "dec",
                    },                    
                    {
                      Header: "Total",
                      accessor: "total",
                    },
                    {
                      Header: "Date limite",
                      accessor: "na",
                    }
                   
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {
                  data.length === 0 ? <div className="text-center">Aucun details </div> : ""
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListeReleve;
