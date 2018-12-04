import React, { Component } from 'react';
import { connect } from "react-redux";
import * as routes from '../constants/routes';
import { compose } from 'redux'
import {auth} from "../actions";

const mapDispatchToProps = dispatch => {
    return {
        Auth: bool => dispatch(auth(bool))
    };
};

class SignInPage extends Component{
    constructor(props) {
        super(props);
        this.Login = this.Login.bind(this);
    }

    componentWillMount() {
        setTimeout(()=> {
            const bool = true;
            this.props.Auth(bool);
            this.props.history.push(routes.HOME);
        });
    }

    Login() {
        const bool = true;
        this.props.firebase.login({provider: 'google', type: 'popup'}).then(()=>{
            this.props.Auth(bool);
            this.props.history.push(routes.HOME);
        });
    }

    render() {
        return (
            <div className="signin page">
                <h2>Please Sign In</h2>
                <button style={{fontSize: 16}} onClick={this.Login}>Sign In With Google</button>
            </div>
        );
    }
}


export default compose(
    connect(null, mapDispatchToProps),
)(SignInPage)
