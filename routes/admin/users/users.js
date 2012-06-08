"use strict";
var User = require('../../../model/user'); 
var util = require('util');
var moment = require('moment');
var ututils = require('../../../lib/ututils');
var datatable = require('../../../model/datatable');

var user = {
    param: function (req, res, next) {
      var user_id = null;
      if(req.params.userid){
        req.userid = req.params.userid;  
        user_id = req.userid;
      }      
      user.info(req, res, next,user_id);
    },
    /*
     * info : Retrieve all the user.
     * @param req
     * @param res
     * @param next
     */
    info:function(req, res,next,user_id){
      var ids = user_id;
      User.user_by_id(ids,null,function(users,err){
        if(!err){
          req.bloguser = {};
          //util.log(util.inspect(users));
          for(var index in users){
            var user_id = users[index].id;            
            req.user[user_id] = users[index];
          }
          //util.log(util.inspect(req.user));
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
      //util.log(util.inspect(req.bloguser));
      res.render('user/list.ejs', 
          { title: 'My Blog Page',
           });
    },
    save:function(req,res){
      var body =req.body;
      //console.log(req.body);
      var data = {id:null,
                  name:body.name,
                  email:body.email,
                  website:body.website,
                  user:body.user,
                  post_id:body.post_id,
                  posted_by:body.posted_by
                  };
      Comments.save(data,function(result,err){
        if(!err){
          console.log(result);
          res.json({'msg':'Comment posted successfully;'});
        }
      });
    },
    bypost:function(req,res,next){
      var post_id = req.postid;
      Comments.user_by_postid(post_id,function(users,err){
        //console.log(users);
        if(!err){
          req.blogpost[post_id].user = users;
          next();
        }
        else{
          console.log('Error in fetching users');
          next();
        }
      });
    },
    /*
     * info : send json for datatable and other purpose
     * @param req request
     * @param res response
     */
    /**
     * Route Middleware: Fetch all sliders for datatable
     *
     **/
    all: function (req, res, next) {
      var columns = req.query.sColumns;
      var searchColumns = ['\'abc\'', '`id`', '`email_id`', '`first_name`', '`last_name`', '`nickname`', '`type`',];
      var sortColumns = columns.split(',');
      var processedSql = datatable.processReqParams(req.query, searchColumns, sortColumns);
      Slider.select(processedSql, {
        'countRows': true,
        'colomns': sortColumns
      }, function (err, rows, count) {
        req.sliders = {
          data: rows,
          total: count
        };
        next(err);
      });
    },
    /**
     * Send back slider list to user
     *
     **/
    list: function (req, res) {
      var dataArray = datatable.format({
        'echo': req.query.sEcho,
        'dateFormat': 'YYYY-MM-DD h:mm:ss a'
      }, req.sliders.total, req.sliders.data);
      var i = 0;
      for (i; i < dataArray.aaData.length; i++) {
        dataArray.aaData[i][0] = '<input type="checkbox" class="sliderClass" name="sliderId[]" value="' + dataArray.aaData[i][1] + '"/>';
      }

      res.json(dataArray, {
        layout: false
      });
    },
    
}
module.exports = user;