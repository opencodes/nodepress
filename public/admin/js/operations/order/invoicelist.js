/**
 *maps columns for datatable
 */
var invoiceColMap = {
  'id': {
    'sName': 'id',
    'display_name': 'Invoice #',
    'sClass': 'tdAnchor center'
  },
  'order_id': {
    'sName': 'order_id',
    'display_name': 'Order #',
    'sClass': 'center'
  },
  'grandtotal': {
    'sName': 'grandtotal',
    'display_name': 'Grand Total&nbsp;&nbsp;',
    'sClass': 'right'
  },
  'total_qty': {
    'sName': 'total_qty',
    'display_name': 'Quantity&nbsp;&nbsp;',
    'sClass': 'right'
  },
  'discount_amount': {
    'sName': 'discount_amount',
    'display_name': 'Discount&nbsp;&nbsp;',
    'sClass': 'right'
  },
  'shipping_amount': {
    'sName': 'shipping_amount',
    'display_name': 'Shipping&nbsp;&nbsp;',
    'sClass': 'right'
  },
  'payment_fee': {
    'sName': 'payment_fee',
    'display_name': 'Payment Fee&nbsp;&nbsp;',
    'sClass': 'right'
  },
  'created_at': {
    'sName': 'created_at',
    'display_name': 'Created at',
    'sWidth': '15%'
  }
};

/**
 *global variable for datatable
 */
var invoiceTable = {};

/**
 *fetches and populates vendor datatable
 */

function fetchInvoiceTable() {
  var sColumns = [];
  var sHeaders = [];
  var k = null;
  for (k in invoiceColMap) {
    if (invoiceColMap.hasOwnProperty(k)) {
      sColumns.push(k);
      sHeaders.push(invoiceColMap[k]['display_name']);
    }
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#invoiceColls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return invoiceColMap[data];
  });

  invoiceTable = $('#invoiceListTable').dataTable({
    "bProcessing": true,
    "bServerSide": true,
    "sAjaxSource": "/operations/invoices/all",
    "aaSorting": [
      [1, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "sDom": '<"H"lip>rt<"F">ip'
  });

  $(".invoiceListHead input").keyup(function () {
    invoiceTable.fnFilter(this.value, $(".invoiceListHead input").index(this));
  });
}

function refreshInvoiceListDataTable() {
  if (!ututils.isDataTable($('#invoiceListTable')[0])) {
    fetchInvoiceTable();
  } else {
    $('#invoiceListTable').dataTable().fnDraw();
  }
  $($($('#invoiceListTable thead').children()[0]).children()[0]).removeClass('tdAnchor');
}

/**
 * on load
 */
$(function () {
  $("a[href='#invoicelist']").click(function (e) {
    refreshInvoiceListDataTable();
  });

  $('#modalInvoiceDetails').modal({
    show: false,
    backdrop: 'static',
    keyboard: true
  });

  $('#invoiceListTable tbody tr td:nth-child(1)').live('click', function () {
    var orderId = $(this).next().text().trim();
    $.get('/operations/orders/invoice/' + orderId, function (html) {
      $('#invoiceDetails').html(html);
      $('#modalInvoiceDetails').modal('show');
    });
  });
});