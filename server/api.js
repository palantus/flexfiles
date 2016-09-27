"use strict"

var ManageAPI = require('./api/manage.js')
var SearchAPI = require('./api/search.js')
var SourceAPI = require('./api/source.js')
var FileAPI = require('./api/file.js')

class API{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}
    this.apis = {
      "manage": new ManageAPI(this),
      "search": new SearchAPI(this),
      "source": new SourceAPI(this),
      "file": new FileAPI(this)
    }
  }

  handleCall(urlParts, data){
    var area = urlParts[0]
    var subArea = urlParts.slice(1)
    var apiObj = null;

    if(this.apis[area] !== undefined){
      //console.log("API: " + area)
      this.apis[area].respond = this.respond
      this.apis[area].handle(subArea, data)
    } else {
      this.respond()
    }
  }
}

module.exports = API
