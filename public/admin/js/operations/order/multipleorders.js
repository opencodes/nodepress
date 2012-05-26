"use strict";
var multipleOrderColMap = {
      'Select'                  : { 'sName':'\'select\'',
    	                            'display_name':'&#10004;',
                                    'bSortable':false,
                                    'bSearchable':false
                                  },
      '`order_id`'                    : {'sName':'`order_id`',
                                    'display_name':'Order Id',
                                    'bSearchable':false
                                  },
      '`created_at`'             : {'sName':'`created_at`',
                                    'display_name':'Purchased On',
                                    'bSearchable':false
                                  },
      '`customer_email`'         : {'sName':'`customer_email`',
                                    'display_name':'Email ',
                                   },
     '`city`'                   : {'sName':'`city`',
                                       'display_name':'City',
                                       'bSearchable':false
                                      },
      '`payment_method`'         : {'sName':'`payment_method`',
                                     'display_name':'Payment Method',
                                     'bSearchable':false
                                   },
      '`grandtotal`'             : {'sName':'`grandtotal`',
                                   'display_name':'GrandTotal',
                                   'bSearchable':false
                                  },
      '`printcount`'                 : {'sName':'`printcount`',
                                    'display_name':'Order Printed',
                                   },
      '`printed_at`'                 : {'sName':'`printed_at`',
                                    'display_name':'Last Printed',
                                    'bSearchable':false
                                   },
      '`other_orders`'             : {'sName':'',
                                       'display_name':'Other Orders',
                                       'bSortable':false,
                                       'bSearchable':false
                                      }
                                   
  };
function fetchMultipleOrderTableData(){


    var sColumns = [], sHeaders = [];
  
    for (var k in multipleOrderColMap) {
      sColumns.push(k);
      sHeaders.push(multipleOrderColMap[k]['display_name']);
    }

    var html='<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
    $('.multipleOrderColumn').html(html);


    var aoColumns = sColumns.map(function(data,index,arr) {
      return multipleOrderColMap[data];
    });
    var multipleOrderListTable = $('#multipleOrderListTable').dataTable( {

      "bProcessing": true,
      "bRetrieve": true,
      "bServerSide": true,
      "sAjaxSource": "/operations/multipleorder/all",
      "aaSorting" : [[3,'desc']],
      "aoColumns": aoColumns,
      "iDisplayLength":25,
      "sPaginationType": "full_numbers",
      "bAutoWidth":false,
      "sDom": '<"H"lip>rt<"F">ip',
    });


$(".multipleOrderHead input").keyup( function () {
    /* Filter on the column (the index) of this element */
    multipleOrderListTable.fnFilter( this.value, $(".multipleOrderHead input").index(this) );
  } );  
}
function refreshMultipleOrderDataTable(){
 if (!ututils.isDataTable($('#multipleOrderListTable')[0])) { //isDataTable() is in ututils.js
    fetchMultipleOrderTableData();
  }
  else {
    $('#multipleOrderListTable').dataTable().fnDraw();
  }
  $('.multipleOrderClass').removeAttr('checked');
  $('#selectFlflmntMultipleOrders').removeAttr('checked');
}

$('#print_multiple_orders_button').click(function(){
	 $("#action_multiple").val("process");
	  if($("input[class=multipleOrderClass]:checked").length >0){
	    $("form#multiple_orders_form").attr("action", "/operations/orders/process").submit(); 
	  }
	  refreshMultipleOrderDataTable();
	}); 

$('#cancel_orders_button').click(function (event){
	  var checked = $("input[class='multipleOrderClass']:checked"); //find all checked checkboxes  
	  var orderId = [];
	  checked.each(function () {
	    orderId.push($(this).val());
	  });
	  if (orderId.length > 0) {
	    $("#multipleActionResponse").html('').hide();
	    var htmlContent='Cancel orders ';
	    for(var count=0;count<orderId.length;count++)
	      htmlContent=htmlContent+' '+orderId[count];
	    $('#fullfillment_action_modal').modal({
	      show:true,
	      backdrop:true,
	      keyboard:true
	    });
	    $('#fullfillment_action_message').html(htmlContent);
	    $('#fullfillment_action_ok').live('click',function(){
	      $.post('/operations/orders/cancel',{'orderId':orderId, 'flagInventoryUpdate':true}, function(res) {
	        $('#fullfillment_action_modal').modal('hide');
	        $("#multipleActionResponse").html(res.ordersCanceled+' orders canceled').show();
	        refreshMultipleOrderDataTable();
	      });
	    });
	    $('#fullfillment_action_cancel').live('click',function(){
	      $('#fullfillment_action_modal').modal('hide');
	    });
	  }
	});


/*
function selectDeselectFeature(formid,checkboxaction){
  function countChecked() {  
    var n = $("input:checkbox:checked").length;
    $("#selectcount").text(n);
  }
  function toggleChecked(status) {
    $('#'+formid+" input:checkbox").each( function() {
    $(this).attr("checked",status);
    });
    countChecked();
  }  
  var html  = '<a href="javascript:void(0)" id="selectallvisible" >Select Visible</a>';
      html +='<span class="separator"> | </span>';
      html +='<a href="javascript:void(0)" id="unselectallvisible">Unselect Visible</a>';
      html +='<span class="separator"> | </span>';
      html +='<strong id="selectcount"> 0 </strong> item selected.';
      
  $('#'+checkboxaction).html(html);  
  $('#selectallvisible').click(function(){
    toggleChecked('checked');
  });
  $('#unselectallvisible').click(function(){
    toggleChecked(false);
  });
  $('#'+formid+ ' :checkbox').live('click',function(){
    countChecked();
  });  
}
*/

$('#selectFlflmntMultipleOrders').click(function () {
  if ($(this).attr('checked') == 'checked') 
    $('.multipleOrderClass').attr('checked', 'checked');
  else 
    $('.multipleOrderClass').removeAttr('checked');
});


$(document).ready(function(){  
  $("a[href='#multipleorders']").click(function(e){refreshMultipleOrderDataTable(); });
  $('#multipleOrderListTable tbody tr td:nth-child(2)').live('click', function () {
    var orderId = $(this).text().trim();
    showOrderDetail(orderId);
  });  
  
  //selectDeselectFeature('multiple_orders_form','checkboxaction');
});






