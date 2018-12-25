import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import PostDetail from '../container/postDetail';

class UserProfile extends Component {
    state = {
        user: {}
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.user) {
            return {
                user: nextProps.user
            }
        }
        return null;
    }
    render() { 
        const { user} = this.state;
        console.log(user);
        return ( 
                 <div>
                {/* user infor */}
                <div id="PictureTitel">
                </div>
                <div className="">
                    <div id="ava" className="rounded-circle offset-1" style={{ backgroundImage: "url('images/chalee.jpg')", zIndex: "3", position: "relative" }}>
                    </div>
                    <div >
                    </div>
                </div>

                <div className="row mt-0">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-2 text-center font-weight-bold">Tweet</div>
                            <div className="col-2 text-center font-weight-bold"><Link to="/user/following" style={{textDecoration: 'none'}}>Following</Link></div>
                            <div className="col-2 text-center font-weight-bold"><Link to="/user/follower" style={{textDecoration: 'none'}}>Follower</Link></div>
                            <div className="col-2 text-center font-weight-bold">Favorite</div>
                            <div className="col-2 text-center font-weight-bold">List</div>
                            <div className="col-2 text-center font-weight-bold">Moment</div>
                        </div>
                        <div className="row">
                            <div className="col-2 text-center font-weight-bold text-success">usernumber </div>
                            <div className="col-2 text-center font-weight-bold text-success">userfollowing</div>
                            <div className="col-2 text-center font-weight-bold text-success">userfollower</div>
                            <div className="col-2 text-center font-weight-bold text-success">userfavorite</div>
                            <div className="col-2 text-center font-weight-bold text-success">userlist</div>
                            <div className="col-2 text-center font-weight-bold text-success">usermoment</div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="float-left">
                            <Link to="/user/edit"><button className="border-customize btn btn-outline-danger font-weight-bold" style={{ width: "146px" }} >Edit Profile</button></Link>
                        </div>
                    </div>
                </div>
                <hr style={{ "paddingBottom": "0px", "marginBottom": "0px" }}></hr>

                {/* end user infor */}

                {/* content */}

                <div id="content" className="row mt-0">
                    <div className="col-3 float-left" >
                        <h5 className="UserName mb-3 font-weight-bold" title="user-name">{user.username}</h5>
                        <div className="row mb-2 " title="description"><i className="fab fa-accessible-icon mr-1 mt-1"></i>user.description</div>
                        <div className="row mb-2 " title="Location"><i className="fa fa-home mr-1 mt-1" aria-hidden="true"></i>user.location</div>
                        <div className="row mb-2" title="Times of register"><i className="fa fa-calendar mr-1 mt-1" aria-hidden="true"></i>Involved  6th February, 2018</div>
                        <div className="row mb-2" title="school"><i className="fa fa-graduation-cap mr-1 mt-1" aria-hidden="true"></i>user.school</div>
                        <a href="#"> <i className="fa fa-picture-o mr-1 mt-1" aria-hidden="true"></i>Photos and videos</a>
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
                    <div className="col-6 bg-newfeed">
                        <div className="row">
                            <div className="col-2 text-center font-weight-bold text-danger">Tweet </div>
                            <div className="col-3 text-center font-weight-bold text-danger">Tweet & reply </div>
                            <div className="col-2 text-center font-weight-bold text-danger">Vehicle</div>
                            <div className="col-1 "></div>
                            <div className="col-2 "></div>
                            <div className="col-2 "></div>
                        </div>
                        <hr></hr>
                       

            <h2>This is list old status of me (wall) </h2>

    
                    </div>
                    <div className="col-3">
                        <div className="float-left">
                            <div className="row bg-newfeed p-3">
                                <h5>New to Twitter?</h5>
                                <div >Sign up now to have your personal timeline!</div> <br />
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
                {/* Enc */}
            </div>

         );
    }
}
 
export default UserProfile;