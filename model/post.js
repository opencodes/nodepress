var table = 'post';
var Db = require('./model.js');
var util = require('util');

var blogpost = {
    post_by_id:function(ids,limit,callback){
    var post_id;
    var post_limit = Number(limit);
    var sub_query = '';
      if(ids && !util.isArray(ids)){
        if(util.isArray(ids)){
          post_id = ids.join();
          sub_query = 'where '+table+'.id IN('+post_id+')';
        }
        else{
          sub_query = 'where '+table+'.id ='+ ids;
        }
      }
      var sql = 'SELECT '+ table + '. *,user.nickname,category.cat_name  FROM '+ table; 
          sql += ' INNER JOIN category ON '+ table + '.category_id = category.id '; 
          sql += ' INNER JOIN user ON '+ table + '.posted_by = user.id ' + sub_query + ' ORDER BY '+ table + '.created_date';
      if(post_limit){
        sql += " LIMIT "+post_limit;
      }
      //util.log('Query:'+sql);
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
      /*
       * info post by cat id
       * @param 
       * 
       */
      post_by_cat_id:function(ids,limit,callback){
        var cat_id;
        var post_limit = Number(limit);
        var sub_query = '';
          if(ids && !util.isArray(ids)){
            if(util.isArray(ids)){
              cat_id = ids.join();
              sub_query = 'where '+table+'.category_id IN('+cat_id+')';
            }
            else{
              sub_query = 'where '+table+'.category_id ='+ ids;
            }
          }
          var sql = 'SELECT '+ table + '. *,user.nickname,category.cat_name  FROM '+ table; 
              sql += ' INNER JOIN category ON '+ table + '.category_id = category.id '; 
              sql += ' INNER JOIN user ON '+ table + '.posted_by = user.id ' + sub_query + ' ORDER BY '+ table + '.created_date';
          if(post_limit){
            sql += " LIMIT "+post_limit;
          }
          //util.log('Query:'+sql);
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
          }
      
   
};
module.exports = blogpost;
