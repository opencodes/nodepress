"use strict";
var npModelUser = require('../../../model/user'); 
var util = require('util');
var users = {
    param: function (req, res, next) {
      var user_id = null;
      if(req.params.userid){
        req.userid = req.params.userid;  
        user_id = req.userid;
      }    
      users.info(req, res, next,user_id);
    },
    /*
     * info : Retrieve all the user.
     * @param req
     * @param res
     * @param next
     */
    info:function(req, res,next,user_id){
      var ids = user_id;
      npModelUser.userbyid(ids,function(err,users){
        if(!err){
          req.bloguser = {};
          for(var index in users){
            var user_id = users[index].id;            
            req.bloguser[user_id] = users[index];
          }
          next();
        }
        else{
          console.log('Error in fetching users');
          next();
        }
      });
    },
    /*
     * info : Render all user.
     * @param req
     * @param res
     * @param next
     */
    render_all:function(req, res){
      var bloguser = req.bloguser;
      //util.log(util.inspect(req.bloguser));
      res.render('users/list.ejs', 
          { title: 'My Blog Page'});
    },
    /*
     * info : Render all user.
     * @param req
     * @param res
     * @param next
     */
    render:function(req, res){
      var bloguser = req.bloguser[req.userid];
      req.session.userid=req.userid;
      res.render('users/view.ejs', 
          { title: 'My Blog Page',
            'bloguser':bloguser            
            });
    },
    /*
     * info : send json for datatable and other purpose
     * @param req request
     * @param res response
     */
    json_data:function(req,res){
    	npModelUser.all(null,function(err,users){
        if(!err){
          //util.log(util.inspect(users));          
          var userjson = {
              "sEcho": 1,
              "iTotalRecords": "57",
              "iTotalDisplayRecords": "57",
              "aaData": users
            };
          res.json(userjson);
        }
      });      
    },
    /*
     * info : save user
     * @param req request
     * @param res response
     */
    save:function(req,res){
    	var userid = (req.body.user_id)?req.body.user_id:null;
    	var data = {
    		category_id:req.body.category,
    		id:userid,
    		title:req.body.title,
    		content:req.body.content,
    		usered_by:req.session.adminuser.id
    	};
    	npModelUser.save(data,function(err,result){
    		if(!err){
    			console.log('user save successfully');
    			res.redirect('/users/');
    		}
    	});
    },
    /*
     * info : delete user
     * @param req request
     * @param res response
     */
    deleteuser:function(req,res){    	
    	var user_id = req.params.userid;
    	if(user_id){
    		npModelUser.deleteuser(user_id,function(err,result){
        		if(!err){
        			console.log('user deleted successfully');
        			res.redirect('/users/');
        		}
        	});
    	}
    	else{
    		res.redirect('/users/')
    	}
    	
    },
    /*
     * info : delete user
     * @param req request
     * @param res response
     */
    add:function(req,res){
    	res.render('user/add.ejs', 
    	          { title: 'My Blog Page'
    	            
    	});
    },
    /*
     * info : save user
     * @param req request
     * @param res response
     */
    adduser:function(req,res){
    	var data = {
    		category_id:req.body.category,
    		title:req.body.title,
    		content:req.body.content,
    		usered_by:req.session.adminuser.id
    	};
    	util.log(data);
    	npModeluser.adduser(data,function(err,result){
    		if(!err){
    			console.log('user save successfully');
    			res.redirect('/users/');
    		}
    		else{console.log(err);}
    	});
    }
     
     
    
    
};
module.exports = users;
