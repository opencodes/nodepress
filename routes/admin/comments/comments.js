"use strict";
var Comments = require('../../../model/comments'); 
var util = require('util');

var comment = {
    param: function (req, res, next) {
      var comment_id = null;
      if(req.params.commentid){
        req.commentid = req.params.commentid;  
        comment_id = req.commentid;
      }      
      comment.info(req, res, next,comment_id);
    },
    /*
     * info : Retrieve all the comment.
     * @param req
     * @param res
     * @param next
     */
    info:function(req, res,next,comment_id){
      var ids = comment_id;
      Comments.comment_by_id(ids,null,function(comments,err){
        if(!err){
          req.blogcomment = {};
          //util.log(util.inspect(comments));
          for(var index in comments){
            var comment_id = comments[index].id;            
            req.comment[comment_id] = comments[index];
          }
          //util.log(util.inspect(req.comment));
          next();
        }
        else{
          console.log('Error in fetching comments');
          next();
        }
      });
    },
    /*
     * info : Render all comment.
     * @param req
     * @param res
     * @param next
     */
    render_all:function(req, res){
      //util.log(util.inspect(req.blogcomment));
      res.render('comment/list.ejs', 
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
    /*
     * info : send json for datatable and other purpose
     * @param req request
     * @param res response
     */
    json_data:function(req,res){
      Comments.comment_by_id(null,null,function(comments,err){
        if(!err){
          //util.log(util.inspect(comments));

          var commentsjson = {
              "sEcho": 1,
              "iTotalRecords": comments.length,
              "iTotalDisplayRecords": "25",
              "aaData": comments
            }
          res.json(commentsjson);
        }
      })
    }
    
}
module.exports = comment;