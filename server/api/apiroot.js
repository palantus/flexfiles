"use strict"

class APIRoot{
  constructor(){
    this.respond = function(){console.log("ERROR: API.respond not set before use!" )}
		let Database = require("../database.js");
		this.db = new Database().getConnection();
  }

  getFile(hash, cb){
    this.db.query('SELECT files.hash, files.size, files.extension, files.title, files.description, files.type, files.metadataupdated \
                        , files_images.width, files_images.height, files_images.phash\
                        , sourcefiles.path, sourcefiles.filename, sources.id AS sourceid, sources.type as sourcetype, sources.config as sourceconfig, sources.name as sourcename\
                   FROM files \
                   LEFT JOIN files_images on files.hash = files_images.hash \
                   LEFT JOIN sourcefiles ON sourcefiles.id = (SELECT id FROM sourcefiles WHERE sourcefiles.hash = files.hash LIMIT 1)\
                   LEFT JOIN sources ON sources.id = sourcefiles.sourceid\
                   WHERE files.hash = ?', [hash], function(err, rows){
      if(err) console.log(err)
      if(rows.length > 0)
        cb(rows[0])
      else
        cb(null)
    })
  }
}

module.exports = APIRoot;
