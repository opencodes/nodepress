var rtoColMap = {
  'Select': {
    'sName': '\'~\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false,
    'sWidth': '5%'
  },
  '`id`': {
    'sName': 'sales_order.`id`',
    'display_name': 'Order Id',
    'sWidth': '10%',
    'sClass': 'center rto-order'
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
  '`payment_method`': {
    'sName': '`payment_method`',
    'display_name': 'Payment Method',
    'sWidth': '15%'
  },
  '`grandtotal`': {
    'sName': '`grandtotal`',
    'display_name': 'GrandTotal',
    'sWidth': '10%'
  },
  '`status`': {
    'sName': 'sales_order.`status`',
    'display_name': 'Status',
    'sWidth': '15%'
  }
};


/**
 *global variable for datatable
 */
var rtoReceiveTable = {};

function fetchRtoReceiveTable() {
  var sColumns = [];
  var sHeaders = [];
  var key = null;
  for (key in rtoColMap) {
    if (rtoColMap.hasOwnProperty(key)) {
      sColumns.push(key);
      sHeaders.push(rtoColMap[key]['display_name']);
    }
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#rtoReceiveOrderCols').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return rtoColMap[data];
  });

  rtoReceiveTable = $('#rtoReceiveOrderTable').dataTable({
    'bProcessing': true,
    'bServerSide': true,
    'sAjaxSource': '/logistics/tracking/receivedRTO/all',
    'aaSorting': [
      [1, 'desc']
    ],
    'aoColumns': aoColumns,
    'iDisplayLength': 25,
    'sPaginationType': 'full_numbers',
    'bAutoWidth': false,
    'oLanguage': {
      'sSearch': 'Search all columns'
    },
    'fnRowCallback': function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      for (var i = 1; i < (aData.length - 1); i++) { //1st column is dummy id and last column is id of courier company
        if (aData[i] === null) $('td:eq(' + (i - 1) + ')', nRow).html('null'); // i-1 because first is dummy 
      }
      return nRow;
    }
  });

  $('.rtoOrderHead input').keyup(function () { /* Filter on the column (the index) of this element */
    rtoReceiveTable.fnFilter(this.value, $('.rtoOrderHead input').index(this));
  });
}

function refreshRtoDataTable() {
  rtoReceiveTable.fnDraw();
  $('#select_id').removeAttr('checked');
}

var fade = null;

function fadeOut(refresh, delay) {
  $('.fade-in').hide();
  if (fade) {
    clearTimeout(fade);
  }
  delay = typeof delay !== 'undefined' ? delay : 3000;
  fade = setTimeout(function () {
    $('#rtoOrderStatus').html('');
    $('.fade-in').html('').hide();
    if (refresh) {
      refreshRtoDataTable();
    }
  }, delay);
}

function getSelectedItems() {
  var checked = $('#rtoReceiveOrderTable input[@type=checkbox]:checked'); //find all checked checkboxes  
  var items = [];
  checked.each(function () {
    items.push($(this).val());
  });
  return items;
}

$('#rtocreditmemo_orders').click(function (event) {
  event.preventDefault();
  var orderIds = getSelectedItems();
  if (orderIds.length > 0) {
    $.post('/logistics/tracking/creditmemo', {
      'orderId': orderIds
    }, function (res) {
      $('#rtoOrderStatus').html('<div class="alert-message block-message success">' + res.message + '</div>');
      fadeOut(true);
    });
  } else {
    $('#rtoOrderStatus').html('<div class="alert-message block-message info">No item is selected.</div>');
    fadeOut();
  }
});

$('#rtolistitem_orders').click(function (event) {
  event.preventDefault();
  var orderIds = getSelectedItems();
  if (orderIds.length > 0) {
    $('#formrtolistitem_orders input[name=orderId]').val(orderIds.join(','));
    $('#formrtolistitem_orders').submit();
  } else {
    $('#rtoOrderStatus').html('<div class="alert-message block-message info">No item is selected.</div>');
    fadeOut();
  }
});

function checkedItemListeners() {
  var checkbox = 'input.trackingOrdersClass[type=checkbox]';
  $('#select_id').click(function () {
    $(checkbox).attr('checked', this.checked);
  });

  $('#rtoReceiveOrderTable').delegate('tr', 'dblclick', function () {
    $(this).find(checkbox).attr('checked', 'checked');
    $('#select_id').attr('checked', $(checkbox + ':not(:checked)').length === 0);
  });

  $(checkbox).live('click', function () {
    $('#select_id').attr('checked', $(checkbox + ':not(:checked)').length === 0);
  });
}

$(function () {
  fetchRtoReceiveTable();

  $('a[href="#rtoReceived"]').click(function (e) {
    refreshRtoDataTable();
  });

  checkedItemListeners();
});