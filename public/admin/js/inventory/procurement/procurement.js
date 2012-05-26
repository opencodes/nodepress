/*------------------------DataTable-------------------*/

var colMap = {
  'select': {
    'sName':'\'~\'',
    'display_name': '<input type="checkbox" name="checkPrcrmnt_0" id="checkPrcrmnt_0" onclick="checkAll(this);">',
    'bSortable':false
  },
  'id': {
    'sName': 'id',
    'display_name': 'Sl. No.',
    'bSortable' : false
  },
  'sku': {
    'sName': 'sku',
    'display_name': 'SKU',
    'bSortable' : false
  },
  'name': {
    'sName': 'name',
    'display_name': 'Product Name',
    'bSortable' : false
  },
  'orderId': {
    'sName': 'orderId',
    'display_name': 'Order ID',
    'bSortable' : false
  },
  'orderDate': {
    'sName': 'orderDate',
    'display_name': 'Order Date',
    'bSortable' : false
  },
  'qty': {
    'sName': 'qty',
    'display_name': 'Quantity Ordered',
    'bSortable' : false
  },
  'mrp': {
    'sName': 'mrp',
    'display_name': 'Mrp',
    'bSortable' : false
  }
};

var procurementBrandsTable = {};
var ordersFrom = {};
var ordersTo = {};
var selectedBrand = {};

function fetchProcurementTable(){
  var sColumns = [];
  var sHeaders = [];

  for(var key in colMap){
    sColumns.push(key);
    sHeaders.push(colMap[key]['display_name']);
  }
  
  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#procurementBrandsCols').html(html);

  var aoColumns = sColumns.map(function(data, index, arr){
    return colMap[data];
  });
  
  procurementBrandsTable = $('#procurementBrandsTable').dataTable({
    "bProcessing" : true,
    "bServerSide" : true,
    "bDestroy" : true,
    "sAjaxSource" : "/inventory/procurement/itemsList",
    "fnServerParams" : function(aoData){
      aoData.push(ordersFrom);
      aoData.push(ordersTo);
      aoData.push(selectedBrand);
    },
    "aoColumns" : aoColumns,
    "sPaginationType" : "full_numbers",
    "bAutoWidth" : false,
    "sDom": '<"H"i>rt<"F">ip',
    "iDisplayLength": 9999
  });
}

/**
  * Re-draw the data table
  */
function refreshDataTable(){
  procurementBrandsTable.fnDraw();
}

function initProcurementTab(){
  ordersFrom = {
    'name' : 'ordersFrom',
    'value' : 100076666
  };
  ordersTo = {
    'name' : 'ordersTo',
    'value' : 100076936
  };
  selectedBrand = {
    'name' : 'selectedBrand',
    'value' : 4
  };

  $('#procurementSubmit').click(function(){
    var brandId  = $('#brandsList').val();
    var minOrderId = '10000000';
    var maxOrderId = '999999999999';
    var ordersFromId = $('#startOrderid').val() || minOrderId;
    var ordersToId = $('#endOrderid').val() || maxOrderId;

    if(!ututils.validateOrderId(ordersFromId)){
      $("#submitActionResponse").html('<div class="alert-message block-message error" style="padding:5px;"> Invalid "From" Order Id</div>');
        var t = setTimeout(function() {
          $("#submitActionResponse").html('');
        }, 5000);
      return;
    }
  
    if(!ututils.validateOrderId(ordersToId)){
      $("#submitActionResponse").html('<div class="alert-message block-message error" style="padding:5px;"> Invalid "To" Order Id</div>');
      var t = setTimeout(function() {
        $("#submitActionResponse").html('');
      }, 3000);
      return;
    }
    ordersFrom['value'] = ordersFromId;
    ordersTo['value'] = ordersToId;
    selectedBrand['value'] = brandId;
    fetchProcurementTable();
  });

  $('#printPdf').click(function(){
    var checked = $("input[@type=checkbox]:checked");  
    var Ids = [];
    checked.each(function () {
      Ids.push($(this).val());
    });

    if (Ids.length > 0) {
      $("form#procurementForm").attr("action","/inventory/procurement/printReport").submit(); 
    }
  });

  $('#exportAllPrcrmnt').click(function(){
    var checked = $("input[@type=checkbox]:checked");  
    var Ids = [];
    checked.each(function () {
      Ids.push($(this).val());
    });

    if (Ids.length > 0) {
      $("form#procurementForm").attr("action","/inventory/procurement/exportAll").submit();
    }
  });
}

function checkAll(x){
  if($(x).is(':checked')){
    $("#procurementBrandsTable tbody input[type='checkbox']").attr('checked','checked');
  }
  else{
    $("#procurementBrandsTable tbody input[type='checkbox']").removeAttr('checked');
  }
}  

/* ----------------------- Main ------------------------ */
$(function() {
  initProcurementTab();
  //fetchProcurementTable();
});
