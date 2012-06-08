"use strict";
var npModelPost = require('../../../model/post'); 
var util = require('util');
var post = {
    param: function (req, res, next) {
      var post_id = null;
      if(req.params.postid){
        req.postid = req.params.postid;  
        post_id = req.postid;
      }      
      post.info(req, res, next,post_id);
    },
    /*
     * info : Retrieve all the post.
     * @param req
     * @param res
     * @param next
     */
    info:function(req, res,next,post_id){
      var ids = post_id;
      npModelPost.post_by_id(ids,null,function(posts,err){
        if(!err){
          req.blogpost = {};
          //util.log(util.inspect(posts));
          for(var index in posts){
            var post_id = posts[index].id;            
            req.blogpost[post_id] = posts[index];
          }
          //util.log(util.inspect(req.blogpost));
          next();
        }
        else{
          console.log('Error in fetching posts');
          next();
        }
      });
    },
    /*
     * info : Render all post.
     * @param req
     * @param res
     * @param next
     */
    render_all:function(req, res){
      var blogpost = req.blogpost;
      //util.log(util.inspect(req.blogpost));
      res.render('post/list.ejs', 
          { title: 'My Blog Page'});
    },
    /*
     * info : Render all post.
     * @param req
     * @param res
     * @param next
     */
    render:function(req, res){
      var blogpost = req.blogpost[req.postid];
      //util.log(util.inspect(blogpost));
      console.log('Render Post Id '+req.postid);
      res.render('post/view.ejs', 
          { title: 'My Blog Page',
            'blogpost':blogpost
            });
    },
    /*
     * info : send json for datatable and other purpose
     * @param req request
     * @param res response
     */
    json_data:function(req,res){
      npModelPost.post_by_id(null,null,function(posts,err){
        if(!err){
          //util.log(util.inspect(posts));          
          var postjson = {
              "sEcho": 1,
              "iTotalRecords": "57",
              "iTotalDisplayRecords": "57",
              "aaData": posts
            }
          res.json(postjson);
        }
      });
      

      
      
    }
    
    
};
module.exports = post;
