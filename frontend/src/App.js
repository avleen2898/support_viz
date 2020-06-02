import React from 'react';
import SignIn from './components/SignIn.js';
import SignUp from './components/SignUp';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

function App() {
  return (
      <Router>
        <Route exact path='/' component={SignIn} />
        <Route exact path='/register' component={SignUp} />
      </Router>

  );
}

export default App;
