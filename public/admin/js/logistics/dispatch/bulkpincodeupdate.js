/* ----------------------- Bulk Pincodde Update ----------------------- */
function genTableData(pincode,prefix,enable) {
  return [
    '<td class="tableCell"><input type="checkbox" class="',
    prefix,
    '" ',
    enable?'checked':'',
    ' id="',
    prefix,
    pincode,
    '" name="',
    prefix,
    pincode,
    '" value="1"/></td>'
    ].join('');
}

function genEmptyTableData() {
  return '<td class="tableCell">&nbsp;</td>';
}

function genRowHtml(pincode, pincodeobj, paymentType) {
  var flag = false;
  var html = '<tr><td class="tableCell">' + pincode + '</td>';
  
  for (var ptIndex=0; ptIndex<paymentType.length; ptIndex++) {
    flag = false;
    for (var pmapIndex=0; pmapIndex<pincodeobj.length; pmapIndex++)
      if (paymentType[ptIndex].name == pincodeobj[pmapIndex].PT) {
        html += genTableData(pincode, paymentType[ptIndex].name+'_', pincodeobj[pmapIndex].Enbl === 1);
        flag = true;
        break;
      }
    
    if (!flag)
      html += genEmptyTableData();
  }
    
  html += '</tr>';
  return html;
}

function processPincodeBulk(pincodes, paymentType) {

  var html = '';
  for (var key in pincodes)
    html += genRowHtml(key, pincodes[key], paymentType);

  $('#pintbody').html(html); 
}

function splitPincodes(pincodeStr) {
  return pincodeStr.split(/[,\r\n]+/).filter(Number);
}

function clearBulkForm() {
  $('#bulkUpdateForm').hide();
  $('#bulkPincodes').val("");
  $('#messageValid').removeClass('success').removeClass('important').text("");
}

function initBulkUpdateTab(paymentType) {
  $('.togglecheck').click(function(e) {
    var checked_status = this.checked; 
    var classname = $(this).attr('cclass');
    $('.' + classname).attr('checked',checked_status);
  });
  
  $('#bulkUpdateForm').hide();

  $('#bulkUpdateForm').submit(function(event) {
    event.preventDefault();
    var courier = $('#courierservices-bulk').val();
    $('#messageValid').removeClass('important').addClass('success').text('Processing...');
    var t = setTimeout(function() {
      $('#messageValid').removeClass('success').addClass('important').text('Error communicating with server');
    }, 25000);
    $.post('/logistics/dispatch/pincode/bulk/update/'+courier , $(this).serialize() ,function(res) {
      clearTimeout(t);
      $('#messageValid').removeClass('important').addClass('success').text(res.status);
    });
    $('.bulkUpdateHeader').removeAttr('checked');
    $('#bulkUpdateForm').hide();
  });

  $('#bulkGetForm').submit(function(event) {
    event.preventDefault();
    $('#bulkUpdateForm').hide();
    $('#messageValid').removeClass('important').addClass('success').text("Fetching data...");
    var courier = $('#courierservices-bulk').val();
    var pincodeText = $('#bulkPincodes').val();
    if (courier != '' && pincodeText) {
      $('#passPincodes').val(pincodeText);
      var allPincodes = splitPincodes(pincodeText);
      var validPincodes = allPincodes.every(ututils.validatePincode);
      if(allPincodes.length == 0 || validPincodes == false) {
        $('#messageValid').removeClass('success').addClass('important').text('Invalid data');
      } else {
        var data = $(this).serialize();
        var t = setTimeout(function() {
          $('#messageValid').removeClass('success').addClass('important').text('Error communicating with server');
        }, 25000);
        
        $.post('/logistics/dispatch/pincode/bulk/get/'+courier , data ,function(res) {
          clearTimeout(t);
          if(res.status == 'success') {
            if (res.resultEmpty) {
              $('#messageValid').removeClass('success').addClass('important').text('Pincode(s) dont belong to the selected courier.');
            } else {
              processPincodeBulk(res.result, paymentType);
              $('#messageValid').removeClass('success').removeClass('important').text('');
              $('#bulkUpdateForm').show();
            }
          } else {
            $('#messageValid').removeClass('success').addClass('important').text('Error: ' + res.status);
          }
        });
      }
    } else {
      $('#messageValid').removeClass('success').addClass('important').text('No pincodes or courier entered!!');
    }
  });

}

$(function() {
  $.getJSON('/logistics/dispatch/pincode/fetchLookups', function (res) {
    if (res.payment_type) {
      initBulkUpdateTab(res.payment_type);
    }
  });
});
