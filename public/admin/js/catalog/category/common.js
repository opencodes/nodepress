$(function(){
  $('.tab-link').click(function(){
    $('.active').removeClass('active');
    $(this).addClass('active');
    $('#'+$(this).attr('id')+'Div').addClass('active');
    if($('#'+$(this).attr('id')+'Div').html() === '') {
      $('#'+$(this).attr('id')+'Div').html('Please click on a category in the category list first to view its members.');
    }
  });
})