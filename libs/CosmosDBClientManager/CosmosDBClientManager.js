/* 
 * @fileoverview This file contains the wrapper for the singleton
 * cosmosdb client manager.
 */
const cosmosdb = require('@azure/cosmos');
// TODO - move this to KeyVault.
const config = require('./config.json');

const client = new cosmosdb.CosmosClient({ endpoint: config.endPoint, auth: { masterKey: config.primaryKey } });

module.exports = {
  client,
};
