import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { getPharmacieSegment,fetchSegment } from "../../../Redux/segmentReduce";
import { useDispatch } from "react-redux";
import Select from "react-select";
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

// core components
function ListSegmentPharma() {
  const dispatch = useDispatch();
  var dateToday = new Date();
  var pharmacieDate = dateToday.getDate() + "/" + (dateToday.getMonth() + 1) + "/" + dateToday.getFullYear();
  const [entities, setEntities] = React.useState([]);

  //Segment
  const [segment, setSegment] = React.useState({
    value: 0,
    label: "Tous",
  });
  const [optionSegment, setOptionSegment] = React.useState([
    {
      value: 0,
      label: "Segment",
    },
  ]);

  const getSegment = useCallback(async () => {
    var type = await dispatch(fetchSegment());
    var entities = type.payload;
    var arrayOption = [];
    arrayOption.push({ value: 0, label: "Tous" });
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionSegment(arrayOption);
  }, [dispatch]);
  const getSegmments = useCallback(async (idSeg) => {
    var actions = await dispatch(getPharmacieSegment({idSeg}));
    var res = actions.payload;
    var array=[];
    res.forEach(e=>{
      array.push({
        nomPharma:e.Pharmacie,
        nomSeg:e.segments?e.segments.nom:""
      })
    })
    setEntities(array);
  }, [dispatch]);
  useEffect(() => {
    getSegment();
    getSegmments(segment.value);
  }, [getSegmments,getSegment,segment]) //now shut up eslint
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Row>
              <Col md="12">
                <h4 className="title">Segment pharmacie</h4>                
              </Col>
              <Col md="4">
                <br></br>
                <Select
                  className="react-select primary"
                  classNamePrefix="react-select"
                  value={segment}
                  placeholder="segment"
                  onChange={(v) => {
                    setSegment(v);
                  }}
                  options={optionSegment}
                />
              </Col>
              <Col md="8" className="pdfExcel">
                <ExcelFile
                  element={<button id="export">Export Excel <i className="fas fa-file-excel"></i></button>}
                  filename={pharmacieDate + "pharmacie"}
                >
                  <ExcelSheet data={entities} name="Pharmacie">
                    <ExcelColumn label="Pharmacie" value="nomPharma" />
                    <ExcelColumn label="Segments" value="nomSeg" />
                  </ExcelSheet>
                </ExcelFile>
              </Col>
            </Row>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Pharmacie",
                      accessor: "nomPharma",
                    },
                    {
                      Header: "segments",
                      accessor: "nomSeg",
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

export default ListSegmentPharma;
