/* ----------------------- Sent Mails Log ----------------- */

function getSkuLog() {
  $('#bulkSkuUpdateLog').submit(function (event) {
    event.preventDefault();
    $('#loggingInfo').html("");
    var dateSelected = $('#fs-datePicker').val();
    if (typeof dateSelected === 'undefined' || dateSelected === '') {
      $('#errorLabel').text('Select a Date').show();
    } else {
      var requestObject = new Object();
      requestObject.date = dateSelected;
      $.post('/inventory/bulk/sku/log', requestObject, function (results) {
        $('#errorLabel').addClass('label notice').html('Fetching Details');
        $('#errorLabel').show();
        var html = '<h4>There are no logs for given date.</h4>';
        if (results.data && results.data.length) {
          var dtResult = getDataTableFromDataAndColList(results.data, results.colNames, results.titles, 'logTable');
          html = dtResult;         
        }
        else{
          $('#logTable_wrapper').hide();
        }
        $('#errorLabel').hide();
        $('#loggingInfo').html(html);
        $('#fs-status').removeClass('notice').addClass('success').html('Done');
      });
    }
  });
}

function splitSku(skuStr) {
  return skuStr.split(/[,\r\n]+/);
}
function hideDataTable(){
  $('#logTable_wrapper').hide();
}

function initSkuLogTab() {
  getSkuLog();
} /* ----------------------- Main ------------------------ */

$(function () {
  initSkuLogTab();
});