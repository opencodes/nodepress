"use strict"
var mysql = require('mysql');
var util = require('util');
var config = require('../config/config').db_options;
var Db = require('./db')(config);

module.exports = Db;
