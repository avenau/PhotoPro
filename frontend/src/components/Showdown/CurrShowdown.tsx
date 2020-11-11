import React from "react";
import axios from "axios";
import { RouteComponentProps, withRouter } from "react-router-dom";
import ShowdownLike from "./ShowdownVote";
import PhotoThumbnail from "../Thumbnails/PhotoThumbnail";
import LoadingButton from "../LoadingButton/LoadingButton";

interface Props extends RouteComponentProps {
  photos: Photo[] | null;
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
  participantId: string;
  votes: number;
}

interface State {}

class CurrShowdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private doVote(e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post("/showdown/updatelikes", {
          sd_id: this.props.sdId,
          token,
          part_id: this.props.partId,
        })
        .catch(() => {});
      if (!this.state.isLiked) {
        this.setState({
          likeCount: this.state.likeCount + 1,
          isLiked: true,
          alertContent: "You successfully liked this photo!",
          showAlert: true,
        });
      } else {
        this.setState({
          likeCount: this.state.likeCount - 1,
          isLiked: false,
          alertContent: "You successfully unliked this photo!",
          showAlert: true,
        });
      }
    } else {
      this.setState({
        alertContent: "You must be logged in to like a photo!",
        showAlert: true,
      });
    }
  }

  render() {
    const { photos } = this.props;
    console.log(photos);
    return (
      <div className="showdown-photo-container">
        {photos !== null ? (
          photos.map((photo: Photo) => (
            <div style={{ padding: "10px" }} key={photo.id}>
              <div>Total Votes</div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push(`/photo/${photo.id}`);
                }}
                className="showdown-photo"
              >
                <PhotoThumbnail {...photo} />
              </div>
              {/* <ShowdownLike likeCount={600} isLiked partId="" sdId="" /> */}
              <LoadingButton>Vote</LoadingButton>
            </div>
          ))
        ) : (
          <div>
            There are no participants in the current showdown. Continue liking
            photos and check back for more showdowns later!
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(CurrShowdown);
