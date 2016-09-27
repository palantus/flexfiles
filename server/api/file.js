"use strict"

class FileHandler{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}
		let Database = require("../database.js");
		this.db = new Database().getConnection();
  }

  handle(urlParts, data){
    var self = this;
    var fileHash = urlParts[0]
    var command = urlParts.length > 1 ? urlParts[1] : "metadata"

    switch(command){
      case "metadata" :
        self.db.query('SELECT * FROM files LEFT JOIN files_images on files.hash = files_images.hash WHERE files.hash = ?', [fileHash], function(err, rows){
          if(err) console.log(err)
          self.respond(rows.length > 0 ? rows[0] : {error: "Unknown file"})
        })
        break;
        
      default:
        self.respond({error: "Unknown command for file"})
    }
  }
}

module.exports = FileHandler
