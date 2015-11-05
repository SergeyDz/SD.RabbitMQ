var Sequelize = require('sequelize');
var sequelize = new Sequelize('OpenDb_Full', 'sa', 'Tsunami9', {
	host: '10.1.0.166',
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