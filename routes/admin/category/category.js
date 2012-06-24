"use strict";
var npModelCat = require('../../../model/category'); 
var util = require('util');
var category = {
		param: function (req, res, next) {
	      var cat_id = null;
	      if(req.params.catid){
	        req.catid = req.params.catid;  
	        cat_id = req.catid;
	      }      
	      category.info(req, res, next,cat_id);
	    },
	    /*
	     * info : Retrieve all the cat.
	     * @param req
	     * @param res
	     * @param next
	     */
	    info:function(req, res,next,cat_id){
	      var ids = cat_id;
	      npModelCat.cat_by_id(ids,function(err,cats){
	        if(!err){
	          req.blogcat = {};
	          //util.log(util.inspect(cats));
	          for(var index in cats){
	            var cat_id = cats[index].id;            
	            req.blogcat[cat_id] = cats[index];
	          }
	          util.log(util.inspect(req.blogcat));
	          next();
	        }
	        else{
	          console.log('Error in fetching cats');
	          next();
	        }
	      });
	    },
	    /*
	     * info : Render all cat.
	     * @param req
	     * @param res
	     * @param next
	     */
	    render_all:function(req, res){
	      //util.log(util.inspect(req.blogcat));
	      res.render('category/list.ejs', 
	          { title: 'My Blog Page'});
	    },
	    /*
	     * info : Render all cat.
	     * @param req
	     * @param res
	     * @param next
	     */
	    render:function(req, res){
	      var blogcat = req.blogcat[req.catid];
	      req.session.catid=req.catid;
	      res.render('category/view.ejs', 
	          { title: 'My Blog Page',
	            'blogcat':blogcat            
	            });
	    },
	    /*
	     * info : send json for datatable and other purpose
	     * @param req request
	     * @param res response
	     */
	    json_data:function(req,res){
	    	npModelCat.cat_by_id(null,function(err,cats){
	        if(!err){
	          //util.log(util.inspect(cats));          
	          var catjson = {
	              "sEcho": 1,
	              "iTotalRecords": "57",
	              "iTotalDisplayRecords": "57",
	              "aaData": cats
	            };
	          res.json(catjson);
	        }
	      });      
	    },
	    /*
	     * info : save cat
	     * @param req request
	     * @param res response
	     */
	    save:function(req,res){
	    	var catid = (req.body.catid)?req.body.catid:null;
	    	var data = {
	    		id:catid,
	    		cat_name:req.body.catname,
	    		description:req.body.description
	    	};
	    	npModelCat.save(data,function(err,result){
	    		if(!err){
	    			console.log('cat save successfully');
	    			res.redirect('/category/');
	    		}
	    	});
	    },
	    /*
	     * info : delete cat
	     * @param req request
	     * @param res response
	     */
	    deletecat:function(req,res){    	
	    	var cat_id = req.params.catid;
	    	if(cat_id){
	    		npModelCat.deletecat(cat_id,function(err,result){
	        		if(!err){
	        			console.log('cat deleted successfully');
	        			res.redirect('/category/');
	        		}
	        	});
	    	}
	    	else{
	    		res.redirect('/cats/')
	    	}
	    	
	    },
	    /*
	     * info : delete cat
	     * @param req request
	     * @param res response
	     */
	    add:function(req,res){
	    	res.render('category/add.ejs', 
	    	          { title: 'My Blog Page'
	    	            
	    	});
	    },
	    /*
	     * info : save cat
	     * @param req request
	     * @param res response
	     */
	    addcat:function(req,res){
	    	var data = {
	    		cat_name:req.body.catname,
	    		description:req.body.description
	    	};
	    	util.log(data);
	    	npModelCat.add(data,function(err,result){
	    		if(!err){
	    			console.log('cat save successfully');
	    			res.redirect('/category/');
	    		}
	    		else{console.log(err);}
	    	});
	    }
    
};
module.exports = category;
