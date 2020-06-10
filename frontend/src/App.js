import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux'
import {createStore} from "redux";
import jwt_decode from "jwt-decode";
import {setCurrentUser, logoutUser} from "./actions/authActions";
import setAuthToken from "./utils/setAuthToken";
import './App.css';

import SignIn from './views/SignIn.js';
import SignUp from './views/SignUp';
import LandingPage from './views/LandingPage';
import GardenViz from './views/GardenViz';
import './App.css';
import rootReducer from "./reducers";

const store = createStore(
    rootReducer
);

if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    store.dispatch(setCurrentUser(token));

    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = "./login";
    }
}

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Route exact path='/' component={LandingPage}/>
                <Route exact path='/login' component={SignIn}/>
                <Route exact path='/register' component={SignUp}/>
                <Route exact path='/my-garden' component={GardenViz}/>
            </Router>
        </Provider>
    );
}

export default App;
