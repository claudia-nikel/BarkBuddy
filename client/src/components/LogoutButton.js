import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();
  
  const handleLogout = () => {
    const returnToUrl = process.env.REACT_APP_AUTH0_REDIRECT_URI;

    logout({ returnTo: returnToUrl });
  };

  return (
    <button onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
