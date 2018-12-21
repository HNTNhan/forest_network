import React, {Component} from "react";
import Navigation from './Navigation';
import * as routes from '../constants/routes';
import SignInPage from './SignIn';
import HomePage from './Home';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap';
//import Popper from 'popper.js';
//import $ from "jquery";
import AccountPage from './Account';
import LandingPage from  './Landing';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import {compose} from "redux";
import {website, systemActive} from "../actions";
import axios from 'axios';


const mapStateToProps = state => {
    return { auth: state.auth};
};

const mapDispatchToProps = dispatch => {
    return {
        website: string => dispatch(website(string)),
        systemActive: bool => dispatch(systemActive(bool))
    };
};

class App extends Component {
    constructor(props) {
        super(props);
        this.statusWebsite =this.statusWebsite.bind(this);
    }

    async statusWebsite(){
        let website = [];
        await axios.get('https://komodo.forest.network/')
            .then(function (response) {
                website = website.concat('https://komodo.forest.network/');
            })
            .catch(function (error) {
                website = website.concat('');
            });
        await axios.get('https://zebra.forest.network/')
            .then(function (response){
                website = website.concat('https://komodo.forest.network/');
            })
            .catch(function (error) {
                website = website.concat('');
            });
        await axios.get('https://dragonfly.forest.network/')
            .then(function (response) {
                website = website.concat('https://komodo.forest.network/');
            })
            .catch(function (error) {
                website = website.concat('');
            });
        await axios.get('https://gorilla.forest.network/')
            .then(function (response) {
                website = website.concat('https://komodo.forest.network/');
            }).catch(function (error) {
                website = website.concat('');
            });
        let number = 0;
        for(let i=0; i < website.length; i++) {
            if(website[i] !== '') {
                number++;
                if(number===1) this.props.website(website[i]);
            }
        }
        if(number >= 3) this.props.systemActive(true);
    }

    render() {
        this.statusWebsite();
        return (
            <div>
                <Router>
                    <div>
                        <Navigation authUser={this.props.auth} />
                        <Route exact path={routes.LANDING} component={LandingPage} />
                        <Route exact path={routes.SIGN_IN} component={SignInPage} />
                        <Route exact path={routes.HOME} component={HomePage} />
                        <Route exact path={routes.ACCOUNT} component={AccountPage} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(App)
