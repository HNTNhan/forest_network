import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserProfile extends Component {
    constructor(props){
        super(props);
        this.state =  {
            user: props.user
        }
    }
    
    handleInputChange = e => {
        let value = e.target.value;
        let name = e.target.name;
        this.setState(prevState => ({
            user:{
                ...prevState.user,
                [name]: value
            }
        }));
    }
    resetState = e => {
        const {user} = this.props;
        this.setState({
            user: user
        })
    }
    updateUser = e => {
        console.log(this.state);
        console.log(this.props);
        this.props.onUpdate(this.state.user)
    }
    render() { 
        const { user }= this.state;
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
                            {/* <div className="col-2 text-center font-weight-bold">Tweet</div>
                            <div className="col-2 text-center font-weight-bold">Following</div>
                            <div className="col-2 text-center font-weight-bold">Follower</div>
                            <div className="col-2 text-center font-weight-bold">Favorite</div>
                            <div className="col-2 text-center font-weight-bold">List</div>
                            <div className="col-2 text-center font-weight-bold">Moment</div> */}
                        </div>
                        <div className="row">
                            {/* <div className="col-2 text-center font-weight-bold text-success">{user.tweet.number} </div>
                            <div className="col-2 text-center font-weight-bold text-success">{user.tweet.following}</div>
                            <div className="col-2 text-center font-weight-bold text-success">{user.tweet.follower}</div>
                            <div className="col-2 text-center font-weight-bold text-success">{user.tweet.favorite}</div>
                            <div className="col-2 text-center font-weight-bold text-success">{user.tweet.list}</div>
                            <div className="col-2 text-center font-weight-bold text-success">{user.tweet.moment}</div> */}
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="float-left">
                            <button className="border-customize btn btn-outline-danger font-weight-bold" type="button" style={{ width: "100px", marginRight:20 }} onClick={this.resetState} >Cancel</button>
                            <Link to="/"><button className="border-customize btn btn-outline-success font-weight-bold" type="button" style={{ width: "120px" }} onClick={this.updateUser} >Save</button></Link>
                        </div>
                    </div>
                </div>
                <hr style={{ "paddingBottom": "0px", "marginBottom": "0px" }}></hr>

                {/* end user infor */}

                {/* content */}

                <div id="content" className="row mt-0">
                <div className="col-3 float-left" style={{marginLeft: 15, marginTop: 35}}>
                        <form action="" onChange={this.handleInputChange}>
                            <input name="username" className="form-control" style={{ marginTop: 10 }} type="text" value={user.username} onChange={this.handleInputChange} />
                            <input name="location" className="form-control" style={{ marginTop: 10 }} type="text" value={user.location} onChange={this.handleInputChange} />
                            <input name="school" className="form-control" style={{ marginTop: 10 }} type="text" value={user.school} onChange={this.handleInputChange} />

                        </form>

    
  </div>
  <div className="col-6 bg-newfeed">
    <div className="row">
    {/* <div className="col-2 text-center font-weight-bold text-danger">Tweet </div>
    <div className="col-3 text-center font-weight-bold text-danger">Tweet & reply </div>
    <div className="col-2 text-center font-weight-bold text-danger">Vehicle</div> */}
    <div className="col-1 "></div>
    <div className="col-2 "></div>
    <div className="col-2 "></div>
    </div>
    
  </div>
  <div className="col-3">
    <div className="float-left">
      <div className="row bg-newfeed p-3">
        {/* <h5>New to Twitter?</h5>
        <div >Sign up now to have your personal timeline!</div> <br/>
        <button className="border-customize btn btn-danger font-weight-bold" style={{width: "270px"}} >Registration</button> */}
      </div>

      <div className="bg-newfeed pl-3 mt-1">
        
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