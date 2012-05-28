"use strict";
var util = require('util');
var main = require('./../main');
var user = require('./user');

module.exports = function(app) {
    //Posts Routes
    app.post('/user/login', main.cats,main.recentpost,main.recentcomment,user.login);
    app.get('/user/myaccount/',main.cats,main.recentpost,main.recentcomment,user.render);
    app.get('/user/logout/',user.logout);
    app.get('/user/register/',main.cats,main.recentpost,main.recentcomment,user.registerform);
    app.post('/user/register/',main.cats,main.recentpost,main.recentcomment,user.register);

};
/*
 * - Saving User Password
 * 1. Fetch User password
 * 2. Generate salt just 2 char 
 * 3. Append userpassword with salt and md5
 * 4. Append md5:salt and save
 * - Validating User
 * 1. Fetch input password
 * 2. Detach salt from password saved for that user
 * 3. if inputpass+salt md5 = detached md5 
 * 4. process login user is valid.
 * 
 */