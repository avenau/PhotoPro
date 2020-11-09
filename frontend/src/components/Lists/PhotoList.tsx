import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import PhotoThumbnail from "../Thumbnails/PhotoThumbnail";
import "./PhotoList.scss";

interface Props extends RouteComponentProps {
  photos: Photo[];
  addPhotoId?: (newPhotoId: string) => void;
}

interface Photo {
  id: string;
  title: string;
  price: number;
  discount: number;
  photoStr: string;
  metadata: string;
  user: string;
  owns: boolean; // purchased or posted
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
