const express = require('express');
const HttpStatus = require('http-status-codes');
const path = require('path');
const fs = require("fs");

const router = express.Router();

router.get('/', (req, res, next) => {
  // When we deploy DataCopService in Azure, the file location will be changed.
  // So we need to use "__dirname" to get the current loaction then use "path.join" to get the yaml file location.
  fs.readFile(path.join(__dirname, './../../swagger.yaml'), 'utf8', function (err, swaggerDocContent) {
    res.status(HttpStatus.OK).send(swaggerDocContent);
  });
});

module.exports = router;
