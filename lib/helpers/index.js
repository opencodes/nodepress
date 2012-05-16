var util = require('util');
var moment = require('moment');

var sth = {
    /*
     * Formating date time in required format
     * @param date must be in mysql date time format
     * @output output date format 
     */
    dateFormat:function(date,outputformat){
      var day = moment(date);
      return day.format("dddd, MMMM Do YYYY");
    }
};
//Thu, 03 May 2012 07:37:43 GMT
module.exports = sth;
//----------------------------------------------------------------------------
if (require.main === module) {
  (function () {
    function logcb(err, obj) {
      util.log(err || util.inspect(obj));
      process.exit(0);
    }
    util.log(sth.dateFormat('2012-05-03 13:07:43'));
  })();
}

