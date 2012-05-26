function fetchTableData() {
  var colMap = {
      'Select': {
        'sName': '\'select\'',
        'display_name': 'Select',
        'bSortable': false,
        'bSearchable': false
      },
      '`id`': {
        'sName': '`id`',
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

  var pTable = $('#productListTable').dataTable({
    "bProcessing": false,
    "bServerSide": true,
    "sAjaxSource": "/products/all",
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
      $("#selectProdStatus").removeAttr("checked");
    }
  });

  $('select#vizProd').change( function() { pTable.fnFilter( $(this).val(),8 ); } );
  $('select#statusProd').change( function() { pTable.fnFilter( $(this).val(),9 ); } );

  $(".productListHead input").keyup(function () { /* Filter on the column (the index) of this element */
    pTable.fnFilter(this.value, $(".productListHead input").index(this));
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

$(document).ready(function () {
  var pTable = fetchTableData();

  $('#export_product').click(function (event) {
    var tableParams = pTable.oApi._fnAjaxParameters(pTable.fnSettings());
    var obj = '';
    var oper = '';
    for (var i = 0; i < tableParams.length; i++) {
      obj += oper;
      obj += tableParams[i].name + '=' + encodeURIComponent(tableParams[i].value);
      oper = '&';
    }
    $("#action").val("process");
    $("form#export_all_product_form").attr("action", "/products/exportall?" + obj).submit();
  });

  $('#add_product').click(function (event) {
    $.get('/products/getData', function (html) {
      if (html) {
        $('#productDetailsDiv').html(html);
        $('#prodDupId').val('');
        $('#imgposition').val('');
        $('#oldVertical').val('');
        $('.prodData').val('');
        $('#resourceCount').val('0');
        $('#countRootCat').val('0');
        if(tinymce.get('prodDesc'))
          tinymce.get('prodDesc').setContent('');
        if(tinymce.get('prodSDesc'))
          tinymce.get('prodSDesc').setContent('');
        $('.active').removeClass('active');
        $('#productDetails').addClass('active');
        $('#productDetailsDiv').addClass('active');
        $('#productInventoryDiv').html('');
        $('#assocProdHdName').text('Please select a configurable product with a valid vertical set. ');
        $('#assocProdListDiv').hide();
        $('#configProdListDiv').hide();
        $('#configProdHdName').text('Please select a configurable product with a valid vertical set.');
        $('#assocProdHdId').text('');
        $('#configProdHdId').text('');
        var JTurl = "/product/category/-1";
        $("#categories").jstree({
          "json_data": {
            "ajax": {
              "url": JTurl,
              "data": function (n) {}
            }
          },
          "plugins": ["themes", "json_data", "ui", "checkbox"],
          "checkbox": {
            "two_state": true
          }
        }).bind("change_state.jstree", function (e, data) {
          var tagName = data.args[0].tagName;
          var refreshing = data.inst.data.core.refreshing;
          if ((tagName === "A" || tagName === "INS") && (refreshing !== true && refreshing !== "undefined")) {
            var oldText = $('#hiddenList').val();
            if (oldText.indexOf('_' + data.rslt.data("id") + '_') != -1) {
              var index = oldText.indexOf('_' + data.rslt.data("id") + '_');
              var substring1 = oldText.substring(0, index);
              oldText = oldText.substring(index + 1, oldText.length);
              var index2 = oldText.indexOf('_');
              var substring2 = oldText.substring(index2, oldText.length);
              var result_string = substring1 + substring2;
              $('#hiddenList').val(result_string);
              if(data.rslt.data("level") == '1')
                $('#countRootCat').val(parseInt($('#countRootCat').val(),10) - 1);
            } else {
              $('#hiddenList').val(oldText + data.rslt.data("id") + "_");
              if(data.rslt.data("level") == '1')
                $('#countRootCat').val(parseInt($('#countRootCat').val(),10) + 1);
            }
          }
        }).bind('loaded.jstree', function (e, data) {
          data.inst.get_container().find('li').each(function (i) {
            if($(this).data('is_disabled') === true)
              $(this).children()[1].setAttribute("style","color:#FF0000");
          });
        });
      }
    });
  });

  $("a[href='#productlist']").click(function (e) {
    refreshDataTable('productListTable');
  });

  $($($('#productListTable thead').children()[0]).children()[1]).removeClass('tdAnchor');
  $($($('#productListTable thead').children()[0]).children()[2]).removeClass('tdAnchor');

  $('#productListTable tbody tr td:nth-child(2)').live('click', function () {
    renderProductDetails($(this).text());
  });

  $('#productListTable tbody tr td:nth-child(3)').live('click', function () {
    var productId = $($(this).parent().children()[1]).text();
    renderProductDetails(productId);
  });

});