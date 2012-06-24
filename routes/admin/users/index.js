"use strict";
var util = require('util');
var users = require('./users');

module.exports = function(app) {
    //User Routes
    app.get('/users/',users.render_all);
    app.get('/users/all',users.json_data);
    app.get('/users/add',users.add);
    app.get('/users/edit/:userid',users.param,users.render);
    app.post('/users/save',users.save);
    app.post('/users/add',users.addusers);
    app.get('/users/delete/:postid',users.deleteusers);
};
