import React from "react";
import { RouteChildrenProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Toolbar from "../../components/Toolbar/Toolbar";
import "./PurchasesPage.css";

class PurchasesPage extends React.Component<RouteChildrenProps, any> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      credits: 0,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("/userdetails", {
        params: {
          token,
        },
      })
      .then((res) => {
        this.setState({ credits: res.data.credits });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="purchasesPage">
        <Toolbar />
        <Container className="mt-5">
          <Row className="align-items-center">
            <Col xs={9}>
              <Jumbotron>
                <h1>You have {this.state.credits} Credits.</h1>
                <p>You need more.</p>
                <Button href="/purchases/buycredits" size="lg">
                  Buy Credits
                </Button>
              </Jumbotron>
            </Col>
            <Col>
              <Button
                href="/purchases/refundcredits"
                size="sm"
                variant="danger"
              >
                Refund Credits
              </Button>
            </Col>
          </Row>
          <Row id="purchasesHeading">
            <h1>Your Purchases</h1>
          </Row>
          {/* TODO: Actually display purchases here */}
          <Tabs defaultActiveKey="photos" transition={false}>
            <Tab eventKey="photos" title="Photos" />
            <Tab eventKey="albums" title="Albums" />
          </Tabs>
        </Container>
      </div>
    );
  }
}

export default PurchasesPage;
