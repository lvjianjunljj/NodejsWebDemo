/* 
 * Detail in OneNote: https://microsoftapc-my.sharepoint.com/personal/jianjlv_microsoft_com/_layouts/OneNote.aspx?id=%2Fpersonal%2Fjianjlv_microsoft_com%2FDocuments%2FJianjun%20%40%20Microsoft&wd=target%28Work.one%7C08C13A75-D69C-49FE-8D53-8DBF6710CCF0%2FKusto%7CAA3603CD-57C4-4547-B6A2-EAE9A7063F31%2F%29
 * @fileoverview This file contains the wrapper for the singleton
 * kusto client manager.
 */

const azureKusto = require('azure-kusto-data');
// TODO - move this to KeyVault.
const config = require('./config.json');

const kcsb = azureKusto.KustoConnectionStringBuilder.withAadApplicationKeyAuthentication(
  config.kustoConnectionString, config.kustoAppId, config.kustoAppKey, config.kustoAuthorityId);
const client = new azureKusto.Client(kcsb);

module.exports = {
  client,
};
