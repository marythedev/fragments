//Authorization is now handled by the authorize middleware
//Keeping the previous code for reference
//const passport = require('passport');

const auth = require('http-auth');
const authPassport = require('http-auth-passport');

const authorize = require('./auth-middleware');

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

module.exports.strategy = () =>
  // looks for a username/password pair in the Authorization header.
  authPassport(
    auth.basic({
      file: process.env.HTPASSWD_FILE,
    })
  );

//Authorization is now handled by the authorize middleware
//Keeping the previous code for reference
//module.exports.authenticate = () => passport.authenticate('http', { session: false });

module.exports.authenticate = () => authorize('http');