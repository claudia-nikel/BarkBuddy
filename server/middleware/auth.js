const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');

// Simplified JWT middleware for debugging
const checkJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('No token found in authorization header');
    return res.status(401).json({ message: 'No token found' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Received JWT:', token);

  // Decode the token without verification for testing
  try {
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded Token:', decodedToken);
    req.user = decodedToken.payload; // Manually set the user
    next();
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = checkJwt;

