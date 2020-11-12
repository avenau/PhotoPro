import React from "react";
import Toolbar from "../components/Toolbar/Toolbar";
import Showdown from "../components/Showdown/Showdown";
import PopularContributors from "../components/Welcome/PopularContributors";
import PopularImages from "../components/Welcome/PopularImages";
import WelcomeHeader from "../components/Welcome/WelcomeHeader";
import CuratedFeed from "../components/Welcome/CuratedFeed";

interface Props {
  refreshCredits: () => void;
}

class WelcomePage extends React.Component<Props> {
  render() {
    return (
      <div className="HomePage">
        <WelcomeHeader />
        <Showdown />
        <br />
        <CuratedFeed refreshCredits={this.props.refreshCredits} />
        <PopularContributors />
        <PopularImages refreshCredits={this.props.refreshCredits} />
      </div>
    );
  }
}

export default WelcomePage;
