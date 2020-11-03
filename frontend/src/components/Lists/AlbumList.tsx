import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import UserHeader from "../UserHeader/UserHeader";

interface Props extends RouteComponentProps {
  albums: Profile[];
}

interface Profile {
  fname: string;
  lname: string;
  nickname: string;
  email: string;
  location: string;
  id: string;
}

class AlbumList extends React.Component<Props> {
  render() {
    return (
      <>
        {this.props.albums.map((profile) => (
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

export default withRouter(AlbumList);
