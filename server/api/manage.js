"use strict"
var APIRoot = require('./apiroot.js')
var SourceMaster = require('../sourcehandlers/master.js')
let path = require("path")
let fs = require("fs")
var Jimp = require("jimp");

class Manage extends APIRoot{

  handle(urlParts, data, respond){
    if(urlParts.length < 1){
      respond({error: "Unknown command"})
      return;
    }

    let self = this;
    let command = urlParts[0]

    switch(command){
      case "genthumbnails":
        let rootAppDir = path.dirname(require.main.filename);
        let thumbDir = path.join(rootAppDir, "thumbnails")

        if(!fs.existsSync(thumbDir)){
          fs.mkdirSync(thumbDir)
        }

        let fileSet = new Set(this.walkSync(thumbDir));

        this.db.query("SELECT hash FROM files_images", function(err, rows){
          if(err) console.log(err)

          let imageSet = new Set()
          rows.forEach(function(row){
            imageSet.add(row.hash)
          })

          let missingThumbs = new Set([...imageSet].filter(x => !fileSet.has(x)));
          let obsoleteThumbs = new Set([...fileSet].filter(x => !imageSet.has(x)));

          self.generateNextThumbnail(missingThumbs, thumbDir, function(){
            console.log("Finished generating thumbnails")
          })

          obsoleteThumbs.forEach(function(hash){
            let filePath = path.join(thumbDir, hash)
            if(fs.existsSync(filePath)){
              fs.unlink(filePath)
            }
          })

          respond({success: true, message: "Generating thumbnails now...", missingThumbs: missingThumbs.size, obsoleteThumbs: obsoleteThumbs.size})
        })
        break;
    }
  }

  generateNextThumbnail(hashSet, thumbDir, callback){
    var self = this;

    if(hashSet.size < 1){
      callback();
      return;
    }

    var hash = hashSet.values().next().value;
    hashSet.delete(hash)

    this.getFile(hash, function(file){
      let source = SourceMaster.construct(file)
      source.getFileContent(file, function(buffer){
        console.log("Gen thumb for hash " + file.hash + " and writing to: " + path.join(thumbDir, hash))
        Jimp.read(buffer, function (err, img) {
          buffer = null;
          if (err) throw err;
          img.scaleToFit(150, 150).write(path.join(thumbDir, hash) + '.png', function(err){
             if(err) throw err;
             self.generateNextThumbnail(hashSet, thumbDir, callback)
          });
        });
      })
    })
  }

	walkSync(dir, filelist)	{
		var self = this;
		dir = dir || '';

		var fs = fs || require('fs'),
			path = path || require('path'),
			files = fs.readdirSync(dir),
			filelist = filelist || [];

		files.forEach(function(file) {
			if (fs.statSync(path.join(dir, file)).isDirectory()) {
				filelist = self.walkSync(path.join(dir, file), filelist);
			}
			else {
				filelist.push(path.basename(file, '.png'));
			}
		});
		return filelist;
	}

}

module.exports = Manage
