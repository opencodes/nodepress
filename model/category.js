var table = 'category';
var Db = require('./model.js');
var util = require('util');

var category = {
    cat_by_id:function(ids,callback){
    var cat_id;
    var sub_query = '';
      if(ids && !util.isArray(ids)){
        if(util.isArray(ids)){
          cat_id = ids.join();
          sub_query = 'where id IN('+cat_id+')';
        }
        else{
          sub_query = 'where id ='+ ids;
        }
      }
      var sql = 'SELECT * FROM '+ table +' '+ sub_query;
      //console.log("Query:"+sql);
      Db.query(
          sql,
          function selectCb(err, results) {
            if (!err) {
              return callback(results, null); 
            }
            else{
              return callback(null, err); 
            }            
           }
       ); 
      },
      
      cat_by_post_id:function(post_id,callback){
    	 var sql = 'SELECT c.id as cat_id,c.cat_name,c.description,post.category_id FROM '+ table +' as c LEFT JOIN (SELECT id,category_id FROM post where post.id="'+ post_id +'") AS post ON c.id = post.category_id;';
    	 //if(post_id) sql +=' where post.id="'+post_id+'";';
    	  //console.log("Query:"+sql);
          Db.query(
              sql,
              function selectCb(err, results) {
                if (!err) {
                  return callback(err, results); 
                }
                else{
                  return callback(err, null); 
                }            
               }
           ); 
      }
 
   
};
module.exports = category;
