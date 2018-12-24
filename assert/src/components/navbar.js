import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
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
        const { user } = this.state;
        return ( 
            //<CSSTransition>
              <div id="menu" className="row bg-lightc">
              <nav className="navbar navbar-expand-lg navbar-light bg-light textNav " style={{width: "100%"}}>
                  <div className="collapse navbar-collapse" >
                  <ul className="navbar-nav mr-5 font-weight-bold sticky-top">
                      <li className="nav-item ml-5">
                      <a className="nav-link text-dark iconWeb" href="#"></a>
                      </li>
                      <li className="nav-item mr-1">
                      <Link className="nav-link text-dark" href="#" to='/'>Home </Link>
                      </li>
                      <li className="nav-item mr-1 ">
                          <a className="nav-link text-dark" href="#">About</a>
                      </li>
                      <li className="nav-item align-textbox-Search" style={{position: "relative",
                      float: "right"}}>
                          <form className="form-inline my-2 my-lg-0">
                              <input className="form-control mr-sm-2 border-customize" type="search" placeholder="Search" aria-label="Search"></input>
                              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                          </form>
                      </li>
                      
                      <li className="nav-item dropdown no-arrow ml-2" style={{position: "relative",
                      float: "right"}}>
                      <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="fas fa-user-circle fa-fw" ></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                          <a className="dropdown-item" href="#">log out</a>
                          <a className="dropdown-item" href="#">Log in</a>
                          <div className="dropdown-divider"></div>
                          <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">Setting</a>
                      </div>
                      </li>
                            <Link to='/user'>
                                <li className="nav-item alignRignt accoutInfor ">
                                    <div style={{color: 'black', textDecoration: 'none'}}>{user.username}</div>
                                </li>
                            </Link>
                      
                      <li className="nav-item dropdown no-arrow" style={{position: "relative",
                      float: "right"}}>
                      <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="fas fa-envelope fa-fw"></i>
                          <span className="badge badge-danger">4+</span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="messagesDropdown">
                          <a className="dropdown-item" href="#">Action</a>
                          <a className="dropdown-item" href="#">Another action</a>
                          <div className="dropdown-divider"></div>
                          <a className="dropdown-item" href="#">Something else here</a>
                      </div>
                      </li>
                  
                  
                  </ul>
                  
                  </div>
                  
              </nav>
              </div>
         );
    }
}
 
export default Navbar;