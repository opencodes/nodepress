"use strict";
var util = require('util');
var cat = require('./category');
var main = require('./../main');

var category = function(app) {
	//Category Routes
    app.get('/category/',cat.render_all);
    app.get('/category/all',cat.json_data);
    app.get('/category/add',cat.add);
    app.get('/category/edit/:catid',cat.param,cat.info,cat.render);
    app.post('/category/save',cat.save);
    app.post('/category/add',cat.addcat);
    app.get('/category/delete/:catid',cat.deletecat);
    
    

};
module.exports = category;