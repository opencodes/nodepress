var category = require('./../model/category');
var Blogpost = require('./../model/post'); 
var Comments = require('./../model/comments'); 

var util = require('util');

var main = {
    /*
     * Fetch Categories
     */
    cats:function(req,res,next){
      category.cat_by_id(null,function(cats,err){
        if(!err){
          req.cats =  cats;        
        }
        else{
          req.cats =  null;        
        }
        next();
      });
    },
    /*
     * info : fetch recent post
     * @param req
     * @param res
     * @param next
     */
    recentpost:function(req,res,next){
      Blogpost.post_by_id(null,5,function(posts,err){
        if(!err){
          req.recentposts = {};
          //util.log(util.inspect(posts));
          for(var index in posts){
            var post_id = posts[index].id;            
            req.recentposts[post_id] = {id:posts[index].id,title:posts[index].title};
          }
          //util.log(util.inspect(req.recentposts));
          next();
        }
        else{
          console.log('Error in fetching recent posts');
          next();
        }
      });
    },
    recentcomment:function(req,res,next){
      Comments.comment_by_id(null,5,function(comments,err){
        //console.log(comments);
        if(!err){
          req.recentcomments = {};
          //util.log(util.inspect(posts));
          for(var index in comments){
            var comment_id = comments[index].id;            
            req.recentcomments[comment_id] = comments[index];
          }
          next();
        }
        else{
          console.log('Error in fetching recent comments');
          next();
        }
      });
    },
};

module.exports = main;