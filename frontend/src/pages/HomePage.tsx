import React from 'react';
import Toolbar from '../components/Toolbar/Toolbar';
import IToolbarState from '../components/Toolbar/IToolbarState';
import IToolbarProps from '../components/Toolbar/IToolbarProps';
import Showdown from '../components/Showdown/Showdown';
import PopularContributors from '../components/Welcome/PopularContributors';
import PopularImages from '../components/Welcome/PopularImages';
import WelcomeHeader from '../components/Welcome/WelcomeHeader';

class WelcomePage extends React.Component<IToolbarProps, IToolbarState> {
  constructor(props:IToolbarProps) {
    super(props);
    this.state = {
      isLoggedIn: props.isLoggedIn,
    };
  }

  render() {
    const { isLoggedIn } = this.state;
    return (
      <div className="HomePage">
        <Toolbar isLoggedIn {...isLoggedIn} />
        <WelcomeHeader />
        <Showdown />
        <PopularContributors />
        <PopularImages />
      </div>
    );
  }
}

export default WelcomePage;
