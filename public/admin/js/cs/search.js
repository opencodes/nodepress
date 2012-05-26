
function renderCustomerinOrderSearch(res){
  var order = res.order[0];
  var customername;
  var customerPhone = null;
  $('#customerName').text('');
  $('#customerAddress').text('');
  $('#customerTelephone').text('');
  $('#customerEmail').text('');
  if (order && order.address && order.address.shipping) {
    var shippingAddress = order.address.shipping;
    var customerPhone = shippingAddress.phone;
    var address = [ shippingAddress.address , shippingAddress.city , shippingAddress.zip ].filter(ututils.isNullorEmpty);
    address = (address.length > 0)? address.join(',') : 'Not Available';
    $('#customerAddress').text(address);
    $('#customerTelephone').text(customerPhone|| 'Not Available');
  }
  customername = [order.customer_firstname, order.customer_middlename, order.customer_lastname].filter(ututils.isNullorEmpty);
  customername = (customername.length > 0)? customername.join(' ') : '';
  customername.replace('null', '');
  if(!ututils.isNotEmptyString(customername) && order.address.billing){
    customername = [order.address.billing.firstname, order.address.billing.middlename, order.address.billing.lastname].filter(ututils.isNullorEmpty).join(' ');
  } 
  if(!ututils.isNotEmptyString(customername)) {
    customername = 'Not available';
  }
  $('#customerName').text(customername);
  $('#customerEmail').text(order.customer_email);
  if (customerPhone){
    $('#calliframe').attr('src','/cs/callwidget/'+ customerPhone.replace('+91','').trim());
    $('#calliframe-div').show();
  }
  else {
    $('#calliframe').attr('src','');
  }
}

function renderFeedback(tabInfo, email, orderId) {
    $('#feedback-' + tabInfo).show();
    $('#comments-' + tabInfo).focus().select();
    $('#comments-' + tabInfo).val('');
    $('#precomments-' + tabInfo).val('');
    $('#orderId-' + tabInfo).val(orderId);
    $('#email-' + tabInfo).val(email);
    $('#preference-' + tabInfo).attr('checked', false);
    $('#msgcomments-' + tabInfo).text('');
    $.get('/cs/comments/email/' + email, function (res) {
        if (res.status === "success") {
            var resultText = res.result.general + 'Order Specific Comments :\n';
            if (res.result.orderSpecific[orderId] != undefined) resultText += res.result.orderSpecific[orderId] + '\n';
            $('#precomments-' + tabInfo).val(resultText);
        } else {
            if (res.err) $('#msgcomments-' + tabInfo).text(res.err);
        }
    });
}

function deleteFeedback(tabInfo) {
    var email = $('#email-' + tabInfo).val();
    var orderId = $('#orderId-' + tabInfo).val();
    var info = email + ':' + orderId;
    $.post('/cs/comments/delete/' + info, $(this).serialize(), function (res) {
        if (res.status == "success") {
            var previousComments = $('#precomments-' + tabInfo).val();
            var index = previousComments.indexOf('Order Specific Comments :');
            $('#precomments-' + tabInfo).val(previousComments.substring(0, index - 1));
            $('#msgcomments-' + tabInfo).text('Comments were deleted successfully.');
        } else {
            $('#msgcomments-' + tabInfo).text('Comments could not be deleted.');
        }
    });
}

function storeFeedback(tabInfo, data) {
    $.post('/cs/comments/update/' + tabInfo, data, function (res) {
        if (res.status === "success") {
            var previousComment = $('#precomments-' + tabInfo).val();
            var index = previousComment.indexOf('Order Specific Comments :');
            var newComment = res.added;
            if (newComment.indexOf('100') != -1) {
                if (index == -1) newComment = previousComment + '\nOrder Specific Comments :\n' + res.added + '\n';
                else newComment = previousComment.substring(0, index - 1) + '\nOrder Specific Comments :\n' + res.added + '\n';
            } else {
                if (index != -1) newComment = 'General comments: \n' + res.added + '\n' + previousComment.substring(index, previousComment.length);
                else newComment = 'General comments: \n' + res.added + '\n';
            }
            $('#precomments-' + tabInfo).val(newComment);
            $('#comments-' + tabInfo).val('');
            $('#preference-' + tabInfo).attr('checked', false);
            $('#msgcomments-' + tabInfo).text('Your comments were saved successfully.');
        } else $('#msgcomments-' + tabInfo).text('Your comments could not be updated. Error: ' + err);
    });
}

function resetFeedback(tabInfo) {
    $('#comments-' + tabInfo).val('');
    $('#preference-' + tabInfo).attr('checked', false);
    $('#msgcomments-' + tabInfo).text('');
}

function cancelFeedback(tabInfo) {
    $('#msgcomments-' + tabInfo).text('');
    $('#feedback-' + tabInfo).hide();
}

/**
 * Method to trim the whitespaces present in the beginning and end of string
 */
function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g, "");
}

function setUrlOnGo(order_id, tabInfo, email_id,store_url) {
    var selected = '#crmActionStatus_' + order_id;
    switch ($('#sel_' + tabInfo + '_' + order_id).val()) {
    case 'track':
        window.open(store_url+'/track?consoleFlag=1&orderId=' + order_id);
        break;
    case 'comment':
        closeMessageBox(tabInfo);
        renderFeedback(tabInfo, email_id, order_id);
        break;
    case 'cancel':
        $(selected).attr('disabled', true);
        cancelFeedback(tabInfo);
        renderCancelForm($(selected), order_id, tabInfo, email_id);
        //window.open(url);
        break;
    }
}


function renderOrders(div, orders, store_url) {
    var tabInfo = (div === '#orderDetails') ? 'search' : 'history';
    var html = new EJS({
        url: '/ejs/order/orderdetails.ejs'
    }).render({
        'orders': orders,
        'tab': tabInfo,
        'store_url':store_url
    });
    $(div).html(html);
    if(div==='#orderDetails')  $('#customer_orderinfo').show();
    else $('#customer_orders').show();
}



function initSearchTab() {
  $('#cancelMail-history').hide();
  $('#cancelMail-search').hide();
  $('#customer_orderinfo').hide();
  $('#telephone-info').hide();
  $('#phone').focus().select();
  $('#feedback-search').hide();
  $('#phonelookup').show();

	$('#phonelookupForm').submit(function(event) {
		event.preventDefault();
		$('#feedback-search').hide();
		$('#telephone-info').hide();
		$('#customer_orderinfo').hide();
    $('#cancelMail-search').hide();
		$('#messageStatus').text('Fetching..');
		var t = setTimeout(function() {
			$('#messageStatus').text('Error communicating with server');
		}, 25000);

		var searchString = $('#phone').val();
		if(searchString.trim()==='')
		  $('#messageStatus').text('please provide some input');
		else
		$.get('/cs/lookup/'+searchString, function(res) {
			clearTimeout(t);
			$('#messageStatus').text('');
			if (res.retStatus==="success") {
				$('#telephone-info').show();
				renderCustomerinOrderSearch(res);
				renderOrders('#orderDetails',res.order, res.store_url);
			}else{
			  $('#messageStatus').text(res.msg);
      }
		});
	});

	$('#selectAllcrmSearch').click(function(){
		if($(this).attr('checked') == 'checked')
			$('.crmSearchCheckBoxClass').attr('checked','checked');
		else
			$('.crmSearchCheckBoxClass').removeAttr('checked');
	});

	$('#selectAllcrmSearchGo').click(function(){
		var sAction = $('#selectedAction').val();
		$(':checked').filter('.crmSearchCheckBoxClass').each(function(){
					order_id = $(this).val();
					if(sAction == 'track'){
						window.open('http://www.urbantouch.com/track?consoleFlag=1&orderId='+order_id);
					}
				
		});
		$(this).attr('disable',false);
	});

	$('#feedback-search').submit(function(event) {
		event.preventDefault();
		var comments = $('#comments-search').val().trim();
		if(comments!= '') {
			storeFeedback('search',$(this).serialize());
		} else {
			$('#msgcomments-search').text('No comments entered');
			$('#comments-search').val('');
		}
	});
}

$(function() {
    initSearchTab();
    
    //following code is needed in the first (default active) tab, since console-utils.js code for 'menuToTab' 
    //won't work if any of the menu drop down items is accessed while some other menu is active
    var URL = window.location.href;
    if (URL.indexOf('#') != -1) {
      var divId = URL.substring(URL.indexOf('#'), URL.length);
      $('.active').removeClass('active');
      $(divId+'Tab').addClass('active');
      $(divId).addClass('active');
      
      //special check for 'callHistory' - populate its dataTable
      if (divId === '#callHistory')
        fetchTableData();
    }
});
