import axios from "axios";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroller";
import AlbumList from "../Lists/AlbumList";
import CollectionList from "../Lists/CollectionList";
import PhotoList from "../Lists/PhotoList";
import UserList from "../Lists/UserList";
import ArtistList from "../Lists/ArtistList";

interface Props {
  query: string;
  route: string;
  type: "photo" | "album" | "collection" | "user" | "artist" | "albumPhotos";
  orderby?: string;
  filetype?: string;
  priceMin?: number;
  priceMax?: number;
  curatedFeed?: boolean;
  addPhotoId?: (newPhotoId: string) => void;
  updatePage?: () => void;
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
  priceMin: number;
  priceMax: number;
}

export default class ContentLoader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      query: this.props.query,
      loading: false,
      offset: 0,
      limit: 5,
      results: [],
      atEnd: false,
      orderby: this.props.orderby !== undefined ? this.props.orderby : "recent",
      filetype: this.props.filetype !== undefined ? this.props.filetype : "all",
      priceMin: this.props.priceMin !== undefined ? this.props.priceMin : 0,
      priceMax: this.props.priceMax !== undefined ? this.props.priceMax : -1,
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
          orderby: this.state.orderby,
          filetype: this.state.filetype,
          priceMin: this.state.priceMin,
          priceMax: this.state.priceMax,
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log('in then')
        console.log(res)
        this.setState((prevState) => ({
          loading: false,
          results: [...prevState.results, ...res.data],
          offset: prevState.offset + res.data.length,
          atEnd: res.data.length < prevState.limit,
          limit: prevState.limit,
        }));
      })
      .catch(() => { });
  }



  private getList() {
    // Add message for the user if there are no results
    if (this.state.results.length < 1 && this.state.atEnd) {
      if (this.props.curatedFeed === true) {
        return <p>Like and search more photos for a curated feed.</p>
      } else {
        return <p>No results were found :(</p>
      }
    }

    switch (this.props.type) {
      case "photo":
        return (
          <PhotoList
            photos={this.state.results}
            addPhotoId={this.props.addPhotoId}
          />
        );
      case "album":
        return <AlbumList albums={this.state.results} />;
      case "collection":
        return <CollectionList collections={this.state.results} />;
      case "user":
        return <UserList users={this.state.results} />;
      case "artist":
        return <ArtistList artists={this.state.results} />;
      case "albumPhotos":
        return (
          <PhotoList
            photos={this.state.results}
            addPhotoId={(newPhotoId: string) =>
              this.props.addPhotoId?.(newPhotoId)
            }
            updatePage={this.props.updatePage}

          />
        );
      default:
        return <div>Error: Invalid seach type: {this.props.type}</div>;
    }
  }

  render() {
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
          {this.state.loading ? (
            <Spinner
              animation="border"
              role="status"
              style={{ display: "block", margin: "40px" }}
              key="spin"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
              <></>
            )}
        </InfiniteScroll>
      </>
    );
  }
}
