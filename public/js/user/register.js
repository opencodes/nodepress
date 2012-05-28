$(document).ready(function(){
  $("#register_form").validate();
  $('#register_form').submit(function(ev){
    ev.preventDefault();
      $.post('/user/register/',$(this).serialize(),function(res){
        if(res){
          $('#comment-msg').html("<div class='alert alert-success'>"+res.msg+"</div>");
          document.getElementById('register_form').reset();

        }
      });
  });
});

