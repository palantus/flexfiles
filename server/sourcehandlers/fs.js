"use strict"

var path = require('path')
var constants = require('../constants.json')
var SourceRoot = require('./root.js')

class FSHandler extends SourceRoot{

	constructor(){
		super();
		this.acceptableExtensions = ['.png', '.jpg', '.jpeg'];
	}

	/*
	 * Returns:
	 *   {hash,	size, filename, path, extension, type, meta}
	 */
	getFileList(cb){
		this.files = this.walkSync(this.config);
		if(cb !== undefined)
			cb(this.files)
		else
			return this.files;
	}

	fillMissingMetadata(file, cb){
		file.meta = file.meta || {};
		if(constants.fileTypes[file.type] == "image"){
			this.image_fillDimensions(file, cb);
		}
	}

	image_fillDimensions(file, cb){
		file.meta.image = file.meta.image || {};

		if(isNaN(file.meta.image.width) || isNaN(file.meta.image.width)){
			var filepath = path.join(this.config, file.path, file.filename);
			var sizeOf = require('image-size');
			var dimensions = sizeOf(filepath);
			file.meta.image.width = dimensions.width;
			file.meta.image.height = dimensions.height;
		}

		if(isNaN(file.meta.image.phash)){
			var filepath = filepath || path.join(this.config, file.path, file.filename);
			var phash = require('phash-image');
			phash(filepath, true, function(err, phash){
				file.meta.image.phash = phash;
				cb(file);
			})
		} else {
			cb(file)
		}
	}

	getTypeFromExt(extension){
		switch(extension){
			case "jpg":
			case "jpeg":
			case "png":
			case "bmp":
			case "gif":
				return constants.fileTypes.indexOf("image");
			default:
				return constants.fileTypes.indexOf("misc");
		}
	}

	walkSync(rootdir, reldir, filelist)	{
		var self = this;
		reldir = reldir || '';

		var fs = fs || require('fs'),
			path = path || require('path'),
			files = fs.readdirSync(path.join(rootdir, reldir)),
			filelist = filelist || [],
			md5File = md5File || require('md5-file');

		files.forEach(function(file) {
			if (fs.statSync(path.join(rootdir, reldir, file)).isDirectory()) {
				filelist = self.walkSync(rootdir, path.join(reldir, file), filelist);
			}
			else {
				if(self.acceptableExtensions.indexOf(path.extname(file.toLowerCase())) >= 0){
					var fullPath = path.join(rootdir, reldir, file);
					var ext = path.extname(file.toLowerCase()).substring(1);
					var file = {
						path: path.join("/", reldir),
						filename: file,
						hash: md5File.sync(fullPath),
						size: fs.statSync(fullPath).size,
						extension: ext,
						type: self.getTypeFromExt(ext),
						meta: {}
					}
					filelist.push(file);
				}
			}
		});
		return filelist;
	}

	getFileContent(file, cb){
		var fs = fs || require('fs')
		var filepath = path.join(this.config, file.path, file.filename);
		fs.readFile(filepath, (err, data) => {
		  if (err) throw err;
		  cb(data);
		});
	}
}

module.exports = FSHandler;
