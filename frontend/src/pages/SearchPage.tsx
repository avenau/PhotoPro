import React from "react";
// import axios from "axios";
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps {}

interface State {
  search: string | undefined;
}

export default class ProfilePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search: this.props.location.search.match(/q=([^&]*)/)?.[1],
    };
  }

  render() {
    console.log(this.state.search);

    return <>Searched for {decodeURIComponent(this.state.search!)}</>;
  }
}
