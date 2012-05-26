//Address id hyperlink handler.
function viewAddress (addressId) {
  //compile the address details tab and show it in update mode
  $.get('/cs/customerManagement/addressDetail/' + addressId, function (adrsDetailsHtml) {
    $('#addressDetails').html(adrsDetailsHtml);
    $('#customerDetailsTab').removeClass('active');
    $('#customerDetails').removeClass('active');
    $('#addressDetailsTab').addClass('active');
    $('#addressDetails').addClass('active');
  });
}

//Account information side-nav hyperlink handler.
$('#url_accountInfo').live('click', function() {
  var customerId = $('#customerIdHidden').val();
  //compile the account information side-nav on customer details tab and show it
  $.get('/cs/customerManagement/account/' + customerId, function (custDetailsHtml) {
    $('#customerDetails').html(custDetailsHtml);
  });
});

//Addresses side-nav hyperlink handler.
$('#url_addressInfo').live('click', function() {
  var customerId = $('#customerIdHidden').val();
  //compile the address side-nav on customer details tab and show it
  $.get('/cs/customerManagement/address/' + customerId, function (custDetailsHtml) {
    $('#customerDetails').html(custDetailsHtml);
  });
});

//Cart side-nav hyperlink handler.
$('#url_cartInfo').live('click', function() {
  var customerId = $('#customerIdHidden').val();
  //compile the cart side-nav on customer details tab and show it
  $.get('/cs/customerManagement/cart/' + customerId, function (custDetailsHtml) {
    $('#customerDetails').html(custDetailsHtml);
  });
});

//Account information side-nav form submit handler.
$('#customerAccountForm').live('submit', function() {
  var t = setTimeout(function() {
    $("#ai_error").html('');
  }, 8000);
  if (!ututils.isNotEmptyString($('#ai_email').val().trim())) {
    //Show the validation error
    $("#ai_error").html('<div class="alert-message block-message error"> Please fill all the mandatory fields marked with a *.</div>');
  } else if (!ututils.validateEmail($('#ai_email').val())) {
    //Show the validation error
    $("#ai_error").html('<div class="alert-message block-message error"> Invalid email address.</div>');
  } else if (!ututils.validateTelephone($('#ai_phone').val())) {
    //Show the validation error
    $("#ai_error").html('<div class="alert-message block-message error"> Invalid Telephone Number.</div>');
  } else {
    $.post('/cs/customerManagement/update', $('#customerAccountForm').serialize(), function(response) {
      if (!response.error) {
        //Show confirmation message
        $('#ai_password').val('');
        $("#ai_error").html('<div class="alert-message block-message success"> Account information updated.</div>');
      } else {
        //Show error message
        $("#ai_error").html('<div class="alert-message block-message error"> '+response.error+'</div>');
      }
    });
  }
  
  return false;
});

$('#customerFeedbackForm').live('submit',function(event){
  event.preventDefault();
  
  var t = setTimeout(function() {
    $("#ai_error").html('');
  }, 8000);
  
  $.post('/cs/feedbackupdate',$('#customerFeedbackForm').serialize(), function(res) {
    if(res.status ==='success'){
      $("#ai_error").html('<div class="alert-message block-message success"> '+res.message+'</div>');
    } else {
      $("#ai_error").html('<div class="alert-message block-message error"> '+res.message+'</div>');
    }
  });

});

//Account information side-nav form's Cancel button handler.
$('#ai_cancel').live('click', function() {
  $('#customerDetailsTab').removeClass('active');
  $('#customerDetails').removeClass('active');
  $('#customerListTab').addClass('active');
  $('#customerList').addClass('active');
  
  return false;
});

//Addresses side-nav form's Cancel button handler.
$('#ad_cancel').live('click', function() {
  $('#customerDetailsTab').removeClass('active');
  $('#customerDetails').removeClass('active');
  $('#customerListTab').addClass('active');
  $('#customerList').addClass('active');
  
  return false;
});

//Cart side-nav form's Cancel button handler.
$('#ct_cancel').live('click', function() {
  $('#customerDetailsTab').removeClass('active');
  $('#customerDetails').removeClass('active');
  $('#customerListTab').addClass('active');
  $('#customerList').addClass('active');
  
  return false;
});

//Add New Address button handler.
$('#ad_addAddress').live('click', function () {
  var customerId = $('#customerIdHidden').val();
  //compile the address details tab and show it in add mode
  $.get('/cs/customerManagement/addressDetail/newAddress/' + customerId, function (adrsDetailsHtml) {
    $('#addressDetails').html(adrsDetailsHtml);
    $('#customerDetailsTab').removeClass('active');
    $('#customerDetails').removeClass('active');
    $('#addressDetailsTab').addClass('active');
    $('#addressDetails').addClass('active');
  });
  
  return false;
});

//Delete address button handler.
$('#ad_deleteAddress').live('click', function () {
  var checked = $("input[@type=checkbox]:checked");  
  var addressIds = [];
  checked.each(function () {
    addressIds.push($(this).val());
  });
  var t = setTimeout(function() {
    $("#ad_error").html('');
  }, 8000);
  
  if (addressIds.length > 0) {
    $('#ad_error').html('').hide();
    $.post('/cs/customerManagement/deleteAddress', {'addressIds' : addressIds}, function (response) {
      if(!response.error) {
        var customerId = $('#customerIdHidden').val();
        //compile the address side-nav on customer details tab and show it
        $.get('/cs/customerManagement/address/' + customerId, function (custDetailsHtml) {
          $('#customerDetails').html(custDetailsHtml);
          $("#ad_error").html('<div class="alert-message block-message success"> Selected address(es) deleted successfully.</div>');
          $('#addressDetails').html('<span style=\"float:left\">Please click an address id on the Customer Details tab to see the details, or click to Add New Address.</span>');
        });
      } else {
        $("#ad_error").html('<div class="alert-message block-message error"> '+response.error+'</div>');
      }
    });
  } else {
    $("#ad_error").html('<div class="alert-message block-message information"> Please select an address from the table first.</div>');
  }
  
  return false;
});

//Delete cart button handler.
$('#ct_deleteCart').live('click', function () {
  var t = setTimeout(function() {
    $("#ct_error").html('');
  }, 8000);
  
  var customerId = $('#customerIdHidden').val();
  $.post('/cs/customerManagement/deleteCart/' + customerId, function (custDetailsHtml) {
    $('#customerDetails').html(custDetailsHtml);
    $("#ct_error").html('<div class="alert-message block-message error">Cart removed for the customer.</div>');
  });
});
