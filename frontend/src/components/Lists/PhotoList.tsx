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
      <div className="photo-results">
        {this.props.photos.map((photo) => (
          <div
            onClick={(e) => {
              e.preventDefault();
              this.props.history.push(`/photo/${photo.id}`);
            }}
            key={photo.id}
            className="photo-result"
          >
            <PhotoThumbnail {...photo} />
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(PhotoList);
