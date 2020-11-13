import React from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

interface FollowButtonProps {
  userId: string; // This is the user_id of the person being followed
  following?: boolean;
}

interface State {
  showLoginAlert: boolean;
  following: boolean | undefined;
}

export default class FollowButton extends React.Component<
  FollowButtonProps,
  State
> {
  constructor(props: FollowButtonProps) {
    super(props);
    this.state = {
      showLoginAlert: false,
      following: this.props.following,
    };
  }

  private loginAlert() {
    return (
      <div>
        <Modal
          show={this.state.showLoginAlert}
          onHide={() => this.setState({ showLoginAlert: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>PhotoPro</Modal.Title>
          </Modal.Header>
          <Modal.Body>You must be logged in to follow!</Modal.Body>
        </Modal>
      </div>
    );
  }

  handleFollow(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token") as string;
    if (token) {
      axios
        .post(`/user/follow`, {
          token,
          followed_u_id: this.props.userId,
        })
        .then((res) => {
          this.setState({ following: res.data.followed });
        })
        .catch(() => {});
    } else {
      this.setState({ showLoginAlert: true });
    }
  }

  render() {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        {this.state.following ? (
          <Button variant="secondary" onClick={(e) => this.handleFollow(e)}>
            Unfollow
          </Button>
        ) : (
          <Button variant="primary" onClick={(e) => this.handleFollow(e)}>
            Follow
          </Button>
        )}
        {this.state.showLoginAlert ? this.loginAlert() : null}
      </div>
    );
  }
}
