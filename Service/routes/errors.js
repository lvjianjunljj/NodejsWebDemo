/**
 * @fileoverview This file contains the implementation of the error handling middleware.
 */
const HttpStatus = require('http-status-codes');

/**
 * Error handling middleware.
 * @module errors
 */
module.exports = function errors(err, req, res, next) {
  if (err.code === HttpStatus.NOT_FOUND) {
    return res.status(HttpStatus.NOT_FOUND).json({ title: `404: ${HttpStatus.getStatusText(HttpStatus.NOT_FOUND)}`, error: (err.message) ? err.message : HttpStatus.getStatusText(HttpStatus.NOT_FOUND), url: req.url });
  }

  if (err.code === HttpStatus.UNPROCESSABLE_ENTITY) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ title: `422: ${HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY)}`, error: (err.message) ? err.message : HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY), url: req.url });
  }

  if (err.code && HttpStatus.getStatusText(err.code)) {
    return res.status(err.code).json({ title: `${err.code} : ${HttpStatus.getStatusText(err.code)}`, error: err.message, url: req.originalUrl });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ title: `500: ${HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)}`, error: (err.message) ? err.message : HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR), url: req.url });
};
