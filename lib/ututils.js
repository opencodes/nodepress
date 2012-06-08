// urbantouch utility functions
// code that is shared between the browser and server goes here
(function (exports) {
  var method;
  var utils = {
    validateOrderId: function (orderId) {
      var orderIdStr = orderId + '';
      if ((orderIdStr.length >= 8) && (orderIdStr.length <= 12)) {
        return true;
      }
      return false;
    },
    validatePincode: function (code) {
      var regex = /^[1-9][0-9]{5}/;
      if ((code.length == 6) && code.match(regex)) {
        return true;
      }
      return false;
    },
    validateTelephone: function (telephone) {
      var regex = /[0-9]{10}/; 
      if ((this.stringTrim(telephone) === '') || (telephone.match(regex) && (telephone.length <= 10) && telephone.charAt(0)!="0")) {
        return true;
      }
      return false;
    },
    validateHexColorCode: function (colorCode) {
      var regex = /^#([A-Fa-f0-9]{6})$/;
      if ((colorCode === '') || (colorCode.match(regex))) {
        return true;
      }
      return false;
    },
    validateEmail: function (email) {
        if (email && email.indexOf('@') != -1) {
          var name = email.substring(0, email.indexOf('@'));
          var domain = email.substring(email.indexOf('@')+1, email.length);
          
          var nameRegex = /^[a-zA-Z0-9.+_-]+$/;
          var domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          
          var retVal = false;
          
          if (name.match(nameRegex)) {
            retVal = true;

            //email name should not lead or trail with a '.'
            //there should not be multiple dots
            if (name.charAt(0) == '.' || name.charAt(name.length-1) == '.' || 
                name.indexOf('..') != -1) {
              retVal = false;
            }

            if (retVal) {
              if (domain.match(domainRegex)) {
                //domain name should not lead with a '.' or '-'
                //there should not be multiple dots
                //it should not end with 'web'
                if (domain.charAt(0) == '.' || domain.charAt(0) == '-' || 
                    domain.indexOf('..') != -1 || domain.substring(domain.length-3, domain.length).toLowerCase() == 'web') {
                  retVal = false;
                } 
              } else {
                retVal = false;

                //it should be a valid IP, may or may not be contained in []
                if (domain.charAt(0) == '[' && domain.charAt(domain.length-1) == ']') {
                  domain = domain.substring(1, domain.length-1);
                } 
                
                var ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
                if (domain.match(ipRegex)) {
                  retVal = true;
                }
              }//domain regex match check
            }//name matched regex, and didn't have other issues
          }//name matches regex
          
          return retVal;
        } else {
          return false;
        }
      },
    isKeyNumeric: function (evt) {
      var charCode = evt.which || evt.keyCode;
      if ((charCode > 31) && ((charCode < 48) || (charCode > 57))) {
        return false;
      }
      return true;
    },
    isKeyArrows: function (evt) {
      var charCode = evt.which || evt.keyCode;
      if ((charCode >= 37) && (charCode <= 40)) {
        return true;
      }
      return false; 
    },
    isNumber: function (num) {
      return !isNaN(parseFloat(num)) && isFinite(num);
    },
    hasNumbers:function(t) {
      var regex = /\d/g;
      if(regex.test(t)){
        return true; 
      }      
      return false;
    },
    hasSpclChar: function(str) {
      var iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_";
      var i = 0;
      for (i; i < str.length; i++) {
       if (iChars.indexOf(str.charAt(i)) != -1) {
       return true;
       }
     }
    },
    isEmpty: function (map) {
      var key;
      for (key in map) {
        if (map.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    },
    isNotEmptyString: function (str, def) {
      var code = (str && this.stringTrim(str) !== '');
      if (def === undefined) {
        def = false;
      }
      return code ? str : def;
    },
    isNullorEmpty : function(obj){
      return obj?true:false;
    },
    validatePositiveNumber: function (val) {
      return Number(val) > 0;
    },
    validateWholeNumber: function (val) {
      return Number(val) >= 0;
    },
    validatePositiveDecimal: function (val) {
      return Number(val) > 0.0;
    },
    sanitizeName: function (name) {
      var sanitizedname = null;
      if (name) {
        sanitizedname = (name[0].toUpperCase() + name.substr(1, name.length)).split(' ')[0];
      }
      return sanitizedname;
    },
    sanitizeEmail: function (email){
       var sanitizedemail = null;
        if (email) {
          sanitizedemail = this.stringTrimAndToLower(email);
        }
        return sanitizedemail;
    },

    stringTrimAndToLower:function(str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '').toLowerCase();
    },
    
    stringTrim:function(str) {
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    /**
     * Short method for printing a message in the console
     * QZ: changed to console.log as this file is also used
     * on server side
     **/
    log: function(message) {
      console.log(message);
    },
    
    /**
     * @returns local time in format YYYY-MM-DD HH:MM:SS
     **/
    currentTime:function() {
       var current = new Date();
      return this.formatTime(current);
    },

    /**
     * @returns local time in format YYYY-MM-DD HH:MM:SS
     * Removes the GMT/IST markers that give us trouble 
     * with node-mysql
     * @params date
     **/
    formatTime: function(d) {
      return [
                d.getFullYear(),
                d.getMonth() + 1,
                d.getDate() 
             ].join('-') + ' ' +
             [ 
                d.getHours(),
                d.getMinutes(),
                d.getSeconds()
             ].join(':');
    },
    
    /**
     * @returns local date in format YYYY-MM-DD
     * @params date
     **/
    formatDate: function(d) {
      return [
                d.getFullYear(),
                d.getMonth() + 1,
                d.getDate() 
             ].join('-');
    },
    
    /**
     * @returns local time in format DAY Month DD YYYY HH:MM AM/PM
     * Removes the GMT/IST markers that give us trouble 
     * @params date
     **/
    
    format12hrDateTime: function(d) {
      var hour=d.getHours();
      var suffix;
      if(hour<12){
        suffix='AM';
      }else{
        suffix='PM';
        hour=hour-12;
      }
      if(hour===0){
        hour=12;
      }
      var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var day=days[d.getDay()];
      var month=months[d.getMonth()];
      var minute=d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes();
      hour=hour<10?'0'+hour:hour;
      return [  day,
                month,
                d.getDate(),
                d.getFullYear()
             ].join(' ') + ' ' +
             [  hour,
                minute
             ].join(':') + ' '+
             [  suffix
             ];
    },
    
    validatePasswordLength:function(val){
      if(val && val.length > 5){
        return true;
      }
      return false;
    },

    isDataTable: function( nTable ){
      var settings = $.fn.dataTableSettings;
      for ( var i=0, iLen=settings.length ; i<iLen ; i++ )
      {
        if ( settings[i].nTable == nTable )
        {
            return true;
        }
      }
      return false;
    },

    supportedImageTypes: ['.jpg','.jpeg','.png','.gif','.bmp'],

    isImage: function(file) {
      var ext = file.substring(file.lastIndexOf('.')).toLowerCase();
      return utils.supportedImageTypes.indexOf(ext) > -1;
    },

    /**
     * Used in CS console to know whether order can be tracked.
     * @params orderStatus: status of the order
     **/

    isOrderinTrackState: function(orderStatus) {
      var orderTrackingStatus = [
        'SHIPPED',
        'COMPLETE',
        'DELIVERED',
        'HANDED_OVER_TO_COURIER',
        'RTO_RECEIVED',
        'COURIER_RETURNED',
        'HANDED_OVER_TO_INVENTORY',
        'HANDED_OVER_TO_COURIER',
        'delivered',
        'complete'
      ];

      for ( var i = 0; i < orderTrackingStatus.length ; i++) {
        if ( orderTrackingStatus[i] === orderStatus) {
          return true;
        }
      }
      return false;
    },

    /**
     * Used in CS console to know whether comment can be applied to the order.
     * @params orderStatus: status of the order
     **/

    isOrderinCancelState: function(orderStatus) {
      var orderCancelStatus = [
        'PENDING',
        'OPF_PRINTED',
        'AUTHORIZED',
        'FAILED',
        'PAYMENT_REVIEW'
      ];

      for ( var i = 0; i < orderCancelStatus.length ; i++) {
        if ( orderCancelStatus[i] === orderStatus) {
          return true;
        }
      }
      return false;
    },
    //Check if order is in valid state for printing Invoice
    isOrderinPrintInvoiceState: function(orderStatus){
      var validStates = ['OPF_PRINTED','INVOICED','SHIPPED','COMPLETE','DELIVERED','SHIPMENT_CREATED'
                         ,'HANDED_OVER_TO_COURIER','RTO_RECEIVED','COURIER_RETURNED','HANDED_OVER_TO_INVENTORY','HANDED_OVER_TO_COURIER'];
      return (validStates.indexOf(orderStatus.toUpperCase()) != -1);
    },
    /**
     * A utility function to check whether a string has ascii character(s)
     * @params token: a string
     * @returns true if string does not have any ascii character.
     **/
    isWithoutAsciiChars: function(token){
      var regex = /^[\x00-\x7F]+$/;
      if(token.match(regex)){
        return true;
      }
      return false;
    },
    
    cloneObject : function(obj) {
      var clone = {};
      for(var i in obj) {
        if(typeof(obj[i])== "object")
          clone[i] = this.cloneObject(obj[i]);
        else
          clone[i] = obj[i];
      }
      return clone;
    },
    
    // Make a clone of every Object or primitive
    clone: function(variable) {
      if (typeof(variable) === "object") {
        return this.cloneObject(variable);
      } else {
        return variable;
      }
    },

    // function to generate a random interger between min and max
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  };

  for (method in utils) {
    if (typeof utils[method] == 'function') {
      exports[method] = utils[method];
    }
  }
}(typeof exports === 'undefined' ? this.ututils = {} : exports));
