import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import PostDetail from "../container/postDetail";
import '../style/css/home.css'
class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: props.user,
			post: props.post
		}
	}
    render() { 
		const { user } = this.state;
		console.log(this.state);
        return (
		<div className="" >
			<div className="row">
				<div className="col-3" style={{background: 'lightcyan'}}>
					<div className="panel panel-default">
						<div className="panel-body">
							<span style={{display: 'table',margin: '0 auto'}} ><img className="rounded-circle" alt={user.username} src="images/chalee.jpg" style={{width:100 , height:100}}></img>
							<p  style={{textAlign: 'center' , fontWeight: 'bold'}}><Link to="/user" style={{textDecoration: 'none'}}>{user.username}</Link> </p>
							{}
							</span>
							<div className="row">
									<div className="col-3 text-center font-weight-bold"> Tweet</div>
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
			
					<div className="col-6 bg-newfeed">
						
						<div className="row">
						
							<div className="col-1 "></div>
							<div className="col-2 "></div>
							<div className="col-2 "></div>
							

						</div>
						<div className="form-group shadow-textarea" style={{color: 'lightblue', marginBottom: 50}}>
							<textarea className="form-control" placeholder="Write something here..."></textarea>
							<button type="button" className="floatRight btn btn-primary btn-md" style={{fontWeight: "bold", float: "right" , marginTop: 5 }}>Submit</button>
						</div>
						<PostDetail></PostDetail>

              </div>


				<div className="col-3" style={{background: 'lightcyan'}}>
					<div className="panel panel-default panel-custom">
						<div className="panel-heading font-weight-bold mb-3">
							<h3 style={{textAlign: "center"}} className="panel-title">
								Who to follow
								
							</h3>
						</div>
						<div className="panel-body">
							<div className="media mb-1">
								<div className="media-left">
									<img src="http://placehold.it/32x32" alt="" className="media-object img-rounded"></img>
								</div>
								<div className="media-body">
									<h4 className="media-heading">Nome e cognome</h4>
									<a href="#" className="btn btn-default btn-xs">
										+
										<span className="glyphicon glyphicon-user"></span>
										Follow
									</a>
								</div>
							</div>
							<div className="media mb-1">
								<div className="media-left">
									<img src="http://placehold.it/32x32" alt="" className="media-object img-rounded"></img>
								</div>
								<div className="media-body">
									<h4 className="media-heading">Nome e cognome</h4>
									<a href="#" className="btn btn-default btn-xs">
										+
										<span className="glyphicon glyphicon-user"></span>
										Follow
									</a>
								</div>
							</div>
							<div className="media mb-1">
								<div className="media-left">
									<img src="http://placehold.it/32x32" alt="" className="media-object img-rounded"></img>
								</div>
								<div className="media-body">
									<h4 className="media-heading">Nome e cognome</h4>
									<a href="#" className="btn btn-default btn-xs">
										+
										<span className="glyphicon glyphicon-user"></span>
										Follow
									</a>
								</div>
							</div>
						</div>
						<div className="panel-footer">
							<a href="www.google.it">
								<span className="glyphicon glyphicon-user"></span>
								Find people you know
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>




        );
       
        
    }
}
 
export default Home;