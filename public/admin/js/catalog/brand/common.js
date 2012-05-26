$(function(){
  $('.tab-link').click(function(){
    $('.active').removeClass('active');
    $(this).addClass('active');
    $('#'+$(this).attr('id')+'Div').addClass('active');
    if($('#'+$(this).attr('id')+'Div').html() === '') {
      $('#'+$(this).attr('id')+'Div').html('Please click on a brand in the brand list first to view its details.');
    }
  });

  $('.cancelButton').click(function(){
    $('.active').removeClass('active');
    $('#brandList').addClass('active');
    $('#brandListDiv').addClass('active');
    $('#brandDetailsDiv').html('');
   });
});


