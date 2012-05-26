"use strict";
var util = require('util');
var main = require('./main');
module.exports = function (app) {
  app.get('/', function(req, res){
    res.render('index.ejs', 
        { title: 'Home Page',
          categories:req.cats,
          recentposts:req.recentposts,
          recentcomments:req.recentcomments});
  });
  app.get('/login',main.login);
  app.post('/login', user.login, cmw.load, cmw.validate, cmw.save, user.redirect);
  require('./blog')(app);  
};



