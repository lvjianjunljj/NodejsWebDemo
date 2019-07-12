/**
 * @fileoverview This file contains the implementation of all supported routes in
 * datacop  service.
 */
const passport = require('passport');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const ADCredentialsManager = require('../libs/ActiveDirectory/ADCredentialsManager');

// For AAD auth
const authenticationStrategy = new BearerStrategy(ADCredentialsManager.credentials, (req, token, done) => {
  if (token.tid === ADCredentialsManager.microsoftTenantId) {
    req.tokenAppId = token.appid;
    return done(null, true);
  } else {
    return done(null, false);
  }
});
passport.use(authenticationStrategy);

// Load the route handlers
const uuid = require('node-uuid');

const swaggerdoc = require('./routes/swaggerdoc.js');
const heartbeat = require('./routes/heartbeat.js');
const alerts = require('./routes/alerts.js');
const errors = require('./routes/errors.js');

module.exports = function routes(app) {
  // Add request id and start time to request object
  app.use((req, res, next) => {
    // Generates and returns a RFC4122 v4 UUID for correlating logs purpose
    req.requestId = uuid.v4(); // eslint-disable-line no-param-reassign
    req.startTime = Date.now(); // eslint-disable-line no-param-reassign
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());

  // Define the routes and auth checking.
  const baseRoute = '/datacop/api';
  app.use(`${baseRoute}/v1/swaggerdoc`, swaggerdoc);
  app.use(`${baseRoute}/v1/heartbeat`, heartbeat);
  app.use(`${baseRoute}/v1/alerts`, passport.authenticate('oauth-bearer', { session: false }), alerts);

  // Handle incorrect URIs
  app.all('*', (req, res, next) => {
    const err = new Error('Endpoint not found.');
    err.code = 404;
    return next(err);
  });

  // Error handling middleware
  app.use(errors);
};
