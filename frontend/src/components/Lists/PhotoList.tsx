import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import PhotoThumbnail from "../PhotoThumbnail/PhotoThumbnail";
import "./PhotoList.scss";

interface Props extends RouteComponentProps {
  photos: Photo[];
}

interface Photo {
  id: string;
  title: string;
  price: number;
  discount: string;
  photoStr: string;
  metadata: string;
}

class PhotoList extends React.Component<Props> {
  render() {
    return (
      <>
        {this.props.photos.map((photo) => (
          <div
            onClick={(e) => {
              e.preventDefault();
              this.props.history.push(`/photo/${photo.id}`);
            }}
            className="result-container"
            key={photo.id}
          >
            <PhotoThumbnail {...photo} />
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(PhotoList);
