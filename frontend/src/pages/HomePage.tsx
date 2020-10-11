import React from 'react';
import Welcome from '../components/Welcome/Welcome';
import Toolbar from '../components/Toolbar/Toolbar'

function HomePage() {
  return (
    <div className = "HomePage">
      <Toolbar />
      <Welcome />
    </div>
  )
}

export default HomePage;
