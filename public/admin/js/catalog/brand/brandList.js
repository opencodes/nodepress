var colMap = {
  '`id`': {
    'sName': '`id`',
    'sClass': 'tdAnchor',
    'display_name': 'Brand Id',
    'sWidth':'10%'
  },
  '`name`': {
    'sName': '`name`',
    'sClass': 'tdAnchor',
    'display_name': 'Name',
    'sWidth':'30%'
  },
  '`url_key`': {
    'sName': '`url_key`',
    'display_name': 'URL Key',
    'sWidth':'30%'
  },
  '`status`': {
    'sName': '`status`',
    'sWidth' : '25%',
    'display_name': 'Status'
  }
};


function fetchTableData() {
  var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k].display_name);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#cols').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  var bTable = $('#brandListTable').dataTable({
    "bProcessing": false,
    "bServerSide": true,
    "sAjaxSource": "/brands/all",
    "aaSorting": [
      [0, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "sDom": '<"H"lip>rt<"F">ip',
    "oLanguage": {
      "sSearch": "Search all columns:"
    }
  });

  $('select#statusBrand').change( function() { bTable.fnFilter( $(this).val(),3 ); } );

  $("thead input").keyup(function () { /* Filter on the column (the index) of this element */
    bTable.fnFilter(this.value, $("thead input").index(this));
  });
  return bTable;
}

function renderBrandDetails(brand_id) {
  $.get('/brand/' + brand_id, function (html) {
    $('#brandDetailsDiv').html(html);
    $('.active').removeClass('active');
    $('#brandDetails').addClass('active');
    $('#brandDetailsDiv').addClass('active');
  });
}

$(document).ready(function () {
  var bTable = fetchTableData();

  $('#export_brand').click(function (event) {
    var tableParams = bTable.oApi._fnAjaxParameters(bTable.fnSettings());
    var obj = '';
    var oper = '';
    for (var i = 0; i < tableParams.length; i++) {
      obj += oper;
      obj += tableParams[i].name + '=' + encodeURIComponent(tableParams[i].value);
      oper = '&';
    }
    $("#action").val("process");
    $("form#export_all_brand_form").attr("action", "/brands/exportall?" + obj).submit();
  });
  
  $('#add_brand').click(function (event) {
    event.preventDefault();
    $.get('/brand/clean', function (html) {
      $('#brandDetailsDiv').html(html);
      $('.brandData').val('');
      $('#resourceCount').val('0');
      if(tinyMCE.get('brandDesc'))
        tinyMCE.get('brandDesc').setContent('');
      $('.active').removeClass('active');
      $('#brandDetails').addClass('active');
      $('#brandDetailsDiv').addClass('active');
    });
  });

  $($($('#brandListTable thead').children()[0]).children()[0]).removeClass('tdAnchor');
  $($($('#brandListTable thead').children()[0]).children()[1]).removeClass('tdAnchor');

  $("a[href='#brandlist']").click(function (e) {
    $('#brandListTable').dataTable().fnDraw();
  });

  $('#brandListTable tbody tr td:nth-child(1)').live('click', function () {
   renderBrandDetails($(this).text());
  });

  $('#brandListTable tbody tr td:nth-child(2)').live('click', function () {
    var brandId = $($(this).parent().children()[0]).text();
    renderBrandDetails(brandId);
   });
});
