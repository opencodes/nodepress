/* ---------------------------DataTable--------------------*/
var colMap = {
  '\'~\'': {
    'sName': '\'~\'',
    'display_name': 'Select',
    'bSearchable': false,
    'bSortable': false
  },
  'orderId': {
    'sName': 'sales_order.id',
    'display_name': 'Order #'
  },
  'status': {
    'sName': 'sales_order.status',
    'display_name': 'Status'
  },
  'carrier': {
    'sName': 'carrier_info.name',
    'display_name': 'Carrier'
  },
  'weight': {
    'sName': 'weight',
    'display_name': 'Weight'
  },
  'awb_number': {
    'sName': 'awb_no',
    'display_name': 'AWB Number'
  },
  'purchased_on': {
    'sName': 'sales_order.created_at',
    'display_name': 'Purchased On'
  },
  'payment_method': {
    'sName': 'sales_order.payment_method',
    'display_name': 'Payment Method'
  },
  'is_picked': {
    'sName': 'is_picked',
    'display_name': 'Shipment Picked'
  },
  'email_sent': {
    'sName': 'sales_shipment.email_sent',
    'display_name': 'Shipping Email Sent'
  }
};

/**
 *global variable for datatable
 */
var ordersDispatchTable = {};

function fetchOrdersTable(){
  var sColumns = [];
  var sHeaders = [];

  for(var key in colMap){
    sColumns.push(key);
    sHeaders.push(colMap[key]['display_name']);
  }
  
  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#orderListCols').html(html);

  var aoColumns = sColumns.map(function(data, index, arr){
    return colMap[data];
  });

  ordersDispatchTable = $('#ordersDispatchTable').dataTable({
    "bProcessing" : true,
    "bServerSide" : true,
    "sAjaxSource" : "/logistics/dispatch/orders/all",
    "aaSorting" : [
      [1, 'desc']
    ],
    "aoColumns" : aoColumns,
    "iDisplayLength" : 25,
    "sPaginationType" : "full_numbers",
    "bAutoWidth" : false,
    "oLanguage" : {
      "sSearch" : "Search all columns" 
    },
    "sDom"  : "liprtip",
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      for (var i = 1; i < (aData.length); i++) { //1st column is dummy id and last column is id of courier company
        if (aData[i] === null) $('td:eq(' + (i) + ')', nRow).html('null'); // i-1 because first is dummy 
      }
      //Fix for not able to copy OrderId from dataTable
      $('td:eq(1)', nRow).html( '<span class=\'orderIdlink\'>' + aData[1] + '</span>' );
      return nRow;
    }
  });
  $(".ordersDispatchHead input[type='text']").keyup(function () {
    ordersDispatchTable.fnFilter(this.value, $(".ordersDispatchHead input[type='text']").index(this)+1);
  });
  
  $('select#search_payment_method').change(function(){ 
    ordersDispatchTable.fnFilter($(this).val(), 7); 
  });
  
  $('select#search_shipmentpicked').change(function(){ 
    ordersDispatchTable.fnFilter($(this).val(), 8); 
  });
  
  $('select#search_emailsent').change(function(){ 
    ordersDispatchTable.fnFilter($(this).val(), 9); 
  });
}
//-----------------------------------------------------//
/**
  * Re-draw the data table
  */
function refreshDataTable(){
  ordersDispatchTable.fnDraw();
}

/**
  * Initialize the button actions
  */
function initDispatchconsoleTab(){
  $('#setStatusPicked').click(function(event){
    var checked = $("input[@type=checkbox]:checked"); //find all selected boxs
    var orderIds = [];
    checked.each(function () {
      orderIds.push($(this).val());
    });

    if(orderIds.length > 0){
      $.post('/logistics/dispatch/orders/picked', {'orderIds' : orderIds}, function(res){
        if(res.retStatus === 'success'){
          $("#orderActionResponse").html('<div class="span16 alert-message block-message success"> '+ res.msg+'</div>');
        } else {
          $("#orderActionResponse").html('<div class="span16 alert-message block-message error"> '+ res.msg+'</div>');
        }
        refreshDataTable();
      });
      
    } else {
      $("#orderActionResponse").html('<div class="span16 alert-message block-message info">No order is selected.</div>');
    }
    
    var t = setTimeout(function() {
      $("#orderActionResponse").html('');
    }, 5000);
  });

  $('#sendShipmentMail').click(function(event){
    var checked = $("input[@type=checkbox]:checked"); //find all selected boxs
    var orderIds = [];
    checked.each(function () {
      orderIds.push($(this).val());
    });

    if(orderIds.length > 0){
      $('#sendShipmentMail').attr('disabled', true);
      $("#orderActionResponse").html('<div class="span16 alert-message block-message info">Sending Emails for selected orders. Please wait....</div>');
      $.post('/logistics/dispatch/orders/mail', {'orderIds' : orderIds}, function(res){
        $('#sendShipmentMail').attr('disabled', false);
        if(res.retStatus === 'success'){
          $("#orderActionResponse").html('<div class="span16 alert-message block-message success"> '+ res.msg+'</div>');
        } else {
          $("#orderActionResponse").html('<div class="span16 alert-message block-message error"> '+ res.msg+'</div>');
        }
        //set timer after callback as sending mail takes more time.
        var t = setTimeout(function() {
          $("#orderActionResponse").html('');
        }, 5000);
        refreshDataTable();
      });
 
    } else {
      var t = setTimeout(function() {
        $("#orderActionResponse").html('');
      }, 5000);
 
      $("#orderActionResponse").html('<div class="span16 alert-message block-message info">No order is selected.</div>');
    }
    
  });
  
  $('#shipWOShipmentMail').click(function(event){
    var checked = $("input[@type=checkbox]:checked"); //find all selected boxs
    var orderIds = [];
    checked.each(function () {
      orderIds.push($(this).val());
    });

    if(orderIds.length > 0){
      $('#shipWOShipmentMail').attr('disabled', true);
      $.post('/logistics/dispatch/orders/shipwithoutmail', {'orderIds' : orderIds}, function(res){
        $('#shipWOShipmentMail').attr('disabled', false);
        if(res.retStatus === 'success'){
          $("#orderActionResponse").html('<div class="span16 alert-message block-message success"> '+ res.msg+'</div>');
        } else {
          $("#orderActionResponse").html('<div class="span16 alert-message block-message error"> '+ res.msg+'</div>');
        }
        refreshDataTable();
      });
 
    } else {
      $("#orderActionResponse").html('<div class="span16 alert-message block-message info">No order is selected.</div>');
    }
    
    var t = setTimeout(function() {
      $("#orderActionResponse").html('');
    }, 5000);
  });
  
  $('#deleteSelectedShipment').click(function(event){
    var checked = $("input[@type=checkbox]:checked");
    var orderIds = [];
    checked.each(function(){
      orderIds.push($(this).val());  
    });
    
    if(orderIds.length > 0){
      $.post('/logistics/dispatch/orders/delete', {'orderIds':orderIds},function(res){
        $("#orderActionResponse").html('<div class="span16 alert-message block-message success">' + res.msg + '</div>');
        refreshDataTable();
      });
    } else {
      $("#orderActionResponse").html('<div class="span16 alert-message block-message info">No order is selected.</div>');
    }
    
    var t = setTimeout(function() {
      $("#orderActionResponse").html('');
    }, 5000);
  });
  
  $('#printInvoice').click(function(event){
    var checked = $("input[@type=checkbox]:checked");    
    var orderIds = [];
    checked.each(function(){
      orderIds.push($(this).val());  
    });

    if(orderIds.length > 0){
      $("#action").val("invoice");
      $("#orderId").val(orderIds);
      $("form#orderDispatchForm").attr("action", "/operations/orders/invoice").submit(); 
    } else {
      $("#orderActionResponse").html('<div class="span16 alert-message block-message info">No order is selected.</div>');
    }
    
    var t = setTimeout(function() {
      $("#orderActionResponse").html('');
    }, 5000);
  });
  
  $('#export_shipped_orders').click(function (event) {
    var checked = $("input[@type=checkbox]:checked");    
    var orderIds = [];
    checked.each(function(){
      orderIds.push($(this).val());  
    });

    if(orderIds.length > 0){
      var tableParams = ordersDispatchTable.oApi._fnAjaxParameters(ordersDispatchTable.fnSettings());
      var obj = '?';
      var oper = '';
      for (var i = 0; i < tableParams.length; i++) {
        obj += oper;
        obj += tableParams[i]['name'] + '=' + tableParams[i]['value'];
        oper = '&';
      }
      $("form#orderDispatchForm").attr("action", "/logistics/dispatch/orders/exportall" + obj).submit();
    } else {
      $("#orderActionResponse").html('<div class="span16 alert-message block-message info">No order is selected.</div>');
      var t = setTimeout(function() {
        $("#orderActionResponse").html('');
      }, 5000);
    }
  });

  $('#select_orderid').click(function () {
    if ($(this).attr('checked') == 'checked'){
      $('.dispatchConsoleClass').attr('checked', 'checked');
    }else{ 
      $('.dispatchConsoleClass').removeAttr('checked');
    }
  });
}

/* ----------------------- Main ------------------------ */
$(function() {
    fetchOrdersTable();
    initDispatchconsoleTab();

    $("a[href='#dispatch-console']").click(function (e) {
      refreshDataTable();
    });
});
