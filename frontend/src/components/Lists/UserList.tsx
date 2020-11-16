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
  following: boolean;
}

interface State {
  followBtnsDisabled: boolean;
}

class UserList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      followBtnsDisabled: false,
    };
  }

  setFollowBtnsDisabled = (followBtnsDisabled: boolean) => {
    this.setState({ followBtnsDisabled });
  };

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
              isCurrentUser={profile.id === localStorage.getItem("u_id")}
              name={`${profile.fname} ${profile.lname}`}
              {...profile}
              following={profile.following}
              userId={profile.id}
              followBtnsDisabled={this.state.followBtnsDisabled}
              setFollowBtnsDisabled={this.setFollowBtnsDisabled}
            />
          </div>
        ))}
      </>
    );
  }
}

export default withRouter(UserList);
