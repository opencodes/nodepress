var productColMap = {
    'ckBox': {
      'sName': '\'tBox\'',
      'display_name': 'Quantity',
      'bSearchable': false,
      'bSortable': false
    },  
  'tBox': {
    'sName': '\'ckBox\'',
    'display_name': '',
    'bSearchable': false,
    'bSortable': false
  },
  '`id`': {
    'sName': '`id`',
    'display_name': 'Product Id',
    'bVisible': false,
    'bSearchable': false,
    'bSortable': false
  },
  '`sku`': {
    'sName': '`sku`',
    'display_name': 'Sku_id'
  },
  '`name`': {
    'sName': '`name`',
    'display_name': 'Name'
  },
  '`price`': {
    'sName': '`price`',
    'display_name': 'Price'
  }
};

function validateAndAddPrdts(flag) {
  // Validate from backend if selected products are available in required
  // quantity
  var elements = $('#productTable .cartitem-container');
  if (elements.length > 0) {
    var data = {
      'customerId' : $('#hiddenCust_id').val()
    };
    var url;
    if(flag === 'editOrder'){
      url = '/settings/editOrder/renderCart';
    } else{
      url = '/settings/editOrder/validatenCreateCart';
    }
    $.post(url,data, function(res) {
      if (res.response) {
        $('#errorCrtOrder').html(res.details);
        $('#errorCrtOrder').show();
      } else {
        $('#modal-formAddNewOrder').modal('hide');
        showCheckoutTab();
        $('.checkoutDetails').show();
        $('#checkoutDetails').html(res);
        $('#emptyMessage').hide();
        $('.ceo_create').show();
        $('#ero_error').html('').hide();
        $('#hiddenCreateVal').val('1');
        $('.getShippingBtn').hide();
        var cartError = $('#hiddenErrorCart').val();
        if(cartError !== ''){
          $('#hiddenCreateVal').val('0');
          $('.ceo_create').hide();
          $('#ero_error').html(cartError).show();
        }
        //Hide the newOrderNextPrdtSel btn as its ajax call needs to be made once
        if(flag === 'newOrder'){
          $('#newOrderNextPrdtSel').hide();
          $('#productListBack').hide();
          $('#nextPrdtSel').show();
        }
      }

    });
  } else {
    $('#errorCrtOrder').html('Please select atleast one product.');
    $('#errorCrtOrder').show();
  }
}

function renderOrderSummary() {
    var data = {
      'customerId' : $('#hiddenCust_id').val()
    };
    $.post('/settings/editOrder/renderCart',data, function(res) {
      if (res.response) {
        $('#hiddenCreateVal').val('0');
        $('.ceo_create').hide();
        $('#ero_error').html(res.details).show();
        $('#ero_error').append(' click edit items to rectify the cart');
      } else {
        showCheckoutTab();
        $('.checkoutDetails').show();
        $('#checkoutDetails').html(res);
        $('#emptyMessage').hide();
        $('.ceo_create').show();
        $('#ero_error').html('').hide();
        $('#hiddenCreateVal').val('1');
        $('.getShippingBtn').hide();
        var cartError = $('#hiddenErrorCart').val();
        if(cartError !== ''){
          $('#hiddenCreateVal').val('0');
          $('.ceo_create').hide();
          $('#ero_error').html(cartError).show();
        }
      }
    });
}

function fetchProductTableData(customerId,customerEmail,customerName) {
 // $.post('/settings/orderManagement/clearCart', function (res) {
   // if(res.response === "success"){
      $('#hiddenCust_id').val(customerId);
      if(customerEmail || customerEmail){
        $('#customerInfo').show();
        if(customerName) $('#customerName').html('Customer Name <b>'+customerName+'</b>');
        if(customerEmail) $('#customerEmail').html('Email <b>'+customerEmail+'</b>');
      }
      $('.customerListTable').hide();
      $('#orderCreateSubHeading').html('Process Order: Select Products');
      $('.productListTable').show();
      $('#createOrderHome').hide();
      $('.viewCartDetails').hide();
      $('#errorCrtOrder').hide();
      $('#createCustomer').hide();
      $('.addressDetails').hide();
      var sColumns = [],
          sHeaders = [];

      for (var k in productColMap) {
        sColumns.push(k);
        sHeaders.push(productColMap[k]['display_name']);
      }

      var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
      $('#productCols').html(html);

      var aoColumns = sColumns.map(function (data, index, arr) {
        return productColMap[data];
      });


      var pTable = $('#productListTable').dataTable({

        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": "/settings/productlist/get",
        "aaSorting": [
          [1, 'asc']
        ],
        "aoColumns": aoColumns,
        "iDisplayLength": 10,
        "sPaginationType": "full_numbers",
        "bAutoWidth": false,
        "bDestroy": true,
        "sDom": 'rtip'
      });
      
      $("#productListTable input").keyup(function () {
        pTable.fnFilter(this.value, $("#productListTable input").index(this));
      });
  //  }
  //});
}