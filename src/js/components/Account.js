import React, {Component} from 'react';
import {compose} from "redux";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import * as routes from "../constants/routes";
import { getData, getName, convertName, getTime, getEnergy, getLatestBlockTime } from "./Funtions";
import { decode, encode, sign } from "../transaction/index";
import { data, sequence, userName, followings, userPost, energy } from "../actions";
import { FindFollowerInfor } from './Funtions';
//
class Account extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            energy: 0,
            sequence: 0,
            transictions: 0,
            balance: 0,
            chatBox: false,
            posts: [],
            follower: []
        };
    }
    async componentWillMount() {
        console.log(this.props.keypair.pk);
        console.log('cwumount');
        let followings_name = [];
        let user_post = [];
        let data = await getData(this.props.website, this.props.keypair.pk);
        let balance = this.props.energy.balance;
        let bandwidthTime = this.props.energy.bandwidthTime;
        let bandwidth = this.props.energy.bandwidth;
        const transictions = data.length;
        var decodeArray = [];
        for(let i=0; i<data.length; i++) {
            let tx = Buffer(data[i].tx, "base64");
            let txSize = tx.length;
            try {
                tx = decode(tx);
                decodeArray.push(tx)
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

        let tempArray = [];
        for(let i=0; i<this.props.followings.addresses.length; i++) {
            const temp_data = await getData(this.props.website, this.props.followings.addresses[i]);
            tempArray = data.concat(temp_data);
            const name = await getName(this.props.website, this.props.followings.addresses[i]);
            followings_name = followings_name.concat(name);
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

        //
        var FollowerTx = [];
        decodeArray.map(tx => {
            if(tx.operation === 'update_account' && tx.params.key === 'followings'){
                FollowerTx.push(tx);
            }
        })
        //get username of follower.
        let FollowerInfor =[];
        for(let i=0; i < FollowerTx.length; i++) {
            let temp = await FindFollowerInfor(FollowerTx[i]);
            FollowerInfor.push(temp);
        }
    //     let x = await FindFollowerInfor(FollowerTx[0]);
    //   console.log(x);
    console.log(FollowerInfor);
     
      
        //
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
            followings_name: followings_name,
            follower: FollowerInfor
        });
    }

    render() {
        console.log(this.props);
        console.log(this.state);
        let posts = [];
        let following = [];
        let follower = [];
        if(this.state.posts !== null) {
            this.state.posts.map((post, index) => {
                posts = posts.concat(
                    <div className="button-post" key={index} id={index}>
                    <div className="row" style={{ padding: 10 , margin: "1px 0", background: "#f5f8fa"}}>
                        <div className="col-lg-1 col-md-1">
                            <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                        </div>
                        <div className="col-lg-11 col-md-11">
                            <div> {post.user_name}</div>
                            <div> {post.time}</div>
                            <div><span> {post.content.text} </span></div>
                            <button className="reply" title="Reply">
                                <img id={index} src={require("../../image/Reply.png")} alt="reply" width="18" onClick={this.show_post}/>
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
            })
        } 


        if(this.state.followings_name !== undefined ) {
            this.state.followings_name.map((person, index) => {
                following = following.concat(
                    <div key={index} className="col-6" style={{padding: 0,  marginRight: 0, border: "1px solid #e6ecf0"}}>
                        <div style={{background: "white"}}>
                            <div style={{background: "#1da1f2"}}>
                                <img height="100px"/>
                            </div>
                            <div className="rounded-circle"
                                 style={{position: "absolute", background: "#1da1f2",
                                     width: 75, height: 75, top: 50, left: 15, border: "3px solid white"}}>
                                <img style={{position: "absolute", width: "100%", justifyContent: "center"}}
                                     src={require("../../image/Trump.jpg")} className="rounded-circle"/>
                            </div>
                            <br/>
                            <div style={{textAlign: "left", paddingLeft: 5, fontSize: 14, height: 100}}>
                            <div></div>
                                <div>{person}</div>
                                <div>@{person.split(' ').join('')}</div>
                                {/* <div>45th President of the United States of America</div> */}
                            </div>
                            <br/>
                        </div>
                    </div>
                );

            })
        }
        
        if(this.state.follower.length !== 0) {
            this.state.follower.map(username => {
                follower = follower.concat(
                    <div className="col-6" style={{padding: 0, marginRight: 0,  border: "1px solid #e6ecf0"}}>
                        <div style={{background: "white"}}>
                            <div style={{background: "#1da1f2"}}>
                                <img height="100px"/>
                            </div>
                            <div className="rounded-circle"
                                 style={{position: "absolute", background: "#1da1f2",
                                     width: 75, height: 75, top: 50, left: 15, border: "3px solid white"}}>
                                <img style={{position: "absolute", width: "100%", justifyContent: "center"}}
                                     src={require("../../image/UserIcon.ico")} className="rounded-circle"/>
                            </div>
                            <div style={{textAlign: "center", paddingLeft: 5, fontSize: 14, height: 100}}>
                                <div>{username}</div>
                                <div>@{username.split(' ').join('')}</div>
                                <div className="row">
                                    <div className="col-4">
                                        <p style={{margin: 0}}>Posts</p>
                                        <p style={{margin: 0, fontSize: 20}}><b>10</b></p>
                                    </div>
                                    <div className="col-4">
                                        <p style={{margin: 0}}>Following</p>
                                        <p style={{margin: 0, fontSize: 20}}><b>3</b></p>
                                    </div>
                                    <div className="col-4">
                                        <p style={{margin: 0}}>Follower</p>
                                        <p style={{margin: 0, fontSize: 18}}><b>4</b></p>
                                    </div>
                                </div>
                            </div>
                            <br/>
                        </div>
                    </div>
                );
            })
        }

        return(
            <div className="container-fluid">
                <div className="row" style={{ margin: 0,padding: "5px 5%", background: "white"}}>
                    <div className="col-3">
                    </div>
                    <div className="col-6 row" style={{textAlign: "center"}}>
                        <div className="col-4">
                            <button className="button-info" onClick={() => this.setState({tag: "posts"})}>
                                <div>Posts</div>
                                <div>{this.state.posts.length? this.state.posts.length : 0}</div>
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="button-info" onClick={() => this.setState({tag: "following"})}>
                                <div>Following</div>
                                <div>{this.props.followings.addresses.length}</div>
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="button-info" onClick={() => this.setState({tag: "follower"})}>
                                <div>Follower</div>
                                <div>{this.state.follower.length}</div>
                            </button>
                        </div>
                    </div>
                    <div className="col-3">
                        {(this.state.edit) ? null :
                            <button className="send btn btn-primary" onClick={()=>this.setState({edit: true})}>
                                Edit profile
                            </button>
                        }

                    </div>
                </div>
                <div className="row" style={{ margin: 0,padding: "5px 5%", background: "#e6ecf0"}}>
                    <div className="col-3" style={{padding: 0}}>
                        <div style={{textAlign: "center"}}>
                            <div>{this.props.userName}</div>
                            <div>Balance: {this.props.energy.balance} TRE</div>
                            {/* <div>Joined November 2015</div> */}
                            <br/>
                        </div>
                        {(this.state.edit) ?
                        <form style={{textAlign: "center"}}>
                            <div>
                                <input type="name" className="form-control"
                                       placeholder="Thiện Nhân" style={{margin: 0, padding: 10, width: "90%"}}/>
                            </div>
                            <div>
                                <input type="email" className="form-control" placeholder="@123"
                                       style={{margin: 0, padding: 10, width: "90%"}}/>
                            </div>
                            <div>
                                <input type="birthday" className="form-control" placeholder="Birthday"
                                       style={{margin: 0, padding: 10, width: "90%"}}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                            : null
                        }
                        <div>

                        </div>
                    </div>

                    <div className="col-6 row" style={{padding: 0, margin: 0}}>
                        {(this.state.tag === "posts") ? posts : (this.state.tag === "following") ? following : follower}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        keypair: state.key,
        website: state.website,
        energy: state.energy,
        followings: state.followings,
        userName: state.userName,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        Sequence: int => dispatch(sequence(int)),
        Data: array => dispatch(data(array)),
        UserName: string => dispatch(userName(string)),
        Followings: array => dispatch(followings(array)),
        UserPost: array => dispatch(userPost(array)),
        Energy: object => dispatch(energy(object)),
    };
};
export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Account)