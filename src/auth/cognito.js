//Authorization is now handled by the authorize middleware
//Keeping the previous code for reference
//const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const authorize = require('./auth-middleware');

const logger = require('../logger');

// We expect AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID to be defined.
if (!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
  throw new Error('missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID');
}

// Confirm that JWT token is valid and can be trusted
// https://github.com/awslabs/aws-jwt-verify#cognitojwtverifier-verify-parameters
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  // We expect an Identity Token (vs. Access Token)
  tokenUse: 'id',
});

logger.info('Configured to use AWS Cognito for Authorization');

// Download and cache the public keys (JWKS) we need in order to verify our Cognito JWTs
//https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets
// curl https://cognito-idp.us-east-1.amazonaws.com/<user-pool-id>/.well-known/jwks.json
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS cached');
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to cache Cognito JWKS');
  });

module.exports.strategy = () =>
  // Looks for the Bearer Token in the Authorization header
  // and verifies that with our Cognito JWT Verifier.
  new BearerStrategy(async (token, done) => {
    try {
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, 'verified user token');

      // Create a user, only with their email
      done(null, user.email);
    } catch (err) {
      logger.error({ err, token }, 'could not verify token');
      done(null, false);
    }
  });

//Authorization is now handled by the authorize middleware
//Keeping the previous code for reference
//module.exports.authenticate = () => passport.authenticate('bearer', { session: false });

module.exports.authenticate = () => authorize('bearer');