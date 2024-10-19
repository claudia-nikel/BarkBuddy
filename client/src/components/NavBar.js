import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './NavBar.css';

const NavBar = () => {
  const { user, logout } = useAuth0();

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/dogs">Dog List</Link></li>
        <li><Link to="/my-dogs">My Dogs</Link></li>
      </ul>
      <div className="navbar-user">
        <div className="dropdown">
          <button className="dropbtn">{user?.name || 'User'}</button>
          <div className="dropdown-content">
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
