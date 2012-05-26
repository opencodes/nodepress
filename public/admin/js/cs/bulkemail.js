/* ----------------------- Bulk Email Tab ----------------- */

function allOrderStatus() {
      var status = [
                     'processing',
                     'closed',
                     'holded',
                     'complete',
                     'delivered',
                     'canceled',
                     'pending',
                     'PENDING',
                     'OPF_PRINTED',
                     'AUTHORIZED',
                     'INVOICED',
                     'SHIPPED',
                     'COMPLETE',
                     'DELIVERED',
                     'ON_HOLD',
                     'FAILED',
                     'PEND_CANCEL',
                     'PROCESS_CANCEL',
                     'PAYMENT_REVIEW',
                     'SHIPMENT_CREATED',
                     'HANDED_OVER_TO_COURIER',
                     'RTO_RECEIVED',
                     'COURIER_RETURNED',
                     'HANDED_OVER_TO_INVENTORY',
                     'HANDED_OVER_TO_COURIER',
                     'MIGRATED'];
      return status;
}


function rendercrmOrderDetails(div,orders) {
  var html = '';
  $('#messageValid').text('').hide();
  $(div).html('');
  if(orders.length > 0) {
    $('#orders_info').show();
  var html = new EJS({url: '/ejs/cs/crmorderdetails.ejs'}).render({ 'orders': orders});
    $(div).html(html); 
  } else {
    $('#messageStatus').text('No data found');
  }
}

function getCheckedOrders() {
  var orderIds = [];
	var checked = $("input[@type=checkbox]:checked"); //find all checked checkboxes + radio buttons  
  checked.each(function() {
		if($(this).hasClass('crmOrderCheckBoxMail'))
			orderIds.push($(this).val());
	});
  return orderIds;
}

function sendMails() { 
 	$('#mail_status').hide();
	var template = $('#email-bulkOrders').val();
	var orderIds = getCheckedOrders();
	
  if(orderIds.length > 0 && template) {
    $.post('/cs/orders/apply/' + template, { 'orders': orderIds } , function(response) {
      if (!response.error) {
        var html = new EJS({ url: '/ejs/cs/mailpreview.ejs'}).render({ 'emails': response.emails });
        $('#mail_status').html(html).show();
        initPagerButtons(response.emails.length);
        $('#sendBulkMailForm').submit(function(ev) {
          ev.preventDefault();
          var t = setTimeout(function() {
          var checked = $("input[@type=checkbox]:checked");
            $('#messageValid').text('Error communicating with server').show();
          },25000);

          var checkedOrders = {};
          var emails = [];

          getCheckedOrders().forEach(function(order) {
            checkedOrders[order] = 1;
          });

          response.emails.forEach(function(mail){
            if (mail.orderId in checkedOrders) {
              emails.push(mail);
            }
          });

          $.post('/cs/orders/mail',{ 'emails': emails } , function(res){
            clearTimeout(t);
            $('#mail_status').html(res.result);
            $('#mail_status').show();
          },"json");
          return false;
        });
        $('#resetBulkMailForm').click(function(ev) {
          $('#mail_status').html('');
          $('#mail_status').hide();
          return false;
        });
      } else {
        $('#bulkMailMessage').addClass('label error').html('error in  template  selected');
      }
	  },"json").error(function(res) {
	    $('#bulkMailMessage').addClass('label error').html('No template is selected');
    });
	}else{
		$('#bulkMailMessage').addClass('label error').html('No order/mail template is selected');
		 setTimeout(function() {
			 $('#bulkMailMessage').removeClass('label error').html('');
		 }, 3000);
	}
}

function initPagerButtons(maxEmails) {

  function updatePagerButtons(next,prev) {
			$('#nextButton').removeClass();
			$('#nextButton').addClass('buttons bt'+next);
			$('#nextButton').attr('rel', next);

			$('#prevButton').removeClass();
			$('#prevButton').addClass('buttons bt'+prev);
			$('#prevButton').attr('rel', prev);
  }

  $('#prevButton').click(function() {
    var previous = parseInt($(this).attr('rel'));
    if (previous > 1)
      updatePagerButtons( previous,previous-1);
  });

  $('#nextButton').click(function() {
    var next = parseInt($(this).attr('rel'));
    if (next < maxEmails)
      updatePagerButtons( next + 1,next);
  });

  $('#firstButton').click(function() {
    updatePagerButtons( 2,1);
  });

  $('#lastButton').click(function() {
    updatePagerButtons( maxEmails,maxEmails-1);
  });

}

function validateBulkGetForm() {
  function splitOrders(orderStr) {
    return orderStr.split(/[ ,\r\n]+/);
  }

  var ordersText = $('#orders').val().trim();
  var allOrders = splitOrders(ordersText);
  var validOrders = allOrders.every(ututils.validateOrderId)

  return validOrders;
}

function initBulkMailTab() {
  $('#orders_info').hide();
  $('#mail_status').hide();
  $('#messageValid').hide();

  $('#resetBulk').click(function(event) {
    $('#messageValid').text('').hide();
  });

  $('#sendMailBtn').click(function(event){
    sendMails();
  });

  $('#bulkGetForm').submit(function(ev) {
    ev.preventDefault();
    $('#orders_info').hide();
    $('#mail_status').hide();
    if (validateBulkGetForm()) {
      var t = setTimeout(function() {
        $('#messageValid').text('Error communicating with server').show();
      }, 25000);
      $.post('/cs/orders/fetch',$(this).serialize(),function(res){
        clearTimeout(t);
        if (res.status==="success") {
          rendercrmOrderDetails('#orderCrmDetails',res.orders);
        } else {
          $('#messageValid').text('No data found').show();
        }
      });
    } else {
      $('#messageValid').text('Order Ids invalid').show();
    }
    return false;
  });

	 $('#selectAllcrmOrder').click(function(){
	  if($(this).attr('checked') == 'checked'){
	    $(':checkbox').attr('checked','checked');
    }else{
	    $(':checkbox').removeAttr('checked'); 
    }
	 });
}

$(function() {
	initBulkMailTab();
  
  var html = '<option value="">Select Status</option>';
  var status = allOrderStatus();
  for (var i=0; i < status.length; i++) {
   html += '<option value="'+ status[i]+'">'+status[i]+'</option>';
  }
  $('#orderStatus').html(html);
});
