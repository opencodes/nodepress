$(document).ready(function() {
	var postid = Number($('#edit_post [name=post_id]').val());
	$.get('/category/list/'+postid,function(res){
		if(res){
			var catlist = '';
			var selected;
			for(var i in res){
				selected = '';
				selected += (res[i].category_id)?'checked="checked"':'';
				catlist  += '<label class="checkbox">';
				catlist  += '<input type="checkbox" name="category[]" value="'+res[i].id+'" '+selected+'>';
				catlist	 += ''+res[i].cat_name+'</label>';
			}
			$('#post_category').html(catlist);
		}
	});
});