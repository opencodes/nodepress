var fs = require('fs');
var xml2js = require('xml2js');

var xmlreader = {
	readFile:function readXml(filepath,callback){
		
		var parser = new xml2js.Parser();
		fs.readFile(filepath, function(err, data) {
		    parser.parseString(data, function (err, result) {
		        if(!err){
			        console.log('Reading XML done successfully');
		        	callback(null,result);
		        }else{
		        	console.log(err);
		        	callback(err,null);
		        }
		    	
		    });
		});
		
	}	
};
module.exports = xmlreader;
