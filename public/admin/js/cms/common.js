$(function(){
  $('.tab-link').click(function () {
    $('.active').removeClass('active');
    $(this).addClass('active');
    $('#' + $(this).attr('id') + 'Div').addClass('active');
    if ($('#' + $(this).attr('id') + 'Div').html() === '') {
      $('#' + $(this).attr('id') + 'Div').html('Please click on a item in the cms list to view/edit its details or add new from <a href="#" class="addNewCmsPageBtn">here</a>.');
    }
  });
});


