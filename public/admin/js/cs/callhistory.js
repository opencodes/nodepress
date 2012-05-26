/* ----------------------- History Tab ----------------- */
var dTable;
var colMap = {
  '`sid`': {
    'sName': '`sid`',
    'display_name': 'sid',
    'sClass': 'hide-cell',
    'bSearchable':false
  },
  '`from`': {
    'sName': '`from`',
    'display_name': 'Call From'
  },
  '`customer_name`': {
    'sName': '`customer_name`',
    'display_name': 'Customer Name'
  },
  '`to`': {
    'sName': '`to`',
    'display_name': 'Agent No'
  },
  '`customer_email`': {
    'sName': '`customer_email`',
    'display_name': 'Customer Email'
  },
  '`start_time`': {
    'sName': '`start_time`',
    'display_name': 'Time of Call'
  }

};



function fetchTableData() {
  $('#feedback-search').hide();
  $('#feedback-history').hide();
  $('#customer_orders').hide();
  var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data]
  });

  var dTable = $('#calllogtablereport').dataTable({
    "bProcessing": true,
    "sDom": 'lrtip',
    "bServerSide": true,
    "sAjaxSource": "/cs/fetchcalls",
    "aoColumns": aoColumns,
    "sPaginationType": "full_numbers",
    "bDestroy": true,
    "aaSorting": [
      [5, 'asc']
    ],
    "iDisplayLength": 10,
    "bAutoWidth": false
  });


  $('#calllogtablereport thead input[type="text"]').keyup(function () {
    dTable.fnFilter(this.value, $('#calllogtablereport thead input[type="text"]').index(this)+1);
  });
}

function hideOrderTable() {
  $('#customer_orders').hide();
}

function renderOrderDetails(SID) {
  $('#customer_orders').hide();
  $('#feedback-history').hide();
  $('#cancelMail-history').hide();
  $('#orderDetailStatus').text('');
  $.get('/cs/sids/' + SID, function (res) {
    if (res.retStatus == "success") {
      if (res.order) {
        $('#orderDetailsHistory').html('');
        $('#history_customerName').text(res.order[0].customer_firstname);
        renderOrders('#orderDetailsHistory', res.order, res.store_url);
        $('#customer_orders').show();
      } else {
        $('#orderDetailStatus').text('Error: ' + res.err);
      }
    }
  });
}

function refreshDataTable() {
  if (!ututils.isDataTable($('#calllogtablereport')[0])) { //isDataTable() is in ututils.js
    fetchTableData();
  } else {
    $('#calllogtablereport').dataTable().fnDraw();
  }
}

function initHistoryTab() {
  $('#feedback-history').hide();
  $('#calllogtablereport tbody tr td:nth-child(3)').live('click', function () {
    if ($(this).text().trim() != '') {
      renderOrderDetails($($(this).parent().children(':first-child')).text());
    }
  });
  $("a[href='#callHistory']").click(function (e) {
    refreshDataTable();
  });

  $('#feedback-history').submit(function (event) {
    event.preventDefault();
    var comments = $('#comments-history').val();
    if (comments != '') storeFeedback('history', $(this).serialize());
    else $('#msgcomments-history').text('No comments entered.');
  });
} /* ----------------------- Main ------------------------ */

$(function () {
  initHistoryTab();
});