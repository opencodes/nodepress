$(function () {
  
  $('.cancelButton').click(function () {
    $('.active').removeClass('active');
    $('#inventorylist').addClass('active');
    $('#inventorylistDiv').addClass('active');
    $('#inventoryProductDiv').html('');
  });
  
  $('#inventoryProductForm').live('submit', function(ev){
    ev.preventDefault();
    $.post('/inventory/product/save',$(this).serialize(), function(res){
      if(res.error){
        $("#inventoryPtoductSaveStatus").html('<div class="alert-message block-message error"> '+ res.msg+'</div>');
      } else {
        $("#inventoryPtoductSaveStatus").html('<div class="alert-message block-message success"> '+ res.msg+'</div>');
      }
      setTimeout(function () {
        $('#inventoryPtoductSaveStatus').html('');
       }, 5000);
    });
  });
});