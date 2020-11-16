import axios from "axios";
import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import { RouteChildrenProps } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import "./BuyCreditsPage.css";

interface State {
  credits: number | null;
  price: number;
  priceMsg: string;
  ncredits: number;
  creditsErrMsg: string;
  location: string;
}

class RefundCreditsPage extends React.Component<RouteChildrenProps, State> {
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
    document.title = "Refund Credits | PhotoPro";
    axios
      .get("/userdetails", {
        params: {
          token,
        },
      })
      .then((res) => {
        this.setState({
          credits: res.data.credits,
          location: res.data.location,
        });
      })
      .catch(() => {});
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
        token,
        ncredits: this.state.ncredits,
      })
      .then(() => {
        this.props.history.push("/purchases");
      })
      .catch(() => {});
  }

  handleCreditsChange(e: any) {
    const ncredits = Number(e.target.value);
    this.setState({ ncredits }, this.setPrice);
    this.setCreditsErr(ncredits);
  }

  setPrice() {
    this.setState((prevState) => {
      const price = Number((prevState.ncredits / 100).toFixed(2));
      return { price };
    }, this.setPriceMsg);
  }

  setPriceMsg() {
    this.setState((prevState) => ({
      priceMsg: `Refund amount: ${prevState.price.toString()} USD.`,
    }));
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
    return `http://letmegooglethat.com/?q=+${this.state.price.toString()}+usd+to+${
      this.state.location
    }+currency`;
  }

  setCreditsErr(ncredits: number) {
    if (this.state.credits === null || ncredits > this.state.credits) {
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
      <div className="refundCreditsPage" style={{ marginTop: "20px" }}>
        <BackButton href="/purchases" label="Purchases" />
        <Container className="mt-5">
          <Row>
            <Col>
              <Jumbotron id="creditsJumbotron">
                <h1>How many Credits would you like to refund?</h1>
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
                />
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
