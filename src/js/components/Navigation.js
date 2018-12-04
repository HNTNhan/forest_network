import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';

class Navigation extends  Component  {
    render() {
        let navigation = [];
        if(this.props.authUser) {

            navigation = <NavigationAuth/>
        }
        else {
            navigation = <NavigationNotAuth />
        }
        return (
            <div>
                { navigation }
            </div>

        );
    }
}

const NavigationAuth = (props) =>
    <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{borderBottom: "1px solid black", padding: "5px 5%"}}>
            <div className="collapse navbar-collapse col">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <button className="nav-link" style={{background: "none", border: "none"}}>
                            <Link to={routes.LANDING}>Home</Link>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" style={{background: "none", border: "none"}}>
                            <Link to={routes.LANDING}>Notifications</Link>
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" style={{background: "none", border: "none"}}>
                            <Link to="">Messages</Link>
                        </button>
                    </li>
                </ul>
            </div>

            <div className="collapse navbar-collapse col" style={{justifyContent: "center"}}>
                <img src={require("../../image/OakTree.png")} alt="tree" width="30"/>
            </div>

            <div className="collapse navbar-collapse col" style={{justifyContent: "flex-end"}}>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <img src={require("../../image/UserIcon.ico")} alt="user" width="30"/>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to={routes.ACCOUNT}>Account</Link>
                            <div className="dropdown-divider"/>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </div>;
const NavigationNotAuth = () =>
    <div className="navigation">
        <button className="navigation_item"><Link to={routes.LANDING}>Landing</Link></button>
        <button className="navigation_item"><Link to={routes.SIGN_IN}>Sign In</Link></button>
    </div>;

export default Navigation;