$(function(){
  $('.tab-link').click(function(){
    $('.active').removeClass('active');
    $(this).addClass('active');
    $('#'+$(this).attr('id')+'Div').addClass('active');
    if($('#'+$(this).attr('id')+'Div').html() === '') {
      $('#'+$(this).attr('id')+'Div').html('Please click on a slider in the list first to view its details.');
    }
  });
});
function showMessage(div,css,message){
  $(div).addClass(css).html(message).show(); 
  setTimeout(function () {
    $(div).html('').removeClass(css);
   }, 4000);
 }