"use strict"

class Manage{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}
  }

  handle(urlParts, data){
    if(urlParts.length < 1){
      this.respond({error: "Unknown command"})
      return;
    }

    var subArea = urlParts[0]
    
    this.respond({"ismanage": true})
  }

  refreshFilesInSource(){

  }

  updateFilesMetadata(){

  }

}

module.exports = Manage
