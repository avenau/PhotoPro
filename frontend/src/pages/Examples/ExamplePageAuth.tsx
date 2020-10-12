import React from "react";

export default class ExamplePageAuth extends React.Component {
  private doLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("u_id");
    window.location.pathname = "/login";
  }
  render() {
    return (
      <>
        <div>This is a auth blocked example page</div>
        <br />
        <button onClick={() => this.doLogout()}>Logout</button>
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
