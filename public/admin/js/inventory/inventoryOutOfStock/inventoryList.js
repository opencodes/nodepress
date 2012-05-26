var colMap = {
  '`id`': {
    'sName': 'cp.`id`',
    'sClass': 'tdAnchor',
    'display_name': 'Product Id',
    'sWidth':'8%'
  },
  '`sku`': {
    'sName': '`sku`',
    'sClass': 'tdAnchor',
    'display_name': 'Sku_id'
  },
  '`name`': {
    'sName': '`name`',
    'display_name': 'Name',
    'sWidth':'25%'
  },
  '`brand`': {
    'sName': '`brand`',
    'display_name': 'Brand',
    'sWidth':'15%'
  },
  '`mrp`': {
    'sName': '`mrp`',
    'display_name': 'MRP'
  },
  '`product_type`': {
    'sName': '`product_type`',
    'display_name': 'Type'
  },
  '`qty`': {
	    'sName': '`qty`',
	    'display_name': 'Qty'
	  },
	'`bin_location`' : {
	    'sName': '`bin_location`',
	    'display_name' : 'Bin No.',
	    'sWidth'  : '10%'
	  },
  '`visibility`': {
    'sName': '`visibility`',
    'display_name': 'Visibility'
  },
  '`status`': {
    'sName': '`status`',
    'display_name': 'Status'
  },
  '`is_saleable`': {
    'sName': '`is_saleable`',
    'display_name': 'Is Saleable'
  },
};


function fetchTableData() {
	$('#inventorylistDiv').show();
	var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#cols').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  var pTable = $('#inventoryOutOfStockListTable').dataTable({
    "bProcessing": false,
    "bServerSide": true,
    "sAjaxSource": "/inventory/invoutofstock/all",
    "aaSorting": [
      [2, 'desc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": true,
    "sDom"  : '<"H"lip>rt<"F">ip',
    "oLanguage": {
      "sSearch": "Search all columns:"
    }
  });
  $('select#visibility').change( function() { pTable.fnFilter( $(this).val(),8 ); } );
  $('select#status').change( function() { pTable.fnFilter( $(this).val(),9 ); } );
  $('select#saleable').change( function() { pTable.fnFilter( $(this).val(),10 ); } );

  $("thead input").keyup(function () { /* Filter on the column (the index) of this element */
	  pTable.fnFilter(this.value, $("thead input").index(this));
	});

	$("thead select").keyup(function () {
	  pTable.fnFilter(this.value, 0);
	});

	  return pTable;
	}
$('#selectProdStatus').click(function () {
	  if ($(this).attr('checked') == 'checked') $('.selectAllProdStatus').attr('checked', 'checked');
	  else $('.selectAllProdStatus').removeAttr('checked');
	});

function renderProductDetails(product_id,prodType) {

  $.get('/inventory/product/' + product_id, function (html) {
    if (html) {
      $('#inventoryProductDiv').html(html);
      $('.active').removeClass('active');
      $('#inventoryProduct').addClass('active');
      $('#inventoryProductDiv').addClass('active');
      if(prodType==='configurable')
      $('#invProductQty').attr('readonly',true);
    }
  });
}

$(function() {
	var pTable=fetchTableData();
	
  $('.tab-link').click(function () {
    
    $('.active').removeClass('active');
    $(this).addClass('active');
    $('#' + $(this).attr('id') + 'Div').addClass('active');
    if ($('#' + $(this).attr('id') + 'Div').html() === '') {
      $('#' + $(this).attr('id') + 'Div').html('Please click on a product in the product list first to view its details.');
    } 
  });
  
	$('#export_product').click(function (event) {
		   
		var tableParams =pTable.oApi._fnAjaxParameters(pTable.fnSettings());
	    var obj = '';
	    var oper = '';
	    for (var i = 0; i < tableParams.length; i++) {
	      obj += oper;
	      obj += tableParams[i]['name'] + '=' + encodeURIComponent(tableParams[i]['value']);
	      oper = '&';
	    }
	    $("#action").val("process");
	    $("form#export_all_product_form").attr("action", "/inventory/exportall?" + obj).submit();
	  });
	
  $($($('#inventoryOutOfStockListTable thead').children()[0]).children()[0]).removeClass('tdAnchor');
  $($($('#inventoryOutOfStockListTable thead').children()[0]).children()[1]).removeClass('tdAnchor');

  $('#inventoryOutOfStockListTable tbody tr td:nth-child(1)').live('click', function () {
    var prodType=$($(this).parent().children()[5]).text();
    renderProductDetails($(this).text(),prodType);
  });

  $('#inventoryOutOfStockListTable tbody tr td:nth-child(2)').live('click', function () {
    var productId = $($(this).parent().children()[0]).text();
    var prodType=$($(this).parent().children()[5]).text();
    renderProductDetails(productId,prodType);
  });
});