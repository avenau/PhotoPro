import axios from "axios";
import { isNaN } from "lodash";
import qs from "qs";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroller";
import { RouteComponentProps } from "react-router-dom";
import UserList from "../../components/Lists/UserList";
import PhotoList from "../../components/Lists/PhotoList";
import AlbumList from "../../components/Lists/AlbumList";
import CollectionList from "../../components/Lists/CollectionList";
import OrderBy from "../../components/Search/OrderBy";
import PriceFilter from "../../components/Search/PriceFilter";
import Search from "../../components/Search/Search";
import TypeFilter from "../../components/Search/TypeFilter";
import Toolbar from "../../components/Toolbar/Toolbar";
import "./SearchPage.scss";
import ContentLoader from "../../components/ContentLoader/ContentLoader";

interface Props extends RouteComponentProps {}

interface State {
  search: string;
  type: "photo" | "album" | "collection" | "user";
  orderby: string;
  filetype: string;
  priceMin?: number;
  priceMax?: number;
}

export default class SearchPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { params } = this.props.match;
    const type = Object.values(params)[0] as
      | "photo"
      | "album"
      | "collection"
      | "user";
    const queryParams = qs.parse(this.props.location.search.slice(1));
    let priceMin;
    let priceMax;
    if (
      typeof queryParams.priceMin === "string" &&
      !isNaN(Number.parseInt(queryParams.priceMin, 10))
    ) {
      priceMin = Number.parseInt(queryParams.priceMin, 10);
    }
    if (
      typeof queryParams.priceMax === "string" &&
      !isNaN(Number.parseInt(queryParams.priceMax, 10))
    ) {
      priceMax = Number.parseInt(queryParams.priceMax, 10);
    }

    this.state = {
      search: typeof queryParams.q === "string" ? queryParams.q : "",
      type,
      orderby:
        typeof queryParams.order === "string" ? queryParams.order : "recent",
      filetype:
        typeof queryParams.filetype === "string" ? queryParams.filetype : "all",
      priceMin,
      priceMax,
    };
  }

  // private getResults() {
  //   axios
  //     .get(`/search/${this.state.type}`, {
  //       params: {
  //         query: this.state.search,
  //         offset: this.state.offset,
  //         limit: this.state.limit,
  //         order: this.state.orderby,
  //         filetype: this.state.filetype,
  //         priceMin: this.state.priceMin,
  //         priceMax: this.state.priceMax,
  //         token: localStorage.getItem("token"),
  //       },
  //     })
  //     .then((res) => {
  //       this.setState((prevState) => ({
  //         results: [...prevState.results, ...res.data],
  //         offset: prevState.offset + res.data.length,
  //         atEnd: res.data.length < prevState.limit,
  //       }));
  //     })
  //     .catch(() => {});
  // }

  // private getList() {
  //   switch (this.state.type) {
  //     case "photo":
  //       return <PhotoList photos={this.state.results} />;
  //     case "album":
  //       return <AlbumList albums={this.state.results} />;
  //     case "collection":
  //       return <CollectionList collections={this.state.results} />;
  //     case "user":
  //       return <UserList users={this.state.results} />;
  //     default:
  //       return <div>Error: Invalid seach type: {this.state.type}</div>;
  //   }
  // }

  private orderChange(orderid: string) {
    this.setState({ orderby: orderid });
  }

  private typeChange(typeid: string) {
    this.setState({ filetype: typeid });
  }

  private priceChange(priceMin?: number, priceMax?: number) {
    this.setState({ priceMin, priceMax });
  }

  render() {
    const { search, type, orderby, filetype, priceMin, priceMax } = this.state;
    return (
      <>
        <Toolbar />
        <div className="search-options">
          {type === "photo" ? (
            <TypeFilter
              filetype={filetype}
              onChange={(typeid) => this.typeChange(typeid)}
            />
          ) : (
            <div />
          )}
          <Search
            prefill={search}
            type={type}
            order={orderby}
            filetype={filetype}
            priceMin={priceMin}
            priceMax={priceMax}
          />
          <OrderBy
            type={type}
            orderby={this.state.orderby}
            onChange={(name) => this.orderChange(name)}
          />
          {["photo", "album"].includes(type) ? (
            <PriceFilter
              min={priceMin}
              max={priceMax}
              onChange={(min, max) => this.priceChange(min, max)}
            />
          ) : (
            <div />
          )}
        </div>
        <div className="search-results">
          <ContentLoader
            query={this.state.search}
            route={`/search/${type}`}
            type={type}
            orderby={orderby}
            filetype={filetype}
            priceMin={priceMin}
            priceMax={priceMax}
          />
          {/* <InfiniteScroll
            hasMore={!atEnd}
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
          </InfiniteScroll> */}
        </div>
      </>
    );
  }
}
