"use strict";
var util = require('util');
var comments = require('./comments');
var main = require('./../main');

module.exports = function(app) {
    //Comments Routes
    app.get('/comments/',comments.render_all);
    app.get('/comments/all',comments.json_data);
    app.get('/comments/delete/:commentid',comments.del);
 
};
