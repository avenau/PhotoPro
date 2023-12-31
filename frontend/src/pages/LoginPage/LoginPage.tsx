import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { RouteChildrenProps } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

export default class LoginPage extends React.Component<
  RouteChildrenProps,
  any
> {
  constructor(props: RouteChildrenProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      btnLoading: false,
    };
  }

  componentDidMount() {
    document.title = "Login | PhotoPro";
  }

  handleSubmit(e: React.FormEvent<HTMLElement>) {
    if (e) {
      e.preventDefault();
    }
    const { email } = this.state;
    const { password } = this.state;
    this.setState({ btnLoading: true });
    axios
      .post("/login", { email, password })
      .then((response: any) => {
        const { data } = response;
        this.setState({ btnLoading: false });
        localStorage.setItem("token", data.token);
        localStorage.setItem("u_id", data.u_id);
        localStorage.setItem("nickname", data.nickname);
        this.props.history.push("/");
      })
      .catch(() => {
        this.setState({ btnLoading: false });
      });
  }

  handleChange(event: any) {
    const { id } = event.target;
    this.setState({ [id]: event.target.value });
  }

  render() {
    return (
      <div className="loginPage">
        <Container>
          <Jumbotron>
            <h1>Log In to PhotoPro</h1>
            <p>by JAJAC</p>
          </Jumbotron>
          <Form onSubmit={(e) => this.handleSubmit(e)}>
            <Form.Group as={Row} controlId="email">
              <Col xs={3}>
                <Form.Label>Email</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="password">
              <Col xs={3}>
                <Form.Label>Password</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
            </Form.Group>
            <Row>
              <Col>
                <a href="/forgotpassword/request">
                  Forgot your password? Click here.
                </a>
              </Col>
              <Col>
                <LoadingButton
                  loading={this.state.btnLoading}
                  type="submit"
                  size="lg"
                  onClick={() => {}}
                >
                  Log In
                </LoadingButton>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}
