import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import axios from "axios";
import Toolbar from "../components/Toolbar/Toolbar"
import 'bootstrap/dist/css/bootstrap.min.css';

interface LoginProps  {
  setAuth: (token: string, email: string) => void
  history: any
}

export default class Login extends React.Component <LoginProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleSubmit(event: any) {
    if (event) {
      event.preventDefault();
    }
    const email = this.state.email;
    const password = this.state.password;
    axios.post('/login', { email, password })
      .then((response: any) => {
        const data = response.data;
        this.props.setAuth(data.token, data.email);
        this.props.history.push("/feed");
    });
  }

  handleChange(event: any) {
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
  }

  render() {
    return (
      <div className="loginPage">
      <Toolbar />
      <Container>
        <Jumbotron>
          <h1>Log In to PhotoPro</h1>
          <p>by JAJAC</p>
        </Jumbotron>
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Form.Group as={Row} controlId="email">
            <Col xs={3}>
              <Form.Label>
                Email
              </Form.Label>
            </Col>
            <Col>
              <Form.Control type="email" placeholder="Enter Email" onChange={(e) => this.handleChange(e)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="password">
            <Col xs={3}>
              <Form.Label>
                Password
              </Form.Label>
            </Col>
            <Col>
              <Form.Control type="password" placeholder="Enter Password" onChange={(e) => this.handleChange(e)}/>
            </Col>
          </Form.Group>
          <Row>
            <Col>
              {/* TODO: change href */}
              <a href="/recover">Forgot your password? Click here.</a>
            </Col>
            <Col>
            </Col>
            <Col>
              <Button variant="primary" type="submit" size="lg">
                Log In
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      </div>
    );
  }
}

