import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Jumbotron from "react-bootstrap/Jumbotron";
import "./ForgotPasswordPage.scss";
import { Redirect, RouteComponentProps } from "react-router-dom";
import ValidatePassword from "../../components/AccountManagement/ValidatePassword";

interface Props extends RouteComponentProps {}

interface State {
  code?: string;
  newPassword?: string;
  email?: string;
  validPass?: boolean;
}

type LocState = {
  email: string;
};

export default class ForgotPasswordPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      validPass: false,
    };
  }

  private handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    const { code } = this.state;
    const password = this.state.newPassword;
    const { email } = this.state;
    // TODO replace with toast in axios
    if (!this.state.validPass) {
      alert("Passwords Don't Match");
      return;
    }
    axios
      .post("/passwordreset/reset", {
        reset_code: code,
        new_password: password,
        email,
      })
      .then(() => {
        // TODO intermediate confirmation page
        this.props.history.push("/login");
      })
      .catch(() => {});
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name } = event.target;
    this.setState({ [name]: event.target.value });
  }

  private resendEmail(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    email: string
  ) {
    event.preventDefault();
    // TODO update these notifications with toast
    axios
      .post("/passwordreset/request", { email })
      .then(() => {
        alert("Email Sent");
      })
      .catch(() => {
        alert("Failed to send");
      });
  }

  componentDidMount() {
    if (this.props.location.state instanceof Object) {
      this.setState({ email: (this.props.location.state as LocState).email });
    }
  }

  render() {
    if (!this.props.location.state) {
      return <Redirect to="/forgotpassword/request" />;
    }
    let email = "Email not found.";
    if (this.props.location.state instanceof Object) {
      email = (this.props.location.state as LocState).email;
    }
    return (
      <Jumbotron className="forgot-jumbo">
        <p>Enter the verification code sent to {email}</p>
        <Form
          onSubmit={(e: React.FormEvent<HTMLElement>) => this.handleSubmit(e)}
        >
          <Form.Group controlId="formGroupEmail">
            <Form.Control
              required
              type="text"
              placeholder="Verification Code"
              name="code"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                this.handleChange(e)
              }
            />
          </Form.Group>
          <ValidatePassword
            setPassword={(password) => {
              this.setState({ newPassword: password });
            }}
            validPass={(valid) => {
              this.setState({ validPass: valid });
            }}
            required
          />
          <Button variant="primary" type="submit">
            Submit
          </Button>{" "}
          <Button
            variant="primary"
            type="button"
            onClick={(e) => {
              this.resendEmail(e, email);
            }}
          >
            Re-send Email
          </Button>{" "}
        </Form>
      </Jumbotron>
    );
  }
}
