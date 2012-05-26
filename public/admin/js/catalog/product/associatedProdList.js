function fetchAssociatedProdList(configProdId,prodVertical) {
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
//  var configProdId = $('#assocProductId').val();
//  var prodVertical = $('#assocProductVertical').val();
  var assocProdInfo = prodVertical+'_'+configProdId;
  var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k].display_name);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#assocProdCols').html(html);
  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  $(".assocProductHead input").val('');
  if (!ututils.isDataTable($('#assocProductListTable')[0])){
    $(".assocProductHead input").keyup(function () { /* Filter on the column (the index) of this element */
      aTable.fnFilter(this.value, $(".assocProductHead input").index(this));
    });
    $(".assocProductHead select").keyup(function () {
      aTable.fnFilter(this.value, 0);
    });
  }

  var aTable = $('#assocProductListTable').dataTable({
    "bDestroy" : true,
    "bProcessing": false,
    "bServerSide": true,
    "sAjaxSource": "/products/associatedProduct/"+assocProdInfo,
    "aaSorting" : [[1,'asc']],
    "aoColumns": aoColumns,
    "iDisplayLength":25,
    "sPaginationType": "full_numbers",
    "sDom": '<"H"lip>rt<"F">ip',
    "bAutoWidth":false,
    "oLanguage":{
      "sSearch":"Search all columns:"
    },
    "fnDrawCallback" : function () {
      $("#selectAssocProduct").removeAttr("checked");
    }
  });

  $('#export_AssocProduct').click(function (event) {
    var assocProdInfo = prodVertical+'_'+configProdId;
    var tableParams = aTable.oApi._fnAjaxParameters(aTable.fnSettings());
    var obj = '?';
    var oper = '';
    for (var i = 0; i < tableParams.length; i++) {
      obj += oper;
      obj += tableParams[i].name + '=' + encodeURIComponent(tableParams[i].value);
      oper = '&';
    }
    $("#action").val("process");
    $("form#export_all_assocProduct_form").attr("action", "/products/exportAssocProduct/"+assocProdInfo+"?"+obj).submit();
  });


  $('select#vizAssoc').change( function() { aTable.fnFilter( $(this).val(),8 ); } );
  $('select#statusAssoc').change( function() { aTable.fnFilter( $(this).val(),9 ); } );

  return aTable;
}



$('#selectAssocProduct').click(function(){
  if($(this).attr('checked') == 'checked')
  $('.selectAssocProductClass').attr('checked','checked');
  else
  $('.selectAssocProductClass').removeAttr('checked');
  }); 

$('#removeAssociatedProduct').click(function (event) {
  var checked = $("input[class=selectAssocProductClass]:checked"); 
  var prodId = [];
  checked.each(function () {
    prodId.push($(this).val());
  });
  if (prodId.length > 0) {
    var prodType = $('#assocProductType').val();
    var configProdId = $('#assocProductId').val();
    var prodVertical = $('#assocProductVertical').val();
    $.post('/vertical/remove', {
      'prodType': prodType,
      'prodVertical' : prodVertical,
      'prodId': configProdId,
      'varients': prodId
    }, function (res) {
    	 if(res.error) {
       	  showMessage('#productUnAssoscStatus','label important', res.error);
           //$('#associateProdCatStat').text('Failure');
         } else {
       	  showMessage('#productUnAssoscStatus','label success','Products Successfully removed from configurable product Id: ' + configProdId);
          // $('#associateProdCatStat').text('Success');
       	 $('#selectAssocProduct').removeAttr('checked');
         $('#assocProductListTable').dataTable().fnDraw();
         $('#configProductListTable').dataTable().fnDraw();
         }

    });
  }
});
$(document).ready(function () {

  $("a[href='#productAssociate']").unbind('click');
  $("a[href='#productAssociate']").click(function (e) {
   // refreshDataTable('assocProductListTable');
  });

});