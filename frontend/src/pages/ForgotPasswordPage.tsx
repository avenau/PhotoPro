import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Jumbotron from "react-bootstrap/Jumbotron";
import "./ForgotPasswordPage.scss";

interface Props {}

interface State {
  email?: string;
}

export default class ForgotPasswordPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  private handleSubmit(event: React.FormEvent<HTMLElement>) {
    if (event) {
      event.preventDefault();
    }
    let email = this.state.email;
    // axios.post("/passwordreset/request", { email: email });
    axios.get("/").then(console.log);
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event) {
      event.preventDefault();
    }
    const name = event.target.name;
    this.setState({ [name]: event.target.value });
    console.log(this.state);
  }

  render() {
    return (
      <Jumbotron className="forgot-jumbo">
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Form.Group controlId="formGroupEmail">
            <Form.Label column>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                this.handleChange(e)
              }
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Jumbotron>
    );
  }
}
