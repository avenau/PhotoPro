import React from "react";
import { Spinner } from "react-bootstrap";

export default class LoadingPage extends React.Component {
  render() {
    return (
      <div className="HomePage">
        <Spinner
          animation="border"
          role="status"
          style={{
            display: "block",
            margin: "100px auto",
            width: "50px",
            height: "50px",
          }}
          key="spin"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }
}
