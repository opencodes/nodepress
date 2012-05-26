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

//Reset button handler.
function resetAddress() {
  $('#auad_error').html('').hide();
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
}

//Add / update address form submit handler.
function addUpdateAddress(){
  var validateMessage = validateForm();
  
  if ('' !== validateMessage) {
    //Show the validation error
    $('#auad_error').html(validateMessage).show();
  } else {
    var custId = $('#auad_customerIdHidden').val();
    $.post('/cs/customerManagement/addUpdateAddress', $('#addUpdateAddressForm').serialize(), function(response) {
      if (!response.error) {
        //compile the address details tab again, and show it in update mode
        $.get('/cs/customerManagement/addressDetail/' + response.id, function (adrsDetailsHtml) {
          $('#addressDetails').html(adrsDetailsHtml);
          $('#auad_error').removeClass('important');
          $('#auad_error').addClass('success');
          $('#auad_error').html('Address added / updated.').show();
          $('#newOrderNextPrdtSel').show();
          $('#productListBack').show();
          $('#nextPrdtSel').hide();
          fetchProductTableData(custId);
        });
      } else {
        //Show error message
        $('#auad_error').removeClass('success');
        $('#auad_error').addClass('important');
        $('#auad_error').html(response.error).show();
      }
    });
  }
  
  return false;
}
