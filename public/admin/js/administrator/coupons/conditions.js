/*
 * Coupon Condition
 */
var CouponConditionModel  = function(condition){
  var self = this;
  this.brands     = [{id:1,name:'cat1'},{id:2,name:'cat2'},{id:3,name:'cat3'},{id:4,name:'cat4'},{id:5,name:'cat5'},];
  this.item       = ko.observable((condition)?condition.item:null);
  this.cart       = ko.observable((condition)?condition.cart.field:null); 
  this.cartQty    = ko.observable((condition)?condition.cart.qty:null);
  this.cartValue  = ko.observable((condition)?condition.cart.value:null);    
  this.brands     = ko.computed( function(){
    if(self.item() == 'brands'){
      return self.brands;
    }   
  });
  this.row       = ko.computed(function(){    
    if(self.item()=='row'){
      return true;
    }
    return false;    
  });
  this.isCartTotalBox     = ko.computed(function (){
    if(self.cart()){
      return true;
    }
    return false;
  });
};
var a= new CouponConditionModel();
ko.applyBindings(a,document.getElementById('coupon_conditions'));
