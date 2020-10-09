import React from 'react';
import Welcome from '../components/Welcome';
import Showdown from '../components/Showdown/Showdown';

function HomePage() {
  return (
    <div className = "HomePage">
      <Welcome />
      <Showdown />
    </div>
  )
}

export default HomePage;
