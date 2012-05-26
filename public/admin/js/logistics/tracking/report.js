(function () {
  var colMap = {
    'tracking.orderId': {
      'sName': 'tracking.orderId',
      'display_name': 'Order #',
      'sClass': 'rto-order-id',
      'sWidth': '5%'
    },
    'tracking.status': {
      'sName': 'tracking.status',
      'display_name': 'Status',
      'sWidth': '5%'
    },
    'tracking.approvedBy': {
      'sName': 'tracking.approvedBy',
      'display_name': 'Approver',
      'sWidth': '5%'
    },
    'tracking.approvedOn': {
      'sName': 'tracking.approvedOn',
      'display_name': 'Approved on'
    },
    'aMessage': {
      'sName': 't1.message AS aMessage',
      'display_name': 'Approve RTO message'
    },
    'carrier_info.name': {
      'sName': 'carrier_info.name',
      'display_name': 'Courier',
      'sWidth': '5%'
    },
    'tracking.shipmentId': {
      'sName': 'tracking.shipmentId',
      'display_name': 'AWB#',
      'sWidth': '5%'
    },
    'tracking.receivedBy': {
      'sName': 'tracking.receivedBy',
      'display_name': 'Receiver',
      'sWidth': '5%'
    },
    'tracking.receivedOn': {
      'sName': 'tracking.receivedOn',
      'display_name': 'Received On'
    },
    'tracking.returnShipmentId': {
      'sName': 'tracking.returnShipmentId',
      'display_name': 'Ret. AWB#',
      'sWidth': '5%'
    },
    'tracking.receiveAction': {
      'sName': 'tracking.receiveAction',
      'display_name': 'Action',
      'sWidth': '5%'
    },
    'rMessage': {
      'sName': 't2.message AS rMessage',
      'display_name': 'Reject Message'
    }
  };

  var rtoReportTable = {};

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

    rtoReportTable = $('#rtoreport').dataTable({
      "bProcessing": true,
      "sDom": 'lrtip',
      "bServerSide": true,
      "sAjaxSource": "/logistics/tracking/report",
      "aaSorting": [
        [3, 'asc']
      ],
      "aoColumns": aoColumns,
      "iDisplayLength":25,
      "sPaginationType": "full_numbers",
      "oLanguage" : {
        "sSearch" : "Search all columns" 
      }
    });

    $('.trackingReportTable input').keyup(function () {
      rtoReportTable.fnFilter(this.value, $('thead input').index(this));
    });
  }

  function refreshTable() {
    $('#rtoreport').dataTable().fnDraw();
  }

  function initRTOReportTab(){
    $('#export_rto_orders').click(function (event) {
        
      var tableParams = rtoReportTable.oApi._fnAjaxParameters(rtoReportTable.fnSettings());
      var obj = '?';
      var oper = '';
      for (var i = 0; i < tableParams.length; i++) {
        obj += oper;
        obj += tableParams[i]['name'] + '=' + tableParams[i]['value'];
        oper = '&';
      }
      $("form#rtoOrderForm").attr("action", "/logistics/tracking/report/exportAll" + obj).submit();
    });
    
  }
  
  $(function () {
    fetchTableData();
    $("a[href='#reportRto']").click(function (e) {
      refreshTable();
    });
    initRTOReportTab();

    var URL = window.location.href.split('#');
    if (URL.length > 1) {
      var link = URL[1];
      $('.active').removeClass('active');
      $('#' + link).addClass('active');
      $('#rtoReceived').addClass('active');
    }
  });
})();