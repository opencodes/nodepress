"use strict";
var Blogcat = require('../../model/category'); 
var Blogpost = require('../../model/post'); 
var util = require('util');
var category = {
    param: function (req, res, next) {
      var cat_id = null;
      if(req.params.catid){
        cat_id = req.params.catid;   
        req.catid = cat_id;
      }        
      category.info(req, res, next,cat_id);
    },
    /*
     * info : Retrieve all the category.
     * @param req
     * @param res
     * @param next
     */
    info:function(req, res,next,cat_id){
      var ids = cat_id;
      Blogcat.cat_by_id(ids,function(cats,err){
        if(!err){
          req.blogcat = cats;
          next();
        }
        else{
          console.log('Error in fetching categoris');
          next();
        }
      });
    },
    posts:function(req,res,next){
      var ids =req.catid;
      Blogpost.post_by_cat_id(ids,null,function(posts,err){
        if(!err){
          req.blogpost = {};
          //util.log(util.inspect(posts));
          for(var index in posts){
            var post_id = posts[index].id;            
            req.blogpost[post_id] = posts[index];
          }
          next();
        }
        else{
          console.log('Error in fetching post  by category');
          next();
        }
      });
    },
    /*
     * info : Render all cat.
     * @param req
     * @param res
     * @param next
     */
    render_all:function(req, res){
      var blogcat = req.blogcat;
      res.render('blog/category/list.ejs', { 
        title: 'My Blog Page',
        'blogcat':blogcat,
        categories:req.cats,
        recentposts:req.recentposts,
        recentcomments:req.recentcomments});
    },
    /*
     * info : Render all cat.
     * @param req
     * @param res
     * @param next
     */
    render_view:function(req, res){
      var blogcat = req.blogcat[0];
      //util.log(util.inspect(req.blogpost));
      console.log('Render cat Id '+req.blogcat[0].id);
      res.render('blog/category/view.ejs', { 
        title: 'My Blog Page',
        'blogcat':blogcat,
        'blogpost':req.blogpost,
        categories:req.cats,
        recentposts:req.recentposts,
        recentcomments:req.recentcomments});
    },
    /*
     * info : send json of all cat.
     * @param req
     * @param res
     * @param next
     */
    json:function(cat_id){
      Blogcat.cat_by_id(cat_id,function(cats,err){
        if(!err){
          return cats;
        }
        else{
          console.log('Error in fetching all cat ');
          return null;
        }
      });
      console.log('Json Sent cat Id ');
    }
    
};
module.exports = category;
