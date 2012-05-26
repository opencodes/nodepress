var colMap = {
  'Select': {
    'sName': '\'select\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false
  },
  '`id`': {
    'sName': '`id`',
    'display_name': 'Order #',
    'sClass': 'center',
    'sWidth': '7%'
  },
  '`created_at`': {
    'sName': '`created_at`',
    'display_name': 'Purchased On',
    'sWidth': '15%'
  },
  '`customer_firstname`': {
    'sName': '`customer_firstname`',
    'display_name': 'First Name'
  },
  '`customer_lastname`': {
    'sName': '`customer_lastname`',
    'display_name': 'Last Name'
  },
  '`customer_email`': {
    'sName': '`customer_email`',
    'display_name': 'Email'
  },
  '`payment_method`': {
    'sName': '`payment_method`',
    'display_name': 'Payment Method',
    'sWidth': '12%'
  },
  '`grandtotal`': {
    'sName': '`grandtotal`',
    'display_name': 'Grand Total&nbsp;&nbsp;',
    'sClass': 'right',
    'sWidth': '9%'
  },
  '`status`': {
    'sName': '`status`',
    'display_name': 'Status'
  }
};


function fetchTableData() {
  var sColumns = [];
  var sHeaders = [];
  var k = null;
  for (k in colMap) {
    if (colMap.hasOwnProperty(k)) {
      sColumns.push(k);
      sHeaders.push(colMap[k]['display_name']);
    }
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  var oTable = $('#orderListTable').dataTable({
    "bProcessing": false,
    "bRetrieve": true,
    "bServerSide": true,
    "bStateSave": true,
    "sAjaxSource": "/operations/orders/all",
    "aaSorting": [
      [1, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "sDom": '<"H"lip>rt<"F">ip',
    "fnDrawCallback": function () {
      $("#selectFlflmntOrders").removeAttr("checked");
      $('#cbactorderList').html('<strong class="selectcount"> 0 </strong>item selected');
    },
    "fnRowCallback": function (nRow, aData, iDisplayIndex) {
      //Fix for not able to copy OrderId from dataTable
      $('td:eq(1)', nRow).html('<span class=\'orderIdlink\'>' + aData[1] + '</span>');
      return nRow;
    }
  });

  $(".orderlistHead input").keyup(function () { /* Filter on the column (the index) of this element */
    oTable.fnFilter(this.value, $(".orderlistHead input").index(this));
  });
}

function showActionResponse(res, isError) {
  $('#actionResponseBlock').show();
  if (isError) {
    $('#actionResponseBlock').addClass('error');
  } else {
    $('#actionResponseBlock').addClass('success');
  }
  $('#actionResponse').html(res);
}

function hideActionResponse() {
  $('#actionResponseBlock').hide();
  $('#actionResponse').html('');
}

function refreshDataTable() {
  if (!ututils.isDataTable($('#orderListTable')[0])) { //isDataTable() is in ututils.js
    fetchTableData();
  } else {
    $('#orderListTable').dataTable().fnStandingRedraw();
  }
  $('.flflmntOrderClass').removeAttr('checked');
  $('#selectFlflmntOrders').removeAttr('checked');
}

$('#cancel_orders').click(function (event) {
  var checked = $("input[class='flflmntOrderClass']:checked"); //find all checked checkboxes  
  var orderId = [];
  checked.each(function () {
    orderId.push($(this).val());
  });
  if (orderId.length > 0) {
    hideActionResponse();
    var htmlContent = 'Cancel orders ';
    var count = 0;
    for (count; count < orderId.length; count++) {
      htmlContent = htmlContent + ' ' + orderId[count];
    }
    htmlContent += '<br><input type=\'checkbox\' id=\'sendCancelMail\' checked=true /> Send Email';
    $('#fullfillment_action_modal').modal({
      show: true,
      backdrop: true,
      keyboard: true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function (event) {
      var sendMail = ($('#sendCancelMail').attr('checked') === 'checked');
      $.post('/operations/orders/cancel', {
        'orderId': orderId,
        'flagInventoryUpdate': true,
        'sendCancelMail': sendMail
      }, function (res) {
        $('#fullfillment_action_modal').modal('hide');
        showActionResponse(res.ordersCanceled + ' orders canceled');
        refreshDataTable();
      });
    });
    $('#fullfillment_action_cancel').unbind('click');
    $('#fullfillment_action_cancel').click(function (event) {
      $('#fullfillment_action_modal').modal('hide');
    });
  }
});

$('#hold_orders').click(function (event) {
  var checked = $("input[class='flflmntOrderClass']:checked"); //find all checked checkboxes  
  var orderId = [];
  checked.each(function () {
    orderId.push($(this).val());
  });
  if (orderId.length > 0) {
    hideActionResponse();
    var htmlContent = 'Hold orders ';
    var count = 0;
    for (count; count < orderId.length; count++) {
      htmlContent = htmlContent + ' ' + orderId[count];
    }
    $('#fullfillment_action_modal').modal({
      show: true,
      backdrop: true,
      keyboard: true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function (event) {
      $.post('/operations/orders/hold', {
        'orderId': orderId
      }, function (res) {
        $('#fullfillment_action_modal').modal('hide');
        showActionResponse(res.ordersHolded + ' orders holded');
        refreshDataTable();
      });
    });
    $('#fullfillment_action_cancel').unbind('click');
    $('#fullfillment_action_cancel').click(function (event) {
      $('#fullfillment_action_modal').modal('hide');
    });
  }
});

$('#unhold_orders').click(function (event) {
  var checked = $("input[class='flflmntOrderClass']:checked"); //find all checked checkboxes  
  var orderId = [];
  checked.each(function () {
    orderId.push($(this).val());
  });
  if (orderId.length > 0) {
    hideActionResponse();
    var htmlContent = 'Unhold orders ';
    var count = 0;
    for (count; count < orderId.length; count++) {
      htmlContent = htmlContent + ' ' + orderId[count];
    }
    $('#fullfillment_action_modal').modal({
      show: true,
      backdrop: true,
      keyboard: true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function (event) {
      $.post('/operations/orders/unhold', {
        'orderId': orderId
      }, function (res) {
        $('#fullfillment_action_modal').modal('hide');
        showActionResponse(res.ordersUnholded + ' orders unholded');
        refreshDataTable();
      });
    });
    $('#fullfillment_action_cancel').unbind('click');
    $('#fullfillment_action_cancel').click(function (event) {
      $('#fullfillment_action_modal').modal('hide');
    });
  }
});

$('#authorize_orders').click(function (event) {
  var checked = $("input[class='flflmntOrderClass']:checked"); //find all checked checkboxes  
  var orderId = [];
  checked.each(function () {
    orderId.push($(this).val());
  });
  if (orderId.length > 0) {
    hideActionResponse();
    var htmlContent = 'Authorize orders ';
    var count = 0;
    for (count; count < orderId.length; count++) {
      htmlContent = htmlContent + ' ' + orderId[count];
    }
    htmlContent += '<br><input type=\'checkbox\' id=\'sendConfirmationMail\' checked=true /> Send Email';
    $('#fullfillment_action_modal').modal({
      show: true,
      backdrop: true,
      keyboard: true
    });
    $('#fullfillment_action_message').html(htmlContent);
    $('#fullfillment_action_ok').unbind('click');
    $('#fullfillment_action_ok').click(function (event) {
      var sendMail = ($('#sendConfirmationMail').attr('checked') === 'checked');
      
      $.ajax({
        type: "POST",
        url: "/operations/orders/authorize",
        data: {
          'orderId': orderId,
          'sendOrderPlacedMail': sendMail
          },    
        dataType: "html",
        success: function(res) {
          $('#fullfillment_action_modal').modal('hide');
          var result = {};
          try{
            if(res)
              result = JSON.parse(res);
          }catch(e){};
          var authorizedOrders = result.ordersAuthorized || 0;
          showActionResponse(authorizedOrders + " orders authroized");
          refreshDataTable();
        },
        error : function(err){
          $('#fullfillment_action_modal').modal('hide');
          showActionResponse('You are forbidden to perform this action. Your attempt has been logged.' +
            'If you think this is an error, report it to <a href="mailto:admin@urbantouch.com">Site Admin</a>', true);
          refreshDataTable();
        }
      });
    });
    $('#fullfillment_action_cancel').unbind('click');
    $('#fullfillment_action_cancel').click(function (event) {
      $('#fullfillment_action_modal').modal('hide');
    });
  }
});


function selectDeselectFeature(tableid, checkboxaction) {
  var html = '<strong class="selectcount"> 0 </strong> item selected.';
  $(checkboxaction).html(html);
  
  
  $(tableid + ' input:checkbox').live('click', function (event) {
    var checkedcount = $(tableid + " input:checkbox:checked").length;
    var selectchecked = $(tableid+' th input:checkbox').attr('checked');
    if (selectchecked && selectchecked=='checked') {
      checkedcount -= 1;
    }
    $(checkboxaction + " strong.selectcount").text(checkedcount);
  });
}

$('#selectFlflmntOrders').click(function () {
  if ($(this).attr('checked') == 'checked') $('.flflmntOrderClass').attr('checked', 'checked');
  else $('.flflmntOrderClass').removeAttr('checked');
});

$('#createOrder').click(function (event) {
  clearCartForNewOrder();
  $('#modal-formAddNewOrder').modal('show');
  $('#errorCrtOrder').hide();
  $('.addressDetails').hide();
  fetchCustomerTableData();
});

$(document).ready(function () {
  $("a[href='#orderlist']").click(function (e) {
    refreshDataTable();
  });
  $('#clearOrderSearch').click(function (event) {
    $('.search_init').val('');
    $('#orderListTable').dataTable().fnResetAllFilters();
  });
  $('#cbactorderList').html('');

  selectDeselectFeature('#orderListTable', '#cbactorderList');

  //following code is needed in the first (default active) tab, since console-utils.js code for 'menuToTab' 
  //won't work if any of the menu drop down items is accessed while some other menu is active
  var URL = window.location.href;
  if (URL.indexOf('#') != -1) {
    var divId = URL.substring(URL.indexOf('#'), URL.length);
    $(window).load(function () {
      $('a[href=\'' + divId + '\']').trigger('click');
    });
  } else {
    refreshDataTable();
    $('#clearOrderSearch').trigger('click');
  }
  $('.numericOnly').live('keypress', function (event) {
    if (!(ututils.isKeyNumeric(event) || ututils.isKeyArrows(event))) {
      event.preventDefault();
      return;
    }
  });
  $('#print_invoice').click();

  $("#bulk_print_invoice_button").click(function () {
    var checkedValues = [];
    var form = $("form#orderListTableForm");
    var htmls = '';

    $('#orderListTable input[type="checkbox"]:checked').each(function () {
      htmls += '<input name="orderId[]"  value="' + $(this).val() + '" type="hidden" />';
    });
    if ('' === htmls) {
      return;
    }
    htmls += '<input type="hidden" name="action" value="invoice" />';
    form.html(htmls);
    $.post('/operations/orders/checkforprintinvoice', form.serialize(), function (res) {
      var orders = res.ordrids;
      var successcount = 0;
      var index = null;
      for (index in orders) {
        if ('OK' === orders[index]) {
          successcount++;
        }
      }
      if (successcount > 0) {
        form.submit();
      } else {
        $('#fullfillment_action_modal').modal({
          show: true,
          backdrop: true,
          keyboard: true
        });
        $('#fullfillment_action_message').html('None of the Order selected are in status to print invoice');
        $('#fullfillment_action_ok').unbind('click');
        $('#fullfillment_action_ok').click(function (event) {
          $('#fullfillment_action_modal').modal('hide');
        });
        $('#fullfillment_action_cancel').unbind('click');
        $('#fullfillment_action_cancel').click(function (event) {
          $('#fullfillment_action_modal').modal('hide');
        });
      }
    });
  });
});
