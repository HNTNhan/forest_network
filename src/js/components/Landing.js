import React, {Component} from 'react';
import {compose} from "redux";
import {Link} from "react-router-dom";
import * as routes from "../constants/routes";
import connect from "react-redux/es/connect/connect";
import {data, sequence, userName, followings, userPost, energy, userPicture} from "../actions";
import axios from "axios";
import {decode, encode, sign} from "../transaction/index";
import {getData, getName, convertName, getTime, getEnergy, getLatestBlockTime} from "./Funtions";
import store from "../store";
import base32 from "base32.js"

const mapDispatchToProps = dispatch => {
    return {
        Sequence: int => dispatch(sequence(int)),
        Data: array => dispatch(data(array)),
        UserName: string => dispatch(userName(string)),
        UserPicture: string => dispatch(userPicture(string)),
        Followings: array => dispatch(followings(array)),
        UserPost: array => dispatch(userPost(array)),
        Energy: object => dispatch(energy(object)),
    };
};

const mapStateToProps = state => {
    return {
        auth: state.auth,
        keypair: state.key,
        website: state.website,
        systemActive: state.systemActive,
        sequence: state.sequence,
        data: state.data,
        userName: state.userName,
        userPicture: state.userPicture,
        followings: state.followings,
        userPost: state.userPost,
        energy: state.energy,
    };
};


class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            energy: 0,
            sequence: 0,
            transictions: 0,
            balance: 0,
            chatBox: false,
            posts: null,
        };
        this.chatBox = this.chatBox.bind(this);
        this.post = this.post.bind(this);
        this.show_post = this.show_post.bind(this);
        this.reply = this.reply.bind(this);
    }

    async componentWillMount(){
        if(!this.props.auth) {
            this.props.history.push(routes.SIGN_IN);
        }
        const a = await base32.encode(Buffer.from(this.props.keypair.prk));
        console.log(a);
        console.log(this.props.userPicture);
    }

    async componentDidMount() {
        let followings_name = [];
        let user_post = [];
        let data = await getData(this.props.website, this.props.keypair.pk);

        let balance = this.props.energy.balance;
        let bandwidthTime = this.props.energy.bandwidthTime;
        let bandwidth = this.props.energy.bandwidth;

        const transictions = data.length;

        for(let i=0; i<data.length; i++) {
            let tx = Buffer(data[i].tx, "base64");
            let txSize = tx.length;
            try {
                tx = decode(tx);
            }
            catch(error) {
                continue;
            }
            if(tx.operation === "post") {
                user_post = await user_post.concat({
                    hash: data[i].hash,
                    time: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(await getTime(this.props.website, data[i].height)),
                    user: tx.account,
                    user_name: await convertName(tx.account, this.props.followings, followings_name, this.props.userName),
                    content: tx.params.content,
                });
            }
            if (i>= this.props.energy.pos) {
                if(tx.operation === "payment") {
                    if(tx.account === this.props.keypair.pk) {
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
        }
        this.props.Energy({
            pos: data.length,
            balance: balance,
            bandwidthTime: bandwidthTime,
            bandwidth: bandwidth,
        });
        let time = await getLatestBlockTime(this.props.website);
        const energy = await getEnergy(balance, bandwidthTime, bandwidth, 0, time);

        this.props.UserPost(user_post);
        if(this.props.followings !== null) {
            for(let i=0; i<this.props.followings.addresses.length; i++) {
                const temp_data = await getData(this.props.website, this.props.followings.addresses[i]);
                data = data.concat(temp_data);
                const name = await getName(this.props.website, this.props.followings.addresses[i]);
                followings_name = followings_name.concat(name);
            }
        }


        for(let i=0; i<data.length-1; i++) {
            for (let j=i+1; j<data.length ; j++) {
                if(parseInt(data[j].height) > parseInt(data[i].height)) {
                    const temp = data[j];
                    data[j] = data[i];
                    data[i] = temp;
                }
            }
        }

        this.props.Data(data);

        let posts = [];
        for(let i=0; i<data.length; i++) {
            let tx = Buffer(data[i].tx, "base64");
            try {
                tx = decode(tx);
            }
            catch(error) {
                continue;
            }
            if(tx.operation === "post") {
                posts = posts.concat({
                    hash: data[i].hash,
                    time: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(await getTime(this.props.website, data[i].height)),
                    user: tx.account,
                    user_name: await convertName(tx.account, this.props.followings, followings_name, this.props.userName),
                    content: tx.params.content,
                });
            }
        }

        this.setState({
            energy: energy.energy,
            posts: posts,
            transictions: transictions,
            balance: parseFloat(balance/100000000).toFixed(8),
        });
    }

    chatBox() {
        this.setState({
           chatBox: true,
        });
    }

    post() {
        if(document.getElementById("new-post").value === "") { alert("Please write something"); return; }
        const tx = {
            version: 1,
            account: this.props.keypair.pk,
            sequence: this.props.sequence,
            memo: Buffer.alloc(0),
            operation: 'post',
            params: {
                content: {
                   type: 1,
                    text: document.getElementById("new-post").value,
                },
                keys: [],
            },
        };
        sign(tx, this.props.keypair.prk);
        const etx = encode(tx).toString('hex');
        axios.post('https://komodo.forest.network/broadcast_tx_commit?tx=0x' + etx)
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error);
            });
        this.props.Sequence(this.props.sequence++);
        document.getElementById("new-post").value = "";
    }

    show_post(e) {
        let posts = this.state.posts;
        posts[e.target.id].show = true;
        this.setState({
            posts: posts
        })
    }

    reply(stt) {
        let reply = [];
        for(let i =0; i<this.state.posts[stt].reply.length; i++)
        {
            reply = reply.concat(
                <div key={i} className="row" style={{ padding: 10 , margin: "1px 0", background: "white"}}>
                    <div className="col-1">
                        <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                    </div>
                    <div className="col">
                        <div> {this.state.posts[stt].reply[i].user} </div>
                        <div> {this.state.posts[stt].reply[i].content} </div>
                    </div>
              </div>)
        }
        return reply;
    }

    like() {

    }

    share() {

    }

    render() {
        if (window.performance) {
            if (performance.navigation.type === 1) {
                //alert( "This page is reloaded" );
            }
        }
        let posts = [];
        if(this.state.posts !== null) {
            for(let i = 0; i <= this.state.posts.length - 1; i++) {
                posts = posts.concat(
                    <div className="button-post" key={i} id={i}>
                        <div className="row" style={{ padding: 10 , margin: "1px 0", background: "#f5f8fa"}}>
                            <div className="col-lg-1 col-md-1">
                                <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                            </div>
                            <div className="col-lg-11 col-md-11">
                                <div> {this.state.posts[i].user_name}</div>
                                <div> {this.state.posts[i].time}</div>
                                <div><span> {this.state.posts[i].content.text} </span></div>
                                <button className="reply" title="Reply">
                                    <img id={i} src={require("../../image/Reply.png")} alt="reply" width="18" onClick={this.show_post}/>
                                    <span><b> </b></span>
                                </button>
                                <button className="like" onClick={this.like} title="Like">
                                    <img src={require("../../image/Heart.ico")} alt="like" width="18"/>
                                    <span><b> </b></span>
                                </button>
                                <button className="share" onClick={this.share} title="Share">
                                    <img src={require("../../image/Share.ico")} alt="share" width="18"/>
                                    <span><b> </b></span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        }

        return(
            <div className="container-fluid" onClick={(e)=>{if(e.target.id !== "new-post") this.setState({chatBox: false})}}>
                <div className="row" style={{ margin: 0,padding: "5px 5%", background: "#e6ecf0"}}>
                    <div className="col-lg-4 col-md-4 col-sm-12" style={{padding: 0, border: "1px solid #e6ecf0"}}>
                        <div style={{background: "white"}}>
                            <div style={{background: "#1da1f2"}}>
                                <div style={{height: 100}}> </div>
                            </div>

                            <Link to={routes.ACCOUNT}>
                                <div className="rounded-circle" style={{position: "absolute", background: "#1da1f2",
                                         width: 100, height: 100, top: 50, left: 15, border: "3px solid white"}}>
                                    {(this.props.userPicture === null)?
                                        <img alt="avatar" style={{position: "absolute", width: "25%", justifyContent: "center", top: "37.5%", left: "37.5%"}}
                                             src={require("../../image/AddCamera.png")} className="rounded-circle"/>
                                        : <img alt="avatar" style={{position: "absolute", width: "100%", justifyContent: "center"}}
                                               src={"data:image/jpeg/png;base64," + this.props.userPicture} className="rounded-circle" /> }
                                </div>
                            </Link>
                            <br/>
                            <div style={{textAlign: "center"}}>
                                <div style={{fontSize: 24}}><b>{this.props.userName}</b></div>
                                <div className="row">
                                    <div className="col-1">
                                    </div>
                                    <div className="col" style={{textAlign: 'left'}}>
                                        <div><b>Transactions:</b> {this.state.transictions} </div>
                                        <div><b>Sequence:</b> {(this.state.balance) ? this.props.sequence - 1: 0 } </div>
                                        <div><b>Balance:</b> {this.state.balance} TRE</div>
                                        <div><b>Energy:</b> {this.state.energy} OXY</div>
                                    </div>
                                    <div className="col-2">
                                    </div>
                                </div>

                                <br/>
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <p style={{margin: 0}}><b>Posts</b></p>
                                        <p style={{margin: 0, fontSize: 20}}>{(this.props.userPost) ? this.props.userPost.length: 0 }</p>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <p style={{margin: 0}}><b>Following</b></p>
                                        <p style={{margin: 0, fontSize: 20}}>{(this.props.followings) ?this.props.followings.addresses.length : 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{background: "white", marginTop: 5}}>
                            <div style={{textAlign: "center"}}>Follower</div>
                            <div> a </div>
                            <div> b </div>
                        </div>
                    </div >

                    <div className="col-lg-8 col-md-8" style={{ padding: 0, border: "1px solid #e6ecf0"}}>
                        <div className="row" style={{ padding: 10 ,margin: 0,background: "#e8f5fd"}}>
                            <div className="col-lg-1 col-md-1">
                                <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                            </div>
                            <div className="col-lg-11 col-sm-11">
                            <textarea placeholder="Write what you want" rows={(this.state.chatBox)?4:1} id="new-post"
                                      style={{width: "100%", padding: 10, borderRadius: 10, border: "2px solid lightblue", outline: "none" }}
                                      onClick={this.chatBox}/>
                                <button className="send btn btn-primary" onClick={this.post}>
                                    Send
                                </button>
                            </div>
                        </div>
                        {posts}
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(LandingPage)