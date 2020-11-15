import axios from "axios";
import React from "react";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Redirect, RouteComponentProps } from "react-router-dom";
import renderToast from "../../axios";
import ValidatePassword from "../../components/AccountManagement/ValidatePassword";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import "./ForgotPasswordPage.scss";

interface Props extends RouteComponentProps {}

interface State {
  code?: string;
  newPassword?: string;
  email?: string;
  validPass?: boolean;
  submitLoading?: boolean;
  resendLoading?: boolean;
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
      submitLoading: false,
      resendLoading: false,
    };
  }

  private handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    const { code } = this.state;
    const password = this.state.newPassword;
    const { email } = this.state;
    if (!this.state.validPass) {
      renderToast("Passwords don't meet the requirements");
      return;
    }
    this.setState({ submitLoading: true });
    axios
      .post("/passwordreset/reset", {
        reset_code: code,
        new_password: password,
        email,
      })
      .then(() => {
        this.props.history.push("/login");
        this.setState({ submitLoading: false });
      })
      .catch(() => {
        this.setState({ submitLoading: false });
      });
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
    this.setState({ resendLoading: true });
    axios
      .post("/passwordreset/request", { email })
      .then(() => {
        renderToast("Email Sent");
        this.setState({ resendLoading: false });
      })
      .catch(() => {
        renderToast("Failed to send");
        this.setState({ resendLoading: false });
      });
  }

  componentDidMount() {
    if (this.props.location.state instanceof Object) {
      this.setState({ email: (this.props.location.state as LocState).email });
    }
    document.title = "Forgot Password | PhotoPro";
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
        <p>
          If there is an account associated with {email} an email will be sent
          containing a verification code. Enter the verification code below to
          reset your password
        </p>
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
          <div style={{ display: "flex", marginTop: "5px" }}>
            <LoadingButton
              variant="primary"
              type="submit"
              loading={
                this.state.submitLoading ? this.state.submitLoading : false
              }
              onClick={() => {}}
              className="mr-2"
            >
              Submit
            </LoadingButton>{" "}
            <LoadingButton
              variant="primary"
              type="button"
              loading={
                this.state.resendLoading ? this.state.resendLoading : false
              }
              onClick={(e) => {
                this.resendEmail(e, email);
              }}
            >
              Re-send Email
            </LoadingButton>{" "}
          </div>
        </Form>
      </Jumbotron>
    );
  }
}
