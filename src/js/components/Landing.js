import React, {Component} from 'react';
import {compose} from "redux";
import {Link} from "react-router-dom";
import * as routes from "../constants/routes";

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_post: 0,
            posts: [{
                content: "123",
                 user: "Thiện Nhân",
                 reply: [{
                     content: "456",
                     user: "Thiện Nhân"
                 }],
                show: false,
                like: 0,
                share: 0,
           }]
        };
        this.post = this.post.bind(this);
        this.show_post = this.show_post.bind(this);
        this.reply = this.reply.bind(this);
    }

    componentWillMount() {
        let posts = [];
        let post = {
            content: "Looking forward to being with the Bush Family to pay my respects to President George H.W. Bush.",
            user: "Donald J. Trump",
            reply: [{
                content: "adydgvjbkqlw;d",
                user: "John",
            }],
            show: false,
            like: 515,
            share: 325,
        };
        posts = posts.concat(post);

        post = {
            content: "Are you ready for the 2018 All-Star Event? Meet some of the pros and special guests representing NA at #AllStar2018!",
            user: "lolesports",
            reply: [],
            show: false,
            like: 845,
            share: 174,
        };
        posts = posts.concat(post);

        post = {
            content: "Check out all the champs and skins on sale this December!",
            user: "League of Legends",
            reply: [],
            show: false,
            like: 346,
            share: 75,
        };
        posts = posts.concat(post);
        this.setState({
            posts: this.state.posts.concat(posts)
        });

        post = {
            content: "2018",
            user: "Thiện Nhân",
            reply: [{
                content: "December",
                user: "A",
            }, {
                content: "Monday",
                user: "B",
            }],
            show: false,
            like: 10,
            share: 0,
        };
        posts = posts.concat(post);
        this.setState({
            posts: this.state.posts.concat(posts)
        });

    }

    post() {
        if(document.getElementById("new-post").value === "") { alert("Please write something"); return; }
        let post = {
            content: document.getElementById("new-post").value,
            user: "Thiện Nhân",
            reply: [],
            show: false,
            like: 0,
            share: 0,
        };
        document.getElementById("new-post").value = "";
        this.setState({
            posts: this.state.posts.concat(post)
        });

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
        let posts = [];
        let user_post = 0;
        for(let i = this.state.posts.length - 1; i >= 0; i--) {
            if(this.state.posts[i].user === "Thiện Nhân") {
                user_post++;
            }
            posts = posts.concat(
                <div className="button-post" key={i} id={i}>
                    <div className="row" style={{ padding: 10 , margin: "1px 0", background: "#f5f8fa"}}>
                        <div className="col-1">
                            <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                        </div>
                        <div className="col">
                            <div> {this.state.posts[i].user} </div>
                            <div> {this.state.posts[i].content} </div>
                            <button  className="reply" title="Reply">
                                <img id={i} src={require("../../image/Reply.png")} width="18" onClick={this.show_post}/>
                                <span><b> {(this.state.posts[i].reply.length === null) ? "" : this.state.posts[i].reply.length} </b></span>
                            </button>
                            <button className="like" onClick={this.like} title="Like">
                                <img src={require("../../image/Heart.ico")} width="18"/>
                                <span><b> {(this.state.posts[i].like === 0) ? "" : this.state.posts[i].like}</b></span>
                            </button>
                            <button className="share" onClick={this.share} title="Share">
                                <img src={require("../../image/Share.ico")} width="18"/>
                                <span><b>  {(this.state.posts[i].share === 0) ? "" : this.state.posts[i].share}</b></span>
                            </button>
                        </div>
                    </div>
                        {(this.state.posts[i].show === true && this.state.posts[i].reply.length !== 0)
                        ? this.reply(i)
                        : null
                    }
                </div>
            )
        }


        return(
            <div className="container-fluid">
                <div className="row" style={{ margin: 0,padding: "5px 5%", background: "#e6ecf0"}}>
                    <div className="col-3" style={{padding: 0}}>
                        <div style={{background: "white"}}>
                            <div style={{background: "#1da1f2"}}>
                                <img height="100px"/>
                            </div>

                            <Link to={routes.ACCOUNT}>
                                <div className="rounded-circle"
                                     style={{position: "absolute", background: "#1da1f2",
                                         width: 75, height: 75, top: 50, left: 15, border: "3px solid white"}}
                                >
                                    <img style={{position: "absolute", width: "25%", justifyContent: "center", top: "37.5%", left: "37.5%"}}
                                         src={require("../../image/AddCamera.png")} className="rounded-circle"/>
                                </div>
                            </Link>

                            <div style={{textAlign: "center"}}>
                                <div>Thiện Nhân</div>
                                <div>@123</div>
                                <br/>
                                <div className="row">
                                    <div className="col-4">
                                        <p style={{margin: 0}}>Posts</p>
                                        <p style={{margin: 0, fontSize: 20}}><b>{user_post}</b></p>
                                    </div>
                                    <div className="col-4">
                                        <p style={{margin: 0}}>Following</p>
                                        <p style={{margin: 0, fontSize: 20}}><b>2</b></p>
                                    </div>
                                    <div className="col-4">
                                        <p style={{margin: 0}}>Follower</p>
                                        <p style={{margin: 0, fontSize: 18}}><b>1</b></p>
                                    </div>
                                </div>
                            </div>
                            <br/>
                        </div>

                        <div>

                        </div>

                    </div>

                    <div className="col-6" style={{ padding: 0,margin: "0 10px"}}>
                        <div className="row" style={{ padding: 10 ,margin: 0,background: "#e8f5fd"}}>
                            <div className="col-1">
                                <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                            </div>
                            <div className="col">
                                <textarea placeholder="Write what you want" rows="4" id="new-post"
                                          style={{width: "100%", padding: 10, borderRadius: 10, border: "2px solid lightblue", outline: "none" }}/>
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

export default compose()(LandingPage)