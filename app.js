var express = require('express');
var app     = express.createServer();
var config = require('./config/config');
var util = require('util');

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  require('./lib/view')(app);   // view settings
  app.set('views', __dirname + '/views');
  var RedisStore = require('connect-redis')(express);
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "3432423YTTU", store: new RedisStore }));
});

require('./routes')(app);
console.log("Server listening on port " + config.port+" url : "+config.host+":"+config.port );

app.listen(config.port);
