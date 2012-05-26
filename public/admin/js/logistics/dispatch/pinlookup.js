/* ----------------------- Pincode ------------------------ */

function processPincode(result, paymentType) {
  var carriers = result.carriers;
  if (result.status === 'success' && carriers) {
    var  tickIcon = '<img src="/images/icon-tick.gif"/>';
    var code = $('#pin').val();
    var flag = false;
    var carrier = null;

    $('#pin-status').html('<b>Pincode : '+ code +'</b>');

    html = '<table class="zebra-striped"><thead><tr>' +
           '<td><b>Courier Service</b></td>';
    
    for (var ptIndex=0; ptIndex<paymentType.length; ptIndex++) {
      html += '<td><b>' + paymentType[ptIndex].label + ' (EDT)</b></td>';
    }
    
    html += '</tr></thead><tbody>';
    
    for (var key in carriers) {
      html += '<tr><td class="tableCell">' + key + '</td>';
      
      for (var ptIdx=0; ptIdx<paymentType.length; ptIdx++) {
        flag = false;
        carrier = carriers[key];
        for (var cmapIdx=0; cmapIdx<carrier.length; cmapIdx++)
          if (paymentType[ptIdx].name == carrier[cmapIdx].PT) {
            html += '<td class="tableCell">' + tickIcon + ' (' + carrier[cmapIdx].EDT + ')</td>';
            flag = true;
            break;
          }
        
        if (!flag)
          html += '<td>&nbsp;</td>';
      }
        
      html += '</tr>';
    }
    html += '</tbody></table>';

    $('#pinstatustable').html(html);
  } else {
    $('#pin-status').html('<b>Currently we do not have any service for this area.</b>');
    $('#pinstatustable').html('');
  }
}

function initPincodeTab(paymentType) {

  $('#pinlookupForm').submit(function(event) {
    event.preventDefault();
    if (ututils.validatePincode($('#pin').val())) {
      var t = setTimeout(function() {
        $('#pin-status').html('<b>Error communicating with the server.</b>');
      }, 25000);
      var data = $(this).serialize();
      $.get('/logistics/dispatch/pincode/get',data,function(res) {
        clearTimeout(t);
        processPincode(res, paymentType);
      });
    } else { 
      $('#pin-status').html('<b>Invalid pin code.</b>');
      $('#pinstatustable').html('');
    }
  });

}

$(document).ready(function() {
  $.getJSON('/logistics/dispatch/pincode/fetchLookups', function (res) {
    if (res.payment_type) {
      initPincodeTab(res.payment_type);
    }
  });
});
