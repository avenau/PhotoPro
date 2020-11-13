import { isNaN } from "lodash";
import qs from "qs";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import OrderBy from "../../components/Search/OrderBy";
import PriceFilter from "../../components/Search/PriceFilter";
import Search from "../../components/Search/Search";
import TypeFilter from "../../components/Search/TypeFilter";
import ContentLoader from "../../components/ContentLoader/ContentLoader";
import "./SearchPage.scss";

interface Props extends RouteComponentProps {
  refreshCredits: () => void;
}

interface State {
  search: string;
  type: "photo" | "album" | "collection" | "user";
  orderby: string;
  filetype: string;
  priceMin?: number;
  priceMax?: number;
}

class SearchPage extends React.Component<Props, State> {
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
            key={this.state.orderby + this.state.filetype}
            refreshCredits={this.props.refreshCredits}
          />
        </div>
      </>
    );
  }
}

export default withRouter(SearchPage);
