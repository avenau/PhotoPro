import React from "react";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import Spinner from "react-bootstrap/Spinner";
import Toolbar from "../components/Toolbar/Toolbar";
import UserHeader from "../components/UserHeader/UserHeader";
import "./SearchPage.scss";

interface Props extends RouteComponentProps {}

interface State {
  search: string;
  type: string;
  offset: number;
  limit: number;
  profiles: any[];
  atEnd: boolean;
}

export default class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { params } = this.props.match;
    const type = Object.values(params)[0] as string;
    const match = this.props.location.search.match(/q=([^&]*)/);
    this.state = {
      search: match !== undefined ? match?.[1]! : "",
      limit: 5,
      offset: 0,
      profiles: [],
      type,
      atEnd: false,
    };
  }

  private getProfiles() {
    axios
      .get(
        `/search/${this.state.type}?query=${this.state.search}&offset=${this.state.offset}&limit=${this.state.limit}`
      )
      .then((res) => {
        this.setState((prevState) => ({
          profiles: [...prevState.profiles, ...res.data],
          offset: prevState.offset + res.data.length,
        }));
        if (res.data.length < this.state.limit) {
          this.setState({ atEnd: true });
        }
      })
      .catch(() => {});
  }

  render() {
    return (
      <>
        <Toolbar />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <InfiniteScroll
            hasMore={!this.state.atEnd}
            loadMore={() => this.getProfiles()}
            loader={
              <Spinner
                animation="border"
                role="status"
                style={{ display: "block", margin: "auto" }}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            }
          >
            {this.state.profiles.map((profile) => (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push(`/user/${profile.id}`);
                }}
                className="result-container"
                key={profile.id}
              >
                <UserHeader
                  style={{ marginTop: "100px" }}
                  name={`${profile.fname} ${profile.lname}`}
                  // currentUser={profile.id === localStorage.getItem("u_id")}
                  {...profile}
                />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </>
    );
  }
}
