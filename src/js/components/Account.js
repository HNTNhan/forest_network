import React, {Component} from 'react';


import {compose} from "redux";
import {Link} from "react-router-dom";
import * as routes from "../constants/routes";

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: "posts",
            edit: false,
        };
    }

    render() {
        let posts = [];
        let following = [];
        let follower = [];
        posts = posts.concat(
            <button className="button-post">
                <div className="row" style={{ padding: 10 , margin: "1px 0", background: "white"}}>
                    <div className="col-1">
                        <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                    </div>
                    <div className="col">
                        <div>Thiện Nhân</div>
                        <div>123</div>
                        <button className="reply" onClick={this.reply} title="Reply">
                            <img src={require("../../image/Reply.png")} width="18"/>
                            <span><b> </b></span>
                        </button>
                        <button className="like" onClick={this.like} title="Like">
                            <img src={require("../../image/Heart.ico")} width="18"/>
                            <span><b> </b></span>
                        </button>
                        <button className="share" onClick={this.share} title="Share">
                            <img src={require("../../image/Share.ico")} width="18"/>
                            <span><b> </b></span>
                        </button>
                    </div>
                </div>
            </button>
        );
        posts = posts.concat(
            <button className="button-post">
                <div className="row" style={{ padding: 10 , margin: "1px 0", background: "white"}}>
                    <div className="col-1">
                        <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                    </div>
                    <div className="col">
                        <div>Thiện Nhân</div>
                        <div>456</div>
                        <button className="reply" onClick={this.reply} title="Reply">
                            <img src={require("../../image/Reply.png")} width="18"/>
                            <span><b> 1</b></span>
                        </button>
                        <button className="like" onClick={this.like} title="Like">
                            <img src={require("../../image/Heart.ico")} width="18"/>
                            <span><b> 1</b></span>
                        </button>
                        <button className="share" onClick={this.share} title="Share">
                            <img src={require("../../image/Share.ico")} width="18"/>
                            <span><b> 1</b></span>
                        </button>
                    </div>
                </div>
            </button>
        );
        posts = posts.concat(
            <button className="button-post">
                <div className="row" style={{ padding: 10 , margin: "1px 0", background: "white"}}>
                    <div className="col-1">
                        <img src={require("../../image/UserIcon.ico")} alt="user" width="36 "/>
                    </div>
                    <div className="col">
                        <div>Thiện Nhân</div>
                        <div>789</div>
                        <button className="reply" onClick={this.reply} title="Reply">
                            <img src={require("../../image/Reply.png")} width="18"/>
                            <span><b> 1</b></span>
                        </button>
                        <button className="like" onClick={this.like} title="Like">
                            <img src={require("../../image/Heart.ico")} width="18"/>
                            <span><b> 1</b></span>
                        </button>
                        <button className="share" onClick={this.share} title="Share">
                            <img src={require("../../image/Share.ico")} width="18"/>
                            <span><b> 1</b></span>
                        </button>
                    </div>
                </div>
            </button>
        );

        following = following.concat(
            <div className="col-6" style={{padding: 0,  marginRight: 0, border: "1px solid #e6ecf0"}}>
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
                        <div>Donald J. Trump</div>
                        <div>@realDonaldTrump</div>
                        <div>45th President of the United States of America</div>
                    </div>
                    <br/>
                </div>
            </div>
        );
        following = following.concat(
            <div className="col-6" style={{padding: 0, marginRight: 0,  border: "1px solid #e6ecf0"}}>
                <div style={{background: "white"}}>
                    <div style={{background: "#1da1f2"}}>
                        <img height="100px"/>
                    </div>
                    <div className="rounded-circle"
                         style={{position: "absolute", background: "#1da1f2",
                             width: 75, height: 75, top: 50, left: 15, border: "3px solid white"}}>
                        <img style={{position: "absolute", width: "100%", justifyContent: "center"}}
                             src={require("../../image/LOL.jpg")} className="rounded-circle"/>
                    </div>
                    <br/>
                    <div style={{textAlign: "left", paddingLeft: 5, fontSize: 14, height: 100}}>
                        <div>League of Legends</div>
                        <div>@LeagueOfLegends</div>
                        <div>Download and Play League of Legends:
                            <a href="http://signup.leagueoflegends.com"> http://signup.leagueoflegends.com </a>
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        );

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
                        <div>Nguyễn Văn A</div>
                        <div>@nguyenvana</div>
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

        return(
            <div className="container-fluid">
                <div className="row" style={{ margin: 0,padding: "5px 5%", background: "white"}}>
                    <div className="col-3">
                    </div>
                    <div className="col-6 row" style={{textAlign: "center"}}>
                        <div className="col-4">
                            <button className="button-info" onClick={() => this.setState({tag: "posts"})}>
                                <div>Posts</div>
                                <div>2</div>
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="button-info" onClick={() => this.setState({tag: "following"})}>
                                <div>Following</div>
                                <div>2</div>
                            </button>
                        </div>
                        <div className="col-4">
                            <button className="button-info" onClick={() => this.setState({tag: "follower"})}>
                                <div>Follower</div>
                                <div>1</div>
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
                            <div>Thiện Nhân</div>
                            <div>@123</div>
                            <div>Joined November 2015</div>
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

export default compose(

)(Homepage)