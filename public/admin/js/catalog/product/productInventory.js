$(function () {
  $('#productInventoryForm').live('submit', function(ev){
    ev.preventDefault();
    $.post('/product/inventory/save',$(this).serialize(), function(res){
      if(res.error)
        showMessage('#inventorySaveStatus','important','Failure');
      else {
        showMessage('#inventorySaveStatus','success','Success');
      }
    });
  });
});