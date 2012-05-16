"use strict"
var mysql = require('mysql');
var config = require('../config/config');
var util = require('util');

var TEST_DATABASE = config.db_options.database;


var Db = mysql.createConnection({
  user: config.db_options.user,
  password: config.db_options.password
});
Db.query('USE '+TEST_DATABASE);

module.exports = Db;
/*
 *  1. createClient method renamed to createConnection
 */