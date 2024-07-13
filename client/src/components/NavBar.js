import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton';

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <nav>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/dogs">Dogs</a></li>
        <li><a href="/add-dog">Add Dog</a></li>
        {isAuthenticated ? (
          <li><LogoutButton /></li>
        ) : (
          <li><button onClick={() => loginWithRedirect()}>Log In</button></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
