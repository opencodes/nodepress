var User = require('./../../model/user'); 
var crypt = require('../../lib/crypt'); 

var util = require('util');

var main = {    
    /*
     * info : Login Admin System
     */
    auth:function(req,res,next){
      if(!req.session.adminuser && req.url!='/login/'){
        res.redirect('/login/');
      } else {
        next();
      } 
    },
    login:function(req,res){
      if(req.body.adminusername && req.body.adminusername.trim()!=''){
        var admin_user = req.body.adminusername.trim();
        if(req.body.adminpass && req.body.adminpass.trim()!=''){
          var admin_password = req.body.adminpass.trim();
          User.isAdminUser(admin_user,function(result,err){
            if(!err){
              console.log(result);
              if(crypt.isvalidpass(admin_password,result[0].password)){
              delete result[0].password;
              req.session.adminuser = result[0];
              console.log(req.session.adminuser);
              res.redirect('/');
              }
            }
          });
        }
      }
    }
    
};

module.exports = main;
