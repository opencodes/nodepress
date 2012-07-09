$(document).ready(function() {
	var postid = Number($('#edit_post [name=post_id]').val());
	$.get('/category/all/',function(res){
		if(res){
			var catlist = '';
			var selected;
			var cats = res.aaData;
			for(var i in cats){
				selected = '';
				selected += (parseInt(cats[i].category_id)!==0)?'checked="checked"':'';
				catlist  += '<label class="radio">';
				catlist  += '<input type="radio"  id="optionsRadios1"  name="category" value="'+cats[i].id+'" '+selected+'>';
				catlist	 += ''+cats[i].cat_name+'</label>';
			}
			$('#post_category').html(catlist);
		}
	});
});