import React from "react";
import "./DoesNotExistPage.css";

export default class DoesNotExistPage extends React.Component {
  componentDidMount() {
    document.title = "Page Does Not Exist | PhotoPro";
  }

  render() {
    return (
      <>
        <div id="does-not-exist-message">
          <p>Sorry, the page you are looking for does not exist.</p>
          <p>
            If you think this is a bug, please contact us at
            photopro.jajac@gmail.com
          </p>
          <p>Thank you :)</p>
        </div>
      </>
    );
  }
}
