"use strict"

var SourceMaster = require('../sourcehandlers/master.js')
var APIRoot = require('./apiroot.js')

class FileHandler extends APIRoot{

  handle(urlParts, data, respond){
    var self = this;
    var fileHash = urlParts[0]

    this.getFile(fileHash, function(file){
      if(file != null)
        self.handleFile(file, urlParts.slice(1), data, respond)
      else
        respond({error: "Unknown file"})
    })
  }

  handleFile(file, urlParts, data, respond){
    var self = this;

    var command = urlParts.length > 0 ? urlParts[0] : "metadata"

    switch(command){
      case "metadata" :
      case "meta" :
        respond(file)
        break;

      case "view":
        var source = SourceMaster.construct(file)
        source.getFileContent(file, function(content){
            respond(content, "image/jpeg", true)
        })
        break;

      case "thumb":
        respond({error: "Not implemented"})
        break;

      case "download":
        //res.setHeader('Content-disposition', 'attachment; filename=dramaticpenguin.MOV');
        respond({error: "Not implemented"})
        break;

      default:
        respond({error: "Unknown command for file"})
    }
  }

  getFileSource(hash, cb){
    var self = this

    this.db.query('SELECT * from sources join sourcefiles on sources.id = sourcefiles.sourceid where sourcefiles.hash = ?', hash, function(err, rows, fields) {
			if (err) throw err;

			if(rows.length > 0){
				var source = SourceMaster.construct(rows[0])
        cb(source, rows[0])
			} else {
				console.log("ERROR: No source for file: " + hash);
			}
		});
  }
}

module.exports = FileHandler
