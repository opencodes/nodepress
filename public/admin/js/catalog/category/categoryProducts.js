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

function fetchCatProds() {
  $('#catProdListDiv').show();
  if($('#assocCatId').val() !== ''){
    var assocInfo='assocProd_'+$('#assocCatId').val();
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
    $(".AssocProdList input").val('');
    if (!ututils.isDataTable($('#catAssociateProds')[0])){
      $(".AssocProdList input").keyup(function () { /* Filter on the column (the index) of this element */
        pTable.fnFilter(this.value, $(".AssocProdList input").index(this));
      });
      $("thead select").keyup(function () {
        pTable.fnFilter(this.value, 0);
      });
    }

    var pTable = $('#catAssociateProds').dataTable({
      "bDestroy" : true,
      "bProcessing": false,
      "bServerSide": true,
      "sAjaxSource": "/category/listassocProd/"+assocInfo,
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
        $("#catSelAssocProd").removeAttr("checked");
      }
    });
    
    $('#export_catAssocProd').click(function (event) {
      var assocInfo='assocProd_'+$('#assocCatId').val();
      var tableParams = pTable.oApi._fnAjaxParameters(pTable.fnSettings());
      var obj = '';
      var oper = '';
      for (var i = 0; i < tableParams.length; i++) {
        obj += oper;
        obj += tableParams[i].name + '=' + encodeURIComponent(tableParams[i].value);
        oper = '&';
      }
      $("#action").val("process");
      $("form#export_catAssocProd_form").attr("action", "/category/exportAssocProd/"+assocInfo+"?"+obj).submit();
    });

    $('select#vizCatProd').change( function() { pTable.fnFilter( $(this).val(),8 ); } );
    $('select#statusCatProd').change( function() { pTable.fnFilter( $(this).val(),9 ); } );

    return pTable;
  }
  
}
$('#catSelAssocProd').click(function () {
  if ($(this).attr('checked') == 'checked') $('.catSAllAssocProdStatClass').attr('checked', 'checked');
  else $('.catSAllAssocProdStatClass').removeAttr('checked');
});

$('#catAssocProds').click(function () {
  var checked = $("input[class=catSAllAssocProdStatClass]:checked");
  var prodId = [];
  checked.each(function () {
    prodId.push($(this).val());
  });
  if (prodId.length > 0) {
    $.post('/category/assocProduct', {
      'catId' : $('#assocCatId').val(),
      'prodId': prodId
    }, function (res) {
      if(res.error) {
    	  showMessage('#associateProdCatStat','label important', res.error);
        //$('#associateProdCatStat').text('Failure');
      } else {
    	  showMessage('#associateProdCatStat','label success','Products Successfully added to Category Id: ' + $('#assocCatId').val());
       // $('#associateProdCatStat').text('Success');
        $('.catSAllAssocProdStatClass').removeAttr('checked');
        $('#catAssociateProds').dataTable().fnDraw();
        $('#catUnAssociateProds').dataTable().fnDraw();
      }
    });
  } else {
    $('#associateProdCatStat').text('Please select some products.');
  }
});

$(document).ready(function () {

  $("a[href='#catProdAssociate']").unbind('click');
  $("a[href='#catProdAssociate']").click(function (e) {
    if (ututils.isDataTable($('#catAssociateProds')[0])) {
      refreshDataTable('catAssociateProds');
    }
  });
});