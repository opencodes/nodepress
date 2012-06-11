"use strict";
var md5 = require('MD5');
var crypt = {
    createpassword:function(password){
      var salt = crypt.salt();
      return md5(password+salt)+":"+salt;
    },
    isvalidpass:function(inputpassword,dbpassword){
      var dbpass = dbpassword.split(':');
      var storedsalt = dbpass[1];
      if(md5(inputpassword+storedsalt) == dbpass[0]){
        return true;
      }
      return false;
    },
    salt:function() {
      var chars = "0123456789abcdefghiklmnopqrstuvwxyz";
      var string_length = 4;
      var randomstring = '';
      for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
      }

      return randomstring;
    }
};
module.exports = crypt;
//console.log(crypt.createpassword('admin123'));
