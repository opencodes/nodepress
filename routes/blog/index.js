"use strict";
var util = require('util');
var post = require('./post');
var cat  = require('./category');
var comment  = require('./comments');
var main = require('./../main');

module.exports = function(app) {
    //Posts Routes
    app.get('/blog', main.cats,main.recentpost,main.recentcomment,post.param,post.render_all);
    app.get('/blog/post/:postid', post.param,main.cats,main.recentpost,main.recentcomment,comment.bypost,post.render_view);
    app.post('/blog/post/',comment.save);
    //Category Routes
    app.get('/blog/cat',cat.param,main.cats,main.recentpost,main.recentcomment,cat.render_all);
    app.get('/blog/cat/:catid',cat.param,main.cats,main.recentpost,main.recentcomment,cat.posts,cat.render_view);   
};
