
function validateTime(){
  
  var fromhh = Number($('#logisticsFromDatehh').val().trim());
  var tohh = Number($('#logisticsToDatehh').val().trim());
  var frommm = Number($('#logisticsFromDatemm').val().trim());
  var tomm = Number($('#logisticsToDatemm').val().trim());
  
  var t = setTimeout(function() {
    $("#logicsticsReportTimeErrorDiv").html('');
  }, 8000);

  if(!(0 <= fromhh && fromhh < 24  && 0 <= frommm && frommm < 60)){
    $('#logicsticsReportTimeErrorDiv').html('<div class="alert-message block-message error"> Invalid "FROM" time.</div>');
    return false;
  }
  
  if(!(0 <= tohh && tohh < 24  && 0 <= tomm && tomm < 60)){
    $('#logicsticsReportTimeErrorDiv').html('<div class="alert-message block-message error"> Invalid "TO" time.</div>');
    return false;
  }
  
  return true;
}

$(function(){
  $('#logicsticsReportError').click(function(){
    $('#logicsticsReportErrorDiv').hide();
  });
  
  
  $('#logisticsDownloadReport').click(function(event) {
    event.preventDefault();
    
    if(validateTime()){
  		var t = setTimeout(function() {
    		$("#logicsticsReportTimeErrorDiv").html('');
  		}, 8000);
			$('#logicsticsReportTimeErrorDiv').html('<div class="alert-message block-message error">Dowloading Report. Please wait....</div>');
      $("form#logisticsShippingReportForm").attr('action',"/logistics/report/get").submit();
    }
  });
});
