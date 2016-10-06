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
        let path = require("path")
        let fs = require("fs")
        let rootAppDir = path.dirname(require.main.filename);
        let thumbDir = path.join(rootAppDir, "thumbnails")

        fs.readFile(path.join(thumbDir, file.hash + ".png"), (err, data) => {
    		  if (err) throw err;
    		  respond(data, "image/png", true)
    		});
        break;

      case "download":
        //res.setHeader('Content-disposition', 'attachment; filename=dramaticpenguin.MOV');
        respond({error: "Not implemented"})
        break;

      default:
        respond({error: "Unknown command for file"})
    }
  }
}

module.exports = FileHandler
