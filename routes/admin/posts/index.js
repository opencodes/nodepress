"use strict";
var util = require('util');
var post = require('./posts');
var main = require('./../main');

var posts =  function(app) {
    //Posts Routes
    app.get('/posts/',post.param,post.render_all);
    app.get('/posts/all',post.json_data);
    app.get('/posts/edit/:postid',post.param,post.info,post.render);
    app.post('/posts/save',post.save)
};
module.exports = posts;