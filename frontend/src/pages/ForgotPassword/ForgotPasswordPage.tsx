import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './ForgotPasswordPage.scss';
import { RouteChildrenProps } from 'react-router-dom';

interface Props extends RouteChildrenProps {}

interface State {
  email?: string;
}

export default class ForgotPasswordPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    const { email } = this.state;
    axios
      .post('/passwordreset/request', { email })
      .then((r) => {
        if (r.status !== 200) {
          throw new Error();
        }
        this.props.history.push({
          pathname: '/forgotpassword/reset',
          state: { email },
        });
      })
      .catch((e) => console.log(e));
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleChange(e)}
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
