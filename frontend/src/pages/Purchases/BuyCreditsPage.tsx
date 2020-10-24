import React from "react";
import { RouteChildrenProps } from "react-router-dom";
import Toolbar from "../../components/Toolbar/Toolbar";

class BuyCreditsPage extends React.Component<RouteChildrenProps, any> {
  constructor(props: RouteChildrenProps) {
    super(props);
  }

  render() {
    return <Toolbar />;
  }
}

export default BuyCreditsPage;
