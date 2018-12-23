import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class PostDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            post: props.post
        }
    }
    render() { 
        console.log(this.state);
        const { post } = this.state;
        return ( 
            post.map((post, index ) => (
                <div key={index}>
                <div className="row bg-newfeed" >
                <div className="ml-1 col-1 pb-3 icon-newfeed rounded-circle" style={{backgroundImage: "url(images/chalee.jpg)",height:40}}></div>
                <div className="col-10">            
          <span style={{fontWeight: "bold"}}> {post.username}  <Link to="#">{post.heading}</Link></span>                   
                  <div className="row">
                     {post.content}
                  </div>
                  <hr></hr>
                  {/* react with post */}
                  <div className="row">
                    <div className="col-2 ">
                    <a href="#" style={{textDecoration: "none"}} className="fa fa-commenting-o" aria-hidden="true"></a>
                      69 </div>
                    <div className="col-2">
                    <a href="#" style={{textDecoration: "none"}}  className="fa fa-heartbeat" aria-hidden="true"></a>
                      322</div>
                      <div className="col-2">
                      <a href="#" style={{textDecoration: "none"}}  className="fa fa-share-alt-square" aria-hidden="true"></a>
                        12</div>
                        <div className="col-2">
                        <a href="#" style={{textDecoration: "none"}}  className="fa fa-thumbs-o-up" aria-hidden="true"></a>
                          89</div>
                          <div className="col-2">
                          <a href="#" style={{textDecoration:"none"}} className="fa fa-thumbs-o-down" aria-hidden="true"></a>
                          90</div>
                  </div>
                  <hr></hr>
                </div>
              </div>
              <hr></hr>
              </div>

                
            ))
            

         );
    }
}
 
export default PostDetail;