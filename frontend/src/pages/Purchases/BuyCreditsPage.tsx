import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Jumbotron from "react-bootstrap/Jumbotron";
import { RouteChildrenProps } from "react-router-dom";
import Toolbar from "../../components/Toolbar/Toolbar";
import axios from "axios";

const CURRENCY_API_URL =
  "https://openexchangerates.org/api/latest.json?app_id=";
const ALLANS_CURRENCY_API_KEY = "9c2b48254528496897f2c690960e967b";

class BuyCreditsPage extends React.Component<RouteChildrenProps, any> {
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
        <Container>
          <Row>
            <Jumbotron>Hey</Jumbotron>
            <Jumbotron>Hey2</Jumbotron>
          </Row>
        </Container>
      </div>
    );
  }
}

export default BuyCreditsPage;
