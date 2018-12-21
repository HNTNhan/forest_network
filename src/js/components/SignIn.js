import React, { Component } from 'react';
import { connect } from "react-redux";
import * as routes from '../constants/routes';
import { compose } from 'redux'
import {auth, key, sequence, data} from "../actions";
import axios from 'axios';
import { Keypair, StrKey } from 'stellar-base';
import {decode} from "../transaction";
import store from "../store";

const mapStateToProps = state => {
    return { auth: state.auth, website: state.website, keypair: state.key};
};


const mapDispatchToProps = dispatch => {
    return {
        Auth: bool => dispatch(auth(bool)),
        Key: Keypair => dispatch(key(Keypair)),
        Sequence: int => dispatch(sequence(int)),
        Data: array => dispatch(data(array)),
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
    signIn(){
        const prk = document.getElementById("prk").value;
        if (StrKey.isValidEd25519SecretSeed(prk)) {
            const pk = Keypair.fromSecret(prk);
            axios.get(this.props.website + "/tx_search?query=%22account=%27" + pk.publicKey() + "%27%22")
                .then(res => {
                    if(res.data.result.total_count === '0' || res.data.result.total_count === 0) {
                        this.setState({
                            check: false,
                        })
                    }
                    else {
                        this.props.Key(pk);
                        this.props.Auth(true);
                        const txs = res.data.result.txs;
                        for (let i = res.data.result.total_count - 1 ; i>=0; i--) {
                            let tx = Buffer(res.data.result.txs[i].tx, "base64");
                            tx = decode(tx);
                            if(tx.account === pk.publicKey()) {
                                this.props.Sequence(tx.sequence+1);
                                break;
                            }
                        }
                        this.props.Data(txs);
                        this.props.history.push(routes.LANDING);
                    }
            });
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
