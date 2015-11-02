var Sequelize = require('sequelize');
var sequelize = new Sequelize('OpenDb', 'sa', 'Tsunami9', {
	host: 'drudenko-w8',
	define: {
    	timestamps: false // true by default
  	},
	dialect: 'mssql'
  }
);

module.exports = {
	Sequelize: Sequelize, 
	sequelize: sequelize
};