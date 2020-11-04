import axios from "axios";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroller";
import AlbumList from "../Lists/AlbumList";
import CollectionList from "../Lists/CollectionList";
import PhotoList from "../Lists/PhotoList";
import UserList from "../Lists/UserList";

interface Props {
  query: string;
  route: string;
  type: "photo" | "album" | "collection" | "user";
  orderby?: string;
  filetype?: string;
  priceMin?: number;
  priceMax?: number;
}

interface State {
  query: string;
  offset: number;
  limit: number;
  results: any[];
  atEnd: boolean;
  loading: boolean;
  orderby: string;
  filetype: string;
  priceMin?: number;
  priceMax?: number;
}

export default class ContentLoader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      query: this.props.query,
      loading: false,
      offset: 0,
      limit: 1,
      results: [],
      atEnd: false,
      orderby: this.props.orderby !== undefined ? this.props.orderby : "recent",
      filetype: this.props.filetype !== undefined ? this.props.filetype : "all",
      priceMin: this.props.priceMin,
      priceMax: this.props.priceMax,
    };
  }

  private getResults() {
    this.setState({ loading: true });
    axios
      .get(this.props.route, {
        params: {
          query: this.state.query,
          offset: this.state.offset,
          limit: this.state.limit,
          order: this.state.orderby,
          filetype: this.state.filetype,
          priceMin: this.state.priceMin,
          priceMax: this.state.priceMax,
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        this.setState((prevState) => ({
          loading: false,
          results: [...prevState.results, ...res.data],
          offset: prevState.offset + res.data.length,
          atEnd: res.data.length < prevState.limit,
          limit: prevState.limit,
        }));
      })
      .catch(() => {});
  }

  private getList() {
    switch (this.props.type) {
      case "photo":
        return <PhotoList photos={this.state.results} />;
      case "album":
        return <AlbumList albums={this.state.results} />;
      case "collection":
        return <CollectionList collections={this.state.results} />;
      case "user":
        return <UserList users={this.state.results} />;
      default:
        return <div>Error: Invalid seach type: {this.props.type}</div>;
    }
  }

  render() {
    console.log("rendering content");

    return (
      <>
        <InfiniteScroll
          hasMore={!this.state.atEnd && !this.state.loading}
          loadMore={() => this.getResults()}
          loader={
            <Spinner
              animation="border"
              role="status"
              style={{ display: "block", margin: "40px" }}
              key="spin"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          }
        >
          {this.getList()}
        </InfiniteScroll>
      </>
    );
  }
}
