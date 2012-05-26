$(function () {
  $('#productCategoryForm').submit(function(ev){
    ev.preventDefault();
    if($('#productCatId').val() === '') {
      $('#saveCatStatus').text('Please click on a product first from the first tab.');
    } else {
      $.post('/product/category/save',$(this).serialize(), function(res){
        if(res.error)
          $('#saveCatStatus').text('Failure');
        else {
          $('.active').removeClass('active');
          $('#productList').addClass('active');
          $('#productListDiv').addClass('active');
          $('#productDetailsDiv').html('');
          $('#productInventoryDiv').html('');
          $('#productCatId').val('');
          $('#productCatName').val('');
          $('#hiddenList').val('_');
        }
      });
    }
  });
});
