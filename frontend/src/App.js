import React from 'react';
import SignIn from './views/SignIn.js';
import SignUp from './views/SignUp';
import LandingPage from './views/LandingPage';
import GardenViz from './views/GardenViz';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router>
            <Route exact path='/' component={LandingPage}/>
            <Route exact path='/login' component={SignIn}/>
            <Route exact path='/register' component={SignUp}/>
            <Route exact path='/my-garden' component={GardenViz} />
        </Router>

    );
}

export default App;
