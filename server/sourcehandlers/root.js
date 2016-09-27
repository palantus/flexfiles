"use strict"

var FS = require('./fs.js')

class SourceRoot{
	constructor(sourceId){
		this.sourceId = sourceId;
	}

	init(cb){

	}

	/*
	 * Returns:
	 *   {hash,	size, filename, path, extension}
	 */
	getFileList(cb){
		throw "Source does not override getFileList";
	}

	refreshAllMetadata(file){
		file.meta = {}
		this.fillMissingMetadata(file)
	}

	fillMissingMetadata(file){
		throw "Source does not override fillMissingMetadata";
	}
}

module.exports = SourceRoot;
