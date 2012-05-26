//JQuery dataTable column mappings.
var colMap = {
    'Select': {
      'sName': '\'~\'',
      'display_name': 'Select',
      'bSortable': false,
      'bSearchable': false
    },
    'customer.id': {
      'sName': 'customer.id',
      'display_name': 'Customer Id'
    },
    'customer.firstname': {
      'sName': 'customer.firstname',
      'display_name': 'First Name'
    },
    'customer.lastname': {
      'sName': 'customer.lastname',
      'display_name': 'Last Name'
    },
    'customer.email': {
      'sName': 'customer.email',
      'display_name': 'Email'
    },
    'customer.primaryphone': {
      'sName': 'customer.primaryphone',
      'display_name': 'Telephone'
    },
    'customer_address.zip': {
      'sName': 'customer_address.zip',
      'display_name': 'ZIP'
    },
    'customer_address.city': {
      'sName': 'customer_address.city',
      'display_name': 'City'
    },
    'customer_address.region': {
      'sName': 'customer_address.region',
      'display_name': 'Region'
    },
    'customer.created_at': {
      'sName': 'customer.created_at',
      'display_name': 'Created On'
    },
    'customer.isactive': {
      'sName': 'customer.isactive',
      'display_name': 'Status',
      'bSearchable': false
    }
};

//Method to construct the dataTable.
function fetchTableData() {
  var sColumns = [];
  var sHeaders = [];
  
  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }
  
  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#cols').html(html);

  var aoColumns = sColumns.map(function(data, index, arr) {
    return colMap[data];
  });
  
  var customerTable = $('#customer_List_Table').dataTable({
    "bProcessing": true,
    "bRetrieve": true,
    "bServerSide": true,
    "sAjaxSource": "/cs/customerManagement/all",
    "aaSorting": [[1,'asc']],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "sDom": '<"clear">liprtip'
  });

  $("thead input").keyup( function () {
    customerTable.fnFilter(this.value, $("thead input").index(this) );
  });
}

//Method to compile the account information side-nav on customer details tab and show it.
function renderCustomerDetails(customerId) {
  $.get('/cs/customerManagement/account/' + customerId, function (custDetailsHtml) {
    $('#customerDetails').html(custDetailsHtml);
    $('#customerListTab').removeClass('active');
    $('#customerList').removeClass('active');
    $('#customerDetailsTab').addClass('active');
    $('#customerDetails').addClass('active');
    //reset the address details tab to empty
    $('#addressDetails').html('<span style=\"float:left\">Please click an address id on the Customer Details tab to see the details, or click to Add New Address.</span>');
  });
}

//Disable button handler.
$('#delete_Customer').click(function () {
  var checked = $("input[@type=checkbox]:checked");  
  var customerIds = [];
  checked.each(function () {
    customerIds.push($(this).val());
  });

  var t = setTimeout(function() {
    $("#validation_error").html('');
  }, 8000);
  
  if (customerIds.length > 0) {
    $('#validation_error').html('');
    $.post('/cs/customerManagement/disable', {'customerIds' : customerIds}, function (res) {
      if(!res.error) {
        $("#validation_error").html('<div class="alert-message block-message success"> Selected customer(s) made Inactive.</div>');
      } else {
        $("#validation_error").html('<div class="alert-message block-message error"> ' + res.error +'</div>');
      }
      
      $('#customer_List_Table').dataTable().fnDraw();
    });
  } else {
    $("#validation_error").html('<div class="alert-message block-message information"> Please select a customer from the table first.</div>');
  }
});

//Enable button handler.
$('#enable_Customer').click(function () {
  var checked = $("input[@type=checkbox]:checked");  
  var customerIds = [];
  checked.each(function () {
    customerIds.push($(this).val());
  });
  
  var t = setTimeout(function() {
    $("#validation_error").html('');
  }, 8000);

  if (customerIds.length > 0) {
    $('#validation_error').html('');
    $.post('/cs/customerManagement/enable', {'customerIds' : customerIds}, function (res) {
      if(!res.error) {
        $("#validation_error").html('<div class="alert-message block-message success"> Selected customer(s) made Active.</div>');
      } else {
        $("#validation_error").html('<div class="alert-message block-message error"> '+ res.error +'</div>');
      }
      
      $('#customer_List_Table').dataTable().fnDraw();
    });
  } else {
    $("#validation_error").html('<div class="alert-message block-message information"> Please select a customer from the table first.</div>');
  }
});

function resetAddNewCustomerModal(){
  $('#ac_error').html('')
  $('#ac_email').val('');
  $('#ac_sendEmail').val('');
}

//Add new customer button handler.
$('#add_New_Customer').click(function () {
  resetAddNewCustomerModal();
  $('#modal_addCustomer').modal({
    backdrop: 'static',
    keyboard: true,
    show: true
  });
});

//Reset button on add new customer modal region handler.
$('button[type=reset]').click(function() {
  resetAddNewCustomerModal();
});

//On click of the 'send mail' check box, set its value
$('#ac_sendEmail').click(function () {
  if ($(this).attr('checked') == 'checked') {
    $(this).val('1');
  } else {
    $(this).val('');
  }
});

//Add new customer modal region form submit handler.
$('#addCustomerForm').submit(function() {
  var t = setTimeout(function() {
    $("#ac_error").html('');
  }, 8000);
  
  if (!ututils.isNotEmptyString($('#ac_email').val().trim())) {
    //Show the validation error
    $("#ac_error").html('<div class="alert-message block-message error"> Please provide an email address.</div>');
  } else if (!ututils.validateEmail($('#ac_email').val())) {
    //Show the validation error
    $("#ac_error").html('<div class="alert-message block-message error"> Invalid email address.</div>');
  } else {
    $.post("/cs/customerManagement/add", $('#addCustomerForm').serialize(), function(response) {
      if (!response.error) {
        //compile the account information side-nav on customer details tab and show it
        $.get('/cs/customerManagement/account/' + response.id, function (custDetailsHtml) {
          $('#customerDetails').html(custDetailsHtml);
          $('#customerListTab').removeClass('active');
          $('#customerList').removeClass('active');
          $('#customerDetailsTab').addClass('active');
          $('#customerDetails').addClass('active');
          $('#modal_addCustomer').modal('hide');
        });
      } else {
        //Show error message
        $("#ac_error").html('<div class="alert-message block-message error"> '+ response.error+'</div>');
      }
    });
  }
  
  return false;
});

//Customer dataTable's customer id column hyperlink handler.
$('#customer_List_Table tbody tr td:nth-child(2)').live('click', function () {
  renderCustomerDetails($(this).text());
});

$(document).ready(function() {
  fetchTableData();
  $("a[href='#customerList']").click(function(e) { 
    fetchTableData();
    $('#customer_List_Table').dataTable().fnDraw(); 
  });
});
