import React, { useCallback } from "react";
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
  var anneeLocal = localStorage.getItem("annee");
  const [alert, setAlert] = React.useState(null);

  const confirmMessage = (anneeLocal,i) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={"Étes vous sûre d'exporter ?"}
        onConfirm={() => exporter(anneeLocal,i)}
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
  const [data1, setData1] = React.useState([]);
  const [dataExport, setDataExport] = React.useState([]);




  const ListeReleve = useCallback(async (anneeLocal) => {
    var prod = await dispatch(allReleve({
      id: id,
      annee: parseInt(anneeLocal),
    }));
    var res = prod.payload;
    var array = [];
    var $p = {};
    var array1 = [];
    var $p1 = {};
    res.forEach(element => {
  
      var val = {
        id_produit:element.id_produit,        
        id_fournisseur:element.releves.id_fournisseur,
        designation: element.produits.designation,
        code: element.produits.code,
        code_pf: element.produits.code_pf,
        fournisseur: element.releves.fournisseurs.nom,
        codeA: element.releves.fournisseurs.code,
        delegue: element.releves.users.nomU + ' ' + element.releves.users.prenomU,
        mesure: element.mesure,
        type: element.type,
        jan: 'N/A',
        fev: 'N/A',
        mars:'N/A',
        avr: 'N/A',
        mai: 'N/A',
        juin:'N/A',
        juillet: 'N/A',
        aout: 'N/A',
        sep:'N/A',
        oct:'N/A',
        nov:'N/A',
        dec:'N/A',
        na: element.date==null || element.date=='0000-00-00' ?'N/A':element.date
      }; 
  if(element.type==2){
      if ($p[element.releves.id_fournisseur])
     { if ($p[element.releves.id_fournisseur][element.id_produit]) {
          if ($p[element.releves.id_fournisseur][element.id_produit][element.mois])
            $p[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;
          else {
            $p[element.releves.id_fournisseur][element.id_produit][element.mois] =[];
            $p[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;
          }
      }else{
        $p[element.releves.id_fournisseur][element.id_produit]={};        
        $p[element.releves.id_fournisseur][element.id_produit][element.mois] =[];
        $p[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;

      }
      }
      else {
        $p[element.releves.id_fournisseur]= {}
        $p[element.releves.id_fournisseur][element.id_produit] = {}
        $p[element.releves.id_fournisseur][element.id_produit][element.mois] = [];
        $p[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;
      }
      array.push(val);
    }else{
      if ($p1[element.releves.id_fournisseur])
      { if ($p1[element.releves.id_fournisseur][element.id_produit]) {
           if ($p1[element.releves.id_fournisseur][element.id_produit][element.mois])
             $p1[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;
           else {
             $p1[element.releves.id_fournisseur][element.id_produit][element.mois] =[];
             $p1[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;
           }
       }else{
         $p1[element.releves.id_fournisseur][element.id_produit]={};        
         $p1[element.releves.id_fournisseur][element.id_produit][element.mois] =[];
         $p1[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;
 
       }
       }
       else {
         $p1[element.releves.id_fournisseur]= {}
         $p1[element.releves.id_fournisseur][element.id_produit] = {}
         $p1[element.releves.id_fournisseur][element.id_produit][element.mois] = [];
         $p1[element.releves.id_fournisseur][element.id_produit][element.mois]=element.mesure;
       }
      array1.push(val);
    }
    });
    array.forEach(element => {
      for(var i=1;i<13;i++){
        switch(i){
          case 1: if($p[element.id_fournisseur][element.id_produit][i]){
            element.jan=$p[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 2: if($p[element.id_fournisseur][element.id_produit][i]){
            element.fev=$p[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 3: if($p[element.id_fournisseur][element.id_produit][i]){
            element.mars=$p[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 4: if($p[element.id_fournisseur][element.id_produit][i]){
            element.avr=$p[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 5: if($p[element.id_fournisseur][element.id_produit][i]){
            element.mai=$p[element.id_fournisseur][element.id_produit][i];
          }break;               
          case 6: if($p[element.id_fournisseur][element.id_produit][i]){
            element.juin=$p[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 7: if($p[element.id_fournisseur][element.id_produit][i]){
            element.juillet=$p[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 8: if($p[element.id_fournisseur][element.id_produit][i]){
            element.aout=$p[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 9: if($p[element.id_fournisseur][element.id_produit][i]){
            element.sep=$p[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 10: if($p[element.id_fournisseur][element.id_produit][i]){
            element.oct=$p[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 11: if($p[element.id_fournisseur][element.id_produit][i]){
            element.nov=$p[element.id_fournisseur][element.id_produit][i];
          }break;        
          case 12: if($p[element.id_fournisseur][element.id_produit][i]){
            element.dec=$p[element.id_fournisseur][element.id_produit][i];
          }break;
        }
      }

    });
    
    array1.forEach(element => {
      for(var i=1;i<13;i++){
        switch(i){
          case 1: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.jan=$p1[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 2: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.fev=$p1[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 3: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.mars=$p1[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 4: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.avr=$p1[element.id_fournisseur][element.id_produit][i];
          }break;          
          case 5: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.mai=$p1[element.id_fournisseur][element.id_produit][i];
          }break;               
          case 6: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.juin=$p1[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 7: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.juillet=$p1[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 8: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.aout=$p1[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 9: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.sep=$p1[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 10: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.oct=$p1[element.id_fournisseur][element.id_produit][i];
          }break;           
          case 11: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.nov=$p1[element.id_fournisseur][element.id_produit][i];
          }break;        
          case 12: if($p1[element.id_fournisseur][element.id_produit][i]){
            element.dec=$p1[element.id_fournisseur][element.id_produit][i];
          }break;
        }
      }

    });
    setData(array);
    setData1(array1);
  }, [dispatch, id]);

  const exporter = useCallback(async (anneeLocal,i) => {

    document.getElementById("export"+i).click();
    hideAlert();


  }, [dispatch, ListeReleve]);
  React.useEffect(() => {
    ListeReleve(anneeLocal);
  }, [ListeReleve, anneeLocal]);

  return (
    <>
      {alert}
      <Container fluid>

        <Row>

          <Col md="12">
            <h4 className="title">Tableau recupulatif des donnèes Reléve grossiste</h4>            
            <h1 className="title">Vente</h1>
            <Card>
              <Card.Body>
                <Row>
                  <Col md="12" className="pdfExcel">
                    <span>
                      <Button onClick={() => confirmMessage(anneeLocal,0)}>
                        Export Excel<i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                  </Col>

                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export0">Export Excel</button>}
                      filename={releveDate + "Relevevente"}
                    >
                      <ExcelSheet data={data} name="Releves">
                        <ExcelColumn label="Nom délegeue" value="delegue" />
                        <ExcelColumn label="Code adonix" value="codeA" />
                        <ExcelColumn label="Fournisseur" value="fournisseur" />
                        <ExcelColumn label="Code Produit" value="code" />
                        <ExcelColumn label="Code pf" value="code_pf" />
                        <ExcelColumn label="Désignation" value="designation" />
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
            <hr></hr>
            <br></br>
            <h1 className="title">Stock</h1>
            <Card>
              <Card.Body>
                <Row>
                  <Col md="12" className="pdfExcel">
                    <span>
                      <Button onClick={() => confirmMessage(anneeLocal,1)}>
                        Export Excel<i className="fas fa-file-excel"></i>
                      </Button>
                    </span>
                  </Col>

                  <Col md="12" className="hidden">
                    <ExcelFile
                      className="hidden"
                      element={<button id="export1">Export Excel</button>}
                      filename={releveDate + "Relevestock"}
                    >
                      <ExcelSheet data={data1} name="Releves">
                        <ExcelColumn label="Nom délegeue" value="delegue" />
                        <ExcelColumn label="Code adonix" value="codeA" />
                        <ExcelColumn label="Fournisseur" value="fournisseur" />
                        <ExcelColumn label="Code Produit" value="code" />
                        <ExcelColumn label="Code pf" value="code_pf" />
                        <ExcelColumn label="Désignation" value="designation" />
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
                        <ExcelColumn label="Date limite" value="na" />
                      </ExcelSheet>
                    </ExcelFile>
                  </Col>

                </Row>

                <ReactTable
                  data={data1}
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
                      Header: "Date limite",
                      accessor: "na",
                    }
                   
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {
                  data1.length === 0 ? <div className="text-center">Aucun details </div> : ""
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
