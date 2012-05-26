function showAlert(div, message){
  $(div).html('<font color=red><i>' + message + '</i></font>');
  setTimeout(function () {
      $(div).html('');
  }, 2000);
}

function renderGatewayDetails(div, gwName, details) {
  $(div).html('');
  if(details != null) {
    $('#gateway_info').show();
    $('#gw_name').val(gwName);
    $('#gw_label').val(gwName);
    var tocheck = details.isEnabled && details.isEnabled == 1;
    if(details.isEnabled && details.isEnabled)
      $('#gw_enabled').attr('checked', tocheck);
    else
      $('#gw_enabled').removeAttr('checked');
    $('#gw_priority').val(details.priority || '');
    var html = new EJS({url: '/ejs/infra/gateway_details.ejs'}).render({ 'details': details.methods ? JSON.parse(details.methods) : {}});
    $(div).html(html); 
  } else {
    showAlert('#gwUpdateMessage', 'No data found');
  }
}

function getGatewayDetails() {
  $('#gateway_new').hide();
  var gwName = $('#payment_gateways').val();
  if (gwName == undefined || gwName === 0 || '' === gwName) {
    showAlert('#gwMessage', 'Please select one gateway');
    return;
  }
  
  $.get('/settings/payment/getGatewayInfo/' + gwName,  function (res) {
    if (res.response==='success') {
      var details = JSON.parse(res.details);
      renderGatewayDetails('#gwDetails', gwName, details);
    } else {
      var msg = res.error_message || 'unable to get details';
      showAlert('#gwMessage', msg);
    }
  });
}

function addGateway() {
  $('#gateway_info').hide();
  $('#gw_add_name').val('');
  $('#gw_add_enabled').removeAttr("checked");
  $('#gw_add_priority').val('');
  $('#gw_add_methods').val('');
  $('#gateway_new').show();
}

function initGatewayTab() {
  $('#gateway_info').hide();
  $('#gateway_new').hide();
  
  $('#editGwBtn').click(function () {
    getGatewayDetails();
  });
  
  $('#addGwBtn').click(function () {
    addGateway();
  });
  
  $('#gwUpdateBtn').click(function () {
    $.post("/settings/payment/gatewayUpdate", $('#gateway_update').serialize(), function(res){
      if (res.response==='success') {
        $('#gateway_info').hide();
        showAlert('#gwMessage', 'values updated successfully');
      } else {
        var error = res.error_message || '';
        showAlert('#gwUpdateMessage', 'unable to update value ' + error);
      }
    });
  });
  
  $('#gwAddBtn').click(function () {
    if($('#gw_add_name').val() == undefined || $('#gw_add_name').val() == ''){
      showAlert('#gw_add_name_msg', 'name should not be empty');
      return;
    }
    
    if($('#gw_add_methods').val() != undefined){
      try{
        JSON.stringify($('#gw_add_methods').val());
      } catch(e){
        showAlert('#gw_add_methods_msg', 'methods should be a proper json string');
        return;
      }
    }
    
    $.post("/settings/payment/gatewayAdd", $('#gateway_add').serialize(), function(res){
      if (res.response==='success') {
        showAlert('#gwMessage', 'gateway added successfully');
        $('#gateway_info').hide();
        $('#gateway_new').hide();
      } else {
        var error = res.error_message || '';
        showAlert('#gwAddMessage', 'unable to add gateway ' + error);
      }
    });
  });
}

$(function() {
  initGatewayTab();
});
