import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PostDetail from '../container/postDetail';

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
        return{};
    }
}
 
export default UserProfile;