import React, {Component} from 'react';
import {compose} from "redux";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import * as routes from "../constants/routes";
import { getData, getName, convertName, getTime, getEnergy, getLatestBlockTime, getArrayLength, removeDuplicate, getFollower, removeDuplicateFollower } from "./Funtions";
import { decode, encode, sign } from "../transaction/index";
import { data, sequence, userName, followings, userPost, energy, userPicture } from "../actions";
import { FindFollowingInfor , FindFollowerInfor} from './Funtions';
const motherAddress ='GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI';

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
    //     let x = await FindFollowerInfor(FollowerTx[0]);
    //   console.log(x);
     
    //get user's avatar.
     //
     let followerArray = await getFollower(this.props.website, motherAddress, this.props.keypair.pk);
     console.log(followerArray);
     var distinctFollowerArray = removeDuplicateFollower(followerArray);
     console.log(distinctFollowerArray);
     let followerDetail = []
     for( let i = 0; i < distinctFollowerArray.length; i++){
         let result = await FindFollowerInfor(this.props.website, distinctFollowerArray[i]);
         followerDetail.push(result);
     }
     console.log(followerDetail);


     ///
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
            followingInfor: FollowingInfor,
            follower: followerDetail
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
                        <span style={{fontWeight: "bold"}}>  <Link to="#"> {posts.user_name} </Link> {posts.time}</span>   
                              
                              <div><span> {(posts.content) ? posts.content.text : null} </span></div>
                             <hr></hr>
                              <a href="#" style={{textDecoration: "none"}} className="fa fa-commenting-o ml-5" aria-hidden="true" onClick={this.show_post}></a>
                              nCmt
                              <a href="#" style={{textDecoration: "none"}} className="fa fa-thumbs-o-up ml-5" aria-hidden="true" onClick={this.like}></a>
                              Number
                              <a href="#" style={{textDecoration:"none"}} className="fa fa-thumbs-o-down ml-5" aria-hidden="true"></a>
                              Number
                              <a href="#" style={{textDecoration: "none"}} className="fa fa-share-alt-square ml-5 " aria-hidden="true" onClick={this.share}></a>
                              Number
                              <a href="#" style={{textDecoration: "none"}}  className="fa fa-heartbeat ml-5" aria-hidden="true"></a>
                              Number
                              <hr></hr>
                            {/* <div> {post.user_name}</div>
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
                            </button> */}
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
        var followers = this.state.follower;
        if( followers.length !== 0){
            followers.map(user => {
                if(user !== undefined) {
                    follower = follower.concat(
                        <div className="col-6" style={{padding: 0, marginRight: 0,  border: "1px solid #e6ecf0"}}>
                            <div style={{background: "white"}}>
                                <div style={{background: "#1da1f2"}}>
                                    <img height="100px"/>
                                </div>
                                <div className="rounded-circle"
                                     style={{position: "absolute", background: "#1da1f2",
                                         width: 75, height: 75, top: 50, left: 15, border: "3px solid white"}}>
                                    {
                                        user.picture? 
                                        <img alt="avatar" style={{position: "absolute", width: "100%", justifyContent: "center"}} className="rounded-circle" src={"data:image/jpeg/png;base64,"+ user.picture} />
                                        :<img style={{position: "absolute", width: "100%", justifyContent: "center"}} alt="avatar" src={require("../../image/UserIcon.ico")} className="rounded-circle"/>
                                    }     
                                </div>
                                <div style={{textAlign: "center", paddingLeft: 5, fontSize: 14, height: 100}}>
                                    <div style={{wordWrap: "break-word"}}>{user.username}</div>
                                    <div style={{wordWrap: "break-word"}}>@{user.username? user.username.split(' ').join('') : ''}</div>
                                    <div className="row">
                                       
                                    </div>
                                </div>
                                <br/>
                            </div>
                        </div>
                    );
                }
            })
        }
        const numberFollower = 0;
        console.log(this.props);
        return(
            <div className="container-fluid">
             <div id="PictureTitel">
                </div>
               
                <div className="row" style={{ margin: 0,padding: "5px 5%", background: "white"}}>
               
                    <div className="col-3">
                    </div>
                    <div className="col-6 row" style={{textAlign: "center"}}>
                        <div className="col-4 ">
                            <button className="button-info text-center font-weight-bold" onClick={() => this.setState({tag: "posts"})}>
                                <div className="text-primary">Posts</div>
                                <div>{this.state.posts.length? this.state.posts.length : 0}</div>
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="button-info text-center font-weight-bold" onClick={() => this.setState({tag: "following"})}>
                                <div className="text-primary">Following</div>
                                <div>{distinctFollowing.length}</div>
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="button-info text-center font-weight-bold" onClick={() => this.setState({tag: "follower"})}>
                                <div className="text-primary">Follower</div>
                                <div>{this.state.follower.length? this.state.follower.length: 0}</div>
                            </button>
                        </div>
                    </div>
                    <div className="col-2">
                        {(this.state.edit) ? null :
                            // <button className="send btn btn-primary" onClick={()=>this.setState({edit: true})}>
                            //     Edit profile
                            // </button>
                            <div className="float-left mt-1">
                            <button className="border-customize btn btn-outline-danger font-weight-bold" style={{ width: "146px" }} onClick={()=>this.setState({edit: true})} >Edit Profile</button>
                            </div>
                        }
                          {/* <div className="float-left">
                            <button className="border-customize btn btn-outline-danger font-weight-bold" style={{ width: "146px" }} onClick={()=>this.setState({edit: true})} >Edit Profile</button>
                        </div> */}
                    </div>
                </div>
              
                <div className="row" style={{ margin: 0,padding: "", background: "#e6ecf0"}}>
                   {/* left side */}
                    <div className="col-3" style={{padding: 0}}>
                        <div >
                        <div style={{textAlign: "center"}}>
                        {
                            
                            this.props.userPicture !== null ? 
                            <img style={{width: 100, height:100}} className="rounded-circle" src={"data:image/jpeg/png;base64,"+ this.props.userPicture} alt="User Picture"/>
                            : (<img src={require("../../image/UserIcon.ico")} alt=""/> ) 
                        }
                        </div>
                        {/* <img src={require("../../image/UserIcon.ico")} alt=""/> */}
                            <div className="text-success" style= {{ fontWeight: 'bold',textAlign:"center" }}>{this.props.userName}</div>
                            {/* <div style={{fontWeight: 'bold'}}>Balance: {this.props.energy.balance} TRE</div> */}
                            <div className="float-left" >
                    
                        <div className="row mb-2 " title="description"><i className="fa fa-address-book-o mr-1 mt-1"></i>TRE {this.props.energy.balance} </div>
                        <div className="row mb-2 " title="Location"><i className="fa fa-home mr-1 mt-1" aria-hidden="true"></i>user.location</div>
                        <div className="row mb-2" title="Times of register"><i className="fa fa-calendar mr-1 mt-1" aria-hidden="true"></i>Involved  6th February, 2018</div>
                        <div className="row mb-2" title="school"><i className="fa fa-graduation-cap  mt-1" aria-hidden="true"></i>user.school</div>
                        <a href="#" className="text-align"  > <i className="fa fa-picture-o mr-1 mt-1 ml-0 text-align" aria-hidden="true"></i>Photos and videos</a>
                        {/* section picture or album */}
                        <div className="row " style={{height: 80}}>
      <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: "url(./images/2l.jpg)"}}>
      </div>
      <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: " url(./images/3l.jpg)"}}>
        </div>
        <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: "url(./images/4l.jpg)"}}>
          </div>
    </div>
    <div className="row mt-1"  style={{height: 80}}>
        <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: " url(./images/5l.jpg)"}}>
          </div>
          <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: "url(./images/6l.jpg)"}}>
            </div>
            <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: " url(./images/7l.jpg)"}}>
              </div>
    </div>
    <div className="row mt-1" style={{height: 80}}>
        <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: " url(./images/5l.jpg)"}}>
          </div>
          <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: "url(./images/6l.jpg)"}}>
            </div>
            <div className="col-3 mr-1 rounded fillPicture" style={{ backgroundImage: " url(./images/7l.jpg)"}}>
              </div>
    </div>
    <hr></hr>
    <div className="text-center font-weight-bold slogan" style={{fontSize:30}}>Make your life more beautifull</div>
                    </div>

                            
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
                    {/* content side */}
                    <div className="col-6 row" style={{padding: 0, margin: 0}}>
                        {(this.state.tag === "posts") ? posts : (this.state.tag === "following") ? following : follower}
                    </div>
                    {/* right side */}
                    <div className="col-3">
                    <div className="float-left">
                            <div className="row bg-newfeed p-3 mt-1">
                                <h5 className="text-center">New to Twitter?</h5>
                                <div className="text-center" >Sign up now to have your personal timeline!</div> <br />
                                <button className="border-customize btn btn-danger font-weight-bold" style={{ width: "270px" }} >Registration</button>
                            </div>

                            <div className="bg-newfeed pl-3 mt-1">
                                <div className="">
                                    <h5> You might also like ·</h5>
                                    <div className="row mb-1">
                                        <div className=" icon-newfeed rounded-circle" style={{ "backgroundImage": "url(images/1.PNG)" }}></div>
                                        <a href="#" className="ml-1">Chali putt</a>
                                    </div>
                                    <br />
                                    <div className="row mb-1">
                                        <div className=" icon-newfeed rounded-circle" style={{ "backgroundImage": "url(images/5l.jpg)" }}></div>
                                        <a href="#" className="ml-1">Tung oc cho</a>
                                    </div>
                                    <br />
                                    <div className="row mb-1">
                                        <div className=" icon-newfeed rounded-circle" style={{ "backgroundImage": "url(images/1.PNG)" }}></div>
                                        <a href="#" className="ml-1">Son doan ngu</a>
                                    </div>
                                    <br />

                                </div>
                            </div>

                            {/* <!--trend in the world--> */}
                            <div className="bg-newfeed pl-3 mt-2 pt-2">
                                <div class="">
                                    <h5  className=""> Trends in the whole world</h5>
                                    <a href="#" className="text-danger font-weight-bold mt-1">#Happy Monday</a>
                                    <div className="row text-dark "> 42,5 N Tweet</div>
                                    <a href="#" className="text-danger font-weight-bold mt-1">#OurEpiphanyJin</a>
                                    <div class="row text-dark "> 25,5 N Tweet</div>
                                    <a href="#" className="text-danger font-weight-bold mt-1"># 3aralıkdünyaengellilerg the</a>
                                    <div class="row text-dark "> 141 N Tweet</div>
                                    <a href="#" className="text-danger font-weight-bold mt-1">#MondayMotivation</a>
                                    <div class="row text-dark "> 118 N Tweet</div>
                                    <a href="#" className="text-danger font-weight-bold mt-1">Alan García</a>
                                    <div class="row text-dark "> 24,8 N Tweet</div>
                                    <a href="#" className="text-danger font-weight-bold mt-1">Paul McCartney</a>
                                    <div class="row text-dark "> 42,5 N Tweet</div>
                                </div>
                            </div>
                        </div>
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