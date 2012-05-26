$(function () {
  $('#brandDetailsForm').submit(function (ev) {
    ev.preventDefault();  
    tinyMCE.activeEditor.save();
      $.post('/brand/save', $(this).serialize(), function (res) {
        if (res.error) {
          if(res.error.indexOf($('#brandName').val()) !== -1 ||
              res.error.indexOf('Cannot delete or update') !== -1)
            $('#brandMsg').text('Brand already exists');
          else
            showMessage('#saveStatus','important', res.error);
        }else {
          renderBrandDetails(res.id);
          showMessage('#saveStatus','success', 'Brand saved successfully.');
        }
        $('#brandId').val(res.id ? res.id : '');
      }); 
  });

  $('#cancelBrand').click(function(event){
    event.preventDefault();
    renderBrandDetails($('#brandId').val());
  });
  
  $('#brandName').change(function(ev){
    var brandName = $('#brandName').val();
    if($('#brandId').val()===''){
      $('#brandMsg').text('');
      $('#saveStatus').text('');
      if(brandName !== '')
        brandName = brandName.trim();
      var brandUrl = generateUrlKey(brandName);
      $('#brandUrlKey').val(brandUrl);   
    }
  });

  $('#brandUrlKey').change(function(ev){
    var brandUrlKey = $('#brandUrlKey').val();
    if(brandUrlKey !== '')
      brandUrlKey = brandUrlKey.trim();
  });
});
