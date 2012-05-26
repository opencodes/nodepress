/*
 *  Coupon Details View Model
 */
var CouponDetailsModel = function(){
  var that = this;
  
  this.code = ko.observable();
  this.desc = ko.observable();
  this.active = ko.observable();
  this.optionsHTML = ko.observable();
  this.backend = ko.observable();
  this.couponCodeDisable= ko.observable(false);
  this.shipping = ko.observable(false);

  this.couponDetailsFormSubmit = function(formElement){
    $.post('/settings/coupons/validate', $('#couponDetailsForm').serialize(), function(res){
      if (res.error) {
        $('#couponOptionsValidationErrors').html(res.error);
        $('#couponOptionsValidationErrors').show();
      } else {
        $('#couponOptionsValidationErrors').html('');
        $('#couponOptionsValidationErrors').hide();
        $.post('/settings/coupons/save', $('#couponDetailsForm').serialize(), function(res){
          if(res.retStatus === 'success'){
            $("#couponSaveResponse").html('<div class="alert-message block-message success"> Successfully Updated the Coupon</div>');
            var t = setTimeout(function() {
              $("#couponSaveResponse").html('');
            }, 5000);
            $(location).attr('href', '/settings/coupons');
          }else if(res.retStatus === 'failure'){
            $("#couponSaveResponse").html('<div class="alert-message block-message alert-error"> Error Parsing "options" JSON</div>');
            $(location).attr('href', '/settings/coupons#couponDetails');
          }
        });
      }
    });
  };

  this.setData = function(coupon){
    that.code(coupon.coupon_code);    
    that.desc(coupon.description);
    that.active(coupon.active);
    that.optionsHTML(coupon.optionsHTML);
    that.backend(coupon.backend);
    that.couponCodeDisable(true);
    that.shipping(coupon.waive_shipping == 0 ? false : true);
    $('#couponOptionsValidationErrors').html('');
    $('#couponOptionsValidationErrors').hide();
  };

  this.clearForm = function(){
    that.code('');
    that.desc('');
    that.couponCodeDisable(false);
    $('#couponOptionsValidationErrors').html('');
    $('#couponOptionsValidationErrors').hide();
  };
  
  this.cancelForm = function(){
    $('ul.tabs li,div.tab-content div').removeClass('active');
    $('ul li:nth-child(1),div.tab-content div#couponlist').addClass('active');    
    $('#couponListTable').dataTable().fnDraw();
  };
};

var couponDetailsObj = new CouponDetailsModel();
ko.applyBindings(couponDetailsObj, document.getElementById('coupon_details'));
