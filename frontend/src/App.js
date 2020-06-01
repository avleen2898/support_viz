import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux'
import {createStore} from "redux";
import './App.css';

import SignIn from './views/SignIn.js';
import SignUp from './views/SignUp';
import LandingPage from './views/LandingPage';
import rootReducer from "./reducers";

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Route exact path='/' component={LandingPage}/>
                <Route exact path='/login' component={SignIn}/>
                <Route exact path='/register' component={SignUp}/>
            </Router>
        </Provider>
    );
}

export default App;
