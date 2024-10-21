import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SignUpButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    loginWithRedirect({
      screen_hint: 'signup', // This directs users to the signup page
    });
  };

  return (
    <button onClick={handleSignup}>
      Sign Up
    </button>
  );
};

export default SignUpButton;
