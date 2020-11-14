import React from "react";
import PhotoContents from "../../components/PhotoContents/PhotoContents";
import "./PhotoDetails.scss";

interface Props {
  refreshCredits: () => void;
}

export default class PhotoDetails extends React.Component<Props> {
  render() {
    const photoId = window.location.pathname.split("/")[2];
    return (
      <div>
        <PhotoContents
          photoId={photoId}
          refreshCredits={this.props.refreshCredits}
        />
      </div>
    );
  }
}
