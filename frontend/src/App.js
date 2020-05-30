import React from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import GardenViz from './components/GardenViz';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
      <Router>
        <Route exact path='/' component={SignIn} />
        <Route exact path='/register' component={SignUp} />
        <Route exact path='/my-garden' component={GardenViz} />
      </Router>

  );
}

export default App;
