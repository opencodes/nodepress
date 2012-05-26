"use strict";

var util = require('util');
var md5 = require('MD5');
var crypt = require('../../lib/crypt'); 
var User = require('../../model/user');

var user = {    
    login:function(req,res){
    var username = (req.body.username.trim()!='')?req.body.username.trim():null;
    var userpass = (req.body.userpass.trim()!='')?req.body.userpass.trim():null;
      if(username && userpass){
        User.by_username(username.trim(),function(result,err){
          if(!err){
            if(crypt.isvalidpass(userpass,result[0].password)){
              delete result[0]['password'];
              delete result[0]['created_date'];
              req.session.user = result[0]; 
              res.redirect('/user/myaccount/');
            }            
          }
        });
      }
      else{
        res.redirect('home');
      }
    },
    authenticate:function(req,res,next,username,userpass){
      res.redirect('home');
    },
    logout:function(req,res){
      req.session.user = null; 
      res.redirect('home');
    },
    render:function(req,res){
      //util.log(util.inspect(req.session.user));
      res.render('user/myaccount.ejs',{
          user:req.user,
          categories:req.cats,
          recentposts:req.recentposts,
          recentcomments:req.recentcomments
        }
      );
    }
};
module.exports = user;