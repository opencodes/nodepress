var table = 'comment';
var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');

var comment = {
    comment_by_id:function(ids,callback){
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
          subquery += values.join(',');
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
      },
      deleteComment:function(id,callback){
      	Query.remove(id,table,function(err,result){
    		if(!err){
    			callback(null,result);
    		}else{
    			console.log(err);
    			callback(null,err);
    		}
    	});
      }
      
   
};
module.exports = comment;
