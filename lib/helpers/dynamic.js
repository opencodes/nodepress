var util = require('util');
var dynamicHelper = {    
    customer:function(req,res){
      return req.customer;
    }
};
module.exports = dynamicHelper; 