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
      }
      
   
};
module.exports = category;
