"use strict"

var SourceMaster = require('../sourcehandlers/master.js')
var constants = require('../constants.json')

class SourceHandler{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}

		let Database = require("../database.js");
		this.db = new Database().getConnection();
  }

  handle(urlParts, data){
    if(urlParts.length < 2){
      this.respond({error: "Unknown command"})
      return;
    }
    let self = this;
    var sourceId = urlParts[0]
    var command = urlParts[1]

    this.getSource(sourceId, function(source){
      switch(command){
        case "all":
          self.db.query('SELECT * FROM sourcefiles WHERE sourceid = ?', [sourceId], function(err, rows){
            self.respond(rows)
          })
          break;

        case "sync":
          console.log("Synchronizing source " + sourceId)
          source.getFileList(function(fileList){
            console.log("Found " + fileList.length + " files")
            fileList.forEach(function(file) {
        			self.db.query('INSERT INTO sourcefiles(sourceid, path, filename, hash) '
        						+ 'SELECT * FROM (SELECT ? f1, ? f2, ? f3, ? f4) as tmp '
        						+ 'WHERE NOT EXISTS (SELECT id FROM sourcefiles WHERE path = ? AND filename = ? AND sourceid = ?)',
        						[sourceId, file.path, file.filename, file.hash, file.path, file.filename, sourceId]);
        			self.db.query('INSERT INTO files(hash, size, extension, title, type) '
        						+ 'SELECT * FROM (SELECT ? f1, ? f2, ? f3, ? f4, ? f5) as tmp '
        						+ 'WHERE NOT EXISTS (SELECT hash FROM files WHERE hash = ?)',
        						[file.hash, file.size, file.extension, file.filename, file.type, file.hash]);
        		})

            self.respond({success: true, message: "Synchronization finished"})
          })
          break;

        case "fillmetadata":
          //TODO: need to get image properties here as well - otherwise I can't check if anything is missing (or has been updated)!
          self.db.query('SELECT * FROM files join sourcefiles on sourcefiles.id = (SELECT id FROM sourcefiles WHERE hash = files.hash limit 1) WHERE metadataupdated = 0', function(err, rows){
            console.log("Updating metadata on " + rows.length + " files...")
            rows.forEach(function(file) {
              source.fillMissingMetadata(file, function(file){
                //TODO: Check if anything has been modified. If not, don't run query!

                if(constants.fileTypes[file.type] == "image"){
                  self.db.query('INSERT INTO files_images(hash, width, height, phash) '
            						      + 'VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE width=?, height=?, phash=?',
            						[file.hash, file.meta.image.width, file.meta.image.height, file.meta.image.phash,
                                    file.meta.image.width, file.meta.image.height, file.meta.image.phash]);
                }

                self.db.query('UPDATE files SET metadataupdated = 1 WHERE hash = ?', [file.hash]);
              })
            })
            self.respond({success: true, message: "Metadata filled"})
          })
          break;
        case "rereadmetadata":
          //TODO: implement
          break;

        default:
          self.respond({error: "Unknown command for source"})
      }
    })
  }

  getSource(sourceId, cb){
    var self = this

    this.db.query('SELECT * from sources where id = ?', sourceId, function(err, rows, fields) {
			if (err) throw err;

			if(rows.length > 0){
				var source = SourceMaster.construct(rows[0])
        cb(source)
			} else {
				console.log("ERROR: Unknown source id: " + sourceId);
			}
		});
  }

  refreshFilesInSource(){

  }

  updateFilesMetadata(){

  }

}

module.exports = SourceHandler
