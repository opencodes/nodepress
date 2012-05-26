function validateAndFetchOrderRto() {
  var orderId = $('#orderidRto').val();
  if (ututils.validateOrderId(orderId) == false) {
    $('#estimatedRto').text('invalid order # ' + orderId);
    setTimeout(function () {
      $('#orderidRto').focus().select();
    }, 1000);
    return;
  }
  $('#estimatedRto').text('fetching ...');
  $('#order-info').html('');
  $('#rtoSubmitBtn').attr('disabled', true);
  $('#orderidRto').attr('readOnly', true);
  var t = setTimeout(function () {
    $('#estimatedRto').text('Error communicating with server');
    $('#orderidRto').focus().select();
  }, 25000);
  $.getJSON('/logistics/tracking/approve/' + orderId, function (orderstatus) {
    var order = orderstatus.order;
    clearTimeout(t);
    if (order) {
      var displayOrder = {
        'orderId': order.id,
        'createdAt': order.created_at,
        'updatedAt': order.updated_at,
        'status': order.status,
        'customer': (order.customer_firstname + '  ' + order.customer_lastname),
        'email': order.customer_email || 'not available',
        'carrier': (order.carrier ? order.carrier.name : 'not available'),
        'shipmentId': (order.shipment ? order.shipment.id : 'not available'),
        'paymentMethod': (order.payment ? order.payment.method : 'not available'),
        'pincode': (order.shipping_address ? order.shipping_address.zip : 'not available'),
        'shipmentAddress': (order.shipping_address ? (order.shipping_address.address + ', ' + order.shipping_address.city) : 'not available')
      };
      var html = new EJS({
        url: '/ejs/logistics/tracking/rto-order-info.ejs'
      }).render('order-info', {
        order: displayOrder
      });
      $('#order-info').html(html);
      $('#rtoSubmitBtn').attr('disabled', false);
      $('#courierRto').val(order.carrier.id);
      $('#courierNumRto').val(displayOrder.shipmentId);
      
    } else {
      $('#orderidRto').attr('disabled', false);
      $('#orderidRto').focus().select();
    }
    
    if('rto already received' === orderstatus.message.trim().toLowerCase()){
      $('#rtoSubmitBtn').attr('disabled', true);
    }
    $('#estimatedRto').text(orderstatus.message);
  });
}

function resetFormRto() {
  $('#orderidRto').attr('readOnly', false);
  $('#estimatedRto').text('Enter Order #');
  $('#orderidRto').val('');
  $('#rtoApprovalCode').val('');
  $('#rtoSubmitBtn').attr('disabled', true);
  $('#order-info').html('');
  $('#orderidRto').focus().select();
}

function initRtoTab() {
  $("a[href='#approveRto']").click(function (e) {
    if (!$('#orderidRto').val()) {
      setTimeout(function () {
        $('#orderidRto').focus().select();
      }, 500);
    }
  });
  $('#orderidRto').keydown(function (event) {
    if (event.keyCode == 13) {
      validateAndFetchOrderRto();
      event.preventDefault();
      return false;
    }
  });
  $('#rtoApprovalCode').change(function (event) {
    var selectedValue = $('#rtoApprovalCode').val();
    if ('' !== selectedValue) {
      $('#rtoSubmitBtn').focus().select();
    }
  });
  $('#rtoCancelBtn').click(function () {
    resetFormRto();
  });
  $('#rtoForm').submit(function (event) {
    event.preventDefault();
    var orderId = $('#orderidRto').val();
    if (typeof orderId === 'undefined' || '' === orderId) {
      $('#estimatedRto').text('Enter Order #');
      $('#orderidRto').focus().select();
      return;
    }
    var approvalCode = $('#rtoApprovalCode').val();
    if (typeof approvalCode === 'undefined' || '' === approvalCode) {
      $('#estimatedRto').text('Select a reason for approval');
      $('#rtoApprovalCode').focus().select();
      return;
    }
    $('#estimatedRto').text('Updating order #' + orderId);
    $('#rtoSubmitBtn').attr('disabled', true);
    var t = setTimeout(function () {
      $('#estimatedRto').text('Error communicating with server');
    }, 60000);
    $.post('/logistics/tracking/approve', $(this).serialize(), function (response) {
      var msg = response.status || 'Request Failed';
      if ('success' === msg.toString().toLowerCase()) {
        $('#estimatedRto').text('Order #' + response.orderId + ' was processed');
        setTimeout(resetFormRto, 1000);
      } else {
        $('#estimatedRto').text(msg);
      }
      clearTimeout(t);
    });
    return false;
  });
}
$(function () {
  initRtoTab();
  if (!$('#orderidRto').val()) {
    setTimeout(function () {
      $('#orderidRto').focus().select();
    }, 500);
  }
});