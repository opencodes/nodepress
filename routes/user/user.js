"use strict";

var util = require('util');
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
    register:function(req,res){
      var postdata = req.body;
      var data = {};
      data.first_name = (postdata.first_name.trim()!='')?postdata.first_name.trim():null;
      data.last_name = (postdata.last_name.trim()!='')?postdata.last_name.trim():null;
      data.nickname = (postdata.nickname.trim()!='')?postdata.nickname.trim():null;
      data.email_id = (postdata.email_id.trim()!='')?postdata.email_id.trim():null;
      data.password = (postdata.password.trim()!='')?crypt.createpassword(postdata.password.trim()):null;
      
      User.save(data,function(result,err){
        if(!err){
          User.by_username(data.email_id.trim(),function(result,err){
          req.session.user = result[0]; 
          res.redirect('/user/myaccount/');
          });
        }
      });
    },
    registerform:function(req,res){
    //util.log(util.inspect(req.session.user));
      res.render('user/register.ejs',{
          user:req.user,
          categories:req.cats,
          recentposts:req.recentposts,
          recentcomments:req.recentcomments
        }
      );
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