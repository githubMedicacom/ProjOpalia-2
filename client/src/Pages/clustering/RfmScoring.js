import { Button, Card, Container, Row, Col } from "react-bootstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import React, { useEffect, useState, useCallback } from "react";
import ReactTable from "../../components/ReactTable/ReactTable.js";
import {
  fetchClustring,
  fetchAction,
  fetchSegment,
} from "../../Redux/clustringReduce";
import { useDispatch } from "react-redux";
import ChartistGraph from "react-chartist";
import Select from "react-select";
function RfmScoring() {
  const dispatch = useDispatch();
  const [valSegment, setValSegment] = useState([]);
  const [segment, setSegment] = useState([]);
  const [segmentSelected, setSegmentSelected] = useState(0);
  const [testOption, setTestOption] = useState(false);
  const [optionSegment, setOptionSegment] = useState([
    { value: "", label: "Segment", isDisabled: true },
  ]);
  const [alert, setAlert] = useState(null);
  const [segmentVal, setSegmentVal] = useState(0);
  const [legendPieVal, setLegendPieVal] = useState(0);
  const [total, setTotal] = useState(0);
  //customer
  let tableCustomer1 = [];
  const [dataCustomer, setDataCustomer] = useState(
    tableCustomer1.map(() => {
      return "";
    })
  );
  const [dataSegment, setDataSegment] = useState(
    tableCustomer1.map(() => {
      return "";
    })
  );
  //Score
  const [data, setData] = useState(
    tableCustomer1.map(() => {
      return "";
    })
  );
  const setTableCustomer = useCallback((tab) => {
    setDataCustomer(
      tab.map((prop) => {
        return {
          id: prop[0],
          Number: prop[1],
          Segment: prop[2],
          actions: "",
        };
      })
    );
  }, []);
  const setTableScore = useCallback((tab) => {
    setData(
      tab.map((prop) => {
        return {
          id: prop[0],
          Customer: prop[1],
          Rfm_Score: prop[2],
          Segment: prop[3],
          actions: "",
        };
      })
    );
  }, []);
  const hideAlert = useCallback(() => {
    setAlert(null);
  }, [setAlert]);
  const htmlAlert = useCallback(
    (event) => {
      const promise = new Promise((resolve) => {
        setTimeout(async () => {
          var action = dispatch(fetchAction(event.target.id));
          resolve(action);
        }, 300);
      });

      promise.then((value) => {
        var pop_up = value.payload;
        setAlert(
          <SweetAlert
            style={{ display: "block", marginTop: "-100px" }}
            title={"Segment " + pop_up.Segment}
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
          >
            <Row>
              <Col md="12">
                Number : {pop_up.Number}
                <br></br>
              </Col>
              <Col md="12">
                lastpurchases : {pop_up.lastpurchases}
                <br></br>
              </Col>
              <Col md="12">
                Frequency : {pop_up.Frequency}
                <br></br>
              </Col>
              <Col md="12">
                Value : {pop_up.Value}
                <br></br>
              </Col>
              <Col md="12" className="hrSweet">
                Activity : {pop_up.Activity}
                <br></br>
              </Col>
              <Col md="12" className="hrSweet">
                ActionableTip : {pop_up.ActionableTip}
                <br></br>
              </Col>
            </Row>
          </SweetAlert>
        );
      });
    },
    [dispatch, hideAlert]
  );
  const getSegment = useCallback((val,total) => {
      var array = [];
      if (val !== 0 )
        val.forEach((seg) => {
          array.push(seg.value);
        });
      var segmentFiltre = array.join('","');
      var joinSegment = "";
      if (val !== 0 ) joinSegment = '("' + segmentFiltre + '")';
      Promise.all([dispatch(fetchSegment(joinSegment))]).then((value) => {
        var pie = value[0].payload;
        var rest = total;
        var nb = 0;
        var tabSeg = [];
        var tabNomSeg = [];
        var arrayOption = [];
        var arraySelected = [];
        var arraySegment = [];
        var arrayValSegment = [];
        var tableCustomer = [];
        pie.forEach((val) => {
          var moy = 0;
          arraySegment.push(val.Segment);
          arrayValSegment.push(val.Number);
          tableCustomer.push([val.id, val.Number, val.Segment]);
          if (nb < 5 && val.Number !== 0) {
            arraySelected.push({
              value: val.Segment,
              label: val.Segment,
            });
            moy = (parseFloat(val.Number) * 100) / parseFloat(total);
            tabSeg.push(Math.round(moy));
            tabNomSeg.push(val.Segment + "(" + Math.round(moy) + "%)");
            nb++;
            rest -= val.Number;
          }
          arrayOption.push({
            value: val.Segment,
            label: val.Segment,
          });
        });
        var moyRest = (parseFloat(rest) * 100) / parseFloat(total);
        if (rest !== 0) {
          tabSeg.push(Math.round(moyRest));
          tabNomSeg.push("Reste (" + Math.round(moyRest) + "%)");
        }
        setSegmentVal(tabSeg);
        setLegendPieVal(tabNomSeg);
        setSegmentSelected(arraySelected);
        if(testOption===false) setOptionSegment(arrayOption);
        setTestOption(true);
        setValSegment(arrayValSegment);
        setSegment(arraySegment);
        setTableCustomer(tableCustomer);
        });
      },
    [dispatch,setTableCustomer,testOption]
  );

  const getClustring = useCallback(() => {
    Promise.all([dispatch(fetchClustring())])
    .then((value) => {
      var segments = value[0].payload.segment;
      var arraySegments = [];
      setTotal(segments.length);
      var tableScore = [];
      segments.forEach((element) => {
        if (typeof arraySegments[element.Segment] === "undefined") {
          arraySegments[element.Segment] = [];
          arraySegments[element.Segment].push(element);
        } else arraySegments[element.Segment].push(element);
        tableScore.push([
          element.id,
          element.Customer,
          element.Rfm_Score,
          element.Segment,
        ]);
      });
      setTableScore(tableScore);

      var tabPush = [];
      var tabPushBody = [];

      Object.keys(arraySegments).forEach((key) => {
        tabPushBody = [];
        tabPushBody.push(
          arraySegments[key].map((prop) => {
            return {
              id: prop.id,
              Customer: prop.Customer,
              actions: "",
            };
          })
        );
        tabPush.push(
          <Col md="6" className="clustering" key={key}>
            <Card>
              <h4 className="title">{key}</h4>
              <Button
                id={key}
                className="btn-fill"
                onClick={htmlAlert}
                variant="default"
              >
                Détail
              </Button>
              <Card.Header>
                <Card.Body>
                  <ReactTable
                    defaultPageSize={5}
                    data={tabPushBody[0]}
                    columns={[
                      {
                        Header: "Pharmacie",
                        accessor: "Customer",
                        sort: true,
                      },
                      {
                        Header: "",
                        accessor: "actions",
                      },
                    ]}
                    className="-striped -highlight primary-pagination"
                  />
                </Card.Body>
              </Card.Header>
            </Card>
          </Col>
        );
      });

      setDataSegment(tabPush);
    })
  }, [dispatch,setTableScore,setDataSegment,htmlAlert]);  // Don't recreate getClustring like [text] would do

  useEffect(() => {  
  if(total === 0){
      getClustring()
  }  
  else{
    getSegment(0,total);
    }
  }, [getClustring, getSegment,total]);

  function legendPie() {
    var v = "";

    if (legendPieVal !== 0) {
      legendPieVal.forEach((val, key) => {
        v +=" <li className='ct-series-" +key +"' data-legend='" +key +"'>" +val + "</li>";
      });
      document.getElementById("legendPie2").innerHTML = v;
    }

    // col[0].innerHTML(v);
  }

  return (
    <>
      {alert}
      <Container fluid>
        <Row>
          <div id="tab"></div>
          <Col md="6" className="clustering">
            <h4 className="title">Score RFM par client</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  defaultPageSize={5}
                  data={data}
                  columns={[
                    {
                      Header: "Pharmacie",
                      accessor: "Customer",
                      sort: true,
                    },
                    {
                      Header: "Score",
                      accessor: "Rfm_Score",
                    },
                    {
                      Header: "Segment",
                      accessor: "Segment",
                    },
                    {
                      Header: "",
                      accessor: "actions",
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md="6" className="clustering">
            <h4 className="title">Taille des segments</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  defaultPageSize={5}
                  data={dataCustomer}
                  columns={[
                    {
                      Header: "Segment",
                      accessor: "Segment",
                    },
                    {
                      Header: "Nombre",
                      accessor: "Number",
                    },
                    {
                      Header: "",
                      accessor: "actions",
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <Card>
              <Card.Header>
                <Row>
                  <Col md="4">
                    <Card.Title as="h4">Distribution des clusters</Card.Title>
                  </Col>
                  <Col md="8">
                    <Select
                      isMulti
                      className="react-select primary"
                      classNamePrefix="react-select"
                      name="singleSelect"
                      value={segmentSelected}
                      onChange={(val) => {
                        setSegmentSelected(val);
                        getSegment(val,total);
                      }}
                      options={optionSegment}
                      placeholder="Segment"
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <ChartistGraph
                  type="Pie"
                  data={{
                    labels: segmentVal,
                    series: segmentVal,
                  }}
                  className="ct-perfect-fourth"
                />
              </Card.Body>
              <Card.Footer>
                <ul className="ct-legend ct-legend-inside" id="legendPie2">
                  {legendPie()}
                </ul>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Liste des Segments</Card.Title>
              </Card.Header>
              <Card.Body>
                <ChartistGraph
                  type="Bar"
                  data={{
                    labels: segment,
                    series: [valSegment],
                  }}
                  options={{
                    /* plugins: [tooltip()], */
                    seriesBarDistance: 10,
                    axisX: {
                      showGrid: false,
                    },
                    axisY: {
                      offset: 90,
                    },
                    height: "245px",
                  }}
                  responsiveOptions={[
                    [
                      "screen and (max-width: 640px)",
                      {
                        width: "700px",
                      },
                    ],
                  ]}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>{dataSegment}</Row>
      </Container>
    </>
  );
}
export default RfmScoring;
