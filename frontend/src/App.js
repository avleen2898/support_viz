import React from 'react';
import SignIn from './views/SignIn.js';
import SignUp from './views/SignUp';
import LandingPage from './views/LandingPage';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router>
            <Route exact path='/' component={LandingPage}/>
            <Route exact path='/login' component={SignIn}/>
            <Route exact path='/register' component={SignUp}/>
        </Router>

    );
}

export default App;
