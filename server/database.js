var DBHandler = function(sourceId){
	this.sourceId = sourceId;

	this.init = function(){

	}

	this.getConnection = function(){
		var self = this;
		self.sourceId = sourceId;
		var mysql      = require('mysql');
		var config = require("../config.json")
		this.db = mysql.createConnection(config.database);

		this.db.connect();

		return this.db;
	}
}

module.exports = DBHandler;
