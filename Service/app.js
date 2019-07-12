/* @fileoverview This file contains the implementation of main entry point of
data cop service and instantiates the service based on different configuration.
*/
const debug = require('debug')('service');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('json spaces', 4); // Express JSON formatter configuration
app.locals.pretty = true; // HTML should be prettified
app.use(cookieParser());

// JSON body parse middleware, parse json-patch+json as JSON
// TODO - Do we really need this?
// app.use(bodyParser.json({ type: 'application/json-patch+json' }));

// When the node.js app is hosted in iisnode, the listen port is provided by IIS
// through the PORT environment variable.
app.set('port', process.env.PORT || 3000);
debug(`listening on port ${process.env.PORT || 3000}`);

// Pass the Express instance to the routes module
const routes = require('./routes')(app); // eslint-disable-line no-unused-vars

const server = app.listen(app.get('port'), () => {
  debug(`Express server listening on port ${server.address().port}`);
});

module.exports = app;
