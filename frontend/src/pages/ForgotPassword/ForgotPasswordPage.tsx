import axios from "axios";
import React from "react";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import { RouteChildrenProps } from "react-router-dom";
import LoadingButton from "../../components/LoadingButton/LoadingButton";
import "./ForgotPasswordPage.scss";

interface Props extends RouteChildrenProps {}

interface State {
  email?: string;
  loading?: boolean;
}

export default class ForgotPasswordPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    document.title = "Forgot Password | PhotoPro";
  }

  private handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    const { email } = this.state;
    this.setState({ loading: true });
    axios
      .post("/passwordreset/request", { email })
      .then(() => {
        this.setState({ loading: false });
        this.props.history.push({
          pathname: "/forgotpassword/reset",
          state: { email },
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name } = event.target;
    this.setState({ [name]: event.target.value });
  }

  render() {
    return (
      <Jumbotron className="forgot-jumbo">
        <p>
          Enter your email below and you will be sent a verification code. Enter
          this on the next page to reset your password.
        </p>
        <Form
          onSubmit={(e: React.FormEvent<HTMLElement>) => this.handleSubmit(e)}
        >
          <Form.Group controlId="formGroupEmail">
            <Form.Control
              required
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                this.handleChange(e)
              }
            />
          </Form.Group>
          <LoadingButton
            variant="primary"
            type="submit"
            loading={this.state.loading ? this.state.loading : false}
            onClick={() => {}}
          >
            Submit
          </LoadingButton>
        </Form>
      </Jumbotron>
    );
  }
}
