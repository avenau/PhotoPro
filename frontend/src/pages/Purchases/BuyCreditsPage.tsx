import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RouteChildrenProps } from "react-router-dom";
import Toolbar from "../../components/Toolbar/Toolbar";
import axios from "axios";
import "./BuyCreditsPage.css";

const CURRENCY_API_URL =
  "https://openexchangerates.org/api/latest.json?app_id=";
const ALLANS_CURRENCY_API_KEY = "9c2b48254528496897f2c690960e967b";

class BuyCreditsPage extends React.Component<RouteChildrenProps, any> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      credits: 0,
      priceMsg: "",
      creditsInput: "",
      creditsErrMsg: "",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("/userdetails", {
        params: {
          token: token,
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
      <div className="buyCreditsPage">
        <Toolbar />
        <Container className="mt-5">
          <Row>
            <Col>
              <Jumbotron id="creditsJumbotron">
                <h1>How many credits would you like to purchase?</h1>
                <h3>
                  <i>You currently have {this.state.credits} Credits.</i>
                </h3>
              </Jumbotron>
            </Col>
          </Row>
          <Form>
            <Form.Group as={Row} controlId="credits">
              <Col xs={3}>
                <Form.Label>Number of Credits:</Form.Label>
              </Col>
              <Col>
                <Form.Control type="number"></Form.Control>
                <Form.Text className="text-muted">
                  <p className="error">Error here</p>
                </Form.Text>
              </Col>
            </Form.Group>
            <Row id="buttonsRow" className="mt-5">
              <Col>
                <Button size="lg">Pay with PayPal</Button>
              </Col>
              <Col>
                <Button size="lg">Pay with Card</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default BuyCreditsPage;
