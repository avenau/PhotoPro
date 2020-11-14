import React from "react";
import PhotoContents from "../../components/PhotoContents/PhotoContents";
import "./PhotoDetails.scss";

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
