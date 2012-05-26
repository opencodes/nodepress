var colMap = {
  '`id`': {
    'sName': '`id`',
    'display_name': 'ID'
  },
  '`order_id`': {
    'sName': '`order_id`',
    'display_name': 'Order Id'
  },
  '`created_at`': {
    'sName': '`created_at`',
    'display_name': 'Created at'
  },
  '`email`': {
    'sName': '`email`',
    'display_name': 'Email'
  },
  '`query_suggestion`': {
    'sName': '`query_suggestion`',
    'display_name': 'Query'
  },
  '`ip_address`': {
    'sName': '`ip_address`',
    'display_name': 'IP address'
  }
};

function fetchTableData() {
  var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });
  var oTable = $('#contactustable').dataTable({
    "bProcessing": true,
    "bRetrieve": true,
    "bServerSide": true,
    "sAjaxSource": "/settings/contactus/all",
    "aaSorting": [
      [0, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "oLanguage": {
      "sSearch": "Search all columns:"
    }
  });

  $('#contactustable thead.listHead input').keyup(function () {
    oTable.fnFilter(this.value, $('#contactustable thead input').index(this));
  });


  $('#contactustable tbody tr td:nth-child(1)').live('click', function () {
    var contactusId = Number($(this).text().trim());
    if (contactusId && (contactusId > 0)) {
      viewDetail(contactusId);
    }
  });
}

function viewDetail(id) {
  $.get('/settings/contactus/view/' + id, function (html) {
    $('#contactDetails').html(html);
    $('#contactUsDetailsDiv').modal('show');
  });
}


$(function () {
  fetchTableData();

  $("a[href='#contactUsList']").click(function (e) {
    refreshDataTable('contactustable');
  });

  $('#contactUsDetailsDiv').modal({
    show: false,
    backdrop: true,
    keyboard: true
  });
});