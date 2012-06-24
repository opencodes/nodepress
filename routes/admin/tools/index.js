"use strict";
var util = require('util');
var tools = require('./tools');

var tool =  function(app) {
    //Tools Routes
	app.get('/tools/',tools.render);
    app.get('/tools/migrate',tools.migrate);   
    app.post('/tools/migrate',tools.wpmigrate,tools.importonode,tools.insertpost,tools.result);   
    
};
module.exports = tool;