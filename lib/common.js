    this.VerticalVariant.select(filters, function (err, results) {    	
      var size = that.hoverFields.indexOf('hover_size') != -1 ? 'hover_size' : 'size';
      var variants = {'Color':[], 'Size':[], 'ColorSize':{}, 'SizeColor':{}};
      if (!err) {
        for (var k in results) {
          if(results[k]['color_code'] && variants.Color.indexOf(results[k]['color_code']) == -1) {
            variants.Color.push({'color_code':results[k]['color_code'],'pid':results[k]['product_id']});         
          }
          if(results[k][size] && variants.Size.indexOf(results[k][size]) == -1) {
            variants.Size.push({'size':results[k]['size'],'pid':results[k]['product_id']});
          }
          if(results[k][size] && results[k]['color_code']) {
            if (!variants.ColorSize[results[k]['color_code']])
              variants.ColorSize[results[k]['color_code']] = [];
            if (!variants.SizeColor[results[k][size]])
              variants.SizeColor[results[k][size]] = [];
            if (variants.ColorSize[results[k]['color_code']].indexOf(results[k][size]) == -1) 
              variants.ColorSize[results[k]['color_code']].push({'size':results[k]['size'],'pid':results[k]['product_id']});
            if (variants.SizeColor[results[k][size]].indexOf(results[k]['color_code']) == -1) 
              variants.SizeColor[results[k][size]].push({'color_code':results[k]['color_code'],'pid':results[k]['product_id']});
          }
        }
        util.log(util.inspect(variants));
      }
      callback(err, variants);
    });