// Doc in OneNote: https://microsoftapc-my.sharepoint.com/personal/jianjlv_microsoft_com/_layouts/OneNote.aspx?id=%2Fpersonal%2Fjianjlv_microsoft_com%2FDocuments%2FJianjun%20%40%20Microsoft&wd=target%28Work.one%7C08C13A75-D69C-49FE-8D53-8DBF6710CCF0%2FAzure%20Active%20Directory%7C1E8132B8-05DD-4DAA-A6BD-D48C56F4A088%2F%29
const microsoftTenantId = '72f988bf-86f1-41af-91ab-2d7cd011db47';
const datacopClientID = '83ac8948-e5e1-4bbd-97ea-798a13dc8bc6';

module.exports.credentials = {
  identityMetadata: `https://login.microsoftonline.com/${microsoftTenantId}/.well-known/openid-configuration`,
  clientID: datacopClientID,
  passReqToCallback: true
};

module.exports.microsoftTenantId = microsoftTenantId;