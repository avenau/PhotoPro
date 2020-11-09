import React from "react";
import { RouteComponentProps } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PhotoDetails.scss";
import Toolbar from "../../components/Toolbar/Toolbar";
import PhotoContents from "../../components/PhotoContents/PhotoContents";

export default class PhotoDetails extends React.Component<RouteComponentProps> {
  photoId = window.location.pathname.split("/")[2];

  render() {
    return (
      <div>
        <Toolbar />
        <PhotoContents photoId={this.photoId} />
      </div>
    );
  }
}
