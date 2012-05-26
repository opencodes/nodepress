/* ----------------------- Settings ------------------------ */

function validateCourierForm() {
  if( $('#courierName').val() == ''){
    $('#courierUpdate').addClass('error').html("Courier Name can not be empty.").show();
    return false;
  }
    
  if( $('#courierLabel').val() == '') {
    $('#courierUpdate').addClass('error').html("Courier Lable can not be empty.").show();
    return "false";
  }

  return "true";
}

function addNewCourier() {
  $('#updateCarrierForm').show();
  $('#courierservices-courier').val("");
  $('#courierLabel').val("");
  $('#courierPriority').val("");
  $('#courierURL').val(null);
  $('#courierId').val("");
  $('#courierName').val("");
  $('#courierName').removeAttr('disabled');
  $('#weightRqd').attr('checked');
  $('#deleteCourier').attr('disabled',true);
  $('#courierUpdate').hide().html("");
}

function removeCourier(){
  var carrierId = $('#courierservices-courier').val();
  var canDelete = true;
  
  if(carrierId == undefined || carrierId == '') {
    $('#courierUpdate').addClass('error').html('No Courier is selected.').show();
    canDelete = false;
  }
  
  if (canDelete) {
    var removeT = setTimeout(function() {
      $('#courierUpdate').addClass('error').html('Error communicating with server').show();
    }, 25000);
    
    $.post('/logistics/dispatch/carrier/remove/'+carrierId,$(this).serialize(),function(res) {
      clearTimeout(removeT);
      $('#courierUpdate').removeClass('error').hide().html("");
      if(res.status == 'success') {
        $('#courierservices-courier option[value="' + res.id + '"]').remove();
        $('#courierservices-addPincode option[value="' + res.id + '"]').remove();
        $('#courierservices-bulk option[value="' + res.id + '"]').remove();
        $('#courierservices-bulkPincodeUploadForm option[value="' + res.id + '"]').remove();

        $('#courierUpdate').addClass('success').html("Courier deleted successfully.").show();
        var t = setTimeout(function() {
          $('#courierUpdate').removeClass('success').hide().html("");
        }, 5000);
      } else {
        $('#courierUpdate').addClass('error').html("Unable to delete Courier.").show();
        var t = setTimeout(function() {
          $('#courierUpdate').removeClass('error').hide().html("");
        }, 5000);
      }
    });
    $('#courierUpdate').hide();
    $('#updateCarrierForm').hide();
  }
}

function initCarrierTab() {
  $('#courierUpdate').hide();
  $('#updateCarrierForm').hide();

  $('#fetchCarrierForm').submit(function(event) {
    event.preventDefault();
    var courier = $('#courierservices-courier').val();
    $('#deleteCourier').attr('disabled',false);
    if(courier){
      $.getJSON('/logistics/dispatch/carrier/' + courier, function(res) {
        if(res.error) {
          $('#courierUpdate').addClass('error').html(res.error).show();
          var t = setTimeout(function() {
            $('#courierUpdate').removeClass('error').hide().html("");
          }, 5000);
        } else {
          var courierDetail = res.courier;
          $('#updateCarrierForm').show();
          $('#courierLabel').val(courierDetail.label);
          $('#courierPriority').val(courierDetail.priority);
          $('#courierURL').val(courierDetail.url);
          $('#courierId').val(courierDetail.id);
          $('#weightRqd').attr('checked',courierDetail.weight_required==1); 
          $('#routingCodeRqd').attr('checked',courierDetail.routingcode_required==1);
          $('#courierName').val(courierDetail.name);
          $('#courierName').attr('disabled',true);
          $('#courierUpdate').hide().html("");
        }
      });
      $('#courierUpdate').hide();
    }else{
      $('#courierUpdate').hide();
      $('#updateCarrierForm').hide();
      $('#courierUpdate').addClass('info').html('Please select courier from the list.').show();
      var t = setTimeout(function() {
        $('#courierUpdate').removeClass('info').hide().html("");
      }, 5000);
    }
  });

  $('#updateCarrierForm').submit(function(event) {
    event.preventDefault();
    
    var validateForm = validateCourierForm();
    
    if(validateForm == "true") {
      $('#courierUpdate').addClass('info').html('Updating data...').show();
        var t = setTimeout(function() {
          $('#courierUpdate').removeClass('info').hide().html("");
        }, 5000);
        
      var id = $('#courierId').val();
      
      if (id == '') {
        var tt = setTimeout(function() {
          $('#courierUpdate').addClass('error').html('Error communicating with server').show();
        }, 25000);
        $.post('/logistics/dispatch/carrier/add',$(this).serialize(),function(res) {
          clearTimeout(tt);
          $('#courierUpdate').removeClass('error').hide().html("");
          if(res.status == 'success') {
            $('#deleteCourier').attr('disabled',false);
            $('#courierUpdate').addClass('success').html("Added new carrier " + res.courier.name).show();
            var t = setTimeout(function() {
              $('#courierUpdate').removeClass('success').hide().html("");
            }, 10000);
            $('#courierservices-courier').append('<option value="' + res.courier.id + '">' + res.courier.name + '</option>');
            $('#courierservices-addPincode').append('<option value="' + res.courier.id + '">' + res.courier.name + '</option>');
            $('#courierservices-bulk').append('<option value="' + res.courier.id + '">' + res.courier.name + '</option>');
            $('#courierservices-bulkPincodeUploadForm').append('<option value="' + res.courier.id + '">' + res.courier.name + '</option>');
          } else {
            $('#courierUpdate').addClass('error').html("Failed to add new carrier. "+ res.msg).show();
            var t = setTimeout(function() {
              $('#courierUpdate').removeClass('error').hide().html("");
            }, 10000);
          }
        });
      } else {        
        var updateT = setTimeout(function() {
          $('#courierUpdate').addClass('error').html('Error communicating with server').show();
        }, 25000);
        $.post('/logistics/dispatch/carrier/update',$(this).serialize(),function(res) {
          clearTimeout(updateT);
          $('#courierUpdate').removeClass('error').hide().html("");
          if(res.status == 'success'){
            $('#courierUpdate').addClass('success').html("Courier details updated successfully.").show();
            var t = setTimeout(function() {
              $('#courierUpdate').removeClass('success').hide().html("");
            }, 10000);
          } else {
            $('#courierUpdate').addClass('error').html("Courier details did not get updated.").show();
            var t = setTimeout(function() {
              $('#courierUpdate').removeClass('error').hide().html("");
            }, 10000);
          }
        });
      }
      $('#updateCarrierForm').hide();
    }
    else  {
      var t = setTimeout(function() {
        $('#courierUpdate').removeClass('error').hide().html("");
      }, 10000);
    }
  });

}


/* ----------------------- Main ------------------------ */

$(function() {
    initCarrierTab();
});
