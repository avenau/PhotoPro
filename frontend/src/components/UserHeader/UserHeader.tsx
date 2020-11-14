import _ from "lodash";
import React from "react";
import { Image } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import profilePic from "../../static/profile-pic.png";
import "./UserHeader.scss";
import FollowButton from "./FollowButton";
import ShowdownBadge from "../Showdown/ShowdownBadge";
import HoverText from "../HoverText";

interface Props {
  profilePic?: string[];
  header: boolean;
  isCurrentUser: boolean;
  showEdit: boolean;
  name: string;
  nickname: string;
  location: string;
  email: string;
  className: string;
  aboutMe?: string;
  userId: string;
  following: boolean;
  contributor?: boolean;
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
    if (!this.props.showEdit || !this.props.isCurrentUser) {
      return null;
    }
    return (
      <HoverText
        id="manage-account-hover"
        helpfulText="Manage your account details"
        placement="right"
      >
        <Link to="/manage_account" className="button-container">
          <PencilSquare size="2rem" color="#343a40" />
        </Link>
      </HoverText>
    );
  }

  /** Return follow button if not current user */
  private getFollowButton() {
    if (this.props.isCurrentUser) {
      return null;
    }
    return (
      <FollowButton
        following={this.props.following}
        userId={this.props.userId}
      />
    );
  }

  private getPic() {
    // Get filetype

    if (_.isEqual(this.props.profilePic, ["", ""])) {
      return profilePic;
    }
    if (this.props.profilePic !== undefined) {
      // base64 of the tuple profilePic
      const b64 = `${this.props.profilePic[0]}`;
      const header = "data:image/";
      // Filetype of the tuple profilePic
      const filetype = `${this.props.profilePic[1]}`;
      const footer = ";base64, ";
      const ret = header.concat(filetype.concat(footer.concat(b64)));

      return ret;
    }
    return profilePic;
  }

  render() {
    return (
      <div className={`user-container ${this.props.className}`}>
        <div className="cropper">
          <Image src={this.getPic()} className="image" />
        </div>
        <div className="text-container">
          {this.props.header ? (
            <h3>{this.props.name}</h3>
          ) : (
            <h4>{this.props.name}</h4>
          )}
          {this.props.contributor ? (
            <b>Contributor</b>
          ) : (
            <b>Explorer</b>
          )}
          <div>@{this.props.nickname}</div>
          <div>Based in {this.props.location}</div>
          <div>{this.props.email}</div>
          {this.props.aboutMe !== undefined && this.props.aboutMe !== "" ? (
            <div>About me: {this.props.aboutMe}</div>
          ) : (
            <></>
          )}
        </div>
        <ShowdownBadge type="user" entryId={this.props.userId} />
        {this.getEditButton()}
        {this.getFollowButton()}
      </div>
    );
  }
}
