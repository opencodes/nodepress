$(document).ajaxStart(function(){
  $('#ajaxSaveBusy').modal('show');
}).ajaxStop(function(){
  $('#ajaxSaveBusy').modal('hide');
});

$(function () {
  $('#ajaxSaveBusy').modal({
    modal: true,
    keyboard: false
  }).css({
    background: 'static',
    width: 'auto',
    'margin-left': function () {
      return -($(this).width() / 2);
    }
  });

  $('.tab-link').click(function () {
    $('.active').removeClass('active');
    $(this).addClass('active');
    $('#' + $(this).attr('id') + 'Div').addClass('active');
    if ($('#' + $(this).attr('id') + 'Div').html() === '') {
      $('#' + $(this).attr('id') + 'Div').html('Please click on a product in the product list first to view its details.');
    }
  });

  $('.cancelButton').click(function () {
    $('.active').removeClass('active');
    $('#productList').addClass('active');
    $('#productListDiv').addClass('active');
    $('#productDetailsDiv').html('');
    $('#productInventoryDiv').html('');
  });
});

function renderAssociatedProductList(prodType, prodId, configVertical,prodName) {
  if (prodType == 'configurable' && configVertical) {
    $('#assocProdHdName').text('Configurable Product Name - ' + prodName);
    $('#assocProdHdId').text('( Id - ' + prodId + ', Vertical - ' +  configVertical + ' )');
    $('#assocProductId').val(prodId);
    $('#assocProductType').val(prodType);
    $('#assocProductVertical').val(configVertical);
    $('#assocProdListDiv').show();
    $('#configProdListDiv').show();
    fetchAssociatedProdList(prodId, configVertical);
  } else {
    $('#assocProdHdName').text('Please select a configurable product with a valid vertical set. ');
    $('#assocProdListDiv').hide();
    $('#configProdListDiv').hide();
    $('#assocProdHdId').text('');
    $('#configProdHdName').text('Please select a configurable product with a valid vertical set.');
  }
}

function renderUnAssociatedProductList(prodType, prodId, configVertical,prodName) {
  if (prodType == 'configurable' && configVertical) {
    $('#configProdHdName').text('Configurable Product Name - ' + prodName);
    $('#configProdHdId').text('( Id - ' + prodId + ', Vertical -  ' + configVertical + ' )');
    $('#configProductId').val(prodId);
    $('#configProductType').val(prodType);
    $('#configProductVertical').val(configVertical);
    $('#assocProdListDiv').show();
    $('#configProdListDiv').show();
    fetchConfigProductList(prodId, configVertical);
  } else {
    $('#assocProdListDiv').hide();
    $('#configProdListDiv').hide();
    $('#configProdHdId').text('');
    $('#assocProdHdName').text('Please select a configurable product or configurable product vertical is not set.');
    $('#configProdHdName').text('Please select a configurable product or configurable product vertical is not set.');
  }
}

function renderProductDetails(product_id) {
  $.get('/product/' + product_id, function (html) {
    if (html) {
      $('#productDetailsDiv').html(html);
      $('#countRootCat').val('0');
      $('#prodDupId').val('');
      $('#inventoryDetails').hide();
      $('.active').removeClass('active');
      $('#productDetails').addClass('active');
      $('#productDetailsDiv').addClass('active');
      var prodType = $('#prodType').val();
      var prodVertical = $('#oldVertical').val();
      var prodName = $('#prodName').val();
      if(prodVertical !== ''){
        showVerticalAttributes(prodVertical);
      }
      renderUnAssociatedProductList(prodType, product_id, prodVertical,prodName);
      renderAssociatedProductList(prodType, product_id, prodVertical,prodName);
      var inventoryHtml = $('#inventoryDetails').html();
      if($('#prodQty').val() !== '') {
        $('#productInventoryDiv').html(inventoryHtml);
        $('#prodHiddenQty').val($('#prodQty').val());
        $('#inventoryDetails').html('');
      } else
        $('#prodHiddenQty').val('');
      var JTurl = "/product/category/" + product_id;
      $("#categories").jstree({
        "json_data": {
          "ajax": {
            "url": JTurl,
            "data": function (n) {}
          }
        },
        "plugins": ["themes", "json_data", "ui", "checkbox"],
        "checkbox": {
          "two_state": true
        }
      }).bind("change_state.jstree", function (e, data) {
        var tagName = data.args[0].tagName;
        var refreshing = data.inst.data.core.refreshing;
        if ((tagName === "A" || tagName === "INS") && (refreshing !== true && refreshing !== "undefined")) {
          var oldText = $('#hiddenList').val();
          if (oldText.indexOf('_' + data.rslt.data("id") + '_') != -1) {
            var index = oldText.indexOf('_' + data.rslt.data("id") + '_');
            var substring1 = oldText.substring(0, index);
            oldText = oldText.substring(index + 1, oldText.length);
            var index2 = oldText.indexOf('_');
            var substring2 = oldText.substring(index2, oldText.length);
            var result_string = substring1 + substring2;
            $('#hiddenList').val(result_string);
            if(data.rslt.data("level") == '1')
              $('#countRootCat').val(parseInt($('#countRootCat').val(),10) - 1);
          } else {
            $('#hiddenList').val(oldText + data.rslt.data("id") + "_");
            if(data.rslt.data("level") == '1')
              $('#countRootCat').val(parseInt($('#countRootCat').val(),10) + 1);
          }
        }
      }).bind('loaded.jstree', function (e, data) {
        data.inst.get_container().find('li').each(function (i) {
          if ($(this).data('initial_checked') === true) {
            data.inst.check_node($(this));
            if($(this).data('level') === 1)
              $('#countRootCat').val(parseInt($('#countRootCat').val(),10) + 1);
          }
          if($(this).data('is_disabled') === true)
            $(this).children()[1].setAttribute("style","color:#FF0000");
        });
      });
      var productCategories = $('#productCategories').val().trim();
      $('#productCatList').val(productCategories);
      $('#hiddenList').val(productCategories);
      $('preloader').hide();
    }
  });
}

function showVerticalAttributes(vertical){
  var selectedVertical = vertical;
  var prodType = $('#prodType').val();
  var prodId = $('#prodId').val();
  var data = prodId + '_' + selectedVertical;
  $.get('/vertical/info/' + data, function (res) {
    var html = '';
    var newHtml;
    if(res.verticalObj) {
      var verticalObj = res.verticalObj;
      for (var key in verticalObj) {
        if (selectedVertical == key && prodType == 'simple') {
          html = html + '<div class="row">';
          var field = verticalObj[key].field;
          var count = 0;
          for (var key1 in field) {
            attribute = field[key1];
            html = (count === 0 || count === 2) ? (html + '<div class="clearfix span8">') : (html + '<div class="clearfix span6">');
            count++;
            for (var key2 in attribute) {
              if (key2 == 'label') {
                html = html + '<label for="' + attribute[key2] + '">' + attribute[key2] + '</label><div class="input">';
              }
              if (attribute[key2] == 'input') {
                html = html + '<input id="' + key1 + '" name="' + key1 + '" type="text" value="<%=vertical.' + key1 + '%>">';
              }
              if (key2 == 'options') {
                html = html + '<select id="' + key1 + '" name="' + key1 + '">';
                for (var i = 0; i < attribute[key2].length; i++){
                html = html + '<option value="' + attribute[key2][i] + '">' + attribute[key2][i] + '</option>';
                }
             }
              html = html + '</select>';
            }
            html = html + '</div></div>';
          }
          html = html + '</div>';
        }
      }
    }
    if (res.val) {
      newHtml = new EJS({
        text: html
      }).render({
        'vertical': res.val
      });
      $('#prodAttributes').html(newHtml);
      if(res.val.weight_suffix)
      $('#weight_suffix').val(res.val.weight_suffix);
      $('#prodAttributes').show();
    } else {
      newHtml = new EJS({
        text: html
      }).render({
        'vertical': ''
      });
      $('#prodAttributes').html(newHtml);
      $('#prodAttributes').show();
    }
  });
}