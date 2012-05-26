$(function(){
  $('#catUrl').change(function(ev){
    var catUrl = $('#catUrl').val();
    if(catUrl !== '')
      catUrl = catUrl.trim();
    var newCatUrl = generateUrlKey(catUrl);
    $('#catUrl').val(newCatUrl);
  });

  $('#categoryDetailsForm').submit(function(ev){
    ev.preventDefault();
    if($('#catName').val() === '')
      $('#saveCatDetStat').text('Name cannot be blank.');
    else {
      $.post('/category/save',$(this).serialize(), function(res){
        if(res.error)
          showMessage('#saveCatDetStat','important',res.error);
        else {
          showMessage('#saveCatDetStat','success','Category Successfully Saved');
          setTimeout(function () {
            $('#categoriesAll').jstree("refresh");
           }, 1000);
        }
      });
    }
  });
});