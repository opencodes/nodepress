$(function(){
  setupJSTree();
});


function setupJSTree(){
  var product_id = $('#prodId').val();
  $('#source').val('tabLink');
  $('#countRootCat').val('0');
  $('#prodDupId').val('');
  var prodQty = $('#prodQty').val();
  $('#prodHiddenQty').val(prodQty);
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
  $('#inventoryDetails').html('');
  var prodVertical = $('#oldVertical').val();
  if(prodVertical !== ''){
    showVerticalAttributes(prodVertical);
  }
}