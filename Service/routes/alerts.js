const express = require('express');
const HttpStatus = require('http-status-codes');
const cosmosDBProvider = require('../../libs/Model/CosmosDBProvider');
const kustoProvider = require('../../libs/Model/KustoProvider');
const analyticsLogger = require('../../libs/Logger/AnalyticsLogger');

const router = express.Router();
const baseRoute = '/datacop/api/v1/alerts';

router.get('/', (req, res, next) => {
  analyticsLogger.logInfoAsync('951dfbb2-9fc3-46b7-a9fc-3fe0143e5572', `Access DataCop Rest API '${baseRoute}' with application id: ${req.tokenAppId}`);
  const cutOffMilliSecs = 1000 * 60 * 60 * 24 * 7;
  cutOffTime = new Date(new Date().getTime() - cutOffMilliSecs).toISOString();
  if (req.query.cutofftime != undefined && !isNaN(Date.parse(req.query.cutofftime))) {
    cutOffTime = req.query.cutofftime;
  }
  // Use parameterized sql name to avoid SQL injection attacks.
  const querySpec = {
    query: 'select \
              c.issuedOnDate AS dateTime, \
              c.severity AS severity, \
              c.alertType AS alertType, \
              c.testCategory AS testType, \
              c.datasetName AS datasetName, \
              c.incidentId AS incidentId, \
              c.alertStatus AS status, \
              c.title AS alertTitle, \
              c.titleOverride AS titleOverride, \
              c.owningTeamId AS icmTeamName, \
              c.owningContactAlias AS assignedTo, \
              c.acknowledgeDate AS acknowledgeDate, \
              is_defined(c.mitigationDate) ? c.mitigationDate : c.impactedDate AS mitigateDate, \
              c.resolvedDate AS resolvedDate, \
              c.testDate AS impactedDate \
          from c where c.issuedOnDate > @cutOffTime \
          OR c.alertStatus = "Active" \
          order by c.issuedOnDate',
    parameters: [
      {
        name: "@cutOffTime",
        value: cutOffTime,
      }
    ]
  };

  cosmosDBProvider.getAlerts(querySpec).then((data) => {
    res.status(HttpStatus.OK).json(data);
  }).catch((error) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
  });
});

router.get('/QoB/dataset/:datasetId', (req, res, next) => {
  analyticsLogger.logInfoAsync('4ac3461e-60c8-4bb7-a7bf-51937fca5318', `Access DataCop Rest API '${baseRoute}/QoB/dataset/${req.params.datasetId}' with application id: ${req.tokenAppId}`);
  // Use parameterized sql name to avoid SQL injection attacks.
  const querySpec = {
    query: 'select \
              t.incidentId AS id, \
              t.title AS title, \
              t.titleOverride AS shortTitle, \
              t.owningContactAlias AS owner, \
              t.severity AS severity, \
              t.businessOwner AS businessOwner, \
              t.alertStatus AS status, \
              t.alertType AS alertType, \
              t.issuedOnDate AS createDate, \
              t.acknowledgeDate AS acknowledgeDate, \
              t.mitigationDate AS mitigateDate, \
              t.resolvedDate AS resolveDate, \
              t.impactStartDate AS impactStartDate \
          from t where t.datasetId = @id  \
          AND t.displayInSurface = \'BusinessPulse\' \
          order by t.issuedOnDate',
    parameters: [
      {
        name: "@id",
        value: req.params.datasetId,
      }
    ]
  };

  cosmosDBProvider.getAlerts(querySpec).then((data) => {
    res.status(HttpStatus.OK).json(data);
  }).catch((error) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
  });
});

router.get('/QoB/dataset/kusto/:datasetId', (req, res, next) => {
  analyticsLogger.logInfoAsync('ca5d89ac-294d-4ff0-98fc-f972128b26d6', `Access DataCop Rest API '${baseRoute}/QoB/dataset/kusto/${req.params.datasetId}' with application id: ${req.tokenAppId}`);
  const querySpec = `let IncidentIdsByDatasetId = IncidentCustomFieldEntriesSnapshot(true)
  | where Name == "DatasetId" and Value == "${req.params.datasetId}"
  | distinct IncidentId;
  let IncidentIdsByAlertType = IncidentCustomFieldEntriesSnapshot(true)
  | where Name == "AlertType" and Value == "Business"
  | distinct IncidentId;
  let IncidentIdsByShowInSurface = IncidentCustomFieldEntriesSnapshot(true)
  | where Name == "ShowInSurface" and Value == "Business Pulse"
  | distinct IncidentId;
  let Descriptions = IncidentDescriptions
  | where IncidentId in (IncidentIdsByDatasetId) and IncidentId in (IncidentIdsByAlertType) and IncidentId in (IncidentIdsByShowInSurface)
  | summarize arg_max(Date, Text) by IncidentId
  | project IncidentId, Text;
  IncidentsSnapshot(true)
  | where SourceCreatedBy == "DataCopMonitor" and  OccurringEnvironment == "PROD" and IncidentId in (IncidentIdsByDatasetId) and IncidentId in (IncidentIdsByAlertType) and IncidentId in (IncidentIdsByShowInSurface)
  | distinct IncidentId, Title, OwningContactAlias, Status, CreateDate, MitigateDate, ResolveDate, ModifiedDate
  | join (Descriptions) on IncidentId
  | order by CreateDate`;

  kustoProvider.getAlerts(querySpec, (error, results) => {
    if (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
    var data = [];
    results["tables"][1]["_rows"].forEach(function (item) {
      data.push({
        'incidentId': item[0],
        'title': item[1],
        'owningContactAlias': item[2],
        'alertStatus': item[3],
        'issuedOnDate': item[4],
        'mitigateDate': item[5],
        'resolvedDate': item[6],
        'lastUpdateDate': item[7],
        'lastUpdate': item[8],
      });
    });
    res.status(HttpStatus.OK).json(data);
  });
});

module.exports = router;
