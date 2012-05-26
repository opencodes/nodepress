//Helper function to validate add / update address form.
function validateForm () {
  //Validate mandatory fields
  if (!ututils.isNotEmptyString($('#auad_firstName').val().trim()) || !ututils.isNotEmptyString($('#auad_lastName').val().trim()) ||
      !ututils.isNotEmptyString($('#auad_phone').val().trim()) || 
      (!ututils.isNotEmptyString($('#auad_street1').val().trim()) && !ututils.isNotEmptyString($('#auad_street2').val().trim())) || 
      !ututils.isNotEmptyString($('#auad_city').val().trim()) || !ututils.isNotEmptyString($('#auad_region').val()) || 
      !ututils.isNotEmptyString($('#auad_zip').val().trim()) || !ututils.isNotEmptyString($('#auad_country').val().trim())) {
    return 'Please fill all the mandatory fields marked with a *';
  }
  
  //Validate ZIP
  if (!ututils.validatePincode($('#auad_zip').val())) {
    return 'Invalid ZIP';
  }
  
  //Validate telephone
  if (!ututils.validateTelephone($('#auad_phone').val())) {
    return 'Invalid Telephone Number.';
  }
  
  return '';
}

//Cancel button handler.
$('#auad_cancel').live('click', function() {
  var customerId = $('#auad_customerIdHidden').val();
  //compile the address side-nav on customer details tab and show it
  $.get('/cs/customerManagement/address/' + customerId, function (custDetailsHtml) {
    $('#customerDetails').html(custDetailsHtml);
    $('#addressDetailsTab').removeClass('active');
    $('#addressDetails').removeClass('active');
    $('#customerDetailsTab').addClass('active');
    $('#customerDetails').addClass('active');
  });
  
  return false;
});

//Reset button handler.
$('button[type=reset]').live('click', function() {
  $('#auad_error').html('');
  $('#auad_firstName').val('');
  $('#auad_lastName').val('');
  $('#auad_phone').val('');
  $('#auad_street1').val('');
  $('#auad_street2').val('');
  $('#auad_city').val('');
  $('#auad_region').val('');
  $('#auad_zip').val('');
  $('#auad_country').val('');
  $('#auad_defaultBA').val('1');
  $('#auad_defaultSA').val('1');
  
  $('#auad_update').removeAttr("disabled");
  $('#auad_add').removeAttr("disabled");
});

//Add / update address form submit handler.
$('#addUpdateAddressForm').live('submit', function() {
  var t = setTimeout(function() {
    $("#auad_error").html('');
  }, 8000);
  
  var validateMessage = validateForm();
  
  if (validateMessage != '') {
    //Show the validation error
    $("#auad_error").html('<div class="alert-message block-message error"> ' + validateMessage +'</div>');
  } else {
    //disable
    $('#auad_update').attr("disabled", "disabled");
    $('#auad_add').attr("disabled", "disabled");
    $.post('/cs/customerManagement/addUpdateAddress', $('#addUpdateAddressForm').serialize(), function(response) {
      //enable
      $('#auad_update').removeAttr("disabled");
      $('#auad_add').removeAttr("disabled");
      if (!response.error) {
        //compile the address details tab again, and show it in update mode
        $.get('/cs/customerManagement/addressDetail/' + response.id, function (adrsDetailsHtml) {
          $('#addressDetails').html(adrsDetailsHtml);
          $("#auad_error").html('<div class="alert-message block-message success"> Address added/updated successfully.</div>');
        });
      } else {
        //Show error message
        $("#auad_error").html('<div class="alert-message block-message error"> '+ response.error +'</div>');
      }
    });
  }
  
  return false;
});
