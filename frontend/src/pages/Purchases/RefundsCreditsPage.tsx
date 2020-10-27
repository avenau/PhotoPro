import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { ArrowLeft } from "react-bootstrap-icons";
import { RouteChildrenProps } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import Toolbar from "../../components/Toolbar/Toolbar";
import axios from "axios";
import "./BuyCreditsPage.css";

class RefundCreditsPage extends React.Component<RouteChildrenProps, any> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      // Number of credits the user currently has
      // Set by axios.get below
      credits: null,
      price: 0,
      priceMsg: "",
      // Number of credits the user wants to refund
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
      .post("/purchases/refundcredits", {
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
      priceMsg: "Refund amount: " + this.state.price.toString() + " USD.",
    });
  }

  deactivateRefundButtons() {
    const paypalButton = document.getElementById("paypalButton") as HTMLElement;
    const cardButton = document.getElementById("cardButton") as HTMLElement;
    return [
      paypalButton.setAttribute("disabled", "true"),
      cardButton.setAttribute("disabled", "true"),
    ];
  }

  activateRefundButtons() {
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
    if (ncredits > this.state.credits) {
      this.setState({ creditsErrMsg: "You don't have that many credits!" });
      this.deactivateRefundButtons();
    } else if (!Number.isInteger(ncredits)) {
      this.setState({ creditsErrMsg: "Please enter a whole number." });
      this.deactivateRefundButtons();
    } else if (ncredits < 1) {
      this.setState({ creditsErrMsg: "Please enter a positive number." });
      this.deactivateRefundButtons();
    } else {
      this.setState({ creditsErrMsg: "" });
      this.activateRefundButtons();
    }
  }

  render() {
    return (
      <div className="refundCreditsPage">
        <Toolbar />
        <BackButton href="/purchases" label="Purchases" />
        <Container className="mt-5">
          <Row>
            <Col>
              <Jumbotron id="creditsJumbotron">
                <h1>How many credits would you like to refund?</h1>
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
                    How much is this in my currency?
                  </a>
                ) : (
                  <></>
                )}
              </Col>
              <Col>
                <Button id="paypalButton" type="submit" size="lg">
                  Refund to PayPal
                </Button>
              </Col>
              <Col>
                <Button id="cardButton" type="submit" size="lg">
                  Refund to Card
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default RefundCreditsPage;
