import React, {Component} from 'react';
import {compose} from "redux";
import {Link} from "react-router-dom";
import * as routes from "../constants/routes";
import connect from "react-redux/es/connect/connect";
import {data, sequence, userName, followings, follower,userPost, energy, userPicture} from "../actions";
import axios from "axios";
import {decode, encode, sign, hash} from "../transaction/index";
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
        Follower: array => dispatch(follower(array)),
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
        follower: state.follower,
    };
};


class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: "posts",
            energy: 0,
            sequence: 0,
            transictions: 0,
            balance: 0,
            followings_name: null,
            others: [],
            show_others: 0,
            chatBox: false,
            posts: null,
            show_posts: 0,
            all_account_data: [],
        };
        this.chatBox = this.chatBox.bind(this);
        this.post = this.post.bind(this);
        this.show_post = this.show_post.bind(this);
        this.reply = this.reply.bind(this);
        this.showOthers = this.showOthers.bind(this);
        this.showPosts = this.showPosts.bind(this);
        this.onClickOthers = this.onClickOthers.bind(this);

    }

    async componentWillMount(){
        if(!this.props.auth) {
            this.props.history.push(routes.SIGN_IN);
        }
        //const a = await base32.encode(Buffer.from(this.props.keypair.prk));
    }

    async componentDidMount() {
        let followings_name = [];
        let user_post = 0;
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
                user_post++;
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

        let limit = this.state.show_posts;
        let posts = [];
        let all_account = [];

        for(let i=0; i<data.length; i++) {
            let tx = Buffer(data[i].tx, "base64");
            try {
                tx = decode(tx);
            }
            catch(error) {
                continue;
            }
            if(limit === 15) { limit = i }
            if(tx.account === "GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI" && tx.operation === "create_account") {
                if(tx.params.address === this.props.keypair.pk && all_account[all_account.length-1] === this.props.keypair.pk) {
                    continue
                }
                all_account = all_account.concat(tx.params.address);
            }
            if(tx.operation === "post") {
                if(limit>=15) continue;
                limit++;
                posts = posts.concat({
                    hash: data[i].hash,
                    time: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(await getTime(this.props.website, data[i].height)),
                    user: tx.account,
                    user_name: await convertName(tx.account, this.props.followings, followings_name, this.props.userName, this.props.keypair.pk),
                    content: tx.params.content,
                    reaction: {
                        like: 0,
                        love: 0,
                        haha: 0,
                        wow: 0,
                        sad: 0,
                        angry: 0,
                    },
                    reply: [],
                });
            }
        }

        let all_account_data = [];
        let all_follower = [];

        for(let i=0; i<all_account.length; i++) {
            getData(this.props.website, all_account[i])
                .then(temp_data =>{
                    all_account_data = all_account_data.concat(temp_data);
                    for(let j = temp_data.length-1; j>=0; j--) {
                        let tx = Buffer(temp_data[j].tx, "base64");
                        try {
                            tx = decode(tx);
                        }
                        catch(error) {
                            continue;
                        }
                        if(tx.operation === "update_account" && tx.params.key === "followings") {
                            for(let k=0; k<=tx.params.value.addresses.length; k++) {
                                if(tx.params.value.addresses[k] === this.props.keypair.pk) {
                                    all_follower = all_follower.concat(all_account[i]);
                                }
                            }
                            break;
                        }
                        let reaction = false;
                        for(let l =0; l<posts.length; l++) {
                            if(tx.operation === "interact" && tx.params.object === posts[l].hash)
                            {
                                if(tx.params.content.type === 1) {
                                    posts[l].reply =  posts[l].reply.concat({
                                        hash: temp_data[j].hash,
                                        block_height: temp_data[j].height,
                                        content: tx.params.content.text,
                                        account: tx.account,
                                    })
                                }
                                else if(tx.params.content.type === 2 && reaction === false) {
                                    reaction = true;
                                    switch (tx.params.content.reaction) {
                                        case 1:
                                            posts[l].reaction.like++;
                                            break;
                                        case 2:
                                            posts[l].reaction.love++;
                                            break;
                                        case 3:
                                            posts[l].reaction.haha++;
                                            break;
                                        case 4:
                                            posts[l].reaction.wow++;
                                            break;
                                        case 5:
                                            posts[l].reaction.sad++;
                                            break;
                                        case 6:
                                            posts[l].reaction.angry++;
                                            break;
                                        default:
                                    }
                                }
                            }
                        }
                    }
                });
        }
        if(limit <= 16) limit = data.length;
        let show_posts = [];
        setTimeout(async ()=>{
            this.props.Follower(all_follower);
            console.log(all_account_data);
            await this.setState({
                posts: [],
                show_posts: 0,
                all_account_data: all_account_data,
            });
            await this.showPosts();
            /*
            show_posts = [];
            if(posts.length !== 0) {
                for (let i = 0; i <= posts.length - 1; i++) {
                    show_posts = show_posts.concat(
                        <div className="button-post" key={i} id={i}>
                            <div className="row" style={{padding: 10, margin: "1px 0", background: "#f5f8fa"}}>
                                <div className="col-lg-1 col-md-1">
                                    <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                                </div>
                                <div className="col-lg-11 col-md-11">
                                    <div> {posts[i].user_name}</div>
                                    <div> {posts[i].time}</div>
                                    <div><span> {posts[i].content.text} </span></div>
                                    <button className="reply" title="Reply">
                                        <img id={"rely-" + posts[i].hash} src={require("../../image/Reply.png")} alt="reply" width="18"
                                             onClick={this.show_post}/>
                                        {posts[i].reply.length}
                                        <span><b> </b></span>
                                    </button>
                                    <button className="like" onClick={this.like} title="Like">
                                        <img id={"like-" + posts[i].hash} src={require("../../image/Heart.ico")} alt="like" width="18"/>
                                        <span><b> </b></span>
                                    </button>
                                    <button className="share" onClick={this.share} title="Share">
                                        <img id={"love-" + posts[i].hash} src={require("../../image/Share.ico")} alt="share" width="18"/>
                                        <span><b> </b></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            }

            this.setState({
                posts: show_posts,
                all_account_data: all_account_data,
            });
            */
        }, 5000);

        if(posts.length !== 0) {
            for (let i = 0; i <= posts.length - 1; i++) {
                show_posts = show_posts.concat(
                    <div className="button-post" key={i} id={i}>
                        <div className="row" style={{padding: 10, margin: "1px 0", background: "#f5f8fa"}}>
                            <div className="col-lg-1 col-md-1">
                                <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                            </div>
                            <div className="col-lg-11 col-md-11">
                                <div> {posts[i].user_name}</div>
                                <div> {posts[i].time}</div>
                                <div><span> {posts[i].content.text} </span></div>
                                <button className="reply" title="Reply">
                                    <img id={"rely-" + posts[i].hash} src={require("../../image/Reply.png")} alt="reply" width="18"
                                         onClick={this.show_post}/>
                                    {posts[i].reply.length}
                                    <span><b> </b></span>
                                </button>
                                <button className="like" onClick={this.like} title="Like">
                                    <img id={"like-" + posts[i].hash} src={require("../../image/Heart.ico")} alt="like" width="18"/>
                                    <span><b> </b></span>
                                </button>
                                <button className="share" onClick={this.share} title="Share">
                                    <img id={"love-" + posts[i].hash} src={require("../../image/Share.ico")} alt="share" width="18"/>
                                    <span><b> </b></span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        }

        this.setState({
            followings_name: followings_name,
            energy: energy.energy,
            posts: show_posts,
            transictions: transictions,
            show_posts: limit,
            balance: parseFloat(balance/100000000).toFixed(8),
        });
    }

    chatBox() {
        this.setState({
           chatBox: true,
        });
    }

    async post() {
        if(document.getElementById("new-post").value === "") { alert("Please write something"); return; }
        let sequence = this.props.sequence;
        const tx = {
            version: 1,
            account: this.props.keypair.pk,
            sequence: sequence,
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
        sign(tx, base32.encode(Buffer.from(this.props.keypair.prk)));
        const etx = encode(tx).toString('hex');

        await axios.post(this.props.website + '/broadcast_tx_commit?tx=0x' + etx)
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error);
            });
        let posts = this.props.userPost;
        this.props.Sequence(sequence+1);
        this.props.UserPost(posts+1);
        this.setState({
            transictions: this.state.transictions+1,
        });
        document.getElementById("new-post").value = "";
        await this.setState({
            posts: [],
            show_posts: 0,
        });
        await this.componentDidMount();
    }

    async onClickOthers(){
        if(!this.state.show_others) {
            await this.showOthers();
            this.setState({
                tag: "others"
            });
        }
        else {
            if(this.state.tag !== "others") {
                this.setState({
                    tag: "others"
                });
            }
        }
    }

    async showOthers() {
        let pos = this.state.show_others;
        let limit = 0;
        let others = [];
        const data = this.props.data;
        for(let i=pos; i < data.length; i++) {
            let tx = Buffer(data[i].tx, "base64");
            try {
                tx = decode(tx);
            }
            catch(error) {
                continue;
            }
            if(tx.operation !== "post" && tx.operation !== "interact") {
                limit++;
                if(limit % 30 === 0 && limit !== 0) {
                    pos = i;
                    break;
                }
                let content = "";
                if(tx.operation === "create_account") {
                    content = tx.account.slice(0, 10) + "... create new account " + tx.params.address.slice(0,10) + "...";
                }
                else if(tx.operation === "payment") {
                    content =  tx.account.slice(0, 10) + "... transfer money to " + tx.params.address.slice(0,10) + "...\namount: " + tx.params.amount;
                }
                else if(tx.operation === "update_account") {
                    if(tx.params.key === "name") {
                        content =  tx.account.slice(0, 10) + "... change name to " + tx.params.value;
                    }
                    else if(tx.params.key === "picture") {
                        content =  tx.account.slice(0, 10) + "... change picture";
                    }
                    else if(tx.params.key === "followings") {
                        content =  tx.account.slice(0, 10) + "... followed ";
                        for(let j=0; j<tx.params.value.addresses.length; j++) {
                            content += tx.params.value.addresses[j].slice(0, 10) + "...,";
                        }

                    }
                }
                others = others.concat({
                    hash: data[i].hash,
                    time: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(await getTime(this.props.website, data[i].height)),
                    user: tx.account,
                    user_name: await convertName(tx.account, this.props.followings, this.state.followings_name, this.props.userName, this.props.keypair.pk),
                    content: content,
                });
            }
            if(i === data.length-1) {
                if(limit<=30) pos = data.length;
            }
        }

        let show_other = this.state.others;
        for(let i = 0; i <= others.length - 1; i++) {
            show_other = show_other.concat(
                <div className="button-post" key={i + this.state.others.length} id={others[i].hash}>
                    <div className="row" style={{ padding: 10 , margin: "1px 0", background: "#f5f8fa"}}>
                        <div className="col-lg-1 col-md-1">
                            <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                        </div>
                        <div className="col-lg-11 col-md-11">
                            <div> {others[i].user_name}</div>
                            <div> {others[i].time}</div>
                            <div><span> {others[i].content}  </span></div>
                        </div>
                    </div>
                </div>
            )
        }

        this.setState({
            show_others: pos,
            others: show_other,
        });
    }

    async showPosts(){
        let pos = this.state.show_posts;
        let limit = 0;
        let posts = [];
        const data = this.props.data;
        for(let i=pos; i < data.length; i++) {
            let tx = Buffer(data[i].tx, "base64");
            try {
                tx = decode(tx);
            }
            catch(error) {
                continue;
            }
            if(tx.operation === "post") {
                limit++;
                if(limit % 15 === 0 && limit !== 0) {
                    pos = i;
                    break;
                }
                posts = posts.concat({
                    hash: data[i].hash,
                    time: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(await getTime(this.props.website, data[i].height)),
                    user: tx.account,
                    user_name: await convertName(tx.account, this.props.followings, this.state.followings_name, this.props.userName, this.props.keypair.pk),
                    content: tx.params.content,
                    reaction: {
                        like: 0,
                        love: 0,
                        haha: 0,
                        wow: 0,
                        sad: 0,
                        angry: 0,
                    },
                    reply: [],
                });
            }
            if(i === data.length-1) {
                if(limit<=15) pos = data.length;
            }
        }
        const temp_data = this.state.all_account_data;
        for(let j = temp_data.length-1; j>=0; j--) {
            let tx = Buffer(temp_data[j].tx, "base64");
            try {
                tx = decode(tx);
            }
            catch(error) {
                continue;
            }
            let reaction = false;
            for(let l =0; l<posts.length; l++) {
                if(tx.operation === "interact" && tx.params.object === posts[l].hash)
                {
                    if(tx.params.content.type === 1) {
                        posts[l].reply =  posts[l].reply.concat({
                            hash: temp_data[j].hash,
                            block_height: temp_data[j].height,
                            content: tx.params.content.text,
                            account: tx.account,
                        })
                    }
                    else if(tx.params.content.type === 2 && reaction === false) {
                        switch (tx.params.content.reaction) {
                            case 1:
                                posts[l].reaction.like++;
                                break;
                            case 2:
                                posts[l].reaction.love++;
                                break;
                            case 3:
                                posts[l].reaction.haha++;
                                break;
                            case 4:
                                posts[l].reaction.wow++;
                                break;
                            case 5:
                                posts[l].reaction.sad++;
                                break;
                            case 6:
                                posts[l].reaction.angry++;
                                break;
                            default:
                        }
                    }
                }
            }
        }

        let show_posts = this.state.posts;
        for(let i = 0; i <= posts.length - 1; i++) {
            show_posts = show_posts.concat(
                <div className="button-post" key={i} id={i}>
                    <div className="row" style={{padding: 10, margin: "1px 0", background: "#f5f8fa"}}>
                        <div className="col-lg-1 col-md-1">
                            <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                        </div>
                        <div className="col-lg-11 col-md-11">
                            <div> {posts[i].user_name}</div>
                            <div> {posts[i].time}</div>
                            <div><span> {posts[i].content.text} </span></div>
                            <button className="reply" title="Reply">
                                <img id={"rely-" + posts[i].hash} src={require("../../image/Reply.png")} alt="reply" width="18"
                                     onClick={this.show_post}/>
                                {posts[i].reply.length}
                                <span><b> </b></span>
                            </button>
                            <button className="like" onClick={this.like} title="Like">
                                <img id={"like-" + posts[i].hash} src={require("../../image/Heart.ico")} alt="like" width="18"/>
                                <span><b> </b></span>
                            </button>
                            <button className="share" onClick={this.share} title="Share">
                                <img id={"love-" + posts[i].hash} src={require("../../image/Share.ico")} alt="share" width="18"/>
                                <span><b> </b></span>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        this.setState({
            show_posts: pos,
            posts: show_posts,
        });
    }

    show_post(e) {
        console.log(e.target.id);
    }

    reply() {

    }

    like() {

    }
    love() {

    }
    haha() {

    }
    wow() {

    }
    sad() {

    }
    angry() {

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

        return(
            <div className="container-fluid" onClick={(e)=>{if(e.target.id !== "new-post") this.setState({chatBox: false})}}
                 style={{wordWrap: "break-word"}}>
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
                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                        <p style={{margin: 0}}><b>Posts</b></p>
                                        <p style={{margin: 0, fontSize: 20}}>{(this.props.userPost)?this.props.userPost.length:0}</p>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12">
                                        <p style={{margin: 0}}><b>Following</b></p>
                                        <p style={{margin: 0, fontSize: 20}}>{(this.props.followings) ?this.props.followings.addresses.length : 0}</p>
                                    </div>
                                    <div className="col-lg- col-md-4 col-sm-12">
                                        <p style={{margin: 0}}><b>Following</b></p>
                                        <p style={{margin: 0, fontSize: 20}}>{(this.props.follower) ?this.props.follower.length : 0}</p>
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
                        <div style={{textAlign: "center", background: 'white', padding: 5, marginBottom: 2}}>
                            <div className="row" >
                                <div className="col-6">
                                    <button className="button-info" onClick={() => this.setState({tag: "posts"})}>
                                        <div>Posts</div>
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button className="button-info" onClick={this.onClickOthers} >
                                        <div>Other</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {(this.state.tag === "posts") ?
                            <div>
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
                                {this.state.posts}
                                {(this.props.data !== null)?(this.state.show_posts < this.props.data.length)?
                                    <div style={{marginTop: 2}}>
                                        <button style={{width: "100%"}} type="button" className="btn btn-outline-primary" onClick={this.showPosts}>Load More</button>
                                    </div> :
                                    <div style={{textAlign: "center", marginTop: 2}}>
                                        Nothing to load
                                    </div>
                                    : null
                                }
                            </div>
                            :
                            <div>
                                { this.state.others }
                                {(this.state.show_others < this.props.data.length)?
                                    <div style={{marginTop: 2}}>
                                        <button style={{width: "100%"}} type="button" className="btn btn-outline-primary" onClick={this.showOthers}>Load More</button>
                                    </div> :
                                    <div style={{textAlign: "center", marginTop: 2}}>
                                        Nothing to load
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(LandingPage)