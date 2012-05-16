"use strict";
var Comments = require('../../model/comments'); 
var util = require('util');

var comment = {
    
    save:function(req,res){
      var body =req.body;
      //console.log(req.body);
      var data = {id:null,
                  name:body.name,
                  email:body.email,
                  website:body.website,
                  comment:body.comment,
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
      Comments.comment_by_postid(post_id,function(comments,err){
        //console.log(comments);
        if(!err){
          req.blogpost[post_id].comment = comments;
          next();
        }
        else{
          console.log('Error in fetching comments');
          next();
        }
      });
    },
    
}
module.exports = comment;