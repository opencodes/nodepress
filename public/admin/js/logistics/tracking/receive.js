function validateAndFetchOrderRtoRes() {
  var orderId = $('#orderidRtoRes').val();
  if (!ututils.validateOrderId(orderId)) {
    $('#estimatedRtoRes').text('invalid order # ' + orderId);
    setTimeout(function () {
      $('#orderidRtoRes').focus().select();
    }, 1000);
    return;
  }
  $('#estimatedRtoRes').text('fetching ...');
  $('#orderidRtoRes').attr('readOnly', true);
  var t = setTimeout(function () {
    $('#estimatedRtoRes').text('Error communicating with server');
    $('#orderidRtoRes').focus().select();
  }, 25000);
  $.getJSON('/logistics/tracking/receive/' + orderId, function (orderstatus) {
    clearTimeout(t);
    if ('success' === orderstatus.status) {
      $('#estimatedRtoRes').text(orderstatus.message || 'unknown error occurred');
      var order = orderstatus.order;
      if (order) {       
        var courier = order.shipment ? order.shipment.carrier_id : order.courier_id || 'not available';
        var shipmentId = order.shipment ? order.shipment.awb_no : order.shipmentId || 'not available';
        $('#courierRtoRes').val(courier);
        $('#shipmentIdRtoRes').val(shipmentId);
      }
      $('#rtoResAcceptBtn').attr('disabled', false);
      $('#rtoResRejectBtn').attr('disabled', false);

      //STHAPLIYAL::13-JAN-12, Allow already received RTOs to be received / updated again.
      //1) Fill the 'Return AWB #' text field, and disable it.
      //2) Fill also the hidden field for the above text field.
      //3) Shift the focus to 'Reason For Rejection' drop down
      //STHAPLIYAL::20-JAN-12, ticket 66
      //1) Fill the hidden field for RTO reject message
      if ('order already rto' === orderstatus.message.trim().toLowerCase()) {
        $('#returnAWB').val(orderstatus.order.returnShipmentId);
        $('#hiddenReturnAWB').val(orderstatus.order.returnShipmentId);
        $('#returnAWB').attr('disabled', true);
        $('#rtoRejectMessage').focus().select();
        $('#hiddenRTORejectMessage').val(orderstatus.order.rejectMessage);
        $('#rtoResAcceptBtn').attr('disabled', true);
        $('#rtoResRejectBtn').attr('disabled', true);
      }


      if (orderstatus.approveMessage) {
        $('#approveMessageLabel').addClass('label success').text(orderstatus.approveMessage);
        $('#approveMessageDiv').show();
      }
      if ('rto approved' === orderstatus.message.trim().toLowerCase()) {
        var elems = $('#rtoRejectMessage option');
        for (var i = 0; i < elems.length; i++) {
          if (elems[i].innerHTML.toLowerCase() === '&nbsp;rto not approved&nbsp;') {
            var option = elems[i].value;
            $('#hiddenRtoOption').val(option);
            $('#rtoRejectMessage option[value=' + option + ']').remove();
            break;
          }
        }
      } else {
        restoreNotApprovedOption();
      }
    } else {
      $('#estimatedRtoRes').text(orderstatus.status);
      $('#orderidRtoRes').attr('disabled', false);
      $('#orderidRtoRes').focus().select();
    }
  });
}

function restoreNotApprovedOption() {
  var hiddenValue = $('#hiddenRtoOption').val();
  if ('' !== hiddenValue) {
    var restoreOption = '<option value=' + hiddenValue + '>&nbsp;RTO Not Approved&nbsp;</option>';
    $('#rtoRejectMessage').append(restoreOption);
    $('#hiddenRtoOption').val('');
  }
}

function resetFormRtoRes() {
  $('#orderidRtoRes').attr('readOnly', false);
  $('#orderidRtoRes').val('');
  $('#returnAWB').val('');
  $('#rtoRejectMessage').val('');
  restoreNotApprovedOption();
  $('#estimatedRtoRes').text('Enter Order #');
  $('#approveMessageDiv').hide();
  $('#rtoResAcceptBtn').attr('disabled', true);
  $('#rtoResRejectBtn').attr('disabled', true);
  $('#orderidRtoRes').focus().select();

  //STHAPLIYAL::13-JAN-12, Allow already received RTOs to be received / updated again.
  //1) Enable the 'Return AWB #' text field back to its normal state.
  //2) NULLify the hidden field for this text field too.
  //STHAPLIYAL::20-JAN-12, ticket 66
  //1) NULLify the hidden field hiddenRTORejectMessage too.
  $('#returnAWB').attr('disabled', false);
  $('#hiddenReturnAWB').val('');
  $('#hiddenRTORejectMessage').val('');
}

function initRtoResTab() {
  $('#approveMessageDiv').hide();
  $("a[href='#receiveRto']").click(function (e) {
    if (!$('#orderidRtoRes').val()) {
      setTimeout(function () {
        $('#orderidRtoRes').focus().select();
      }, 500);
    }
  });
  $('#orderidRtoRes').keydown(function (event) {
    if (event.keyCode == 13) {
      validateAndFetchOrderRtoRes();
      event.preventDefault();
      return false;
    }
  });
  $('#returnAWB').keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  });

  $('#rtoResForm').submit(function (event) {
    event.preventDefault();
    var orderId = $('#orderidRtoRes').val();
    if (typeof orderId === 'undefined' || '' === orderId) {
      $('#estimatedRtoRes').text('Enter Order #');
      $('#orderidRtoRes').focus().select();
      return;
    }
    $('#estimatedRtoRes').text('Updating order #' + orderId);
    $('#rtoResAcceptBtn').attr('disabled', true);
    $('#rtoResRejectBtn').attr('disabled', true);
    var t = setTimeout(function () {
      $('#estimatedRtoRes').text('Error communicating with server');
    }, 60000);
    $.post('/logistics/tracking/receive', $(this).serialize(), function (response) {
      var msg = response.status || 'Request Failed';
      if ('success' === msg.toString().toLowerCase()) {
        $('#estimatedRtoRes').text('Order #' + response.orderId + ' was processed');
        setTimeout(resetFormRtoRes, 1000);
      } else {
        $('#estimatedRtoRes').text(msg);
      }
      clearTimeout(t);
    });
    return false;
  });
  $('#rtoResCancelBtn').click(function () {
    resetFormRtoRes();
  });
  $('#rtoResAcceptBtn').click(function (event) {
    $('#rtoActionTaken').val('accept');
    var retAwb = $('#returnAWB').val();
    if (typeof retAwb === 'undefined' || '' === retAwb) {
      $('#estimatedRtoRes').text('Enter return AWB #');
      $('#returnAWB').focus().select();
      event.preventDefault();
      return;
    }
  });
  $('#rtoResRejectBtn').click(function (event) {
    $('#rtoActionTaken').val('reject');
    var retAwb = $('#returnAWB').val();
    if (typeof retAwb === 'undefined' || '' === retAwb) {
      $('#estimatedRtoRes').text('Enter return AWB #');
      $('#returnAWB').focus().select();
      event.preventDefault();
      return;
    }
    var rejectReason = $('#rtoRejectMessage').val();
    if (typeof rejectReason === 'undefined' || '' === rejectReason) {
      $('#estimatedRtoRes').text('Enter reason for rejection');
      $('#rtoRejectMessage').focus().select();
      event.preventDefault();
      return;
    }
  });
}
$(function () {
  initRtoResTab();
});