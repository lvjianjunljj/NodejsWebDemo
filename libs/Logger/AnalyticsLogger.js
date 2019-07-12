// Doc in OneNote: https://microsoftapc-my.sharepoint.com/personal/jianjlv_microsoft_com/_layouts/OneNote.aspx?id=%2Fpersonal%2Fjianjlv_microsoft_com%2FDocuments%2FJianjun%20%40%20Microsoft&wd=target%28Work.one%7C08C13A75-D69C-49FE-8D53-8DBF6710CCF0%2FLog%20Analytics%7CE7183582-AEE7-4C45-AD61-4C8C3D344111%2F%29
const request = require('request');
const crypto = require('crypto');
const config = require('./config.json');

async function logInfoAsync(tagId, message) {
  sendDataCopTraceAsync(tagId, message, 'Information');
}

async function sendDataCopTraceAsync(tagId, message, traceEventType) {
  var processingDate = new Date().toUTCString();
  var traceEntity =
  {
    TagId: tagId,
    Message: message,
    TraceEventType: traceEventType,
    Environment: config.environment
  };
  var traceBody = JSON.stringify(traceEntity);

  var contentLength = Buffer.byteLength(traceBody, 'utf8');

  var stringToSign = `POST\n${contentLength}\napplication/json\nx-ms-date:${processingDate}\n/api/logs`;
  var signature = crypto.createHmac('sha256', new Buffer(config.sharedKey, 'base64')).update(stringToSign, 'utf-8').digest('base64');
  var authorization = 'SharedKey ' + config.workspaceId + ':' + signature;

  var headers = {
    "content-type": "application/json",
    "Authorization": authorization,
    "Log-Type": config.traceTableName,
    "x-ms-date": processingDate
  };

  var url = 'https://' + config.workspaceId + '.ods.opinsights.azure.com/api/logs?api-version=' + config.apiVersion;

  request.post({ url: url, headers: headers, body: traceBody }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(`Send log request success. response body: ${body}`);
    } else {
      // TODO: Retry when saving log in Log Analytics failed.
      console.log(`Send log request success. error: ${error}; response statusCode: ${response.statusCode}`);
    }
  });
}

module.exports = {
  logInfoAsync,
};