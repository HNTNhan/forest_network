import React, {Component} from "react";
import Navigation from './Navigation';
import * as routes from '../constants/routes';
import SignInPage from './SignIn';
import HomePage from './Home';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap';
import './App.css'
//import Popper from 'popper.js';
//import $ from "jquery";
import AccountPage from './Account';
import LandingPage from  './Landing'
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import {compose} from "redux";

const mapStateToProps = state => {
    return { auth: state.auth };
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
        }
    }

    componentWillMount() {
        if(this.state.auth !== this.props.auth){
            this.setState({
                auth: this.props.auth
            })
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <Navigation authUser={this.state.auth} />
                    <Route exact path={routes.LANDING} component={LandingPage} />
                    <Route exact path={routes.SIGN_IN} component={SignInPage} />
                    <Route exact path={routes.HOME} component={HomePage} />
                    <Route exact path={routes.ACCOUNT} component={AccountPage} />
                </div>
            </Router>
        );
    }
}

export default compose(
    connect(mapStateToProps)
)(App)
