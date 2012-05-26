var printOrderColMap = {
      'Select'                  : { 'sName':'\'select\'',
                                    'display_name':'&#10004;',
                                    'bSortable':false,
                                    'bSearchable':false
                                  },
      '`order_id`'                    : {'sName':'`order_id`',
                                    'display_name':'Order Id'
                                  },
      '`created_at`'             : {'sName':'`created_at`',
                                    'display_name':'Purchased On'
                                    	
                                   },
     '`customer_email`'         : {'sName':'`customer_email`',
                                       'display_name':'Email '
                                      },
      '`city`'                   : {'sName':'`city`',
                                    'display_name':'City'
                                   },
 
      '`payment_method`'         : {'sName':'`payment_method`',
                                     'display_name':'Payment Method'
                                   },
      '`grandtotal`'             : {'sName':'`grandtotal`',
                                   'display_name':'GrandTotal'
                                  },
      '`printcount`'                 : {'sName':'`printcount`',
                                    'display_name':'Order Printed'
                                   },
      '`printed_at`'                 : {'sName':'`printed_at`',
                                    'display_name':'Last Printed'
                                   }
  };
function fetchPrintOrderTableData(){


    var sColumns = [], sHeaders = [];
  
    for (var k in printOrderColMap) {
      sColumns.push(k);
      sHeaders.push(printOrderColMap[k]['display_name']);
    }

    var html='<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
    $('.printOrderColumn').html(html);

    var aoColumns = sColumns.map(function(data,index,arr) {
      return printOrderColMap[data];
    });


    var printOrderListTable = $('#printOrderListTable').dataTable( {

      "bProcessing": true,
      "bRetrieve": true,
      "bServerSide": true,
      "sAjaxSource": "/operations/orderaddress/all",
      "aaSorting" : [[1,'asc']],
      "aoColumns": aoColumns,
      "iDisplayLength":25,
      "sPaginationType": "full_numbers",
      "bAutoWidth":false,
      "sDom": '<"H"lip>rt<"F">ip',
    });


$(".printHead input").keyup( function () {
    /* Filter on the column (the index) of this element */
    printOrderListTable.fnFilter( this.value, $(".printHead input").index(this) );
  } );  
}
function refreshPrintOrderDataTable(){
  if (!ututils.isDataTable($('#printOrderListTable')[0])) { //isDataTable() is in ututils.js
    fetchPrintOrderTableData();
  }
  else {
    $('#printOrderListTable').dataTable().fnDraw();
  }
  $('.printOrderClass').removeAttr('checked');
  
  $('#selectFlflmntPrintOrders').removeAttr('checked');  

}

$('#selectFlflmntPrintOrders').click(function () {
  if ($(this).attr('checked') == 'checked') 
    $('.printOrderClass').attr('checked', 'checked');
  else 
    $('.printOrderClass').removeAttr('checked');
});


$("form#print_orders_form").submit(function(){
  setTimeout("$('#printOrderListTable').dataTable().fnStandingRedraw()",1000);
}); 


$('#print_orders_button').click(function(){
  $("#action").val("process");
  if($("input[class=printOrderClass]:checked").length >0){
    $("form#print_orders_form").attr("action", "/operations/orders/process").submit(); 
  }
}); 

$(document).ready(function(){  

  $("a[href='#printorders']").click(function(e){refreshPrintOrderDataTable(); });
  selectDeselectFeature('#printOrderListTable','#cbactPrintOrders');

  $('#printOrderListTable tbody tr td:nth-child(2)').live('click', function () {
    var orderId = $(this).text().trim();
    showOrderDetail(orderId);
  });  
  $('#clearPrintSearch').click(function(event){
    $('.search_init').val('');
    $('#printOrderListTable').dataTable().fnResetAllFilters();
  });
});






