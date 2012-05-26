var colMap = {
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
  'name': {
    'sName': 'name',
    'display_name': 'Name'
  },
  'isEnabled': {
    'sName': 'isEnabled',
    'display_name': 'isEnabled'
  },
  'options': {
    'sName': 'options',
    'display_name': 'Options'
  }
};

var shippingMethodTable = {};

function fade() {
  $('#submit-status').fadeOut(3500);
}


function fetchShippingMethodsTable() {
  $('#shippingMethodsList').show();
  var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  shippingMethodTable = $('#shippingMethodsListTable').dataTable({
    "bProcessing": true,
    "bServerSide": true,
    "sAjaxSource": "/settings/shippingmethods/all",
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
    "sUpdateURL": "/settings/shippingmethods/editshippingmethod",
    "aoColumns": [
    null, null, null,
    /*{
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#submit-status').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#shippingMethodsListTable').dataTable().fnDraw();
      }
    },*/ {
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#submit-status').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#shippingMethodsListTable').dataTable().fnDraw();
      }
    }, {
      indicator: 'Saving...',
      tooltip: 'Click to edit',
      type: 'textarea',
      submit: 'save',
      cancel: 'cancel',
      callback: function () {
        if (ututils.isNotEmptyString(JSON.parse(this.textContent).value)) {
          $('#submit-status').html('Error: ' + JSON.parse(this.textContent).value).show();
          fade();
        }
        $('#shippingMethodsListTable').dataTable().fnDraw();
      }

    }]
  });

  $("thead input").keyup(function () {
    //  Filter on the column (the index) of this element 
    shippingMethodTable.fnFilter(this.value, $("thead input").index(this));
  });
  $("thead select").change(function () {
    shippingMethodTable.fnFilter(this.value, 0);
  });
}

$('#delete_shippingMethod').click(function (event) {
  var checked = $("input[@type=checkbox]:checked"); //find all checked checkboxes + radio buttons  
  var shippingMethodIds = [];
  checked.each(function () {
    shippingMethodIds.push($(this).val());
  });
  if (shippingMethodIds.length > 0) {
    $.post('/settings/shippingmethods/deleteshippingmethod', {
      'shippingMethodIds': shippingMethodIds
    }, function (res) {
      //redraw table
      $('#submit-status').html(res.status);
      $('#submit-status').show();
      fade();
      $('#shippingMethodsListTable').dataTable().fnDraw();
    });
  }
});


$('#modal-addShippingMethodForm').submit(function (event) {
  $('#msg_addshippingmethod').text('Saving Shipping Method Details');
  event.preventDefault();
  var t = setTimeout(function () {
    $('#msg_addshippingmethod').text('Error communicating with server');
  }, 60000);
  $.post('/settings/shippingmethods/addshippingmethod', $(this).serialize(), function (res) {
    resetForm();
    clearTimeout(t);
    $('#submit-status').html(res.status);
    $('#submit-status').show();
    fade();
    $('#msg_addshippingmethod').text('ENTER SHIPPING METHOD DETAILS');
    $('#modal-addShippingMethodForm').modal('hide');
    $('#shippingMethodsListTable').dataTable().fnDraw();
  });
});


$('#modal-addShippingMethodForm').modal({
  backdrop: 'static',
  keyboard: true
});

$('#add_shippingMethod').click(function (event) {
  $('#modal-addShippingMethodForm').modal('show');
});
$('#close_shippingMethod_modal').click(function (event) {
  $('#modal-addShippingMethodForm').modal('hide');
});

function resetForm() {
  $('#name').val('');
  $('#isEnabled').val('');
  $('#options').val('');
}

$(function () {
  fetchShippingMethodsTable();
});