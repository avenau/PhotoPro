import React from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";


interface FollowButtonProps {
    currentUser: boolean,
    userId: string, // This is the user_id of the person being followed
}

interface FollowButtonState {
    isFollowed: boolean,
    buttonContent: string,
    buttonColour: string,
    showAlert: boolean,

}

export default class FollowButton extends React.Component<FollowButtonProps, FollowButtonState> {
    constructor(props: FollowButtonProps) {
        super(props);
        this.state = {
            isFollowed: false,
            buttonContent: "",
            buttonColour: "primary",
            showAlert: false,
        };
    }

    componentDidMount() {
        if (this.props.currentUser === false) {
            this.isFollowing();
        }
    }

    private loginAlert() {
        return (
          <div>
            <Modal
              show={this.state.showAlert}
              onHide={() => this.setState({ showAlert: false })}
            >
              <Modal.Header closeButton>
                <Modal.Title>PhotoPro</Modal.Title>
              </Modal.Header>

              <Modal.Body>You must be logged in to follow!</Modal.Body>
            </Modal>
          </div>
        )
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
                .catch(() => { });
            if (this.state.isFollowed === true) {
                this.setState({ isFollowed: false, buttonContent: "Follow", buttonColour: "primary" });
            } else {
                this.setState({ isFollowed: true, buttonContent: "Following", buttonColour: "secondary" });
            }
        } else {
            this.setState({ showAlert: true });
        }




    }

    private isFollowing() {
        axios
            .get(`/user/isfollowing?follower_u_id=${localStorage.getItem("u_id") as string}&followed_u_id=${this.props.userId}`)
            .then((r) => {
                this.setState({ isFollowed: r.data.is_followed });
                if (r.data.is_followed === true) {
                    this.setState({ buttonContent: "Following", buttonColour: "secondary" })
                } else {
                    this.setState({ buttonContent: "Follow", buttonColour: "primary" })
                }
            })
            .catch(() => { })
    }

    render() {
        return (
          <div>
            {this.props.currentUser ? null :
            <Button variant={this.state.buttonColour} onClick={(e) => this.handleFollow(e)}>{this.state.buttonContent}</Button>}
            {this.state.showAlert ? this.loginAlert() : null}
          </div>

        )
    }



}