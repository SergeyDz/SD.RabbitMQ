var mssql = require('./db.js'), 
	Sequelize = mssql.Sequelize,
	sequelize = mssql.sequelize;

var Party = sequelize.define('parties', {
  PartyId: Sequelize.TEXT,
  Name: Sequelize.TEXT,
  Description: Sequelize.TEXT, 
  PartyType_Id: Sequelize.INTEGER
});

var PartyType =  sequelize.define('PartyTypes', {
  Id: Sequelize.INTEGER,
  Key: Sequelize.TEXT,
  Name: Sequelize.TEXT
});

Party.belongsTo(PartyType, {foreignKey: 'PartyType_Id'});
//Party.hasOne(PartyType, { foreignKey: 'Id' });

module.exports = {Party: Party, PartyType: PartyType};