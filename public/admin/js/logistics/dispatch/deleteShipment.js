function clearDeleteShipmentForm() {
  $('#bulkDeleteShipmentOrders').val("");
  $('#dispatchDeleteShipmentError').html("");
}

function splitOrderIds(idStr) {
  return idStr.split(/[,\r\n]+/).filter(Number);
}

$(function() {
  clearDeleteShipmentForm();
  
  $('#bulkDeleteShipmentForm').submit(function(event) {
    event.preventDefault();
    
    var orderIds = $('#bulkDeleteShipmentOrders').val();
    var allOrderIds = splitOrderIds(orderIds);
    
    var tt = setTimeout(function() {
      $("#dispatchDeleteShipmentError").html('');
    }, 15000);
    
    var t = setTimeout(function() {
      $('#dispatchDeleteShipmentError').html('<div class="alert-message block-message info">Error Communicating with Server.</div>');
    }, 25000);
    
    if (allOrderIds.length > 0){
      $.post('/logistics/dispatch/shipment/delete', {'orderIds' :allOrderIds} ,function(res) {
        clearTimeout(t);
        if(res.status === 'success'){
          $('#dispatchDeleteShipmentError').html('<div class="alert-message block-message success">' + res.msg + '</div>');
        } else {
          $('#dispatchDeleteShipmentError').html('<div class="alert-message block-message error">'+ res.msg + '</div>');
        }
      });
    } else {
      $('#dispatchDeleteShipmentError').html('<div class="alert-message block-message info">Enter some valid order Id(s).</div>');
    }

  });
});
