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
                <div >
               
              <hr></hr>
              </div>

                
            ))
            

         );
    }
}
 
export default PostDetail;