"use strict";
var npModelTools = require('../../../model/post'); 
var util = require('util');
var xmlreader = require('../../../lib/xmlreader');
var Query = require('../../../model/sql');
var tables = {category:'category',post:'post',comment:'comment'};

var tool = {
		/**
		 * 
		 * @param req
		 * @param res
		 */
		render:function(req,res){
			res.render('tools/index');
		},

		/**
		 * info : Migration from wordpress
		 * @param req
		 * @param res
		 */
		migrate:function(req,res){
			res.render('tools/migrate');
		},

		/**
		 * info : Read uploded wp-xml file
		 * @param req
		 * @param res
		 */
		wpmigrate:function(req,res,next){
			if(req.files.wpxml){
				var fileinfo = req.files.wpxml;
				xmlreader.readFile(fileinfo.path,function(err,result){
					if(!err){
					util.log(util.inspect(result.channel.item));
						req.items = result.channel.item;
						next();
					}else{
						next(err);
					}		
				});
			}else{
				var e=new Error('File not uploded properly');
				console.log(e);
				next(e);
			}		
		},

		/**
		 * info : create wordpress post and comments to nodepress
		 * @param req
		 * @param res
		 */
		importonode:function(req, res, next){
			req.import = {};
			if(req.items){
				req.import.category = [];
				req.import.post = [];
				req.import.comment = 0;
				tool.fetchCategory(function(err,category){
					req.existCategories=category;				
					tool.createcpc(req.items,req.existCategories,req,function(err,result){
						req.category = result;
						next();
					});
				});
			}else{
				var e='no items in req';
				console.log(e);
				next(e);
			}
		},

		/**
		 * info : create category, add post, add comment
		 * 
		 */
		createcpc:function(items,existCategories,req, callback) {
			var unmatchedcat=[];
			var catName=[];
			existCategories.forEach(function(cat){
				catName.push(cat.cat_name);
			});
			if(items && items.length){
				items.forEach(function (item) {
					if(catName.indexOf(item.category['@'].nicename)<0){
						catName.push(item.category['@'].nicename);
						unmatchedcat.push(item.category['@']);
					}
				});
			}
			if(unmatchedcat.length){
				var count = unmatchedcat.length;
				for(var k =0;k<unmatchedcat.length;k++){
					var catdesc = unmatchedcat[k];
					Query.insert({'cat_name':unmatchedcat[k].nicename,'description':unmatchedcat[k].nicename},tables.category,function(err,insertInfo){
						if(err){
							console.log(err);
						}else{
							req.import.category.push(catdesc.nicename);
							existCategories.push({
								'id':insertInfo.insertId,
								'cat_name':catdesc.nicename
							});
						}
						count--;
						if(count===0){
							callback(null,existCategories);
						}		
					});	
				}								
			}else{
				callback();
			}
		},

		/**
		 * 
		 */
		fetchCategory:function(cb){
			var cats = [];
			Query.select(null,tables.category,function(err,catinfo){
				if(err){
					console.log(err);
				}else{
					if(catinfo && catinfo.length){
						for(var i=0;i<catinfo.length;i++){
							cats.push({
								'id':catinfo[i].id,
								'cat_name':catinfo[i].cat_name
							});
						}				
					}
				}
				cb(err,catinfo);
			});
		},
		/**
		 * 
		 * @param req
		 * @param res
		 * @param next
		 */
		insertpost:function(req,res,next){
			var categories = {};
			if(req.category){
				for(var i=0;i<req.category.length;i++ ){
					categories[req.category[i]['cat_name']] = req.category[i];
				}
			}			
			var count = req.items.length;
			var comments = 0;
			req.items.forEach(function (item) {
				var postdata = {
						title:item.title,
						content:item['content:encoded'],
						category_id:categories[item.category['@']['nicename']].id,
						posted_by:1,
						created_date:item['wp:post_date']};
				req.import.post.push(item.title);
				count--;
				Query.insert(postdata,tables.post,function(err,postinfo){
					if(!err){						
						var comment = item['wp:comment'];
						if(!comment) {
							console.log("No comments for post "+item.title);							
					    } else {					    	
					    	var commentdata = {
								'post_id':postinfo.insertId,
								'comment':comment['wp:comment_content'],
								'comment_date':comment['wp:comment_date'] 
					    	};
					    	
					    	Query.insert(commentdata,tables.comment,function(err,comment){
					    		if(!err){
					    			comments++;
					    			req.import.comment = comments;
					    		}else{
					    			console.log("ERROR"+err);
					    		}
					    		if(count===0){					
									next();
								}
					    	});
					    }
						
					} else {
						console.log("ERROR"+err);	
						if(count===0){					
							next();
						}
					}
						
				});
						
			});
		},

		/**
		 * 
		 * @param req
		 * @param res
		 */
		result:function(req,res){
			var importdata = req.import;
			//util.log(util.inspect(importdata));
			res.render('tools/result',{'imports':importdata});
		}



};
module.exports = tool;
