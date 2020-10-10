import React from "react";

export default class ExamplePage extends React.Component {
  render() {
    return (
      <>
        <div>This is an example page</div>
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
