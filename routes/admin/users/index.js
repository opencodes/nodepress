"use strict";
var util = require('util');
var users = require('./users');
var main = require('./../main');

module.exports = function(app) {
    //User Routes
    app.get('/users/',users.render_all);
    app.get('/users/all',users.json_data);
    app.get('/users/:commentid',users.render_view);
    app.post('/users/',users.save);  
};
