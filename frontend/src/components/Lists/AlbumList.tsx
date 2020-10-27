import React from "react";
import { RouteComponentProps } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";

interface Props extends RouteComponentProps {
  profiles: Profile[];
}

interface Profile {
  fname: string;
  lname: string;
  nickname: string;
  email: string;
  location: string;
  id: string;
}

export default class CollectionList extends React.Component<Props> {
  render() {
    return (
      <>
        {this.props.profiles.map((profile) => (
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
              currentUser={profile.id === localStorage.getItem("u_id")}
              {...profile}
            />
          </div>
        ))}
      </>
    );
  }
}
