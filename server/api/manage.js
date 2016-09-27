"use strict"

class Manage{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}
		let Database = require("../database.js");
		this.db = new Database().getConnection();
  }

  handle(urlParts, data, respond){
    if(urlParts.length < 1){
      respond({error: "Unknown command"})
      return;
    }

    let self = this;
    let command = urlParts[0]

    switch(command){
      case "genthumbnails":

        break;
    }
  }

}

module.exports = Manage
