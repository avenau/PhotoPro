import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PhotoDetails.scss";
import Toolbar from "../../components/Toolbar/Toolbar";
import PhotoContents from "../../components/PhotoContents/PhotoContents";

interface Props {
  refreshCredits: () => void;
}

export default class PhotoDetails extends React.Component<Props> {
  photoId = window.location.pathname.split("/")[2];

  render() {
    return (
      <div>
        <PhotoContents
          photoId={this.photoId}
          refreshCredits={this.props.refreshCredits}
        />
      </div>
    );
  }
}
