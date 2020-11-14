import React from "react";

export default class DoesNotExistPage extends React.Component {
  componentDidMount() {
    document.title = "Page Does Not Exist | PhotoPro";
  }

  render() {
    return (
      <>
        <div>Sorry the page you are looking for does not exist</div>
      </>
    );
  }
}
