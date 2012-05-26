"use strict";

var config = require('../config/config');

module.exports = function(app) {

  var options = {
    'environment' : app.settings.env,
    'layout'      : 'layout/index.ejs',
    'style'       : 'container',
    'redir'       : '',
    'title'       : 'Blogging Site',
    'meta'        : {
      'description' : 'Blog',
      'keywords'    : 'Blog'
    },
    'css'        : [],
    'js'         : [],
    'categories' : undefined,
    'canonical_url': undefined,
    'headerscript' : 'layout/analytics',
    'searchTerm'   : ''

  };

  app.set("view engine","ejs");
  app.set("view options",options);

  app.helpers(require('./helpers'));
  app.dynamicHelpers(require('./helpers/dynamic'));

};