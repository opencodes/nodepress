function fetchConfigProductList(configProdId, prodVertical) {
  var colMap = {
      'Select': {
        'sName': '\'abc\'',
        'display_name': 'Select',
        'bSortable': false,
        'bSearchable': false
      },
      '`id`': {
        'sName': '`id`',
        'display_name': 'Product_Id',
        'sWidth':'8%'
      },
      '`sku`': {
        'sName': '`sku`',
        'display_name': 'Sku_id'
      },
      '`name`': {
        'sName': '`name`',
        'display_name': 'Name',
        'sWidth':'30%'
      },
      '`brand`': {
        'sName': '`brand`',
        'display_name': 'Brand',
        'sWidth':'10%'
      },
      '`mrp`': {
        'sName': '`mrp`',
        'display_name': 'MRP',
        'sWidth':'5%'
      },
      '`product_type`': {
        'sName': '`product_type`',
        'display_name': 'Type',
        'sWidth':'10%'
      },
      '`vertical`': {
        'sName': '`vertical`',
        'display_name': 'Vertical',
        'sWidth':'7%'
      },
      '`visibility`': {
        'sName': '`visibility`',
        'display_name': 'Visibility'
      },
      '`status`': {
        'sName': '`status`',
        'display_name': 'Status'
      }
    };

  var configProdInfo = prodVertical+'_'+configProdId;
  var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k].display_name);
  }
  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#prodCols').html(html);
  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  $(".configProductHead input").val('');

  if (!ututils.isDataTable($('#configProductListTable')[0])){ //isDataTable() is in ututils.js
    $(".configProductHead input").keyup(function () { /* Filter on the column (the index) of this element */
      cTable.fnFilter(this.value, $(".configProductHead input").index(this));
    });

    $(".configProductHead select").keyup(function () {
      cTable.fnFilter(this.value, 0);
    });
  }

  var cTable = $('#configProductListTable').dataTable({
    "bDestroy" : true,
    "bProcessing": false,
    "bServerSide": true,
    "sAjaxSource": "/products/vertical/"+configProdInfo,
    "aaSorting" : [[1,'asc']],
    "aoColumns": aoColumns,
    "iDisplayLength":25,
    "sDom": '<"H"lip>rt<"F">ip',
    "sPaginationType": "full_numbers",
    "bAutoWidth":false,
    "oLanguage":{
      "sSearch":"Search all columns:"
    },
    "fnDrawCallback" : function () {
      $("#selectAllProd").removeAttr("checked");
    }
  });

  $('#export_configProduct').click(function (event) {
    var configProdInfo = prodVertical+'_'+configProdId;
    var tableParams = cTable.oApi._fnAjaxParameters(cTable.fnSettings());
    var obj = '';
    var oper = '';
    for (var i = 0; i < tableParams.length; i++) {
      obj += oper;
      obj += tableParams[i].name + '=' + encodeURIComponent(tableParams[i].value);
      oper = '&';
    }
    $("#action").val("process");
    $("form#export_all_configProduct_form").attr("action", "/products/exportUnassocProduct/"+configProdInfo+"?"+obj).submit();
  });

  $('select#vizConfig').change( function() { cTable.fnFilter( $(this).val(),8 ); } );
  $('select#statusConfig').change( function() { cTable.fnFilter( $(this).val(),9 ); } );

  return cTable;
}



$('#selectAllProd').click(function(){
  if($(this).attr('checked') == 'checked')
  $('.selectAllProductClass').attr('checked','checked');
  else
  $('.selectAllProductClass').removeAttr('checked');
  }); 

$('#addAssociatedProduct').click(function (event) {
  var checked = $("input[class=selectAllProductClass]:checked"); 
  var prodId = [];
  checked.each(function () {
    prodId.push($(this).val());
  });
  var configProdId = $('#configProductId').val();
  var prodType = $('#configProductType').val();
  var prodVertical = $('#configProductVertical').val();
  if (prodId.length > 0) {
    $.post('/vertical/add', {
      'prodType': prodType,
      'prodVertical' : prodVertical,
      'prodId': configProdId,
      'varients': prodId
    }, function (res) {
    	if(res.error) {
    	  showMessage('#productAssocStatus','label important', res.error);
      } else {
        showMessage('#productAssocStatus','label success','Products Successfully added to configurable product Id: ' + configProdId);
        $('#selectAllProd').removeAttr('checked');
        $('#assocProductListTable').dataTable().fnDraw();
        $('#configProductListTable').dataTable().fnDraw();
      }
    });
  }
});
$(document).ready(function () {
  $("a[href='#productUnAssociate']").unbind('click');
  $("a[href='#productUnAssociate']").click(function (e) {
    //refreshDataTable('configProductListTable');
  });

});