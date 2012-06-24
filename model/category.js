var table = 'category';
var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');

var category = {
    cat_by_id:function(ids,callback){
    	var filter = {'id':ids};
	    Query.select(filter,table,function(err,result){
			if(!err){
				callback(null,result);
			}else{
				console.log(err);
				callback(null,err);
			}
		});
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
      },
      save:function(data,callback){
    	  Query.update(data,table,'id',function(err,result){
      		if(!err){
      			callback(null,result);
      		}else{
      			console.log(err);
      			callback(null,err);
      		}
      	});
      },
      add:function(data,callback){
    	  Query.insert(data,table,function(err,result){
        		if(!err){
        			callback(null,result);
        		}else{
        			console.log(err);
        			callback(null,err);
        		}
        	});
        },
        deletecat:function(data,callback){
      	  Query.remove(data,table,function(err,result){
      		if(!err){
      			callback(null,result);
      		}else{
      			console.log(err);
      			callback(null,err);
      		}
      	});
      }
 
   
};
module.exports = category;
