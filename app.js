var express = require('express');
var app     = express.createServer();
var config = require('./config/config');
var util = require('util');


app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  require('./lib/view')(app);   // view settings
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
});

require('./routes')(app);
console.log("Server listening on port " + config.port );

app.listen(config.port);
