import _ from "lodash";
import React from "react";
import { Image } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import profilePic from "../../static/profile-pic.png";
import "./UserHeader.scss";
import FollowButton from "./FollowButton";
import HoverText from "../HoverText";

interface Props {
  profilePic?: string[];
  header: boolean;
  currentUser: boolean;
  showEdit: boolean;
  name: string;
  nickname: string;
  location: string;
  email: string;
  className: string;
  aboutMe?: string;
  userId: string;
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
      <HoverText
        id="manage-account-hover"
        helpfulText="Manage your account details"
      >
        <Link to="/manage_account" className="button-container">
          <PencilSquare size="2rem" color="#343a40" />
        </Link>
      </HoverText>
    );
  }

  /** Return follow button if not current user */
  private getFollowButton() {
    if (this.props.currentUser) {
      return null;
    }

    /* const alreadyFollowing = false;
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
     ); */
    return (
      <FollowButton
        currentUser={this.props.currentUser}
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
            <h2>{this.props.name}</h2>
          ) : (
            <h4>{this.props.name}</h4>
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
        {this.getEditButton()}
        {this.getFollowButton()}
      </div>
    );
  }
}
