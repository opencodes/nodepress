$(function () {
  $('.formElement').keydown(function (event) {
    if (event.keyCode == 13) {
      var tabIdx = $(this).attr('tabIndex');
      var i = 0;
      var forms = $(this).closest('form').map(function () {
        return $.makeArray(this.elements);
      });
      if (tabIdx === 0) {
        forms.each(function () {
          if ($(this).hasClass('formElement')) {
            $(this).attr('tabIndex', ++i);
          }
        });
      }
      var btn = $(this).is(':button');
      var val = $(this).val();
      if (('submit' != $(this).attr('type')) && ('reset' != $(this).attr('type'))) {
        event.preventDefault();
        forms.each(function () {
          if (((val == '') || ('undefined' == val)) && !btn) {
            return false;
          }
          if (($(this).attr('tabIndex') == tabIdx + 1) && ($(this).hasClass('formElement'))) {
            $(this).focus().select();
            return false;
          }
        });
      }
    }
  });
  $('ul.nav li.active').removeClass('active');
  $('ul.nav li a[href="' + window.location.pathname + '"]').parents().addClass('active');
  
  $('.menuToTab').click(function(){
    var URL = $(this).attr('href');
    if (URL.indexOf('#') != -1) {
      var divId = URL.substring(URL.indexOf('#'), URL.length);      
      $('a[href=\''+divId+'\']').trigger('click');
    }
  });
});
