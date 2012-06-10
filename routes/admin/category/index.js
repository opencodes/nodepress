"use strict";
var util = require('util');
var cat = require('./category');
var main = require('./../main');

var category = function(app) {
	//Category Routes
    app.get('/category/',cat.param,main.cats,main.recentpost,main.recentcomment,cat.render_all);
    app.get('/blog/cat/:catid',cat.param,main.cats,main.recentpost,main.recentcomment,cat.posts,cat.render_view);  
    app.get('/category/list/:postid',cat.json);
};
module.exports = category;