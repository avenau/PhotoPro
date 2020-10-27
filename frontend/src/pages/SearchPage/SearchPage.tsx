import axios from "axios";
import { isNaN } from "lodash";
import qs from "qs";
import React from "react";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroller";
import { RouteComponentProps } from "react-router-dom";
import UserList from "../../components/Lists/UserList";
import OrderBy from "../../components/Search/OrderBy";
import PriceFilter from "../../components/Search/PriceFilter";
import Search from "../../components/Search/Search";
import TypeFilter from "../../components/Search/TypeFilter";
import Toolbar from "../../components/Toolbar/Toolbar";
import "./SearchPage.scss";

interface Props extends RouteComponentProps {}

interface State {
  search: string;
  type: string;
  offset: number;
  limit: number;
  profiles: any[];
  atEnd: boolean;
  orderby: string;
  filetype: string;
  priceMin?: number;
  priceMax?: number;
}

export default class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { params } = this.props.match;
    const type = Object.values(params)[0] as string;
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
      limit: 5,
      offset: 0,
      profiles: [],
      type,
      atEnd: false,
      orderby:
        typeof queryParams.order === "string" ? queryParams.order : "recent",
      filetype:
        typeof queryParams.filetype === "string" ? queryParams.filetype : "all",
      priceMin,
      priceMax,
    };
  }

  private getProfiles() {
    axios
      .get(`/search/${this.state.type}`, {
        params: {
          query: this.state.search,
          offset: this.state.offset,
          limit: this.state.limit,
          order: this.state.orderby,
          filetype: this.state.filetype,
          priceMin: this.state.priceMin,
          priceMax: this.state.priceMax,
        },
      })
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

  private orderChange(orderid: string) {
    this.setState({ orderby: orderid, profiles: [], offset: 0 });
  }

  private typeChange(typeid: string) {
    this.setState({ filetype: typeid, profiles: [], offset: 0 });
  }

  private priceChange(priceMin?: number, priceMax?: number) {
    this.setState({ priceMin, priceMax });
  }

  render() {
    const {
      search,
      type,
      profiles,
      atEnd,
      orderby,
      filetype,
      priceMin,
      priceMax,
    } = this.state;
    return (
      <>
        <Toolbar />
        <div className="search-options">
          {type === "photo" ? (
            <TypeFilter
              filetype="All"
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
              min={this.state.priceMin}
              max={this.state.priceMax}
              onChange={(min, max) => this.priceChange(min, max)}
            />
          ) : (
            <div />
          )}
        </div>
        <div className="search-results">
          <InfiniteScroll
            hasMore={!atEnd}
            loadMore={() => this.getProfiles()}
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
            <UserList profiles={profiles} {...this.props} />
          </InfiniteScroll>
        </div>
      </>
    );
  }
}