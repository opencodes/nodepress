/* ----------------------- Bulk SKU Update----------------- */

function saveDetails() {
  $('#statusBU').addClass('label notice').html('Data Queued for updation...');
  $('#statusBU').show();
  var t = setTimeout(function () {
    $('#statusBU').hide();
  }, 10000);
  $('#testDiv').hide();
  $.post('/inventory/bulk/sku/save', function (res) {
    var html = '';
    if (!res.error) {
      html = 'Data queued sucessfully.';
      $("#replace").attr('disabled',false);
      $("#replace").removeAttr('checked');
      copyCB();
    } else {
      html = 'Error saving data.';
    }
    $('#errorLabel').hide();
    $('#statusQty').hide();
    $('#statusBU').addClass('label notice').html(html);
  });
}

function hideDataTable() {
  $('#verificationData').hide();
}

function hideVerificationForm() {
  $('#verificationData').html('');
  $('#replace').removeAttr("disabled");
  $("#replace").removeAttr('checked');
  $("#replace_hidden").removeAttr('checked');
  $('#statusQty').hide();
  
};

/**
 * 
 * This function is being called from child iframe, we will get the parsed data and render it here
 */

function getAndRenderParsedData(errs) {
  $.get('/inventory/bulk/sku/getSkuParsedData', function (result) {
    if (!result) {
      alert('An error occurred, please try again later');
      return;
    }

    var html = new EJS({
      url: '/ejs/inventory/bulkSkuDataTable.ejs'
    }).render();
    $('#verificationData').html(html);
    if (!errs) {
      $('#divSave').show();
      $('#divError').hide();
    } else {
      $('#divError').show();
      $('#divSave').hide();
    }
    $('#verificationData').show();
    var dtResult = getDataTableFromDataAndColList(result.data, result.colNames, result.titles, 'bulkSKUMove');
    $('#errDisplay').html(dtResult);
    $('#errDisplay').show();

  });
}

function initBulkSku() {
  $('#statusBU').hide();
  $('#errorLabel').hide();
}
function copyCB(){
  if($("#replace").is(':checked'))
    $("#replace_hidden").attr('checked','checked');
  else
    $("#replace_hidden").removeAttr('checked');
}
$(document).ready(function () {
  initBulkSku();
  copyCB();
  $('#statusQty').hide();
  $('#uploadBtn').click(function(event) {
    $('#statusQty').show();
  $('#replace').attr("disabled", true);
  if($("#replace").is(':checked'))
    $('#statusQty').addClass('label notice').html('going to replace Current Quantity');
  else
    $('#statusQty').addClass('label notice').html('going to add to Current Quantity');
  });
  $('#replace').click(function(event) {
    copyCB();
  });
});