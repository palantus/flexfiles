"use strict"

class SearchHandler{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}
		let Database = require("../database.js");
		this.db = new Database().getConnection();
  }

  handle(urlParts, data){
    var self = this;
    var command = urlParts[0]
    switch(command){
      case "all" :
        self.db.query('SELECT hash, title, type FROM files', function(err, rows){
          if(err) console.log(err)
          self.respond(rows)
        })
        break;
      case "allfull" :
        self.db.query('SELECT * FROM files LEFT JOIN files_images on files.hash = files_images.hash', function(err, rows){
          if(err) console.log(err)
          self.respond(rows)
        })
        break;
      default:
        self.respond({error: "Unknown command for search"})
    }
  }
}

module.exports = SearchHandler
