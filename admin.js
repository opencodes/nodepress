var express = require('express');
var app     = express.createServer();
var config = require('./config/admin');
var util = require('util');


app.configure(function(){
  app.use(express.static(__dirname + '/public/admin'));
  require('./lib/admin')(app);   // view settings
  app.set('views', __dirname + '/views/admin');
  var RedisStore = require('connect-redis')(express);
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "asd43g84webe88d38", store: new RedisStore }));
});

require('./routes/admin')(app);
console.log("Server listening on port " + config.port );

app.listen(config.port);
