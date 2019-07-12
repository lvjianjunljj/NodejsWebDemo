const debug = require('debug')('model');
const kustoClient = require('../KustoClientManager/KustoClientManager').client;

async function getAlerts(querySpec, fun) {
  debug(`Querying from kusto for data cop alerts ${querySpec}`);
  await kustoClient.execute("IcmDataWarehouse", querySpec, fun);
}

module.exports = { getAlerts };
