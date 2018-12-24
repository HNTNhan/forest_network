import React, { Component } from 'react';
import { connect } from "react-redux";
import * as routes from '../constants/routes';
import { compose } from 'redux'
import {auth, key, sequence, followings, userName, userPicture,energy} from "../actions";
import axios from 'axios';
import { Keypair, StrKey } from 'stellar-base';
import {decode} from "../transaction";
import store from "../store"
import {getData, getEnergy, getLatestBlockTime, getTime} from "./Funtions";
import base32 from "base32.js"

const mapStateToProps = state => {
    return { auth: state.auth, website: state.website, sequence: state.sequence, keypair: state.key,
        followings: state.followings, userName:state.userName, userPicture: state.userPicture};
};


const mapDispatchToProps = dispatch => {
    return {
        Auth: bool => dispatch(auth(bool)),
        Key: Keypair => dispatch(key(Keypair)),
        Sequence: int => dispatch(sequence(int)),
        Followings: array => dispatch(followings(array)),
        UserName: string => dispatch(userName(string)),
        UserPicture: string => dispatch(userPicture(string)),
        Energy: object => dispatch(energy(object)),
    };
};
class SignInPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            check: null,
            type_page: 0,
        };
        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
    }


    componentWillMount() {
        //if(this.props.auth === true) this.props.history.push(routes.LANDING);
    }

    //SBXI7TZ6DXHTOX6QW6VQ7F3YWARVA76ZWWKXWC6COHJTQEEJP3ELPQOD
    async signIn(){
        const prk = document.getElementById("prk").value;
        if (StrKey.isValidEd25519SecretSeed(prk)) {
            const pk = Keypair.fromSecret(prk);
            let data = await getData(this.props.website, pk.publicKey());

            if(data === "Not exist")
            {
                this.setState({
                    check: false,
                })
            }
            else {
                let balance = 0;
                let bandwidthTime = 0;
                let bandwidth = 0;
                for(let i=1; i<data.length; i++) {
                    let tx = Buffer(data[i].tx, "base64");
                    let txSize = tx.length;
                    try {
                        tx = decode(tx);
                    }
                    catch(error) {
                        continue;
                    }
                    if(tx.operation === "payment") {
                        if(tx.account === pk.publicKey()) {
                            balance -= parseInt(tx.params.amount);
                            let time = await getTime(this.props.website, data[i].height);
                            const energy = await getEnergy(balance, bandwidthTime, bandwidth, txSize, time);
                            bandwidthTime = time;
                            bandwidth = energy.bandwidth;
                        }
                        else {
                            balance += parseInt(tx.params.amount);
                            let time = await getTime(this.props.website, data[i].height);
                            const energy = await getEnergy(balance, bandwidthTime, bandwidth, 0, time);
                            bandwidthTime = time;
                            bandwidth = energy.bandwidth;
                        }
                    }
                    else {
                        let time = await getTime(this.props.website, data[i].height);
                        const energy = await getEnergy(balance, bandwidthTime, bandwidth, txSize, time);
                        bandwidthTime = time;
                        bandwidth = energy.bandwidth;
                    }
                }
                this.props.Energy({
                    pos: data.length,
                    balance: balance,
                    bandwidthTime: bandwidthTime,
                    bandwidth: bandwidth,
                });
                let time = await getLatestBlockTime(this.props.website);
                const energy = await getEnergy(balance, bandwidthTime, bandwidth, 0, time);


                this.props.Key({
                    pk: pk.publicKey(),
                    prk: Buffer.from(base32.decode(prk)),
                });

                this.props.Auth(true);

                for (let i = data.length - 1 ; i>=0; i--) {
                    let tx = Buffer(data[i].tx, "base64");
                    tx = decode(tx);
                    if(tx.account === pk.publicKey()) {
                        this.props.Sequence(tx.sequence+1);
                        break;
                    }
                }

                for(let i = data.length - 1; i>=0;  i--) {
                    let tx = Buffer.from(data[i].tx, "base64");
                    try {
                        tx = decode(tx);
                    }
                    catch(error) {
                        continue;
                    }
                    if(this.props.userName === null) {
                        if(tx.operation === "update_account" && tx.params.key === "name") {
                            this.props.UserName(tx.params.value);
                        }
                    }
                    if(this.props.userPicture === null) {
                        if(tx.operation === "update_account" && tx.params.key === "picture") {
                            this.props.UserPicture(tx.params.value);
                        }
                    }
                    if(this.props.followings === null) {
                        if(tx.operation === "update_account" && tx.params.key === "followings") {
                            this.props.Followings(tx.params.value);
                        }
                    }
                }
            }
            this.props.history.push(routes.LANDING);
        }
        else {
            this.setState({
                check: false
            });
        }
    }

    signUp(){

    }

    render() {
        const signIn =
            <div className="row sign_in" style={{ margin: 0,padding: "5px 5%", background: "#e6ecf0"}}>
                <div className="col"> </div>
                <div className="col sign_in">
                    <div className="title_sign_in">
                        <div style={{height: 34}}>
                            <img className="rounded-circle" alt="tree" src={require("../../image/OakTree.png")}
                                 style={{background: "white", width: 32, marginBottom: 5}}/>
                        </div>
                        <div>Sign in to your account</div>
                    </div>
                    <div className="form_sign_in">
                        <div className="form-group">
                            <label htmlFor="exampleInputPassword1">Private Key:</label>
                            <div style={{color: "red", margin: 5}}>
                                {(this.state.check === false)? "Wrong private key!" : null }
                            </div>
                            <input type="password" name="prk" className="form-control"
                                   id="prk" placeholder="Please enter private key" onClick={()=>this.setState({check: true})}/>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <button type="submit" className="btn btn-dark" style={{width: "100%"}} onClick={this.signIn}>Submit</button>
                            <br/>
                            <div>
                                Don't have a account?
                                <button style={{paddingBottom: 10}} className="btn btn-link" onClick={()=>this.setState({type_page: 1})}>Sign up</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col"> </div>
            </div>;
        const signUp =
            <div className="row sign_in" style={{ margin: 0,padding: "5px 5%", background: "#e6ecf0"}}>
                <div className="col"> </div>
                <div className="col sign_in">
                    <div className="title_sign_in">
                        <div style={{height: 34}}>
                            <img className="rounded-circle" alt="tree" src={require("../../image/OakTree.png")}
                                 style={{background: "white", width: 32, marginBottom: 5}}/>
                        </div>
                        <div>Sign up new account</div>
                    </div>
                    <div className="form_sign_in">
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="prk" className="form-control"
                                   id="prk" placeholder="Please enter your email"/>
                        </div>
                        <div style={{textAlign: "center"}}>
                            <button type="submit" className="btn btn-dark" style={{width: "100%"}} onClick={this.signUp}>Submit</button>
                            <br/>
                            <button className="btn btn-link" onClick={()=>this.setState({type_page: 0})}>Sign in</button>
                        </div>
                    </div>
                </div>
                <div className="col"> </div>
            </div>;

        return (
            <div>
                {(this.state.type_page === 0)? signIn : signUp }
            </div>
        );
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(SignInPage)
