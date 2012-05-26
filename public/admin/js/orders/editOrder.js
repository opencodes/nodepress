
function showCreatedOrderDetails(res){
 if(res.response === 'success' && !res.orderId){
   showActionResponse('Order Updated Successfully');
 }else if(res.response === 'success' && res.earlierId){
   showActionResponse('Cancelled Order successfully with id :: <strong>'+res.earlierId+'</strong><br/>'+'Order created successfully with id :: <strong>'+res.orderId+'</strong>');
 }else if(res.response === 'success'){
   showActionResponse('Order created successfully with id :: <strong>'+res.orderId+'</strong>');
 }
 else{
   showActionResponse('Order Creation/Updation Failure :: <strong>'+' with error:: '+res.error+'</strong>',true);
 }
 $('#orderListTable').dataTable().fnStandingRedraw();
 showOrderListTab();
}

function showOrderListTab(){
  $('#checkoutDetails').html("");
  $('.checkoutDetails').hide();
  $('#emptyMessage').show();
  $('#orderlist').addClass('active');
  $('#orderlistTab').addClass('active');
  $('#manageorder').removeClass('active');
  $('#manageorderTab').removeClass('active');
}

function showCheckoutTab(){
  $('#orderlist').removeClass('active');
  $('#orderlistTab').removeClass('active');
  $('#manageorder').addClass('active');
  $('#manageorderTab').addClass('active');
  $('.checkoutDetails').show();
  $('#emptyMessage').hide();
  $('#ero_error').html('').hide();
}


function disableShippingTB(){
  $('#auad_firstName_s').attr('readonly','true');
  $('#auad_lastName_s').attr('readonly','true');
  $('#auad_phone_s').attr('readonly','true');
  $('#auad_street1_s').attr('readonly','true');
  $('#auad_city_s').attr('readonly','true');
  $('#auad_region_s').attr('disabled','true');
  $('#auad_zip_s').attr('readonly','true');
  $('#auad_phone1_s').attr('readonly','true');
  $('#auad_lndmrk_s').attr('readonly','true');
}
function enableShippingTB(){
  $('#auad_firstName_s').removeAttr('readonly');
  $('#auad_lastName_s').removeAttr('readonly');
  $('#auad_phone_s').removeAttr('readonly');
  $('#auad_street1_s').removeAttr('readonly');
  $('#auad_city_s').removeAttr('readonly');
  $('#auad_region_s').removeAttr('disabled');
  $('#auad_zip_s').removeAttr('readonly');
  $('#auad_phone1_s').removeAttr('readonly');
  $('#auad_lndmrk_s').removeAttr('readonly');
}
function copyShippingTB(){
  $('#auad_firstName_s').val($('#auad_firstName_b').val());
  $('#auad_lastName_s').val($('#auad_lastName_b').val());
  $('#auad_phone_s').val($('#auad_phone_b').val());
  $('#auad_street1_s').val($('#auad_street1_b').val());
  $('#auad_city_s').val($('#auad_city_b').val());
  $('#auad_region_s').val($('#auad_region_b').val());
  $('#auad_zip_s').val($('#auad_zip_b').val());
  $('#auad_country_s').val($('#auad_country_b').val());
  $('#auad_phone1_s').val($('#auad_phone1_b').val());
  $('#auad_lndmrk_s').val($('#auad_lndmrk_b').val());
  getPaymentMethods($('#auad_zip_b').val());
}
function validateAddress(){
  if (!ututils.isNotEmptyString($('#auad_firstName_s').val().trim()) || !ututils.isNotEmptyString($('#auad_lastName_s').val().trim()) ||
      !ututils.isNotEmptyString($('#auad_phone_s').val().trim()) || 
      (!ututils.isNotEmptyString($('#auad_street1_s').val().trim()) || 
      !ututils.isNotEmptyString($('#auad_city_s').val().trim()) || !ututils.isNotEmptyString($('#auad_region_s').val()) || 
      !ututils.isNotEmptyString($('#auad_zip_s').val().trim()) || !ututils.isNotEmptyString($('#auad_country_s').val().trim()) ||
      //Billing
      !ututils.isNotEmptyString($('#auad_firstName_b').val().trim()) || !ututils.isNotEmptyString($('#auad_lastName_b').val().trim()) ||
      !ututils.isNotEmptyString($('#auad_phone_b').val().trim()) || 
      (!ututils.isNotEmptyString($('#auad_street1_b').val().trim()) || 
      !ututils.isNotEmptyString($('#auad_city_b').val().trim()) || !ututils.isNotEmptyString($('#auad_region_b').val()) || 
      !ututils.isNotEmptyString($('#auad_zip_b').val().trim()) || !ututils.isNotEmptyString($('#auad_country_b').val().trim()))
      )) {
    return 'Please fill all the mandatory fields marked with a *';
  }
  
  //Validate ZIP
  if (!ututils.validatePincode($('#auad_zip_b').val()) || !ututils.validatePincode($('#auad_zip_s').val()))  {
    return 'Invalid ZIP';
  }
  
  //Validate telephone
  if (!ututils.validateTelephone($('#auad_phone_b').val()) || !ututils.validateTelephone($('#auad_phone_s').val())) {
    return 'Invalid Telephone Number.';
  }
  if(!$('input:radio[name="shipping_method"]:checked').val()){
    return 'Please Select atleast one shipping method';
  }
  if(!$('input:radio[name="payment_method"]:checked').val()){
    return 'Please Select atleast one Payment method';
  }
  return '';
}

function getPaymentMethods(zip){
  $.get('/settings/orderManagement/updatepayment', $('#orderUpdateAddress').serialize(), function(html) {
    $('.paymentShippingInfo').html(html);
  });
}
//Shows the confirmation modal,and return the click action as boolean
function showConfirmationModal(htmlContent){
  $('#fullfillment_action_modal').modal({
    show:true,
    backdrop:'true',
    keyboard:true
  });
  $('#fullfillment_action_message').html(htmlContent);
  $('#fullfillment_action_cancel').live('click',function(){
    $('#fullfillment_action_modal').modal('hide');
  });
}

var emtpyCartContent = '<h3>Shopping cart is empty</h3><p>Please add items to the cart from the product list along side.</p>';

function clearCartForNewOrder(){
  $.post('/settings/orderManagement/clearCart',function(res) {
    if (res.response === "success") {
        $('#cartsidebar').html(emtpyCartContent);
    }
  });
}
/*
function hideCheckout(){
  $('#orderList').show();
  $('#checkoutDetails').html("");
  $('.checkoutDetails').hide();
  $('#emptyMessage').show();
}
*/
$(document).ready(function() {
          $('.productListTable').hide();
          $('#errorCrtOrder').hide();
          $('#createOrderHome').show();
          $('.viewCartDetails').hide();
          $('.createCustomer').hide();
          $('.addressDetails').hide();
          $('.checkoutDetails').hide();
          $('#emptyMessage').show();
          $('#orderInfo').hide();
          $('#modal-formAddNewOrder').modal({
            backdrop : 'static',
            keyboard : true
          });
          $('.checkoutDetails .ceo_shipping_lable').live('change', function() {
            var validateMessage = validateAddress();
            if ('' !== validateMessage) {
              // Show the validation error
              $('#auad_error').html(validateMessage).show();
            } else {
              $('#auad_error').hide();
              $.post('/settings/editOrder/changeShipping', $('#orderUpdateAddress').serialize(), function(html) {
                $('#checkoutDetails').html(html);
                $('#hiddenCreateVal').val('1');
              });
            }
          });
          // Selecting products from product datatable
          $('#productListTable tbody tr .ceo_addPrdt').live('click',function() {
                var row = $(this).closest('tr');
                var qty = $('td:nth-child(1)', row).children('input').val();
                if(qty && qty.length && qty>0){
                  var pid = $('td:nth-child(2)', row).children('a').attr('id');
                  var data = {
                      'product' : pid,
                      'qty' : qty,
                      'reqType' : 'add'
                  };
                  $.post('/settings/editOrder/cart', data, function(html) {
                    $('#cartsidebar').html(html);
                  });
                }
          });
          $('.cart_update_qty').live('change',function() {
            var row = $(this).closest('tr');
            var pid = $('td:nth-child(5)', row).children('input').attr('value');
            var qty = $('#cart_update_qty_'+pid).val();
            var updateObj = {};
            updateObj[pid] = qty;
            var data = {
              'product' : pid,
              'qty' : qty,
              'reqType' : 'update',
              updateObj: JSON.stringify(updateObj)
            };
            $.post('/settings/editOrder/cart', data, function(html) {
              $('#cartsidebar').html(html);
            });
          });

          // Selecting Customer from datatable
          $('#customerListTable tbody tr td:nth-child(1) input').live('click',function() {
                $('#customerListTable tbody tr').removeClass('row_selected');
                $('#customerListTable tbody tr td:nth-child(1) input')
                    .removeAttr("checked");
                $(this).attr("checked", "checked");
                var tr = $(this).closest('tr');
                tr.toggleClass('row_selected');
              });
          $('#productTable .btn_apply_coupon').live('click', function() {
            var couponCode = $('#couponCode').val();
            if ('' !== couponCode) {
              var data = {
                'coupon_code' : couponCode,
                'reqType' : 'applycoupon'
              };
              $.post('/settings/editOrder/cart', data, function(html) {
                $('#cartsidebar').html(html);
              });
            }
          });
          $('#productTable #couponCode').live('keypress',function(e){
            if(e.keyCode==13){
              var couponValue=$('#productTable #couponCode').val();
              if(couponValue && couponValue.length){
                $('#productTable .btn_apply_coupon').trigger('click');
              }
            }
          });
          $('#productTable .btn_cancel_coupon').live('click', function() {
            var couponCode = $('#couponCode').val();
            if ('' !== couponCode) {
              var data = {
                'coupon_code' : couponCode,
                'reqType' : 'cancelcoupon'
              };
              $.post('/settings/editOrder/cart', data, function(html) {
                $('#cartsidebar').html(html);
              });
            }
          });
          $('#cartsidebar .ceo_cartSidebar tr td:nth-child(5)').live('click',function(){
            var pid = $(this).children('input').val();
            var data = {
                'product' : pid,
                'reqType' : 'remove'
              };
              $.post('/settings/editOrder/cart', data, function(html) {
                $('#cartsidebar').html(html);
              });
          });
          $('#checkoutDetails .copyBillShipping').live('click', function() {
            if($('#copyBillShipping:checked').length > 0){
              disableShippingTB();
              copyShippingTB();
            }
            else
              enableShippingTB();
          });
          $('#checkoutDetails .auad_billing').live('change', function() {
            if($('#copyBillShipping:checked').length > 0){
              copyShippingTB();
            }
          });

          $('#checkoutDetails .auad_zip').live('change',function(){
            var shipPin = $('#auad_zip_s');
            if(((this).id === 'auad_zip_s' || shipPin.attr("readonly") === "readonly") && ututils.validatePincode(shipPin.val())){
              getPaymentMethods(shipPin.val());
              $('#ero_error').html('').hide();
            }else if((this).id === 'auad_zip_b'){
              return;
            } else{
              $('.payment_options').hide();
              $('#ero_error').show().html('Invalid Shipping Pincode');
            }
          });
          $('#nextPrdtSel').click(function(event) {
            validateAndAddPrdts('editOrder');
          });
          $('#newOrderNextPrdtSel').click(function(event) {
            validateAndAddPrdts('newOrder');
          });
          $('.cancelOrder').click(function(event) {
            $.post('/settings/orderManagement/clearCart', function(res) {
              if (res.response === "success") {
                $('#cartsidebar').html(emtpyCartContent);
                $('#modal-formAddNewOrder').modal('hide');
                $('#orderList').show();
              }
            });
          });
          /*
          $('#ceo_cancel').click(function(event) {
            $.post('/settings/orderManagement/clearCart', function(res) {
              if (res.response === "success") {
                hideCheckout();
              }
            })
          });
          $('#ceo_create').click(function(event){
           var validateMessage = validateAddress();
           if (validateMessage != ''){
            $.post('/settings/order/create',$('#orderUpdateAddress').serialize(),function(res){
              hideCheckout();
             if(res.response === 'success' && res.earlierId){
               $('#orderInfo').html('Cancelled Order successfully with id :: <strong>'+res.earlierId+'</strong><br/>'+'Order created successfully with id :: <strong>'+res.orderId+'</strong>').addClass('success').show();
             }else if(res.response === 'success'){
               $('#orderInfo').html('Order created successfully with id :: <strong>'+res.orderId+'</strong>').addClass('success').show();
             }
             else{
               $('#orderInfo').html('Order Creation Failure :: <strong>'+' with error:: '+res.err+'</strong>').addClass('error').show();
             }
             $('#editOrderTable').dataTable().fnStandingRedraw();
            });
           } else{
             $('#ero_error').show().html(validateMessage);
           }
          });
          */
          $('.productListBack').click(function(event) {
            fetchCustomerTableData();
          });
          $('#ai_back').click(function(event) {
            fetchCustomerTableData();
          });
          $('#addCust').click(function(event) {
            $('.productListTable').hide();
            $('.customerListTable').hide();
            $('.createCustomer').show();
          });
          $('#ai_submit').click(function(event) {
            validateAndAddCustomer();
          });
          $('#auad_reset').click(function(event) {
            resetAddress();
          });
          $('.auad_addupdate').click(function(event) {
            addUpdateAddress();
          });
          $('#nextCustSel').click(function(event) {
            $('#newOrderNextPrdtSel').show();
            $('#productListBack').show();
            $('#nextPrdtSel').hide();
            var elements = $('#customerListTable .row_selected');
            if (elements.length <= 0) {
              $('#errorCrtOrder').html('Please select atleast one Customer or click add new customer to add new.');
              $('#errorCrtOrder').show();
            } else {
              $('.customerListTable').hide();
              fetchProductTableData($('#customerListTable .row_selected td:nth-child(2)').html(),$('#customerListTable .row_selected td:nth-child(5)').html(),$('#customerListTable .row_selected td:nth-child(3)').html()+' '+$('#customerListTable .row_selected td:nth-child(4)').html());
            }
          });
          $('#modal-formAddNewOrder').on('hide',function(){
            $('#productListTable .search_init').val('');
            if (ututils.isDataTable($('#customerListTable')[0])){
              $('#customerListTable .search_init').val('');
              $('#customerListTable').dataTable().fnResetAllFilters();
            }
            
            //reset create customer form
            $('#ai_firstName').val('');
            $('#ai_lastName').val('');
            $('#ai_email').val('');
            //Render Sidecart incase we have changed the cart i.e. we are on product select page
            if($('#nextPrdtSel').is(':visible')){
              renderOrderSummary();
            }
          });
          $('#order_create').click(function(event){
            var url = null;
            var validateMessage = validateAddress();
            if (validateMessage === '') {
              $('#ero_error').hide();
              if($('#hiddenEditType').val() === 'editorder') {
                url = '/settings/order/compareCart';
                $.post(url,$('#orderUpdateAddress').serialize(),function(res){
                  var url;
                  if(res.result){
                    showConfirmationModal('Edit Order:: Updating current order details without creating a new order');
                    url = '/settings/order/update';
                  } else{
                    showConfirmationModal('Edit Order:: Creating a new order after cancelling the current one');
                    url = '/settings/order/create';
                  }
                  $('#fullfillment_action_ok').unbind('click');
                  $('#fullfillment_action_ok').click(function(){
                    $('#fullfillment_action_modal').modal('hide');
                      $.post(url,$('#orderUpdateAddress').serialize(),function(res){
                          //reset hiddenEditType
                          $('#hiddenEditType').val('');
                          showCreatedOrderDetails(res);
                        });
                  });
                });
              }
              else if($('#hiddenEditType').val() === 'reorder'){
                showConfirmationModal('Reorder:: Creating a new order');
                $('#fullfillment_action_ok').unbind('click');
                $('#fullfillment_action_ok').click(function(){
                  $('#fullfillment_action_modal').modal('hide');
                  $.post('/settings/order/reorder',$('#orderUpdateAddress').serialize(),function(res){
                    //reset hiddenEditType
                    $('#hiddenEditType').val('');
                    showCreatedOrderDetails(res);
                  });
                });
              }
              else{
                showConfirmationModal('New Order:: Creating a new order');
                $('#fullfillment_action_ok').unbind('click');
                $('#fullfillment_action_ok').click(function(){
                  $('#fullfillment_action_modal').modal('hide');
                  $.post('/settings/order/create',$('#orderUpdateAddress').serialize(),function(res){
                    //reset hiddenEditType
                    $('#hiddenEditType').val('');
                    showCreatedOrderDetails(res);
                  });
                });
              }
            }else{
              $('#ero_error').show().html(validateMessage);
            }
          });
          $('#order_cancel').click(function(event) {
            //reset hiddenEditType
            $('#hiddenEditType').val('');
            $.post('/settings/orderManagement/clearCart', function(res) {
                showOrderListTab();
            });
          });
          $('#order_editCart').click(function(event) {
            $.get('/settings/editOrder/renderSideCart',$('#orderUpdateAddress').serialize(),function(html) {
              $('#modal-formAddNewOrder').modal('show');
              $('#cartsidebar').html(html);
              fetchProductTableData($('#hiddenCust_id').val());
            });
          });
          $('#hide_message').click(function(event){
            hideActionResponse();
          });
          
          $('.product_update_qty').live('keypress',function(e){
            if(e.keyCode==13){
              var row = $(this).closest('tr');
              var qtyValue=$('td:nth-child(1)', row).children('input').val();
              if(qtyValue && qtyValue.length && qtyValue>0){
                $('td:nth-child(2)', row).children('a').trigger('click');
              }
            }
          });
        });
