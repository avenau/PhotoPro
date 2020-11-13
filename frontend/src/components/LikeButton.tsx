import axios from "axios";
import React from "react";
import { Toast } from "react-bootstrap";
import { HandThumbsUp } from "react-bootstrap-icons";
import HoverText from "./HoverText";
import LoadingButton from "./LoadingButton/LoadingButton";

interface LikeProps {
  pId: string;
  likeCount: number;
  isLiked: boolean;
}

interface State {
  likeCount: number;
  isLiked: boolean;
  loading: boolean;
  alertContent: string;
  showAlert: boolean;
}

// Get like count on its own
export default class LikeButton extends React.Component<LikeProps, State> {
  constructor(props: LikeProps) {
    super(props);
    this.state = {
      likeCount: props.likeCount,
      isLiked: props.isLiked,
      loading: false,
      alertContent: "No Content",
      showAlert: false,
    };
  }

  handleLike(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    this.setState({ loading: true });
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post("/photo_details/like_photo", {
          photoId: this.props.pId,
          token,
        })
        .then(() => {
          if (!this.state.isLiked) {
            this.setState((prevState) => ({
              likeCount: prevState.likeCount + 1,
              isLiked: true,
              alertContent: "You successfully liked this photo!",
              showAlert: true,
              loading: false,
            }));
          } else {
            this.setState((prevState) => ({
              likeCount: prevState.likeCount - 1,
              isLiked: false,
              alertContent: "You successfully unliked this photo!",
              showAlert: true,
              loading: false,
            }));
          }
        })
        .catch(() => {});
    } else {
      this.setState({
        alertContent: "You must be logged in to like a photo!",
        showAlert: true,
        loading: false,
      });
    }
  }

  // Popup window after liking photo
  alertMessage() {
    return (
      <Toast
        style={{
          position: "fixed",
          top: 60,
          right: "50%",
        }}
        onClose={() => this.setState({ showAlert: false })}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">PhotoPro</strong>
        </Toast.Header>
        <Toast.Body>{this.state.alertContent}</Toast.Body>
      </Toast>
    );
  }

  render() {
    return (
      <div>
        <HoverText id="likeButton" helpfulText="Like Photo" placement="bottom">
          <LoadingButton
            variant={this.state.isLiked ? "primary" : "light"}
            onClick={(e) => this.handleLike(e)}
            className="mr-2 mt-2"
            loading={this.state.loading}
          >
            <HandThumbsUp /> {this.state.likeCount}
          </LoadingButton>
        </HoverText>
        {this.state.showAlert ? this.alertMessage() : <></>}
      </div>
    );
  }
}
