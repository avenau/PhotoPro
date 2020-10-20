import React from "react";
import { Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import profilePic from "../../static/profile-pic.png";
import "./UserHeader.scss";

interface Props {
  photo?: string;
  header: boolean;
  currentUser: boolean;
  showEdit: boolean;
  name: string;
  nickname: string;
  location: string;
  email: string;
  className: string;
}

export default class UserHeader extends React.Component<Props> {
  static defaultProps = {
    header: false,
    current_user: false,
    showEdit: false,
    className: "",
  };

  /** Return edit button if current user */
  private getEditButton() {
    if (!this.props.showEdit || !this.props.currentUser) {
      return null;
    }
    return (
      <Link to="/manage_account" className="button-container">
        <PencilSquare size="2rem" color="#343a40" />
      </Link>
    );
  }

  /** Return follow button if not current user */
  private getFollowButton() {
    if (this.props.currentUser) {
      return null;
    }

    const alreadyFollowing = false;
    if (alreadyFollowing) {
      return (
        <Button
          className="button-container"
          variant="outline-primary"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Following
        </Button>
      );
    }
    return (
      <Button
        className="button-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        Follow
      </Button>
    );
  }

  render() {
    return (
      <div className={`user-container ${this.props.className}`}>
        <div className="cropper">
          <Image
            src={this.props.photo !== undefined ? this.props.photo : profilePic}
            className="image"
          />
        </div>
        <div className="text-container">
          {this.props.header ? (
            <h2>{this.props.name}</h2>
          ) : (
            <h4>{this.props.name}</h4>
          )}
          <div>@{this.props.nickname}</div>
          <div>Based in {this.props.location}</div>
          <div>{this.props.email}</div>
        </div>
        {this.getEditButton()}
        {this.getFollowButton()}
      </div>
    );
  }
}
