import React from "react";
import axios from "axios";
import { RouteComponentProps, withRouter } from "react-router-dom";
import PhotoThumbnail from "../Thumbnails/PhotoThumbnail";
import LoadingButton from "../LoadingButton/LoadingButton";

interface Props extends RouteComponentProps {
  photos: Photo[] | null;
  currentVote: string;
  currentId: string;
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
  deleted: boolean;
}

interface State {
  loading: boolean;
  votes: { [key: string]: number };
  currentVote: string;
}

class CurrShowdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { photos, currentVote } = this.props;
    const votes = {} as { [key: string]: number };
    if (photos !== null) {
      photos.forEach((photo) => {
        votes[photo.participantId] = photo.votes;
      });
    }
    this.state = {
      loading: false,
      votes,
      currentVote,
    };
  }

  private doVote(e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (token) {
      // TODO fix request
      this.setState({ loading: true });
      axios
        .post("/showdown/updatelikes", {
          token,
          part_id: id,
        })
        .catch(() => {});
      if (this.state.currentVote !== id) {
        this.setState((prevState) => {
          const newVotes = { ...prevState.votes };
          if (id !== "") newVotes[id] += 1;
          if (prevState.currentVote !== "")
            newVotes[prevState.currentVote] -= 1;
          return {
            currentVote: id,
            loading: false,
            votes: newVotes,
          };
        });
      } else {
        this.setState((prevState) => {
          const newVotes = { ...prevState.votes };
          if (prevState.currentVote !== "")
            newVotes[prevState.currentVote] -= 1;
          return {
            currentVote: "",
            loading: false,
            votes: newVotes,
          };
        });
      }
    } else {
      alert("You must be logged in to do that");
    }
  }

  render() {
    const { photos } = this.props;
    const { votes, currentVote } = this.state;
    return (
      <div className="showdown-photo-container">
        {photos !== null ? (
          photos.map((photo: Photo) => (
            <div style={{ padding: "10px" }} key={photo.id}>
              <div>
                {votes[photo.participantId]}{" "}
                {votes[photo.participantId] === 1 ? "Vote" : "Votes"}
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push(`/photo/${photo.id}`);
                }}
                className="showdown-photo"
              >
                <PhotoThumbnail {...photo} />
              </div>
              <LoadingButton
                loading={this.state.loading}
                onClick={(e) => this.doVote(e, photo.participantId)}
                disabled={photo.deleted}
                variant={
                  photo.participantId === this.state.currentVote
                    ? "primary"
                    : "outline-secondary"
                }
              >
                {photo.participantId === currentVote ? "Voted" : "Vote"}
              </LoadingButton>
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
