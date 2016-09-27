"use strict"

var FS = require('./fs.js')

class MasterSourceHandler{
	static construct(sourceInfo){
		var source = {}
		let sourceType = sourceInfo.sourcetype || sourceInfo.type;
		let sourceId = sourceInfo.sourceid || sourceInfo.id;
		let sourceName = sourceInfo.sourcename || sourceInfo.name;
		let sourceConfig = sourceInfo.sourceconfig || sourceInfo.config;

		switch(sourceType){
			case "fs":
				source = new FS(sourceId);
				break;
			default:
				console.log("ERROR: Unknown source type: " + sourceType);
				return;
		}

		source.config = sourceConfig;
		source.name = sourceName;
		source.type = sourceType;

		return source;
	}

}

module.exports = MasterSourceHandler;
