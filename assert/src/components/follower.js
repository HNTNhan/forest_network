import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user,
            following: props.following,
            follower: props.follower
		}
	}
    render() { 
		console.log(this.state);
		const { user } = this.state;
		const { follower } = this.state;
        return (
			<div className="" >
					{/* left panel  */}
					<div className="row mt-0">
						<div className="col-3"></div>
						<div className="col-6">
							<div className="row">
								<div className="col-2 text-center font-weight-bold">Tweet</div>
								<div className="col-2 text-center font-weight-bold"><Link to="/user/following" style={{textDecoration: 'none'}}>Following</Link></div>
								<div className="col-2 text-center font-weight-bold">Follower</div>
								<div className="col-2 text-center font-weight-bold">Favorite</div>
								<div className="col-2 text-center font-weight-bold">List</div>
								<div className="col-2 text-center font-weight-bold">Moment</div>
							</div>
							<div className="row">
								<div className="col-2 text-center font-weight-bold text-success">{user.tweet.number} </div>
								<div className="col-2 text-center font-weight-bold text-success">{user.tweet.following}</div>
								<div className="col-2 text-center font-weight-bold text-success">{user.tweet.follower}</div>
								<div className="col-2 text-center font-weight-bold text-success">{user.tweet.favorite}</div>
								<div className="col-2 text-center font-weight-bold text-success">{user.tweet.list}</div>
								<div className="col-2 text-center font-weight-bold text-success">{user.tweet.moment}</div>
							</div>

							
							
						</div>
						<div className="col-3">
							<div className="float-left">
								<Link to="/user/edit"><button className="border-customize btn btn-outline-danger font-weight-bold" style={{ width: "146px" }} >Edit Profile</button></Link>
							</div>
						</div>
					</div>
					{/*  */}

					{/*  start Heading */}
			<div className="row">
				<div className="col-3">
					<div className="panel panel-default">
						<div className="panel-body">
							<span style={{display: 'table',margin: '0 auto'}} ><img className="rounded-circle" src="/images/chalee.jpg" style={{width:100 , height:100}}></img>
							<p  style={{textAlign: 'center' , fontWeight: 'bold'}}>{user.username}</p>
							
							</span>
							<div className="row">
									<div className="col-3 text-center font-weight-bold">Tweet</div>
									<div className="col-4 text-center font-weight-bold"><Link to="/user/following" style={{textDecoration: 'none'}}>Following</Link></div>
									<div className="col-4 text-center font-weight-bold"><Link to="/user/follower" style={{textDecoration: 'none'}}>Follower</Link></div>
								</div>
								<div className="row">
									<div className="col-3 text-center font-weight-bold text-success">{user.tweet.number} </div>
									<div className="col-4 text-center font-weight-bold text-success">{user.tweet.following}</div>
									<div className="col-4 text-center font-weight-bold text-success">{user.tweet.follower}</div>
								</div>
						</div>
					</div>

					<div className="panel panel-default panel-custom">
						<div className="panel-heading">
							<h3 style={{textAlign:"center"}} className="panel-title">
								Trends
							</h3>
						</div>

						<div className="panel-body">
							<ul className="list-unstyled">
								<li><a href="#">#Cras justo odio</a></li>
							</ul>
						</div>
					</div>

					
				</div>
				<div className="col-9" style={{marginTop: 10}}>
				<div className="row">
				{
					follower.map((follower, index) => {
						return (
							<div className="card col-3 mr-5" key={index} >
								<img className="card-img-top" src={`/images/${follower.headerImage}`} alt="Card image cap"></img>
								<div className="card-body">
									<h5 className="card-title">{follower.username}</h5>
									<p className="card-text">{follower.description}</p>
									<button  className="btn btn-primary" style={{marginBottom: "20px"}}>{follower.status}</button>
								</div>
							</div>

						)

					})
				}
							
						</div>
						</div>
			</div>
			{/* End Heading */}
			
			



		</div>


        );
       
        
    }
}
 
export default Home;