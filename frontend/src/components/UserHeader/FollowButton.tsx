import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";


interface FollowButtonProps {
    currentUser: boolean,
    userId: string, //This is the user_id of the person being followed
}

interface FollowButtonState {
    isFollowed: boolean,
    buttonContent: string,

}

class FollowButton extends React.Component<FollowButtonProps, FollowButtonState> {
    constructor(props: FollowButtonProps) {
        super(props);
        this.state = {
            isFollowed: false,
            buttonContent: "",
        };
    }

    componentDidMount() {
        if (this.props.currentUser === false) {
            this.isFollowing();
        }
    }

    handleFollow(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();
    }
    private isFollowing() {
        axios
            .get(`/user/isfollowing?follower_u_id=${localStorage.getItem("u_id") as string}&followed_u_id=${this.props.userId}`)
            .then((r) => {
                this.setState({ isFollowed: r.data.is_followed });
                if (r.data.is_followed === true) {
                    this.setState({ buttonContent: "Following" })
                } else {
                    this.setState({ buttonContent: "Follow" })
                }
            })
            .catch(() => { })
    }

    render() {
        return (
            this.props.currentUser ? null :
                <Button>{this.state.buttonContent}</Button>
        )
    }



}