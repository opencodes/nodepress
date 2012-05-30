var util = require('util');
var dynamicHelper = {    
    customer:function(req,res){
      return req.customer;
    },
    session:function(req,res){
      return req.session;
    }
   
};
module.exports = dynamicHelper; 