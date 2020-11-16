import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import PhotoThumbnail from "../Thumbnails/PhotoThumbnail";
import "./PhotoList.scss";

interface Props extends RouteComponentProps {
  photos: Photo[];
  popular?: boolean;
  addPhotoId?: (newPhotoId: string) => void;
  updatePage?: () => void;
  refreshCredits?: () => void;
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
  likes: number;
}

interface State {
  buyBtnsDisabled: boolean;
}

class PhotoList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      buyBtnsDisabled: false,
    };
  }

  setBuyBtnsDisabled = (buyBtnsDisabled: boolean) => {
    this.setState({ buyBtnsDisabled });
  };

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
            <PhotoThumbnail
              {...photo}
              updatePage={this.props.updatePage}
              popular={this.props.popular}
              refreshCredits={this.props.refreshCredits}
              buyBtnLoading={this.state.buyBtnsDisabled}
              setBuyBtnsDisabled={this.setBuyBtnsDisabled}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(PhotoList);
