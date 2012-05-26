var colMap = {
  'Select': {
    'sName': '\'select\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false
  },
  '`id`': {
    'sName': '`id`',
    'display_name': 'Product Id',
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
    'sWidth':'10%'
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

function fetchCatUnProds() {
  $('#catUnProdListDiv').show();

  if($('#unAssocCatId').val() !== ''){
    var sColumns = [],
    sHeaders = [];
    
    for (var k in colMap) {
      sColumns.push(k);
      sHeaders.push(colMap[k].display_name);
    }
    
    var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
    $('#unAssocCols').html(html);
    
    var aoColumns = sColumns.map(function (data, index, arr) {
      return colMap[data];
    });

    $(".unAssocProd input").val('');

    if (!ututils.isDataTable($('#catUnAssociateProds')[0])){
      $(".unAssocProd input").keyup(function () { /* Filter on the column (the index) of this element */
        cTable.fnFilter(this.value, $(".unAssocProd input").index(this));
      });
      $(".unAssocProd select").keyup(function () {
        cTable.fnFilter(this.value, 0);
      });
    }

    var catInfo='unAssocProd_'+$('#unAssocCatId').val();
    var cTable = $('#catUnAssociateProds').dataTable({
      "bDestroy" : true,
      "bProcessing": false,
      "bServerSide": true,
      "sAjaxSource": "/category/listUnassocProd/"+catInfo,
      "aaSorting": [
        [1, 'asc']
      ],
      "aoColumns": aoColumns,
      "iDisplayLength": 25,
      "sPaginationType": "full_numbers",
      "sDom": '<"H"lip>rt<"F">ip',
      "bAutoWidth": false,
      "oLanguage": {
        "sSearch": "Search all columns:"
      },
      "fnDrawCallback" : function () {
        $("#catSelUnAssocProd").removeAttr("checked");
      }
    });

    $('#export_catUnassocProd').click(function (event) {
      var catInfo='unAssocProd_'+$('#unAssocCatId').val();
      var tableParams = cTable.oApi._fnAjaxParameters(cTable.fnSettings());
      var obj = '';
      var oper = '';
      for (var i = 0; i < tableParams.length; i++) {
        obj += oper;
        obj += tableParams[i].name + '=' + encodeURIComponent(tableParams[i].value);
        oper = '&';
      }
      $("#action").val("process");
      $("form#export_catUnassocProd_form").attr("action", "/category/exportUnassocProd/"+catInfo+"?"+obj).submit();
    });


    $('select#vizUnProd').change( function() { cTable.fnFilter( $(this).val(),8 ); } );
    $('select#statusUnProd').change( function() { cTable.fnFilter( $(this).val(),9 ); } );
    return cTable;
  }
}
$('#catSelUnAssocProd').click(function () {
  if ($(this).attr('checked') == 'checked') $('.catSAllUnAssocProdStat').attr('checked', 'checked');
  else $('.catSAllUnAssocProdStat').removeAttr('checked');
});

$('#catUnassocProducts').click(function () {
  var checked = $("input[class=catSAllUnAssocProdStat]:checked");
  var prodId = [];
  checked.each(function () {
    prodId.push($(this).val());
  });
  if (prodId.length > 0) {
    $.post('/category/unassocProduct', {
      'catId' : $('#unAssocCatId').val(),
      'prodId': prodId
    }, function (res) {
      if(res.error) {
       // $('#unassociateProdCatStat').text('Failure');
    	  showMessage('#unassociateProdCatStat','label important', res.error);
      } else {
    	  showMessage('#unassociateProdCatStat','label success','Products Successfully removed from Category Id: ' + $('#unAssocCatId').val());
          // $('#unassociateProdCatStat').text('Success');
        $('.catSAllUnAssocProdStat').removeAttr('checked');
        $('#catAssociateProds').dataTable().fnDraw();
        $('#catUnAssociateProds').dataTable().fnDraw();
      }
    });
  } else {
    $('#unassociateProdCatStat').text('Please select some products.');
  }
});

$(document).ready(function () {
  $("a[href='#catProdUnAssociate']").unbind('click');
  $("a[href='#catProdUnAssociate']").click(function (e) {
    if (ututils.isDataTable($('#catUnAssociateProds')[0])) {
      refreshDataTable('catUnAssociateProds');
    }
  });
});