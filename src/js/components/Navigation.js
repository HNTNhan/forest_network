import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';
import { connect } from "react-redux";
import {compose} from "redux";
import {auth, data, key, sequence, website, systemActive, userName, followings, logOut} from "../actions";
import store from "../store";
import { Keypair } from 'stellar-base';

const mapDispatchToProps = dispatch => {
    return {
        Auth: bool => dispatch(auth(bool)),
        Website: string => dispatch(website(string)),
        Systemactive: bool => dispatch(systemActive(bool)),
        Key: Keypair => dispatch(key(Keypair)),
        Sequence: int => dispatch(sequence(int)),
        Data: array => dispatch(data(array)),
        UserName: string => dispatch(userName(string)),
        Followings: array => dispatch(followings(array)),
        LogOut: () => dispatch(logOut()),
    };
};

class Navigation extends  Component  {
    constructor(props) {
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    async logOut(){
        this.props.LogOut();
        await store.persistor.flush();
    }

    render() {
        return (
            <div className="container-fluid">
                {(this.props.authUser) ?
                    <div className="row" style={{borderBottom: "1px solid black", padding: "5px 5%", background: "white"}}>
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="row my-1">
                                <div className="col-lg-3 col-md-12 col-sm-12" style={{padding: 0, textAlign: "center"}}>
                                    <button type="button" className="btn btn-link"
                                            style={{background: "none", border: "none"}}>
                                        <Link to={routes.LANDING} onClick={this.forceUpdate}>Home</Link>
                                    </button>
                                </div>
                                <div className="col-lg-5 col-md-12 col-sm-12" style={{padding: 0, textAlign: "center"}}>
                                    <button type="button" className="btn btn-link"
                                            style={{background: "none", border: "none"}}>
                                        <Link to={routes.LANDING}>Notifications</Link>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-12 col-sm-12 my-1" style={{textAlign: "center"}}>
                            <img src={require("../../image/OakTree.png")} alt="tree" width="30"/>
                        </div>

                        <div className="col-lg-5 col-md-12 col-sm-12" style={{textAlign: "center"}}>
                            <div className="row">
                                <div className="col-lg-9 col-md-12 col-sm-12">
                                    <form className="form-inline d-flex justify-content-center">
                                        <input className="form-control mr-sm-2 my-1 border-customize" type="search" placeholder="Search"
                                               aria-label="Search"/>
                                        <button className="btn btn-outline-success " type="submit">Search</button>
                                    </form>
                                </div>
                                <div className="col-lg-3 col-md-12 col-sm-12 dropdown" style={{padding: 0}}>
                                    <a className="nav-link dropdown-toggle" href="#" id="Dropdown" role="button"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={require("../../image/UserIcon.ico")} alt="user" width="30"/>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="Dropdown">
                                        <Link className="dropdown-item" to={routes.ACCOUNT}>Account</Link>
                                        <Link className="dropdown-item" onClick={this.logOut} to={routes.SIGN_IN}>Logout</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null }
            </div>
        );
    }
}

export default compose(
    connect(null, mapDispatchToProps),
)(Navigation)