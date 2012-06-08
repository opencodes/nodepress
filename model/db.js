"use strict";

var mysql = require('mysql');
var util = require('util');
var mySQLPool = require('generic-pool');

module.exports = function(config) {

  var pool = mySQLPool.Pool({
    name : config.db_pool,
    create : function(callback) {
      var db = new mysql.createConnection(config).on("error", function(error) {
        util.log("[MySql] " + error);
      });

      /*db.ping(function(err) {
        if (err) {
          util.log("[MySql] Error while connecting to mysql instance " + err + util.inspect(config));
        }
      });*/

      callback(null, db);
    },
    destroy : function(client) {
      client.end();
    },
    max : config.poolSize || 5,
    log : config.log || false
  });

  pool.query = function(sql, param, callback) {

    if (!callback && typeof (param) === 'function') {
      callback = param;
      param = [];
    }

    pool.acquire(function(err, dbConn) {
      if (err)
        util.log('[MySql] error in accquiring connection ' + err);
      dbConn.query(sql, param, function(err, objs) {
        if (err)
          util.log('[MySql] error in executing qeury ' + err);
        pool.release(dbConn);
        callback(err, objs);
      });
    });
  };

  pool.end = function(cb) {
    pool.drain(function() {
      pool.destroyAllNow(cb);
    });
  };

  return pool;
};

/* ----------------------------------------------------- */

if (require.main == module) {
  (function() {
    function logcb(err, res) {
      console.log(err || res);
    }
    var config = require('../config/config').db_options;
    var db = module.exports(config);

    //usage 1
    db.query('show tables;', logcb);

    //usage 2
    db.acquire(function(err, dbConn) {
      dbConn.query('show tables;', function(err, res) {
        db.release(dbConn);
        logcb(err, res);
      });
    });

  }());
}
