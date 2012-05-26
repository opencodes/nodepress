var table = 'user';
var Db = require('./model.js');
var util = require('util');


var User = {
    by_username:function(email_id,callback){
    var sub_query = '';
      if(email_id && !util.isArray(email_id)){
        if(util.isArray(email_id)){
          email_id = email_id.join();
          sub_query = ' where '+table+'.email_id IN('+email_id+')';
        }
        else{
          sub_query = ' where '+table+'.email_id ="'+ email_id+'"';
        }
      }
      var sql = 'SELECT  *  FROM '+ table   + sub_query  ; 

      util.log('Query:'+sql);
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
module.exports = User;



