import React from "react";
import { RouteChildrenProps } from "react-router-dom";
import Toolbar from "../../components/Toolbar/Toolbar";
import axios from "axios";

class PurchasesPage extends React.Component<RouteChildrenProps, any> {
  constructor(props: RouteChildrenProps) {
    super(props);
  }

  render() {
    return (
      <div className="purchasesPage">
        <Toolbar />
      </div>
    );
  }
}

export default PurchasesPage;
