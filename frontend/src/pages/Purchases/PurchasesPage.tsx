import React from "react";
import { RouteChildrenProps } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toolbar from "../../components/Toolbar/Toolbar";
import axios from "axios";

class PurchasesPage extends React.Component<RouteChildrenProps> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      credits: 0,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("userdetails", {
        params: {
          token: token,
        },
      })
      .then((res) => {
        this.setState({ credits: res.data.credits });
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
                <h1>You have x Credits.</h1>
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
          <Tabs
            defaultActiveKey="photos"
            id="uncontrolled-tab-example"
            transition={false}
          >
            <Tab eventKey="photos" title="Photos"></Tab>
            <Tab eventKey="albums" title="Albums"></Tab>
          </Tabs>
        </Container>
      </div>
    );
  }
}

export default PurchasesPage;
