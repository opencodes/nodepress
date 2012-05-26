var colMapProcurement = {
  'Select': {
    'sName': '\'abc\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false
  },
  'id': {
    'sName': 'procurement_brands.id',
    'display_name': 'Id',
    'sWidth': '1%'
  },
  'name': {
    'sName': 'catalog_brand.name',
    'display_name': 'Brand Name'
  },
  'vendor': {
    'sName': 'procurement_vendors.company',
    'display_name': 'Company'
  },
  'poc': {
    'sName': 'procurement_vendors.contact_person',
    'display_name': 'Contact Person'
  }
};

var procurementTable = {};

/**
 *fetches and populates procurement datatable
 */

function fadeProcMsg() {
  $('#submit-status').fadeOut(3500);
}

function fetchprocurementTable() {
  var sColumns = [],
      sHeaders = [];

  for (var k in colMapProcurement) {
    sColumns.push(k);
    sHeaders.push(colMapProcurement[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMapProcurement[data];
  });
  procurementTable = $('#procurementListTable').dataTable({
    "bProcessing": true,
    "bServerSide": true,
    "sAjaxSource": "/inventory/procurementBrand/all",
    "aaSorting": [
      [2, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "oLanguage": {
      "sSearch": "Search all columns:"
    }
  });
  $(".procurementClassHead input").keyup(function () {
    //  Filter on the column (the index) of this element 
    procurementTable.fnFilter(this.value, $(".procurementClassHead input").index(this));
  });
  $(".procurementClassHead select").change(function () {
    procurementTable.fnFilter(this.value, 0);
  });
}
$('#selectAllProc').click(function(){
  if($(this).attr('checked') == 'checked')
  $('.procBrandClass').attr('checked','checked');
  else
  $('.procBrandClass').removeAttr('checked');
});

$('#delete_procurement').click(function (event) {
  var checked = $("input[class=procBrandClass]:checked"); //find all checked checkboxes + radio buttons  
  var procurementIds = [];
  checked.each(function () {
    procurementIds.push($(this).val());
  });
  if (procurementIds.length > 0) {
    $.post('/inventory/procurementBrand/removeProcurement/', {
      'procurementIds': procurementIds
    }, function (res) {
      //redraw table
      $('#submit-status').html(res.status);
      $('#submit-status').show();
      $('#procurementListTable').dataTable().fnDraw();
      fadeProcMsg();
    });
    $('#selectAllProc').attr('checked',false);
  } else {
    $('#submit-status').html('Please select atleast one item from the table');
    $('#submit-status').show();
    fadeProcMsg();
  }
});

$('#save_procurementclass').live('click', function (event) {
  $('#msg_addprocurementclass').text('Saving Procurement Details');
  event.preventDefault();
  var t = setTimeout(function () {
    $('#msg_addprocurementclass').text('Error communicating with server');
  }, 60000);
  var data = {
    'brandId': $('#brandId').val(),
    'vendorId': $('#vendorId').val()
  };

  $.post('/inventory/procurementBrand/addProcurement/', data, function (res) {
    resetForm();
    clearTimeout(t);
    $('#submit-status').html(res.status);
    $('#submit-status').show();
    fadeProcMsg();
    $('#msg_addprocurementclass').text('ENTER Procurement DETAILS');
    $('#modal-addProcurementClassForm').modal('hide');
    $('#procurementListTable').dataTable().fnDraw();
  });
});

$('#add_procurement').click(function (event) {
  $.get('/inventory/procurementBrand/brandList', function (res) {
    $('#modal-addProcurementClassForm').html(res);
  });
  $('#modal-addProcurementClassForm').modal({
    backdrop: 'static',
    keyboard: true,
    show: true
  });
});

$('#close_procurementclass_modal').live('click', function (event) {
  $('#modal-addProcurementClassForm').modal('hide');
});

function resetForm() {
  $('#name').val('');
  $('#vendorName').val('');
}

$(function () {
  fetchprocurementTable();
});