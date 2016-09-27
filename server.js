var bodyParser = require('body-parser')
var API = require('./server/api.js')
let api = new API();

var router = function(req, res){
  var data = req.body;
  if(data === undefined || (Object.keys(data).length === 0 && data.constructor === Object))
    data = req.query;

  var command = req.baseUrl.substring(5).toLowerCase() //anything after /api/
  if(command === undefined || command == ""){
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({error: "Invalid request!", path: req.path}));
    return;
  }

  var parts = command.split("/");

  var respond = function(result, contentType, isBinary){
    if(result !== null && result !== undefined){
      if(contentType === undefined)
        res.writeHead(200, {'Content-Type':'application/json'});
      else
        res.writeHead(200, {'Content-Type': contentType});

      if(typeof result == "string")
        res.end(result);
      else if(typeof result == "object" && isBinary)
        res.end(result, 'binary')
      else
        res.end(JSON.stringify(result));
    } else {
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({error: "Unknown request type: " + command, data: data, baseUrl: req.baseUrl}));
    }
  }

  api.handleCall(parts, data, respond)
}

var express = require('express')
   , http = require('http')
   , path = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(/\/api\/.+/, router);
app.use(express.static(path.join(__dirname, 'www')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
})
