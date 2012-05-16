$(document).ready(function(){
  $("#post_comments").validate();
  $('#post_comments').submit(function(ev){
    ev.preventDefault();
      $.post('/blog/post/',$(this).serialize(),function(res){
        if(res){
          $('#comment-msg').html("<div class='alert alert-success'>"+res.msg+"</div>");
          document.getElementById('post_comments').reset();

        }
      });
  });
});


