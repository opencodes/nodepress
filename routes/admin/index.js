"use strict";
var util = require('util');
var main = require('./main');
module.exports = function (app) {
  app.get('/', main.auth,function(req, res){
    res.render('index.ejs',         { title: 'Home Page' });
  });
  app.get('/login/', function(req, res){
    res.render('login.ejs',         { title: 'Login Page' });
  });
  app.get('/logout/', function(req, res){
    req.session.adminuser = null;
    res.redirect('/');
  });
  app.post('/login/',main.login);
  require('./posts')(app);  
  require('./category')(app);  

};



