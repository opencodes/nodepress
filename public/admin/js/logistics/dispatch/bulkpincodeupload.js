
/************************************DATA TABLE***************************************/

var pincodeColMap = {
  'pincode': {
    'sName': 'pincode',
    'display_name': 'Pincode'
  },
  'current_paymentType:': {
    'sName': 'current_paymentType:',
    'display_name': 'Current Payment Type'
  },
  'new_paymentType:': {
    'sName': 'new_paymentType:',
    'display_name': 'New Payment Type'
  },
  'routing_code': {
    'sName': 'routing_code',
    'display_name': 'Routing Code'
  },
  'servicing_station': {
    'sName': 'servicing_station',
    'display_name': 'Servicing Station'
  },
  'is_new':{
    'sName': 'is_new',
    'display_name': 'Is New'
  },
  'is_active':{
    'sName': 'is_active',
    'display_name': 'Is Active'
  },
  'validationStatus': {
    'sName': 'validationStatus',
    'display_name': 'Validation Status'
  }
};

/**
 *global variable for datatable
 */
var shipmentStatusTable = {};

/**
 *fetches and populates status datatable
 */

function fetchShipmentStatusTable() {

  $('#pincodeStatusBU').hide();
  var sColumns = [],
      sHeaders = [];
  
  for (var k in pincodeColMap) {
    sColumns.push(k);
    sHeaders.push(pincodeColMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#headDatatable').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return pincodeColMap[data];
  });
  
  shipmentStatusTable = $('#tableDatatable').dataTable({
    "bFilter":false,
    "bPaginate":false,
    "bLengthChange":false,
    "bProcessing": true,
    "bServerSide": true,
    "bDestroy":true,
    "sAjaxSource": "/logistics/dispatch/pincode/pincodedetails/getParsedData",
    "aoColumns": aoColumns,
    "bAutoWidth": false,
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      for (var i = 0; i < (aData.length - 1); i++) { //1st column is dummy id and last column is id of courier company
        if (aData[i] === null || aData[i] === '') $('td:eq(' + (i) + ')', nRow).html('null'); // i-1 because first is dummy 
      }
      return nRow;
    },
    "fnPreDrawCallback": function(oSettings){
      var invalidData = false;
      var data = oSettings.aoData;
      
      if(data){
        for(var i = 0; i < data.length; i++){
          var state = data[i]._aData[7];
          if(state !== 'No Error') {
            invalidData = true;
            break;
          }
        }
      
        if (invalidData) {
          $('#btnDatatableSave').hide();
          $('#divDatatableError').show();
        } else {
          $('#btnDatatableSave').show();
          $('#divDatatableError').hide();
        }   
      }
      return true;
    }
    
  });
}
/**************************************PINCODE BULK UPLOAD*************************************/

function getAndRenderParsedData(errorCode, err) {

  if (errorCode === 'invalidData'){
  
    var html = new EJS({
      url: '/ejs/logistics/uploadOrderStatus.ejs'
    }).render();

    $('#verificationData').html(html);
    if (err === 'false') {
      $('#btnDatatableSave').show();
      $('#divDatatableError').hide();
    } else {
      $('#divDatatableError').show();
      $('#btnDatatableSave').hide();
    }
    $('#verificationData').show();

    fetchShipmentStatusTable();

  } else {
    $('#pincodeStatusBU').addClass('error').html(err);
    $('#pincodeStatusBU').show();
    
    var t = setTimeout(function () {
      $('#pincodeStatusBU').hide();
    }, 10000);
  }
}

function validateForm() {

  var filepath = document.getElementById('pincodeuploadfilepath').value;

  if (filepath && (filepath.indexOf('.csv') != -1)) {
    return true;
  }

  $('#pincodeStatusBU').addClass('error').html('Error: Please select a valid .csv file to uplaod.');
  $('#pincodeStatusBU').show();
  
  var t = setTimeout(function () {
    $('#pincodeStatusBU').hide();
  }, 10000);

  return false;
}

function saveDetails() {
  $('#pincodeStatusBU').addClass('info').html('Data Queued for update...Please wait');
  $('#pincodeStatusBU').show();

  $('#divDatatable').hide();
  $.post('/logistics/dispatch/pincode/pincodedetails/save', function (res) {
    var html = '';
    if (res.status === 'success') {
      html = 'Data saved sucessfully.';
    } else {
      html = res.error || 'Error saving data.';
    }
    $('#pincodeStatusBU').addClass('info').html(html);
  });
}

function hideDataTable() {
  $('#verificationData').hide();
}

function hideVerificationForm() {
  $('#verificationData').html('');
}

$('#uploadType').change(function () {
  hideVerificationForm();
  if ($('#uploadType').val() == 'ENTIRE') {
    $('#incrementalUploadOption').addClass('couponHideCondField');
    $('#incrementalUploadOption').attr('disabled', true);
  } else if ($('#uploadType').val() == 'INCREMENTAL') {
    $('#incrementalUploadOption').removeClass('couponHideCondField');
    $('#incrementalUploadOption').attr('disabled', false);
  }
});

$('#incrementalUploadOption').change(function () {
  hideVerificationForm();
});

$(document).ready(function () {
  $('#pincodeStatusBU').hide();
  $('#uploadType').val('ENTIRE');
  $('#incrementalUploadOption').addClass('couponHideCondField');
  $('#incrementalUploadOption').attr('disabled', true);
  $("a[href='#dispatch-pincodeUpload']").click(function (e) {
    fetchShipmentStatusTable();
  });
});
