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
      // Number of credits the user currently has
      // Set by axios.get below
      credits: null,
      price: 0,
      priceMsg: "",
      ncredits: 0,
      creditsErrMsg: "",
      location: "",
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
        this.setState({
          credits: res.data.credits,
          location: res.data.location,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleSubmit(e: React.FormEvent<HTMLElement>) {
    if (e) {
      e.preventDefault();
    }
    if (this.state.ncredits < 1) {
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .post("/purchases/buycredits", {
        token: token,
        ncredits: this.state.ncredits,
      })
      .then((response) => {
        console.log(response);
        this.props.history.push("/purchases");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCreditsChange(e: any) {
    const ncredits = Number(e.target.value);
    this.setState({ ncredits: ncredits }, this.setPrice);
    this.setCreditsErr(ncredits);
  }

  setPrice() {
    const price = Number(this.state.ncredits / 100).toFixed(2);
    this.setState({ price: price }, this.setPriceMsg);
  }

  setPriceMsg() {
    this.setState({
      priceMsg: "Price: " + this.state.price.toString() + " USD.",
    });
  }

  deactivatePurchaseButtons() {
    const paypalButton = document.getElementById("paypalButton") as HTMLElement;
    const cardButton = document.getElementById("cardButton") as HTMLElement;
    return [
      paypalButton.setAttribute("disabled", "true"),
      cardButton.setAttribute("disabled", "true"),
    ];
  }

  activatePurchaseButtons() {
    const paypalButton = document.getElementById("paypalButton") as HTMLElement;
    const cardButton = document.getElementById("cardButton") as HTMLElement;
    return [
      paypalButton.removeAttribute("disabled"),
      cardButton.removeAttribute("disabled"),
    ];
  }

  returnGoogleURL() {
    return (
      "http://letmegooglethat.com/?q=+" +
      this.state.price.toString() +
      "+usd+to+" +
      this.state.location +
      "+currency"
    );
  }

  setCreditsErr(ncredits: number) {
    if (!Number.isInteger(ncredits)) {
      this.setState({ creditsErrMsg: "Please enter a whole number." });
      this.deactivatePurchaseButtons();
    } else if (ncredits < 1) {
      this.setState({ creditsErrMsg: "Please enter a positive number." });
      this.deactivatePurchaseButtons();
    } else {
      this.setState({ creditsErrMsg: "" });
      this.activatePurchaseButtons();
    }
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
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Group as={Row} controlId="credits">
              <Col xs={3}>
                <Form.Label>Number of Credits:</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  onChange={(e) => this.handleCreditsChange(e)}
                ></Form.Control>
                <Form.Text className="text-muted">
                  <p className="error">{this.state.creditsErrMsg}</p>
                </Form.Text>
              </Col>
            </Form.Group>
            <Row id="buttonsRow" className="mt-5">
              <Col>
                <p>{this.state.priceMsg}</p>
                {this.state.priceMsg ? (
                  <a href={this.returnGoogleURL()}>
                    How much does this cost in my currency?
                  </a>
                ) : (
                  <></>
                )}
              </Col>
              <Col>
                <Button id="paypalButton" type="submit" size="lg">
                  Pay with PayPal
                </Button>
              </Col>
              <Col>
                <Button id="cardButton" type="submit" size="lg">
                  Pay with Card
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default BuyCreditsPage;
