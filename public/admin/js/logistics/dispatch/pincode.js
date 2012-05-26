/* ---------------------------DataTable--------------------*/

var routingCodeFlag = '0';

var colMap = {
  'rowId': {
    'sName': '\'xrowId\'',
    'display_name': 'Row Id',
    'bVisible':false,
    'bSearchable': false,
    'bSortable': false
  },
  'select': {
    'sName': '\'xselect\'',
    'display_name': 'Select',
    'bSearchable': false,
    'bSortable': false
  },
  'pincode': {
    'sName': 'pincode',
    'display_name': 'Pincode'
  },
  'label': {
    'sName': 'name',
    'display_name': 'Courier Name'
  },
  'payment_type': {
    'sName': 'payment_type',
    'display_name': 'Payment Type'
  },
  /*
  'shipping_mode': {
    'sName': 'shipping_mode',
    'display_name': 'Shipping Mode'
  },
  */
  'enable_status': {
    'sName': 'enable_status',
    'display_name': 'Enable Status'
  },
  'edt': {
    'sName': 'edt',
    'display_name': 'Estimated Delivery Time'
  },
  'priority': {
    'sName': 'pincode_carrier.priority',
    'display_name': 'Priority'
  },
  'cost': {
    'sName': 'cost',
    'display_name': 'Cost'
  },
  'routing_code': {
    'sName': 'routing_code',
    'display_name': 'Routing Code'
  },
  'servicing_station': {
    'sName': 'servicing_station',
    'display_name': 'Servicing Station'
  },
  'carrier_id': {
    'sName': 'carrier_id',
    'display_name': 'Carrier Id',
    'bVisible': false,
    'bSearchable': false,
    'bSortable': false
  }
};

function validateAddPincodeForm() {
  
  $('#pincodeAdd-error').removeClass('error');
  $('#pincodeAdd-error').html('');
  
  $('#pincode-div').removeClass('error');
  $('#pincode-error').html('');
  var pin = $('#pin').val();
  if (pin == '') {
    $('#pincode-div').addClass('error');
    $('#pincode-error').html('This field is required.');
    return false;
  } 
  
  if (!ututils.validatePincode(pin)) {
    $('#pincode-div').addClass('error');
    $('#pincode-error').html('Invalid Pincode.');
    return false;
  }

  $('#carrier-div').removeClass('error');
  $('#carrier-error').html('');
  var idxCarrier = document.getElementById('courierservices-addPincode').selectedIndex;
  if (idxCarrier == 0) {
    $('#carrier-div').addClass('error');
    $('#carrier-error').html('This field is required.');
    return false;
  }

  $('#code-div').removeClass('error');
  $('#code-error').html('');
  if (routingCodeFlag == 1 && $('#code').val() == '') {
    $('#code-div').addClass('error');
    $('#code-error').html('This field is required.');
    return false;
  }
  
  return true;
}
/**
 *global variable for datatable
 */
var pincodeTable = {};

/**
 *fetches and populates pincode datatable
 */

function fetchPincodeTable(strPaymentType) {
  var sColumns = [],
      sHeaders = [];
  $('#modal-formAddNewPin').modal({
    backdrop: 'static',
    keyboard: true
  });
  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  pincodeTable = $('#pincodeListTable').dataTable({
    "bProcessing": true,
    "bServerSide": true,
    "sAjaxSource": "/logistics/dispatch/pincode/all",
    "aaSorting": [
      [1, 'desc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "sDom": '<"clear">lrtip',
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      for (var i = 1; i < (aData.length - 1); i++) { //1st column is dummy id and last column is id of courier company
        if (aData[i] === null) $('td:eq(' + (i - 1) + ')', nRow).html('null'); // i-1 because first is dummy 
      }
      return nRow;
    }
  })
  $("thead input").keyup(function () {
    //  Filter on the column (the index) of this element 
    pincodeTable.fnFilter(this.value, $("thead input").index(this));
  });

  $('#pincodeListTable').dataTable().makeEditable({
    "sUpdateURL": "/logistics/dispatch/pincode/updatePincodeDetails",
    "aoColumns": [
    null, null, null,
    {
      indicator: 'Saving...',
      tooltip: 'Click to edit Payment type',
      type: 'select',
      data: strPaymentType,
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (JSON.parse(this.textContent).status.indexOf('Error') != -1)
          setStatus(JSON.parse(this.textContent).status, false);
        else
          setStatus(JSON.parse(this.textContent).status, true);
        $('#pincodeListTable').dataTable().fnDraw();
      }
    }, /*{
      indicator: 'Saving...',
      tooltip: 'Click to edit shipment node',
      type: 'select',
      data: strShippingMode,
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (JSON.parse(this.textContent).status.indexOf('Error') != -1)
          $('#pinEditStatus').removeClass('success').addClass('important');
        else
          $('#pinEditStatus').removeClass('important').addClass('success');
        $('#pinEditStatus').html(JSON.parse(this.textContent).status).show();
        $('#pincodeListTable').dataTable().fnDraw();
      }
    },*/ {
      indicator: 'Saving...',
      tooltip: 'Click to edit enable status',
      type: 'select',
      data: "{'1':'Enabled','0':'Disabled'}",
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (JSON.parse(this.textContent).status.indexOf('Error') != -1)
          setStatus(JSON.parse(this.textContent).status, false);
        else
          setStatus(JSON.parse(this.textContent).status, true);
        $('#pincodeListTable').dataTable().fnDraw();
      }
    }, 
      null,
      {
      indicator: 'Saving...',
      tooltip: 'Click to edit priority',
      type: 'select',
      data: "{'1':'1','2':'2','3':'3'}",
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (JSON.parse(this.textContent).status.indexOf('Error') != -1)
          setStatus(JSON.parse(this.textContent).status, false);
        else
          setStatus(JSON.parse(this.textContent).status, true);
        $('#pincodeListTable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit cost',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (JSON.parse(this.textContent).status.indexOf('Error') != -1)
          setStatus(JSON.parse(this.textContent).status, false);
        else
          setStatus(JSON.parse(this.textContent).status, true);
        $('#pincodeListTable').dataTable().fnDraw();
      }
    },{
      indicator: 'Saving...',
      tooltip: 'Click to edit routing code',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (JSON.parse(this.textContent).status.indexOf('Error') != -1)
          setStatus(JSON.parse(this.textContent).status, false);
        else
          setStatus(JSON.parse(this.textContent).status, true);
        $('#pincodeListTable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit servicing station',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (JSON.parse(this.textContent).status.indexOf('Error') != -1)
          setStatus(JSON.parse(this.textContent).status, false);
        else
          setStatus(JSON.parse(this.textContent).status, true);
        $('#pincodeListTable').dataTable().fnDraw();
      }
    }],
    fnOnEditing: function (input) {
      setStatus("Updating...", true)
      return true;
    }
  });
  /**
   * Add pincode div display
   * */
  $('#add_pincode').click(function (event) {
    $('#pincode-div').removeClass('error');
    $('#pincode-error').html('');
    $('#carrier-div').removeClass('error');
    $('#carrier-error').html('');
    $('#code-div').removeClass('error');
    $('#code-error').html('');
    $('#modal-formAddNewPin').modal('show');
  });

  $('#cancelPinAdd').click(function (event) {
    $('#pincode-div').removeClass('error');
    $('#pincode-error').html('');
    $('#carrier-div').removeClass('error');
    $('#carrier-error').html('');
    $('#code-div').removeClass('error');
    $('#code-error').html('');
    $('#modal-formAddNewPin').modal('hide');
  });
  
  $('#courierservices-addPincode').change(function(event){
    $.get('/logistics/dispatch/carrier/'+this.value, function(result){
      if(result && !result.err && result.courier){
        routingCodeFlag = result.courier.routingcode_required;
      } 
    });
  });
  
  $('#submitPinAdd').click(function (event) {

    if(validateAddPincodeForm()) {
    var pinDetails = {
      'carrier_id': document.getElementById('courierservices-addPincode').value,
      'payment_type': $('#payment_type').val(),
      'enable_status': $('#enable_status').val(),
      'edt': $('#edt').val(),
      'pincode': $('#pin').val(),
      'priority': $('#priority').val(),
      'cost': $('#cost').val(),
      'shipping_mode': $('#shipping_mode').val(),
      'code': $('#code').val(),
      'servicing_station': $('#location').val()
    };
    
    var t = setTimeout(function() {
      $('#pincodeAdd-error').addClass('error');
      $('#pincodeAdd-error').html('Error communicating with server');
    }, 25000);
    
    $.post('/logistics/dispatch/pincode/addPincode', pinDetails, function (res) {
      clearTimeout(t);
      $('#pincodeAdd-error').removeClass('error');
      $('#pincodeAdd-error').html('');
      if (res.status == 'success') {
        $('#modal-formAddNewPin').modal('hide');
        setStatus('Pincode-Carrier Info Added.', true);
        $('#pincodeListTable').dataTable().fnDraw();
      } else {
        $('#pincodeAdd-error').addClass('error');
        $('#pincodeAdd-error').html(res.status);
      }
    });
    } else {
      $('#pincodeAdd-error').addClass('error');
      $('#pincodeAdd-error').html('Please fix the error to add pincode.');
    }
  });
  
  $('#select_pincode').click(function () {
    if ($(this).attr('checked') == 'checked'){
      $('.pincodeallClass').attr('checked', 'checked');
    }else{ 
      $('.pincodeallClass').removeAttr('checked');
    }
  });
};

function refreshPincodeTable(){
  pincodeTable.fnDraw();  
}

function setStatus(statusMsg, isSuccess){
  if(isSuccess === true){
    $('#pinEditStatus').html('<div class="alert-message block-message success"> ' + statusMsg + ' </div>');
  }else{
    $('#pinEditStatus').html('<div class="alert-message block-message error"> ' + statusMsg + ' </div>');
  }
  var t = setTimeout(function(){
    $('#pinEditStatus').html('');    
  }, 3000);
}

function initBulkUpdateControls(paymentTypes){
  var pincodeActions = '';
  pincodeActions += '<option value="1"> Status Change </option>';
  pincodeActions += '<option value="0"> Payment Type </option>';
  $('#pincodeAction').html('');
  $('#pincodeAction').append(pincodeActions);

  var pincodeStatus = '';
  pincodeStatus+= '<option value="1"> Enabled </option>';
  pincodeStatus+= '<option value="0"> Disabled </option>';
  $('#pincodeStatus').html('');
  $('#pincodeStatus').append(pincodeStatus);

  $('#pincodeAction').change(function(ev){
    if(1 === Number($('#pincodeAction').val())){
      $('#pincodeStatus').html('');
      var options = '';
      options += '<option value="1" > Enabled </option>';
      options += '<option value="0" > Disabled </option>';
      $('#pincodeStatus').append(options);
    }else if(0 === Number($('#pincodeAction').val())){
      $('#pincodeStatus').html('');
      var options = '';
      for(var i = 0 ;i < paymentTypes.length; i++){
        options += '<option value = "' + paymentTypes[i].name + '" > ' + paymentTypes[i].label + '</option>';
      }
      $('#pincodeStatus').append(options);
    }
  });
  
  $('#bulkPincodeUpdateForm').submit(function(ev){
    ev.preventDefault();
    var checked = $("input[@type=checkbox]:checked");    
    var pincodes = [];
    checked.each(function(){
      pincodes.push($(this).parent().parent().attr('id'));
    });
   
    var action = $('#pincodeAction').val();
    var updateStatus = $('#pincodeStatus').val();
    
    var updateData = {
      'action' : action,
      'updateStatus': updateStatus,
      'pincodes' : pincodes
    };

    if(pincodes.length > 0){
      $.post('/logistics/dispatch/pincode/updateAll', {'updateData' : updateData}, function(response){
        if(response.retStatus === 'success'){
          setStatus('Updated all Pincodes successfully.', true);
          refreshPincodeTable();
        }else if(response.retStatus === 'failure'){
          setStatus('Error while updating pincodes.', false);
        }
      });
    }
  });
}

$(document).ready(function () {
  $.getJSON('/logistics/dispatch/pincode/fetchLookups', function (res) {
    if (res.payment_type) { // && res.shipping_mode) {
      var strPaymentType = "{";
      //var strShippingMode = "{";
      
      for (var ptIndex=0; ptIndex<res.payment_type.length; ptIndex++)
        strPaymentType += "'" + res.payment_type[ptIndex].name + "' : '" + res.payment_type[ptIndex].label + "',";
      strPaymentType = strPaymentType.substring(0, strPaymentType.length-1) + "}";
      /*
      for (var smIndex=0; smIndex<res.shipping_mode.length; smIndex++)
        strShippingMode += "'" + res.shipping_mode[smIndex].name + "' : '" + res.shipping_mode[smIndex].label + "',";
      strShippingMode = strShippingMode.substring(0, strShippingMode.length-1) + "}";
      */

      //fetchPincodeTable(strPaymentType, strShippingMode);
      fetchPincodeTable(strPaymentType);
      initBulkUpdateControls(res.payment_type);
    }
  });
});
