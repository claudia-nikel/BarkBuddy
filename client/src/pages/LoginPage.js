import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SignUpButton from 'SignUpPage'; // Import the signup button

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <h1>Welcome to BarkBuddy</h1>
      <button onClick={() => loginWithRedirect()}>Log In</button> {/* Log In Button */}
      <SignUpButton /> {/* Sign Up Button */}
    </div>
  );
};

export default LoginPage;


