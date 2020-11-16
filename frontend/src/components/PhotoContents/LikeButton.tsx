import axios from "axios";
import React from "react";
import { HandThumbsUp } from "react-bootstrap-icons";
import HoverText from "../HoverText";
import LoadingButton from "../LoadingButton/LoadingButton";

interface LikeProps {
  pId: string;
  likeCount: number;
  isLiked: boolean;
}

interface State {
  likeCount: number;
  isLiked: boolean;
  loading: boolean;
}

// Get like count on its own
export default class LikeButton extends React.Component<LikeProps, State> {
  constructor(props: LikeProps) {
    super(props);
    this.state = {
      likeCount: props.likeCount,
      isLiked: props.isLiked,
      loading: false,
    };
  }

  handleLike(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    this.setState({ loading: true });
    const token = localStorage.getItem("token");
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
            loading: false,
          }));
        } else {
          this.setState((prevState) => ({
            likeCount: prevState.likeCount - 1,
            isLiked: false,
            loading: false,
          }));
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
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
      </div>
    );
  }
}
