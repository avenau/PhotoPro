import React from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import LoadingButton from "../../components/LoadingButton/LoadingButton";

interface FollowButtonProps {
  userId: string; // This is the user_id of the person being followed
  following: boolean;
}

interface State {
  showLoginAlert: boolean;
  following: boolean | undefined;
  btnLoading: boolean;
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
      btnLoading: false,
    };
  }

  componentWillReceiveProps(nextProps: FollowButtonProps) {
    this.setState({ following: nextProps.following });
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
    this.setState({ btnLoading: true });
    const token = localStorage.getItem("token") as string;
    if (token) {
      axios
        .post(`/user/follow`, {
          token,
          followed_u_id: this.props.userId,
        })
        .then((res) => {
          this.setState({ btnLoading: false, following: res.data.followed });
        })
        .catch(() => {
          this.setState({ btnLoading: false });
        });
    } else {
      this.setState({ showLoginAlert: true, btnLoading: false });
    }
  }

  render() {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        {this.state.following ? (
          <LoadingButton
            loading={this.state.btnLoading}
            variant="secondary"
            onClick={(e) => this.handleFollow(e)}
          >
            Unfollow
          </LoadingButton>
        ) : (
          <LoadingButton
            loading={this.state.btnLoading}
            variant="primary"
            onClick={(e) => this.handleFollow(e)}
          >
            Follow
          </LoadingButton>
        )}
        {this.state.showLoginAlert ? this.loginAlert() : null}
      </div>
    );
  }
}
