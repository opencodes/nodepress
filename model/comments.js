var table = 'comment';
var Db = require('./model.js');
var util = require('util');

var comment = {
    comment_by_id:function(ids,limit,callback){
    var req_id;
    var sub_query = '';
      if(ids && !util.isArray(ids)){
        if(util.isArray(ids)){
          req_id = ids.join();
          sub_query = 'where id IN('+req_id+')';
        }
        else{
          sub_query = 'where id ='+ ids;
        }
      }
      
      var sql = 'SELECT * FROM '+ table +' '+ sub_query +' ORDER BY comment_date';
      if(Number(limit)){
        sql += " LIMIT "+limit;
      }
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
      comment_by_postid:function(ids,callback){
        var req_id;
        var sub_query = '';
          if(ids && !util.isArray(ids)){
            if(util.isArray(ids)){
              req_id = ids.join();
              sub_query = 'where post_id IN('+req_id+')';
            }
            else{
              sub_query = 'where post_id ='+ ids;
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
      save:function(data,callback){
        var subquery = 'SET ';
        var values = [];
        console.log(typeof(data));
        if(data && typeof(data) ==  "object"){
          for(var index in data){
            if(index!='id')
            values.push(index +"='"+data[index]+"' ");
          }
          subquery += values.join(',')
          if(data.id && data.id!=''){
            subquery+=" where id='"+Number(data.id)+"'";
          }          
        }        
        var sql = 'INSERT INTO '+ table +' '+ subquery;
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
      }
      
   
};
module.exports = comment;
