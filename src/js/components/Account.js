import React, {Component} from 'react';
import {compose} from "redux";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import * as routes from "../constants/routes";
import { getData, getName, convertName, getTime, getEnergy, getLatestBlockTime, getArrayLength, removeDuplicate } from "./Funtions";
import { decode, encode, sign } from "../transaction/index";
import { data, sequence, userName, followings, userPost, energy, userPicture } from "../actions";
import { FindFollowingInfor } from './Funtions';

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
            follower: [],
            followingInfor: []
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
        var FollowingTx = [];
        decodeArray.map(tx => {
            if(tx.operation === 'update_account' && tx.params.key === 'followings'){
                FollowingTx.push(tx);
            }
        })
        console.log(decodeArray);
        //get username of follower.
        let FollowingInfor =[];
        for(let i=0; i < FollowingTx.length; i++) {
            let temp = await FindFollowingInfor(this.props.website, FollowingTx[i]);
            console.log(typeof temp);
            if(temp.length > 0) {
                FollowingInfor = [...temp];
            } else {
            FollowingInfor.push(temp);

            }
        }
        console.log(FollowingInfor);
    //     let x = await FindFollowerInfor(FollowerTx[0]);
    //   console.log(x);
     
    //get user's avatar.
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
            followingInfor: FollowingInfor
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
                            {
                                this.props.userPicture ? 
                                <img style={{width: 36}} className="rounded-circle" src={"data:image/jpeg/png;base64,"+ this.props.userPicture} alt="User Picture"/>
                                :<img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                            }
                            {/* <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/> */}
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
          let distinctFollowing = removeDuplicate(this.state.followingInfor);
        if(distinctFollowing !== undefined ) {
           distinctFollowing.map((person, index) => {
               if(person.username !== undefined) {
                following = following.concat(
                    <div key={index} className="col-6" style={{padding: 0,  marginRight: 0, border: "1px solid #e6ecf0"}}>
                        <div style={{background: "white"}}>
                            <div style={{background: "#1da1f2"}}>
                                <img height="100px"/>
                            </div>
                            <div className="rounded-circle"
                                 style={{position: "absolute", background: "#1da1f2",
                                     width: 75, height: 75, top: 50, left: 15, border: "3px solid white"}}>
                                {
                                        person.picture? 
                                        <img alt="avatar" style={{position: "absolute", width: "100%", justifyContent: "center"}} className="rounded-circle" src={"data:image/jpeg/png;base64,"+ person.picture} />
                                        :<img style={{position: "absolute", width: "100%", justifyContent: "center"}} alt="avatar" src={require("../../image/UserIcon.ico")} className="rounded-circle"/>
                                    }    
                            </div>
                            <br/>
                            <div style={{textAlign: "left", paddingLeft: 5, fontSize: 14, height: 100}}>
                            <div></div>
                                <div style={{wordWrap: "break-word"}}> {person.username}</div>
                                <div style={{wordWrap: "break-word"}}>@{person.username.split(' ').join('') || null}</div>
                                {/* <div>45th President of the United States of America</div> */}
                            </div>
                            <br/>
                        </div>
                    </div>
                );

               }
               

            })
        }
        // let distinctFollower = removeDuplicate(this.state.follower);
        // console.log(distinctFollower);
        // if( distinctFollower!== 0){
        //     distinctFollower.map(user => {
        //         if(user !== undefined) {
        //             follower = follower.concat(
        //                 <div className="col-6" style={{padding: 0, marginRight: 0,  border: "1px solid #e6ecf0"}}>
        //                     <div style={{background: "white"}}>
        //                         <div style={{background: "#1da1f2"}}>
        //                             <img height="100px"/>
        //                         </div>
        //                         <div className="rounded-circle"
        //                              style={{position: "absolute", background: "#1da1f2",
        //                                  width: 75, height: 75, top: 50, left: 15, border: "3px solid white"}}>
        //                             {
        //                                 user.picture? 
        //                                 <img alt="avatar" style={{position: "absolute", width: "100%", justifyContent: "center"}} className="rounded-circle" src={"data:image/jpeg/png;base64,"+ user.picture} />
        //                                 :<img style={{position: "absolute", width: "100%", justifyContent: "center"}} alt="avatar" src={require("../../image/UserIcon.ico")} className="rounded-circle"/>
        //                             }     
        //                         </div>
        //                         <div style={{textAlign: "center", paddingLeft: 5, fontSize: 14, height: 100}}>
        //                             <div>{user.username}</div>
        //                             <div>@{user.username? user.username.split(' ').join('') : ''}</div>
        //                             <div className="row">
        //                                 <div className="col-4">
        //                                     <p style={{margin: 0}}>Posts</p>
        //                                     <p style={{margin: 0, fontSize: 20}}><b>10</b></p>
        //                                 </div>
        //                                 <div className="col-4">
        //                                     <p style={{margin: 0}}>Following</p>
        //                                     <p style={{margin: 0, fontSize: 20}}><b>3</b></p>
        //                                 </div>
        //                                 <div className="col-4">
        //                                     <p style={{margin: 0}}>Follower</p>
        //                                     <p style={{margin: 0, fontSize: 18}}><b>4</b></p>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <br/>
        //                     </div>
        //                 </div>
        //             );
        //         }
        //     })
        // }
        const numberFollower = 0;
        console.log(this.props);
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
                                <div>{distinctFollowing.length}</div>
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="button-info" onClick={() => this.setState({tag: "follower"})}>
                                <div>Follower</div>
                                <div>{numberFollower}</div>
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
                        {
                            this.props.userPicture !== null ? 
                            <img style={{width: 100, height:100}} className="rounded-circle" src={"data:image/jpeg/png;base64,"+ this.props.userPicture} alt="User Picture"/>
                            : (<img src={require("../../image/UserIcon.ico")} alt=""/> ) 
                        }
                        {/* <img src={require("../../image/UserIcon.ico")} alt=""/> */}
                            <div style= {{ fontWeight: 'bold' }}>{this.props.userName}</div>
                            <div style={{fontWeight: 'bold'}}>Balance: {this.props.energy.balance} TRE</div>
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
    console.log(state.UserPicture);
    return {
        keypair: state.key,
        website: state.website,
        energy: state.energy,
        followings: state.followings,
        userName: state.userName,
        userPicture: state.userPicture,
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
        UserPicture: string => dispatch(userPicture(string)),

    };
};
export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Account)