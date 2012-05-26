//JQuery dataTable column mappings.
var colMapCustomer = {
  'Select': {
    'sName': '\'abc\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false
  },
  'customer.id': {
    'sName': 'customer.id',
    'display_name': 'Customer Id',
    'bSortable': false
  },
  'customer.firstname': {
    'sName': 'customer.firstname',
    'display_name': 'First Name',
    'bSortable': false
  },
  'customer.lastname': {
    'sName': 'customer.lastname',
    'display_name': 'Last Name',
    'bSortable': false
  },
  'customer.email': {
    'sName': 'customer.email',
    'display_name': 'Email',
    'bSortable': false
  },
  'customer.primaryphone': {
    'sName': 'customer.primaryphone',
    'display_name': 'Telephone',
    'bSortable': false
  },
  'customer_address.zip': {
    'sName': 'customer_address.zip',
    'display_name': 'ZIP',
    'bSortable': false
  },
  'customer_address.city': {
    'sName': 'customer_address.city',
    'display_name': 'City',
    'bSortable': false
  },
  'customer_address.region': {
    'sName': 'customer_address.region',
    'display_name': 'Region',
    'bSortable': false
  },
  'customer.created_at': {
    'sName': 'customer.created_at',
    'display_name': 'Created On',
    'bSortable': false
  },
  'customer.isactive': {
    'sName': 'customer.isactive',
    'display_name': 'Active',
    'bSortable': false,
    'bSearchable': false
  }
};

function validateAndAddCustomer() {
  var fName = $('#ai_firstName').val();
  var lName = $('#ai_lastName').val();
  var email = $('#ai_email').val();
  if (!fName || '' === fName) $('#errorCrtOrder').html('Please fill First Name.').show();
  else if (!lName || '' === lName) $('#errorCrtOrder').html('Please fill Last Name.').show();
  else if (!email || '' === email) $('#errorCrtOrder').html('Please fill Email.').show();
  else if (!ututils.isNotEmptyString(email.trim())) {
    // Show the validation error
    $('#errorCrtOrder').html('Please provide an email address.').show();
  } else if (!ututils.validateEmail(email.trim())) {
    // Show the validation error
    $('#errorCrtOrder').html('Invalid email address.').show();
  } else {
    $.post("/settings/orderManagement/addEntireDetails", $('#customerAccountForm').serialize(), function (response) {
      if (!response.error) {
        $('#errorCrtOrder').hide();
        // compile the account information side-nav on customer details tab and show it
        $.get('/settings/orderManagement/addressDetail/newAddress/' + response.id, function (custDetailsHtml) {
          $('.createCustomer').hide();
          $('.addressDetails').show();
          $('#addAddress').html(custDetailsHtml);
        });
      } else {
        // Show error message
        $('#errorCrtOrder').html(response.error).show();
      }
    });
  }
}

//Method to construct the dataTable.
function fetchCustomerTableData() {
  $('.productListTable').hide();
  $('#customerInfo').hide();
  $('.customerListTable').show();
  $('#errorCrtOrder').hide();
  $('#orderCreateSubHeading').html('Process Order: Select Customer');
  $('.addressDetails').hide();
  $('.createCustomer').hide();
  var sColumns = [];
  var sHeaders = [];

  for (var k in colMapCustomer) {
    sColumns.push(k);
    sHeaders.push(colMapCustomer[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#customerCols').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMapCustomer[data];
  });

  var customerTable = $('#customerListTable').dataTable({
    "bProcessing": true,
    "bServerSide": true,
    "sDom": 'rtip',
    "sAjaxSource": "/cs/customerManagement/all",
    "aoColumns": aoColumns,
    "aaSorting": [
      [1, 'asc']
    ],
    "iDisplayLength": 10,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "bRetrieve": true,
    "bDestroy": true
  });

  $("#customerListTable input").keyup(function () {
    customerTable.fnFilter(this.value, $("#customerListTable input").index(this));
  });
}