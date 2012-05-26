
/* ----------------------- Order -------------------------- */

function validateWeight(awbweight) {
  if (('' === awbweight) && ($('#courierservices-dispatch').data('weightRqd') != 1))
    return true;

  var regex = /^[0-9\.]+/;
  if (awbweight.match(regex) && awbweight > 0 && awbweight <= 5)
    return true;

  $('#estimated').text('Weight is Invalid.');
  return false;
}

function validateForm() {
  if ('' === ($('#awbinput').val()) || (!ututils.validateOrderId($('#orderid').val())) || (!validateWeight($('#awbweight').val())))
  return false;

  return true;
}


function updateOrderInfo(order) {
  $('#order-orderid').text(order.id);
  $('#order-email').html("<a href='mailto:" + order.customer_email + "'>" + order.customer_email + "</a>");
  $('#order-cod').text((order.payment_method.toLowerCase() == 'cash on delivery')?"Cash on Delivery":"Prepaid");
  $('#order-pin').text(order.shipping_address.zip);
  $('#order-shipaddress').text(order.shipping_address.address +', ' + order.shipping_address.city);
}

function validateAndFetchOrder() {
  var orderId = $('#orderid').val();
  
  $('#orderid').attr('readOnly', true);  

  if (ututils.validateOrderId(orderId))  {
    $('#estimated').text('fetching ..');

    var t = setTimeout(function() {
      $('#estimated').text('Error communicating with server');
      $('#orderid').attr('readOnly',false);
    }, 25000);

    $.getJSON('/logistics/dispatch/orderInfo/' + orderId, function(order) {
      clearTimeout(t);

      if (order) {
        var courierServices = order.courierServices;
        var carriers = {};  // courierServices, keyed on name, for select
        var priority = 1000;
        var selected = '', etd, weightRqd, selectedId= '',selectedType;
        $('#courierservices-dispatch').empty();

        
        if (courierServices) {
          for (var i =0; i < courierServices.length; i++) {
            var courier = courierServices[i];

            // see if this pincode is really serviced by the courier company 
            if (courier.enable_status === 0)
              continue;

            if (courier.priority < priority) {
              selected = courier.name;    // BUGFIX - 08/11/11
              selectedId = courier.carrier_id;
              selectedType = courier.payment_type;
              priority = courier.priority || 1000; 
              etd = courier.edt || 7; // if unknown, default to 7 days
              weightRqd = courier.weight_required;
            }
            carriers[courier.carrier_id] = courier;
            $('#courierservices-dispatch').append('<option value="'+ courier.carrier_id + '">' + courier.name + '</option>');
          }
        } 

        $('#courierservices-dispatch').val(selectedId);
        $('#courierservices-dispatch').data('weightRqd',weightRqd);

        //'selected' will be empty only when there's just one carrier, i.e. 'By Hand'
        if ('' !== selected)
          $('#order-courier').text(selected+"-"+selectedType);
        else {
          $('#order-courier').text("By Hand-COD/Prepaid");
          etd = 7;
          weightRqd = 0;
        }

        $('#estimated').text(etd + ' days');

        $('#courierservices-dispatch').unbind('change');
        $('#courierservices-dispatch').change(function() {
          var carrierId = $('#courierservices-dispatch option:selected').val();
          var courier = carriers[carrierId];
          $('#estimated').text((courier.edt || 7) + ' days');
          $('#courierservices-dispatch').data('weightRqd',courier.weight_required);
          $('#order-courier').text(courier.name+"-"+courier.payment_type);
          $('#awbinput').focus().select();
        });

        $('#order-shipment').text('');

        $('#order-status').text(order.status);
        if (!order.isValidForShipping || order.shipment) {
          $('#awbupdate').attr('disabled', true);
          $('#awbinput').attr('disabled',true);
          $('#awbweight').attr('disabled',true);
          $('#orderid').attr('readOnly',false);

          if (order.shipment) {
            $('#estimated').text('shipment already created');
            $('#order-shipment').text('created at ' + order.shipment.shipping_date);
          } else {
            $('#estimated').text('order state invalid');
          }
        } else {
          // everything fine - proceed to stage 2
          $('#awbupdate').attr('disabled', false);
          $('#awbinput').attr('disabled',false);
          $('#awbweight').attr('disabled',false);
          $('#orderId').attr('readOnly', false);
        }  

        handleOrderComments(order);
        updateOrderInfo(order);
      } 

      if (order.status != 'success') {
        $('#estimated').text(order.status);
      }

      $('#awbinput').focus().select();
    });
  } else {
    $('#estimated').text('invalid order # '+orderId);
  }
}
function handleOrderComments(order) {
  var feedback = order.feedback;
  if (feedback) {
    var comments = '<h3>';
    var orderComments = getComments(feedback, 'specific');
    if ('' !== orderComments) {
      comments += 'Order Specific: ' + orderComments + '<br />';
    }
    var generalComments = getComments(feedback, 'general');
    if ('' !== generalComments) {
      comments += 'User Comments: ' + generalComments;
    }
    comments += '</h3>';
    if ('<h3></h3>' !== comments.trim()) {
      $('#order-special').html(comments);
      $('#userCommentsPopup').html(comments);
      $('#commentsPopup').modal({
        keyboard: true,show:true, backdrop:'static'
      }).show();
    } else {
      $('#order-special').text('');
    }
  } else {
    $('#order-special').text('');
  }
}
function getComments(feedback, type) {
  var comments = '';
  if (feedback[type]) {
    var index = null;
    for (index in feedback[type]) {
      if (feedback[type].hasOwnProperty(index)) {
        comments += ' ' + feedback[type][index].comment;
      }
    }
  }
  return comments.trim();
}
function resetForm() {
  $('#awbupdate').attr('disabled', false);
  $('#awbinput').attr('disabled',false);
  $('#awbinput').val('');
  $('#awbweight').attr('disabled',false);
  $('#awbweight').val('');
  $('#orderid').val('');
  $('#orderid').focus();
  $('#orderid').attr('readOnly',false);
  $('#courierservices-dispatch').empty();
}

function initOrderTab() {
$('#orderid').focus().select(); 
  $('#edit-pinform').hide();
  $('#orderid').keydown(function(event) {
    if (event.keyCode == 13)  {
      validateAndFetchOrder();
      event.preventDefault();
      return false;
    }
  });

  $('#awbinput').keydown(function(event) {
    if (event.keyCode == 13) {
      $('#awbweight').focus();
      $('#awbweight').select();
      event.preventDefault();
      return false;
    }
    return true;
  });

  $('#awbweight').keydown(function(event) {
    if (event.keyCode == 13) {
        return validateWeight();
      }
      return true;
  });

  $('#deliveryForm').submit(function(event) {
    event.preventDefault();
    if (validateForm()){
      $('#estimated').text('Updating order #' + $('#orderid').val());
      var t = setTimeout(function() {
        $('#estimated').text('Error communicating with server');
      }, 60000);
      $('#awbupdate').attr('disabled', true);
      $.post('/logistics/dispatch/createShipment/'+$('#orderid').val(), $(this).serialize(), function(res) {
        resetForm();
        clearTimeout(t);
        if(res.isDuplicate){
          $('#awbupdate').attr('disabled', false);
        }else{
          resetForm();
        } 
        $('#estimated').text(res.status);
      });
    }
    return false;
  });
}
/* ----------------------- Main ------------------------ */

$(function() {
    initOrderTab();

    //following code is needed in the first (default active) tab, since console-utils.js code for 'menuToTab' 
    //won't work if any of the menu drop down items is accessed while some other menu is active
    var URL = window.location.href;
    if (URL.indexOf('#') != -1) {
      var divId = URL.substring(URL.indexOf('#'), URL.length);
      $('.active').removeClass('active');
      $(divId+'Tab').addClass('active');
      $(divId).addClass('active');
    }
});
