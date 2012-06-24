var table = 'post';
var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');

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
      	Query.custom(sql,function(err,result){
	  		if(!err){
	  			callback(null,result);
	  		}else{
	  			console.log(err);
	  			callback(null,err);
	  		}
	  	}); 
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
          },
          save:function(data,callback){
              var subquery = 'SET ';
              var values = [];
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
              var sql = 'UPDATE '+ table +' '+ subquery;
              Db.query(
                  sql,
                  function selectCb(err, results) {
                    if (!err) {
                      return callback(null, results); 
                    }
                    else{
                      return callback(err, null); 
                    }            
                   }
               ); 
            },
            addpost:function(data,callback){
            	Query.insert(data,table,function(err,result){
            		if(!err){
            			callback(null,result);
            		}else{
            			console.log(err);
            			callback(null,err);
            		}
            	});
            },
            deletePost:function(id,callback){
            	var sql = 'DELETE FROM  '+ table +' '+ ' where id="'+id+'";';
            	console.log(sql);
                Db.query(
                    sql,
                    function selectCb(err, results) {
                      if (!err) {
                        return callback(null, results); 
                      }
                      else{
                        return callback(err, null); 
                      }            
                     }
                 ); 
            }
      
   
};
module.exports = blogpost;
