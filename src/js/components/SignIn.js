import React, { Component } from 'react';
import { connect } from "react-redux";
import * as routes from '../constants/routes';
import { compose } from 'redux'
import {auth, key, sequence, followings, userName, userPicture,energy, lastTransiction, createAccount} from "../actions";
import axios from 'axios';
import { Keypair, StrKey } from 'stellar-base';
import {decode} from "../transaction";
import store from "../store"
import {getData, getEnergy, getLatestBlockTime, getTime} from "./Funtions";
import base32 from "base32.js"
import "../../css/singin.css";


const mapStateToProps = state => {
    return { auth: state.auth, website: state.website, sequence: state.sequence, keypair: state.key,
        followings: state.followings, userName:state.userName, userPicture: state.userPicture, systemActive: state.systemActive,
        createAccount: state.createAccount, lastTransiction: state.lastTransiction,
    };
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
        LastTransiction: int => dispatch(lastTransiction(int)),
        CreateAccount: array => dispatch(createAccount(array)),
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
        this.createKey = this.createKey.bind(this);
    }


    componentWillMount() {
        setTimeout(()=>{
            console.log(this.props.website);
            console.log(this.props.systemActive);
        }, 2000);

        if(this.props.auth === true) {
            this.props.history.push(routes.LANDING);
            return;
        }
    }

    async signIn(){
        const prk = document.getElementById("prk").value;
        if (StrKey.isValidEd25519SecretSeed(prk)) {
            const pk = Keypair.fromSecret(prk);
            let data = await getData(this.props.website, pk.publicKey());
            if(data === "Not exist" || data.length === 0)
            {
                this.setState({
                    check: false,
                });
                return;
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
            setTimeout(()=>{
                this.props.history.push(routes.LANDING);
            }, 500);

        }
        else {
            this.setState({
                check: false
            });
        }
    }

    createKey() {
        const keypair = Keypair.random();
        document.getElementById("pk1").value = keypair.publicKey();
        document.getElementById("prk1").value = keypair.secret();
    }

    async signUp(){
        const pk = document.getElementById("pk").value;
        if(this.props.createAccount === null) this.props.CreateAccount([]);
        let create = this.props.createAccount;
        if (StrKey.isValidEd25519PublicKey(pk)) {
            const check = await getData(this.props.website, pk);
            if(check.length > 0) alert("Public key existed!");
            else {
                for(let i =0; i<create.length; i++) {
                    if(create[i].pk === pk) {
                        alert("Public key is waiting to create!");
                        return;
                    }
                }
                let date = new Date();
                date = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(date);
                let temp_create = {
                    pk: pk,
                    time: date,
                };
                create = create.concat(temp_create);
                this.props.CreateAccount(create);
                alert("Request send!\nPlease sign in after about 1 day.");
            }
        }
        else {
            alert("Invalid Public key!");
        }
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
                        <div>Sign in your account</div>
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
                            <button type="submit" className="btn btn-success" style={{width: "100%",background:""}} onClick={this.signIn}>Submit</button>
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
                        <div style={{textAlign: "center"}}>
                            <button type="submit" className="btn btn-dark" onClick={this.createKey}>Create key</button>
                        </div>
                        <div className="form-group">
                            <label>Public key:</label>
                            <input type="text" name="pk" className="form-control"
                                   id="pk1" placeholder="" readOnly/>
                        </div>
                        <div className="form-group">
                            <label>Private key:</label>
                            <input type="text" name="prk1" className="form-control"
                                   id="prk1" placeholder="" readOnly/>
                        </div>
                        <div className="form-group">
                            <label>Type Public key here to create account:</label>
                            <input type="text" name="pk" className="form-control"
                                   id="pk" placeholder="Please enter your public key"/>
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
