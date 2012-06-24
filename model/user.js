var table = 'user';
var Db = require('./model.js');
var util = require('util');
var Query = require('./sql');


var User = {
    isAdminUser:function(email_id,callback){
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
    var sql = 'SELECT  *  FROM '+ table   + sub_query + " AND `user_type`='admin'" ; 
  
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
      },
      all:function(filters,callback){
    	  Query.select(null,table,function(err,result){
    		  if(!err){
    			  callback(null,result);
    		  }else{
    			  callback(err,null);
    		  }
    		  
    	  })
      },
      userbyid:function(id,callback){
    	  var filters = {'id':id};
    	  Query.select(filters,table,function(err,result){
    		  if(!err){
    			  callback(null,result);
    		  }else{
    			  callback(err,null);
    		  }
    		  
    	  })
      }
      
   
};
module.exports = User;



