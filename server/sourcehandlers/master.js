"use strict"

var FS = require('./fs.js')

class MasterSourceHandler{
	static construct(sourceInfo){
		var source = {}
		switch(sourceInfo.type){
			case "fs":
				source = new FS(sourceInfo.id);
				break;
			default:
				console.log("ERROR: Unknown source type: " + rows[0].type);
				return;
		}

		source.config = sourceInfo.config;
		source.name = sourceInfo.name;
		source.type = sourceInfo.type;

		return source;
	}

}

module.exports = MasterSourceHandler;
