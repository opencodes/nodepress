/************************************DATA TABLE***************************************/

var orderColMap = {
  'order_id': {
    'sName': 'order_id',
    'display_name': 'Order Id'
  },
  'status': {
    'sName': 'status',
    'display_name': 'Shipping Status'
  },
  'comment': {
    'sName': 'comment',
    'display_name': 'Comments'
  },
  'delivered_at': {
    'sName': 'delivered_at',
    'display_name': 'Delivery Data'
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
  var sColumns = [],
      sHeaders = [],
      err = '';
  
  for (var k in orderColMap) {
    sColumns.push(k);
    sHeaders.push(orderColMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#headDatatable').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return orderColMap[data];
  });
  
  shipmentStatusTable = $('#tableDatatable').dataTable({
		"bFilter":false,
		"bPaginate":false,
		"bLengthChange":false,
    "bProcessing": true,
    "bServerSide": true,
    "sAjaxSource": "/logistics/trackorder/bulkOrderStatus/getParsedData",
    "aoColumns": aoColumns,
    "bAutoWidth": false,
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      //console.log('err : '+errorCode);
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
					var state = data[i]._aData[4];
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
  $("thead input").keyup(function () {
    //  Filter on the column (the index) of this element 
    shipmentStatusTable.fnFilter(this.value, $("thead input").index(this));
  });


  $('#tableDatatable').dataTable().makeEditable({
    "sUpdateURL": "/logistics/trackorder/bulkOrderStatus/updateShipmentStatus",
    "aoColumns": [
        {
      indicator: 'Saving...',
      tooltip: 'Click to edit Order Id',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        $('#orderStatusBU').html('Edit action finished. Status - ' + JSON.parse(this.textContent).status);
        $('#tableDatatable').dataTable().fnDraw();
      }
    }, 
    {
      indicator: 'Saving...',
      tooltip: 'Click to edit Shipment Status',
      type: 'select',
      data: "{'Shipped':'Shipped','In Transit':'In Transit','Delivered':'Delivered','Returned':'Returned','Lost':'Lost'}",
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        $('#orderStatusBU').html('Edit action finished. Status - ' + JSON.parse(this.textContent).status);
        $('#tableDatatable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit Comments',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        $('#orderStatusBU').html('Edit action finished. Status - ' + JSON.parse(this.textContent).status);
        $('#tableDatatable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit Delivered Date',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        $('#orderStatusBU').html('Edit action finished. Status - ' + JSON.parse(this.textContent).status);
        $('#tableDatatable').dataTable().fnDraw();
      }
    }],
    fnOnEditing: function (input) {
      $('#orderStatusBU').html('Updating...');
      return true;
    }
  });
  
}

/**************************************SHIPMENT STATUS*************************************/

function validateForm() {

  var filepath = document.getElementById('shipmentStatusFilePath').value;

  if (filepath && (filepath.indexOf('.csv') != -1)) {
    return true;
  }

  $('#orderStatusBU').addClass('error').html('Error: Please select a valid .csv file to uplaod.');
  $('#orderStatusBU').show();

  var t = setTimeout(function () {
    $('#orderStatusBU').hide();
  }, 10000);

  return false;
}

function saveDetails() {
  $('#orderStatusBU').addClass('info').html('Data Queued for updation...');
  $('#orderStatusBU').show();
  var t = setTimeout(function () {
    $('#orderStatusBU').hide();
  }, 10000);

  $.post('/logistics/trackorder/bulkOrderStatus/save', function (res) {
    if (res.retStatus === 'success') {
      $('#divDatatable').hide();
      $('#orderStatusBU').addClass('success').html(res.msg);
    } else {
      $('#orderStatusBU').addClass('error').html(res.msg);
    }
    $('#errorLabel').hide();
  });
}

function hideDataTable() {
  $('#verificationData').hide();
}

function hideVerificationForm() {
  $('#verificationData').html('');
}

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
    $('#orderStatusBU').addClass('error').html(err);
    $('#orderStatusBU').show();

    var t = setTimeout(function () {
      $('#orderStatusBU').hide();
    }, 10000);
  }
}

function validateAddShipStatusForm() {
  
  var orderIdsStr = $('#addShipOrderIds').val();
  var allOrderIds = orderIdsStr.split(/[,\r\n]+/).filter(Number);
  var validOrders = allOrderIds.every(ututils.validateOrderId);
  if(allOrderIds.length == 0 || validOrders == false) {
    $('#orderId-div').addClass('error');
    $('#addShipStatus-error').addClass('error');
    $('#addShipStatus-error').html('Invalid order Id(s).');
    return false;
  }else{
    $('#orderId-div').removeClass('error');
    $('#addShipStatus-error').removeClass('error');
    $('#addShipStatus-error').html('');
  }
        
  var deliveryDate = Date.parse($('#delivery_date').val());
  if(isNaN(deliveryDate) == true){
    $("#deliveryDate-div").addClass('error');
    return false;
  }else{
    $("#deliveryDate-div").removeClass('error');
  }

  var shipmentStatus =  $('#shipment_status').val();
  if(shipmentStatus === 'Delivered'){
    if(deliveryDate == undefined || deliveryDate == null || deliveryDate == ''){
      return false;
    }
  }
  return true;
}

function initBulkOrderStatus() {
  $('#orderStatusBU').hide();
  $('#errorLabel').hide();
    
  $('#modal-formAddShipmentStatus').modal({
    backdrop: 'static',
    keyboard: true
  });

  $('#addnewShipStatus').click(function (event) {
    $('#orderId-div').removeClass('error');
    $('#addShipStatus-error').addClass('error');
    $('#addShipStatus-error').html('');
    $('#modal-formAddShipmentStatus').modal('show');
  });
  
  $('#cancelAddShipStatus').click(function (event) {
    $('#modal-formAddShipmentStatus').modal('hide');
  });
  
  $('#submitAddShipStatus').click(function (event) {

    if(validateAddShipStatusForm()) {
      var orderIdsStr = $('#addShipOrderIds').val();
      var allOrderIds = orderIdsStr.split(/[,\r\n]+/).filter(Number);

      var statusDetails = {
        'order_ids': allOrderIds.join(','),
        'shipment_status': $('#shipment_status').val(),
        'comment': $('#comment').val(),
        'delivery_date': $('#delivery_date').val()
      };
    
      var t = setTimeout(function() {
        $('#addShipStatus-error').addClass('error');
        $('#addShipStatus-error').html('Error communicating with server');
      }, 25000);
    
      $.post('/logistics/trackorder/bulkOrderStatus/add', statusDetails, function (res) {
        clearTimeout(t);

        $('#addShipStatus-error').removeClass('error');
        $('#addShipStatus-error').html('');
        if (res['status'] == 'success') {
          $('#modal-formAddShipmentStatus').modal('hide');
        } else {
          $('#addShipStatus-error').addClass('error');
          $('#addShipStatus-error').html(res['status']);
        }
        if (res.showTable){
          getAndRenderParsedData(res.errorCode,res.errs);
        } else {
          $('#tableDatatable').dataTable().fnDraw();
        }
      });
    }
  });
}

$(document).ready(function () {
  initBulkOrderStatus();
});


