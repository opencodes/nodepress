"use strict";
var util = require('util');
var posts = require('./posts');
var main = require('./../main');

module.exports = function(app) {
    //Posts Routes
    app.get('/posts/',posts.param,posts.render_all);
    app.get('/posts/all',posts.json_data);
    app.get('/posts/:postid',posts.render_view);
    app.post('/post/',posts.save);  
};
