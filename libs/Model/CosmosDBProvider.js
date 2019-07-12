const debug = require('debug')('model');
const cosmosDBClient = require('../CosmosDBClientManager/CosmosDBClientManager').client;

const databaseId = 'DataCop';
const dataCopScoreCollectionId = 'DataCopScore';
const recentDataCopScoreDetailsCollectionId = 'RecentDataCopScoreDetails';
const alertCollectionId = 'Alert';
const datasetCollectionId = 'Dataset';
const activeAlertTrendCollectionId = 'ActiveAlertTrend';
let dataCopScoreContainer;
let recentDataCopScoreDetailsContainer;
let alertContainer;
let datasetContainer;
let activeAlertTrendContainer;

/**
 * This method initializes the collection.
 */
async function init() {
  debug('Setting up the database...');
  const dbResponse = await cosmosDBClient.databases.createIfNotExists({
    id: databaseId,
  });
  // eslint-disable-next-line prefer-destructuring
  const database = dbResponse.database;
  debug('Setting up the database...done!');
  debug('Setting up the container...');
  const dataCopScoreCoResponse = await database.containers.createIfNotExists({
    id: dataCopScoreCollectionId,
  });
  const recentDataCopScoreDetailsCoResponse = await database.containers.createIfNotExists({
    id: recentDataCopScoreDetailsCollectionId,
  });
  const alertCoResponse = await database.containers.createIfNotExists({
    id: alertCollectionId,
  });
  const datasetCoResponse = await database.containers.createIfNotExists({
    id: datasetCollectionId,
  });
  const activeAlertTrendCoResponse = await database.containers.createIfNotExists({
    id: activeAlertTrendCollectionId,
  });

  // eslint-disable-next-line prefer-destructuring
  dataCopScoreContainer = dataCopScoreCoResponse.container;
  recentDataCopScoreDetailsContainer = recentDataCopScoreDetailsCoResponse.container;
  alertContainer = alertCoResponse.container;
  datasetContainer = datasetCoResponse.container;
  activeAlertTrendContainer = activeAlertTrendCoResponse.container;
  debug('Setting up the container...done!');
}

async function getDataCopScores(querySpec) {
  debug(`Querying for data cop scores ${querySpec}`);
  if (!dataCopScoreContainer) {
    throw new Error('Collection is not initialized.');
  }
  const { result: results } = await dataCopScoreContainer.items
    .query(querySpec)
    .toArray();
  return results;
}

async function getRecentDataCopScoreDetails(querySpec) {
  debug(`Querying for data cop scores ${querySpec}`);
  if (!recentDataCopScoreDetailsContainer) {
    throw new Error('Collection is not initialized.');
  }
  const { result: results } = await recentDataCopScoreDetailsContainer.items
    .query(querySpec)
    .toArray();
  return results;
}

async function getAlerts(querySpec) {
  debug(`Querying for data cop alerts ${querySpec}`);
  if (!alertContainer) {
    throw new Error('Collection is not initialized.');
  }
  const { result: results } = await alertContainer.items
    .query(querySpec)
    .toArray();
  return results;
}

async function getDatasets(querySpec) {
  debug(`Querying for data cop scores ${querySpec}`);
  if (!datasetContainer) {
    throw new Error('Collection is not initialized.');
  }
  const { result: results } = await datasetContainer.items
    .query(querySpec)
    .toArray();
  return results;
}

async function getActiveAlertTrend(querySpec) {
  debug(`Querying for data cop scores ${querySpec}`);
  if (!activeAlertTrendContainer) {
    throw new Error('Collection is not initialized.');
  }
  const { result: results } = await activeAlertTrendContainer.items
    .query(querySpec)
    .toArray();
  return results;
}


// call the init method on first access and will
// end up creating the collection / db required.
init().then((err, data) => {
  debug(`collection created err = ${err}`);
}).catch((error) => {
  debug(`collection creation failed with error ${error}`);
});

module.exports = { getDataCopScores, getRecentDataCopScoreDetails, getAlerts, getDatasets, getActiveAlertTrend };
