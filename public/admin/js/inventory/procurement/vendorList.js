var colMapVendor = {
  'Select': {
    'sName': '\'abc\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false
  },
  'id': {
    'sName': 'id',
    'display_name': 'Id',
    'sWidth': '1%'
  },
  'company': {
    'sName': 'company',
    'display_name': 'Company'
  },
  'contact_person': {
    'sName': 'contact_person',
    'display_name': 'Contact Person'
  },
  'company_address': {
    'sName': 'company_address',
    'display_name': 'Company Address'
  },
  'email': {
    'sName': 'email',
    'display_name': 'Email'
  },
  'phone': {
    'sName': 'phone',
    'display_name': 'Phone'
  }
};

var vendorTable = {};

/**
 *fetches and populates vendor datatable
 */

function fade() {
  $('#status-Vendor').fadeOut(3500);
}

function fetchvendorTable() {
  var sColumns = [],
      sHeaders = [];

  for (var k in colMapVendor) {
    sColumns.push(k);
    sHeaders.push(colMapVendor[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#vendorCols').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMapVendor[data];
  });
  vendorTable = $('#vendorListTable').dataTable({
    "bProcessing": true,
    "bServerSide": true,
    "sAjaxSource": "/inventory/vendorDetail/all",
    "aaSorting": [
      [2, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "oLanguage": {
      "sSearch": "Search all columns:"
    },
    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      var rowid = aData[1];
      $(nRow).attr("id", rowid);
      return nRow;
    }
  }).makeEditable({
    "sUpdateURL": "/inventory/vendorDetail/editvendordetails",
    "aoColumns": [
    null, null,
    {
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#status-Vendor').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#vendorListTable').dataTable().fnDraw();
        $('#procurementListTable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#status-Vendor').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#vendorListTable').dataTable().fnDraw();
        $('#procurementListTable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#status-Vendor').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#vendorListTable').dataTable().fnDraw();
        $('#procurementListTable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#status-Vendor').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#vendorListTable').dataTable().fnDraw();
        $('#procurementListTable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#status-Vendor').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#vendorListTable').dataTable().fnDraw();
        $('#procurementListTable').dataTable().fnDraw();
      }

    }]
  });
  $(".vendorHead input").keyup(function () {
    //  Filter on the column (the index) of this element 
    vendorTable.fnFilter(this.value, $(".vendorHead input").index(this));
  });
  $(".vendorHead select").change(function () {
    vendorTable.fnFilter(this.value, 0);
  });
}

$('#selectAllVendor').click(function(){
  if($(this).attr('checked') == 'checked')
  $('.vendorBrandClass').attr('checked','checked');
  else
  $('.vendorBrandClass').removeAttr('checked');
});

$('#delete_vendor').click(function (event) {
  var checked = $("input[class=vendorBrandClass]:checked"); //find all checked checkboxes + radio buttons  
  var vendorIds = [];
  checked.each(function () {
    vendorIds.push($(this).val());
  });
  if (vendorIds.length > 0) {
    $.post('/inventory/vendorDetail/removevendor', {
      'vendorIds': vendorIds
    }, function (res) {
      //redraw table
      $('#status-Vendor').html(res.status);
      $('#status-Vendor').show();
      fade();
      $('#vendorListTable').dataTable().fnDraw();
      $('#procurementListTable').dataTable().fnDraw();
    });
    $('#selectAllVendor').attr('readonly',false);
  } else {
    $('#status-Vendor').html('Please select atleast one item from the table');
    $('#status-Vendor').show();
    fade();
  }
});


$('#addVendorInfo').live('click', function (event) {
  $('#msg_addvendorclass').text('Saving Vendor Details');
  event.preventDefault();
  var t = setTimeout(function () {
    $('#msg_addvendorclass').text('Error communicating with server');
  }, 60000);
  var data = {
    'company': $('#companyName').val(),
    'poc': $('#poc').val(),
    'email': $('#email').val(),
    'phone': $('#phone').val(),
    'address': $('#address').val()
  };
  if(data.company==='' || data.poc==='')
    $('#test').text('Company name should not be empty');
  else
  $.post('/inventory/vendorDetail/addVendor/', data, function (res) {
    resetForm();
    clearTimeout(t);
    $('#status-Vendor').html(res.status);
    $('#status-Vendor').show();
    fade();
    $('#msg_addvendorclass').text('ENTER Vendor DETAILS');
    $('#modal-addVendorClassForm').modal('hide');
    $('#vendorListTable').dataTable().fnDraw();
  });
});

$('#add_vendor').click(function (event) {
  $.get('/inventory/vendorDetail/newvendor', function (res) {
    $('#modal-addVendorClassForm').html(res);
  });
  $('#modal-addVendorClassForm').modal({
    backdrop: 'static',
    keyboard: true,
    show: true
  });
});

$('#cancelVendorBtn').live('click', function (event) {
  $('#modal-addVendorClassForm').modal('hide');
});

function resetForm() {
  $('#name').val('');
  $('#vendorName').val('');
}

$(function () {
  fetchvendorTable();
});