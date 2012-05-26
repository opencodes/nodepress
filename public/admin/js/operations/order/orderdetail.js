
function showOrderDetail(orderId, showManageOrderButtons){
  orderId = orderId.trim().split(' ')[0];
  $.get('/operations/orders/'+ orderId + '/' + showManageOrderButtons,function(html){
    $('#details').html(html); 

    $('#modal-show-order').modal('show');
    if($("#order_status_history_" + orderId).is(':visible'))
      $("#order_status_history_" + orderId).hide();
  });
  
}
function validateShippingAddress(){
  if (!ututils.isNotEmptyString($('#auad_firstName_s').val().trim()) || !ututils.isNotEmptyString($('#auad_lastName_s').val().trim()) ||
      !ututils.isNotEmptyString($('#auad_phone_s').val().trim()) || 
      (!ututils.isNotEmptyString($('#auad_street1_s').val().trim()) || 
      !ututils.isNotEmptyString($('#auad_city_s').val().trim()) || !ututils.isNotEmptyString($('#auad_region_s').val()) || 
      !ututils.isNotEmptyString($('#auad_zip_s').val().trim()) || !ututils.isNotEmptyString($('#auad_country_s').val().trim())
      )) {
    return 'Please fill all the mandatory fields marked with a *';
  }
  
  //Validate ZIP
  if (!ututils.validatePincode($('#auad_zip_s').val()))  {
    return 'Invalid ZIP';
  }
  
  //Validate telephone
  if (!ututils.validateTelephone($('#auad_phone_s').val())) {
    return 'Invalid Telephone Number.';
  }
  return '';
}
function fetchOrderDetails(orderId,orderType){
  $.get('/settings/editorder/getOrderDetails/' + orderId, {'orderType':orderType}, function(res) {
    if (res.response) {
      $('#errorEditOrderLabel').html(res.details);
      $('#errorEditOrderLabel').show();
    } else {
      $("#ordertab li").each(function() {
           $(this).removeClass('active');
      });
      $("#ordertab li a").each(function() {        
        var divid = $(this).attr('href');
        $(divid).removeClass('active');
      });
      showCheckoutTab();
      $('#checkoutDetails').html(res);
      $('.getShippingBtn').hide();
      $('.ceo_create').show();
      $('#ero_error').html('').hide();
      $('#hiddenCreateVal').val('1');
      $('#hiddenEditType').val(orderType);
      if(orderType ==='editorder'){
        $('#updateOrderBtn').show();
      }
      var cartError = $('#hiddenErrorCart').val();
      if (cartError !== '') {
        $('#hiddenCreateVal').val('0');
        $('.ceo_create').hide();
        $('#ero_error').html(cartError).show();
      }
    }
  });
}

$(document).ready(function(){

  $('#modal-show-order').modal({
    show: false,
    backdrop: 'false',
    keyboard:true
  });

  $(".orderStatusHistory").live("click",function(){
    $("#order_status_history_" + $(this).attr('group')).toggle();
  });

  $('#orderListTable tbody tr .orderIdlink').live('click', function () {
    var orderId = $(this).text().trim();
    showOrderDetail(orderId, 'true');

  });

 
 $('#bulkPincodeTable tbody tr .searchOrderId .orderIdlink').live('click', function(){
	 var orderId = $(this).text().trim();
     showOrderDetail(orderId);
  });
  

  $('#ordersDispatchTable tbody tr .orderIdlink').live('click',function(){
    var orderId = $(this).text().trim();
    showOrderDetail(orderId);
  });

  $('#orderHold').live('click',function(){
    var htmlContent='Hold order ';
    htmlContent=htmlContent+' '+$('#holdOrderId').val();
    $('#fullfillment_action_modal').modal({
      show:true,
      backdrop:'true',
      keyboard:true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function(){
      $.post('/operations/orders/hold', {'orderId': $('#holdOrderId').val()}, function(res) {
        $('#fullfillment_action_modal').modal('hide');
        refreshDataTable();
        $('#modal-show-order').modal('hide');
      });
    });
    $('#fullfillment_action_cancel').live('click',function(){
      $('#fullfillment_action_modal').modal('hide');
    });
  });
  
  $('#editAddress').live('click',function(){
    $.post('/operations/orders/editAddress', {'orderId': $('#holdOrderId').val()}, function(res) {
      $('#details').hide();
      $('.orderAddress').show();
      $('#orderAddress').html(res);
      });
  });
  $('#updateAddress').live('click',function(){
    var validateMessage = validateShippingAddress();
    if ('' !== validateMessage) {
      // Show the validation error
      $('#errorEditAddress').html(validateMessage).show();
    } else {
      $('#errorEditAddress').html('').hide();
      $.post('/operations/orders/updateAddress', $('#updateOrderAddress').serialize(), function(res) {
        if(res.response === 'error')
          $('#errorEditAddress').html('Shipping address updation error'+res.error).hide();
        else{
          refreshDataTable();
          $('#modal-show-order').modal('hide');
        }
          
      });
    }
  });
  $('#modal-show-order').on('hide',function(){
    $('.orderAddress').hide();
    $('#errorEditAddress').html('').hide();
    $('#details').show();
  });
  
  $('#cancelOrder').live('click',function(){
    var htmlContent='Cancel order ';
    htmlContent=htmlContent+' '+$('#cancelOrderId').val();
    htmlContent+='<br><input type=\'checkbox\' id=\'sendCancelMail\' checked=true /> Send Email';
    $('#fullfillment_action_modal').modal({
      show:true,
      backdrop:true,
      keyboard:true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function(){
      var sendMail=($('#sendCancelMail').attr('checked')==='checked');
      $.post('/operations/orders/cancel', {orderId: $('#cancelOrderId').val(), 'flagInventoryUpdate':true,'sendCancelMail':sendMail }, function(res) {
        $('#fullfillment_action_modal').modal('hide');
        refreshDataTable();
        $('#modal-show-order').modal('hide');
      });
    });
    $('#fullfillment_action_cancel').live('click',function(){
      $('#fullfillment_action_modal').modal('hide');
    });
  });

  $('.sendOrderPlacedMail').live('click',function(){
    var rowId = $(this).data('history');
    var htmlContent='Send Order Placed mail to the customer.';
    $('#fullfillment_action_modal').modal({
      show:true,
      backdrop:true,
      keyboard:true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function(){
       var options = { orderId: $('#ordPlacedOrdId').val(), 
                       'mailTemplate': 'order-placed',
                       'orderHistoryId' : rowId};
      $.post('/operations/orders/orderDetailMails/ordPlaced', options, function(res) {
      $('#fullfillment_action_modal').modal('hide');
        $('#modal-show-order').modal('hide');
      });
    });
    $('#fullfillment_action_cancel').live('click',function(){
      $('#fullfillment_action_modal').modal('hide');
    });
  });

  $('.sendShpmntDtlsMail').live('click',function(){
    var rowId = $(this).data('history');
    var htmlContent='Send Shipment Details mail to the customer.';
    $('#fullfillment_action_modal').modal({
      show:true,
      backdrop:true,
      keyboard:true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function(){
      $('#fullfillment_action_ok').attr('disabled', true);
      var options = { orderId: $('#shpmntDtlsOrdId').val(), 
                      'mailTemplate': 'shipment-details',
                      'orderHistoryId' : rowId};
      $.post('/operations/orders/orderDetailMails/shpmntDtls', options, function(res) {
        $('#fullfillment_action_ok').attr('disabled', false);
        $('#fullfillment_action_modal').modal('hide');
        $('#modal-show-order').modal('hide');
      });
    });
    $('#fullfillment_action_cancel').live('click',function(){
      $('#fullfillment_action_modal').modal('hide');
    });
  });

  $('#creditMemo').live('click',function(){
    var htmlContent='Creditmemo order ';
    htmlContent=htmlContent+' '+$('#creditmemoOrderId').val();
    $('#fullfillment_action_modal').modal({
      show:true,
      backdrop:true,
      keyboard:true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function(){
      $.post('/operations/creditmemo/create', {orderId: $('#creditmemoOrderId').val(), 'flagInventoryUpdate':true}, function(res) {
        $('#fullfillment_action_modal').modal('hide');
        refreshDataTable();
        $('#modal-show-order').modal('hide');
      });
    });
    $('#fullfillment_action_cancel').live('click',function(){
      $('#fullfillment_action_modal').modal('hide');
    });
  });

  $('#orderUnhold').live('click',function(){
    var htmlContent='Unhold order ';
    htmlContent=htmlContent+' '+$('#unholdOrderId').val();
    $('#fullfillment_action_modal').modal({
      show:true,
      backdrop:true,
      keyboard:true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function(){
      $.post('/operations/orders/unhold', {orderId: $('#unholdOrderId').val()}, function(res) {
        $('#fullfillment_action_modal').modal('hide');
        refreshDataTable();
        $('#modal-show-order').modal('hide');
      });
    });
    $('#fullfillment_action_cancel').live('click',function(){
      $('#fullfillment_action_modal').modal('hide');
    });
  });

  $('#printOrder').live('click',function(){
    $('form#printOrderForm').attr("action", "/operations/orders/process").submit();
    $('#modal-show-order').modal('hide');
  });

  $('#printInvoice').live('click',function(){
    $('form#printInvoiceForm').attr("action", "/operations/orders/invoice").submit();
    $('#modal-show-order').modal('hide');
  });
  $('#reorder').live('click',function(){
    fetchOrderDetails($('#orderId').val(),'reorder');
    $('#modal-show-order').modal('hide');
    
  });
  $('#editorder').live('click',function(){
    fetchOrderDetails($('#orderId').val(),'editorder');
    $('#modal-show-order').modal('hide');
  });

  /*
  $('#updateOrderBtn').live('click', function() {
    var validateMessage = validateAddress();
    if (validateMessage != '') {
      // Show the validation error
      $('#auad_error').html(validateMessage).show();
    } else {
      url = '/settings/order/update';
      $.post(url, $('#orderUpdateAddress').serialize(), function(res) {
        if(res.response === 'error'){
          showOrderListTab();
          showActionResponse(res.response+' Updating Address Error::'+ res.error,true);
          //$('#orderInfo').append(res.response+' Updating Address Error::'+ res.error).addClass('error').show();
        }
        else{
          showOrderListTab();
          showActionResponse(res.response+' Updating Order');
          //$('#orderInfo').html(res.response+' Updating Address').addClass('success').show();
        }
      });
    }
  });
  */
});
