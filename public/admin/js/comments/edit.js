$(document).ready(function() {
	var postid = Number($('#edit_post [name=post_id]').val());
	$.get('/category/list/'+postid,function(res){
		if(res){
			var catlist = '';
			var selected;
			for(var i in res){
				selected = '';
				selected += (parseInt(res[i].category_id)!==0)?'checked="checked"':'';
				catlist  += '<label class="radio">';
				catlist  += '<input type="radio"  id="optionsRadios1"  name="category" value="'+res[i].cat_id+'" '+selected+'>';
				catlist	 += ''+res[i].cat_name+'</label>';
			}
			$('#post_category').html(catlist);
		}
	});
});