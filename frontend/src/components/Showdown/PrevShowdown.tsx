import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import PhotoThumbnail from "../Thumbnails/PhotoThumbnail";

interface Props extends RouteComponentProps {
  photo: Photo | null;
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
  votes: number;
  deleted: boolean;
}

class PrevShowdown extends React.Component<Props> {
  literallyDoNothing(foo: boolean) {
    return;
  }

  render() {
    const { photo } = this.props;
    return (
      <div className="showdown-photo-container">
        {photo !== null ? (
          <div
            onClick={(e) => {
              e.preventDefault();
              if (!photo.deleted) this.props.history.push(`/photo/${photo.id}`);
            }}
            className="showdown-photo"
          >
            <PhotoThumbnail
              {...photo}
              buyBtnLoading={false}
              setBuyBtnsDisabled={this.literallyDoNothing}
            />
          </div>
        ) : (
          <div>
            No previous winner was found. Continue liking photos and check back
            for more showdowns later!
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(PrevShowdown);
