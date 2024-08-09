const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
}).unless({
  path: ['/api/breeds'] // Exclude paths that do not require authentication
});

// Middleware to log the user object
const logUser = (req, res, next) => {
  console.log('User:', req.user);
  next();
};

module.exports = { checkJwt, logUser };
