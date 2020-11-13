import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";
import "./UserList.scss";

interface Props extends RouteComponentProps {
  users: Profile[];
}

interface Profile {
  fname: string;
  lname: string;
  nickname: string;
  email: string;
  location: string;
  id: string;
  following?: boolean;
}

class UserList extends React.Component<Props> {
  render() {
    return (
      <>
        {this.props.users.map((profile) => (
          <div
            onClick={(e) => {
              e.preventDefault();
              this.props.history.push(`/user/${profile.id}`);
            }}
            className="result-container"
            key={profile.id}
          >
            <UserHeader
              name={`${profile.fname} ${profile.lname}`}
              isCurrentUser={profile.id === localStorage.getItem("u_id")}
              {...profile}
              userId={profile.id}
            />
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(UserList);
