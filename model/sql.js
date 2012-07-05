var util = require('util');
var Db = require('./model.js');

var Query = {
		/**
		 * info : prepare insert query and execute
		 * @param data in column value pair
		 * @param table name
		 */
		select:function(filters,table,callback){
			var subquery = [];
			if(filters){
				for(index in filters){
					if(util.isArray(filters[index])){
						subquery.push(' `'+index+'` IN('+filters[index].join(',')+') ');
					}else{
						if(filters[index] && filters[index]!=''){
							subquery.push("`"+index+"` = '"+filters[index]+"'");
						}
					}
					
				}
			}
			sql = "SELECT * FROM "+table;
			if(subquery.length>=1){
				sql+=" WHERE " + subquery.join(' and ')+";";
			}
			//console.log(sql);
        	if(sql!=''){
        		Query.processquery(sql,callback);        		
        	}
		},
		/**
		 * info : prepare insert query and execute
		 * @param data in column value pair
		 * @param table name
		 */
		insert:function(data,table,callback){
			if(!data) callback('Data not available to prepare query',null);
			var sql = '';
        	var column=[];
        	var values = [];        	
        	for(index in data){
        		column.push("`"+index+"`");
        		values.push("'"+data[index]+"'");
        	}
        	sql = "INSERT INTO "+table+" ( "+column.join(",")+") values("+values.join(",")+");";
        	if(sql!=''){
        		Query.processquery(sql,callback);        		
        	}        	
		},
		/**
		 * info : prepare update query and execute
		 * @param data in column value pair
		 * @param table name
		 * @primarykey primary key of table
		 */
		update:function(data,table,primarykey,callback){
			if(!data) callback('Data not available to prepare query',null);
			var sql = '';
			var subquery = 'SET ';
            var values = [];
            if(data && typeof(data) ==  "object"){
              for(var index in data){
                if(index!='id')
                values.push(index +"='"+data[index]+"' ");
              }
              subquery += values.join(',');
              if(data[primarykey] && data[primarykey]!=''){
                subquery+=" where "+primarykey+"='"+Number(data[primarykey])+"'";
              }          
            }        
            sql = 'UPDATE '+ table +' '+ subquery;
            if(sql!=''){
        		Query.processquery(sql,callback);        		
        	}
		},
		/**
		 * info : prepare delete query and execute
		 * @param data in column value pair
		 * @param table name
		 * @primarykey primary key of table
		 */
		remove:function(id,table,callback){
			if(!id) callback('Data not available to prepare query',null);
			var sql = '';
			var subquery = 'WHERE id= '+id;                
            sql = 'DELETE FROM '+ table +' '+ subquery;
            if(sql!=''){
        		Query.processquery(sql,callback);        		
        	}
		},
		custom:function(sql,callback){
			Query.processquery(sql,callback);
		},
		/**
		 * info :  execute query
		 * @param sql 
		 */
		processquery:function(sql,callback){
			util.log("SQL : [ "+ sql+" ]");
			Db.query(
              sql,
              function selectCb(err, results) {
            	//console.log(results);
            	callback(err,results);        
               }
           );
		}
		
		
};
module.exports = Query;