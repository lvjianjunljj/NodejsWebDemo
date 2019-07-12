/**
 * @fileoverview This file contains the implementation of the Heartbeat API Route.
 */

// eslint assumes code under module to be strict. It is not necessarily
// true in node js unless you run node with node --use-strict.
// So explicitly disable the eslint rule strict for this line alone.

'use strict'; //  eslint-disable-line

const express = require('express');
const HttpStatus = require('http-status-codes');
const packageJson = require('../package.json');

const router = express.Router(); // eslint-disable-line new-cap

/**
 * @api {get} /heartbeat Get the heartbeat
 * @apiName GetHeartbeat
 * @apiGroup Heartbeat
 * @apiVersion 0.1.0
 *
 * @apiDescription Returns a message indicating whether the service is responsive and working as expected.
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET "http://localhost:3000/datacop/api/v1/heartbeat"
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "title": "DataCop v1.0.0 Heartbeat",
  *    "url": "/datacop/api/v1/heartbeat"
 *  }
 *
 * @apiError (Error 503) ServiceUnavailable The service is down and thus unresponsive.
 *
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 503 Service Unavailable
 *  {
 *    "title": "Data Service v1.0.0 Heartbeat",
 *    "url": "/dataservice/api/v1/heartbeat"
 *  }
 */
router.get('/', (req, res, next) => {
  const url = '/datacop/api/v1/heartbeat';
  const title = `Data Cop v${packageJson.version} Heartbeat`;
  const httpStatus = HttpStatus.OK;

  // TODO - Check status to number of tests in queue
  // Add stats to number of tests executed in last hour.
  res.status(httpStatus).json({
    title,
    url,
  });
});

module.exports = router;
