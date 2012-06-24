var postdata = {
							title:post.title,
							content:post['content:encoded'],
							category_id:catinfo.insertId,
							posted_by:1,
							created_date:post['wp:post_date']};
					
					Query.insert(postdata,tables.post,function(err,postinfo){
						if(!err){
							
							req.import.post.push(postdata.title);
							console.log(req.import.post)
							util.log(util.inspect(postinfo));
							if(!comment) {
								callback(check);
						    } else {
						    	var commentdata = {
									post_id:postinfo.insertId,
									comment:comment['wp:comment_content'],
									comment_date:comment['wp:comment_date'] 
						    	};
						    	Query.insert(commentdata,tables.comment,function(err,comment){
						    		if(!err){
						    			req.import.comment.push(commentdata.comment);
						    		}
						    		callback(check);
						    	});
						    }
						} else {
							callback(check);
						}
							
					});
					
		

					
					
					//////////////////////
					//util.log(util.inspect(catinfo));
					var postdata = {
							title:post.title,
							content:post['content:encoded'],
							category_id:catinfo.insertId,
							posted_by:1,
							created_date:post['wp:post_date']};
					
					Query.insert(postdata,tables.post,function(err,postinfo){
						if(!err){
							req.import.post.push(postdata.title);
							util.log(util.inspect(postinfo));
							if(!comment) { 
								callback(check);
							}else {
								var commentdata = {
										post_id:postinfo.insertId,
										comment:comment['wp:comment_content'],
										comment_date:comment['wp:comment_date'] 
								};
								Query.insert(commentdata,tables.comment,function(err,comment){
									if(!err){
										req.import.comment.push(commentdata.comment);												
									}
									callback(check);
								});
								
							}
							
							
						}else{
							callback(check);
						}
						
					});