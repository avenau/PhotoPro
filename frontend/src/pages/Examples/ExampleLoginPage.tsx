import React from "react";
import { RouteComponentProps } from "react-router-dom";

export interface IExampleLoginProps {
  setAuth: (token: string, u_id: string) => void;
}

export default class ExamplePageAuth extends React.Component<
  RouteComponentProps & IExampleLoginProps
> {
  private doLogin() {
    this.props.setAuth("token", "1");
    this.props.history.push("/exampleauth");
  }
  render() {
    return (
      <>
        <div>This is a login example page</div>
        <br />
        <button onClick={() => this.doLogin()}>Login</button>
        <br />
        <br />
        <a href="/example">example</a>
        <br />
        <a href="/example2">example2</a>
        <br />
        <a href="/exampleauth">exampleAuth</a>
        <br />
        <a href="/login">exampleLogin</a>
      </>
    );
  }
}
