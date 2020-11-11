import React from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

interface Props {
  partId: string;
  sdId: string;
  isLiked: boolean;
  likeCount: number;
}

// Get like count on its own
export default class ShowdownVote extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      token: localStorage.getItem("token") as string,
      part_id: this.props.partId,
      sd_id: this.props.sdId,
      likeCount: this.props.likeCount,
    };
  }

  handleLike(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
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

  // Popup window after liking photo
  alertMessage() {
    return (
      <div className="alertToast">
        <Modal
          show={this.state.showAlert}
          onHide={() => this.setState({ showAlert: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>PhotoPro</Modal.Title>
          </Modal.Header>

          <Modal.Body>{this.state.alertContent}</Modal.Body>
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Button
          variant={this.state.isLiked ? "primary" : "light"}
          onClick={(e) => this.handleLike(e)}
        >
          Vote
          {this.state.likeCount}
        </Button>
        {this.state.showAlert ? this.alertMessage() : <></>}
      </div>
    );
  }
}
