import React from "react";
import Toolbar from "../components/Toolbar/Toolbar";
import Showdown from "../components/Showdown/Showdown";
import PopularContributors from "../components/Welcome/PopularContributors";
import PopularImages from "../components/Welcome/PopularImages";
import WelcomeHeader from "../components/Welcome/WelcomeHeader";
import CuratedFeed from "../components/Welcome/CuratedFeed";

class WelcomePage extends React.Component {
  render() {
    return (

      <div className="HomePage">
        <Toolbar />
        <WelcomeHeader />
        <Showdown />
        <CuratedFeed/>
        <PopularContributors />
        <PopularImages />
      </div>
    );
  }
}

export default WelcomePage;
