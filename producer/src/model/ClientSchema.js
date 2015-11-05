var mssql = require('./db.js'), 
	Sequelize = mssql.Sequelize,
	sequelize = mssql.sequelize;

var Client = sequelize.define('clients', {
  ClientId: Sequelize.TEXT,
  Name: Sequelize.TEXT,
  Description: Sequelize.TEXT,
  WebSite: Sequelize.TEXT,
  CustomFieldsXml: Sequelize.TEXT
});

module.exports = {Client: Client};