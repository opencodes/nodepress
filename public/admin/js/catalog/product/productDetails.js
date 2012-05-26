$(document).ajaxStart(function () {
  $('#ajaxSaveBusy').modal('show');
}).ajaxStop(function () {
  $('#ajaxSaveBusy').modal('hide');
});

$(function () {
  $('#ajaxSaveBusy').modal({
    modal: true,
    keyboard: false
  }).css({
    background: 'static',
    width: 'auto',
    'margin-left': function () {
      return -($(this).width() / 2);
    }
  });

  $('#prodVertical').change(function (ev) {
    ev.preventDefault();
    showVerticalAttributes($('#prodVertical').val());
  });

  $('#prodName').change(function (ev) {
    $('#prodMsg').text('');
    $('#saveStatus').text('').hide();
    var prodUrlKey = $('#prodUrlKey').val();
    if($('#prodId').val()==='' || prodUrlKey === ''){
      var prodName = $('#prodName').val();
      if (prodName !== '') prodName = prodName.trim();
      prodUrlKey = generateUrlKey(prodName);
      $('#prodUrlKey').val(prodUrlKey);
    }
  });

  $('#prodUrlKey').change(function (ev) {
    var prodUrlKey = $('#prodUrlKey').val();
    var prodName = $('#prodName').val();
    var newProdUrlKey='';
    if (prodUrlKey !== '') {
      prodUrlKey = prodUrlKey.trim();
      newProdUrlKey = generateUrlKey(prodUrlKey);
    }else if(prodUrlKey ==='')
      newProdUrlKey = generateUrlKey(prodName);
      $('#prodUrlKey').val(newProdUrlKey);
  });

  function arePricesValid() {
    var returnValue = true,errorMsg = 'Wrong Price format.';
    var Price, SpecialPrice;
    if ($('#prodPrice').val() !== '')
      Price = $('#prodPrice').val().trim();
    else {
      returnValue = false;
      errorMsg = 'Price cannot be empty.';
    }
    if ($('#prodSpPrice').val() !== '')
      SpecialPrice = $('#prodSpPrice').val().trim();
    else {
      returnValue = false;
      errorMsg = 'Special price cannot be empty.';
    }
    if(returnValue) {
      if(!ututils.validateWholeNumber(Price) || !ututils.validateWholeNumber(SpecialPrice))
        returnValue = false;
      else if(parseFloat(SpecialPrice) > parseFloat(Price)) {
        errorMsg = 'Special Price cannot be greater than Price.';
        returnValue = false;
      }
    }
    if(!returnValue)
      $('#saveStatus').addClass('important').text(errorMsg).show();
    return returnValue;
  }

  function isBrandValid(){
    var brand = $('#prodBrand').val();
    if(!brand) {
      var errorMsg = 'Please select a brand';
      $('#saveStatus').addClass('important').text(errorMsg).show();
      return false;
    }
    return true;
  }

  function arePositionsValid() {
    var returnValue = true;
    var allPositionsValid = true;
    var allPositions = [];
    var suffix,addId;
    for (var i=$('.imageSortOrder').length-1;i>=0;i--) {
      var id = $('.imageSortOrder')[i].id;
      if(!ututils.validateWholeNumber($('#'+id).val())){
        if(id.indexOf('upPosition') === 0) {
          suffix = id.substring(id.indexOf('_'),id.length);
          addId = '#add'+suffix;
          if($(addId).is(':checked') === true)
            returnValue = false;
        } else
            returnValue = false;
      } else {
        if(allPositions.indexOf($('#'+id).val()) !== -1)
          returnValue = false;
        else {
          if(id.indexOf('upPosition') === 0) {
            suffix = id.substring(id.indexOf('_'),id.length);
            addId = '#add'+suffix;
            if($(addId).is(':checked') === true)
              allPositions.push($('#'+id).val());
          } else
            allPositions.push($('#'+id).val());
        }
      }
    }
    if(!returnValue)
      $('#saveStatus').addClass('important').text('Please provide valid uploaded image sort order').show();
    return returnValue;
  }

  function isFormValid() {
    if(!arePositionsValid() || !arePricesValid() || !isBrandValid())
      return false;
    else
      return true;
  }

  $('#prodType').change(function (ev) {
     $('#prodVertical').val('');
     $('#prodAttributes').html('');
  });

  $('#cancel-prod').click(function(event){
    event.preventDefault();
    renderProductDetails($('#prodId').val());
  });

  $('#uploadnewimage').click(function(event){
     event.preventDefault();
     if ($('#uploadImage').val()) {
       $('#imagesUploadForm').submit();
     }
  });

  $('.hoverimages').change(function(){
    var cur = $(this);
    var img = cur.data('image');
    if ($('.hoverimages').is(':checked')){
      $('.hoverimages').removeAttr('checked');
      cur.attr('checked','checked');
      $('#hoverimageurl').val(img.substring(img.indexOf('_')+1));
    }
    else {
      $('#hoverimageurl').val('');
    }
  });

  $('#productDetailsForm').submit(function (ev) {
    ev.preventDefault();
    tinyMCE.get('prodSDesc').save();
    tinyMCE.get('prodDesc').save();
    var checkedHoverId = $('.hoverimages:checked').map(function () {
      return this.id;
    }).get();

    if ($('#prodType').val() === 'configurable' && $('#prodVertical').val() === '') {
      $('#saveStatus').addClass('important').text('Please specify vertical for configurable product').show();
    } else if ($('#prodTaxClass').val() === '') {
      $('#saveStatus').addClass('important').text('Please specify a tax category').show();
    } else if ($('#prodViz').val() === '') {
      $('#saveStatus').addClass('important').text('Please choose visibility').show();
    } else if (parseInt($('#countRootCat').val(),10) <= 0) {
      $('#saveStatus').addClass('important').text('Please select a root level category.').show();
    } else if ($('#prodSku').val().trim().indexOf(' ') !== -1) {
      $('#saveStatus').addClass('important').text('Sku should not contain spaces.').show();
    } else if ($('#prodUrlKey').val().trim() === '') {
      $('#saveStatus').addClass('important').text('URL key is empty.').show();
    } else if (checkedHoverId.length > 0 && (checkedHoverId[0] === 'hover_'+$('input[name="default_image"]:checked').val())) {
      $('#saveStatus').addClass('important').text('Please select hover image other than default image.').show();
    }
    else {
      if(isFormValid()) {
        $.post('/product/save', $(this).serialize(), function (res) {
          if (res.error) {
        	  showMessage('#saveStatus','important',res.error);
          } else {
            if($('#source').val() !== '') {
              $('#prodSavedImg').html('');
              window.location.reload();
            }
            else
              renderProductDetails(res.id);
        	  showMessage('#saveStatus','success','Product Successfully Saved');
          }
          $('#prodId').val(res.id ? res.id : '');
        });
      }
    }
  });

  $('#dupProd').click(function(event){
    if($('#prodId').val() === '')
      showMessage('#DupError','important','No product to duplicate.');
    else {
      $.get('/product/duplicate/getFolderName',function(res){
        if(res.folderName){
          $('#folderName').val(res.folderName);
          $('#imgFolderName').val(res.folderName);
          $('#prodSku').val('');
          $('#prodUrlKey').val('');
          $('#oldProdStatus').val($('#prodStatus').val());
          $('#prodDupId').val($('#prodId').val().trim());
          $('#prodId').val('');
          $('#prodName').val('');
          $('#prodInfo').val('');
          $('#prodInvName').val('');
          $('#oldProdViz').val($('#prodViz').val());
          $('#oldVertical').val('');
          $('#productCategories').val('_');
          $('#prodHiddenQty').val('');
          $('#productCatList').val('');
          $('#topViewProdURL').html('');
          $('#prodHiddenQty').text('');
          $('#assocProdHdName').text('Please select a configurable product with a valid vertical set. ');
          $('#assocProdListDiv').hide();
          $('#configProdListDiv').hide();
          $('#configProdHdName').text('Please select a configurable product with a valid vertical set.');
          $('#assocProdHdId').text('');
          $('#configProdHdId').text('');
          if($('#prodVertical').val() !== '') {
            $('#prodAttributes').html('');
            showVerticalAttributes($('#prodVertical').val());
          }
          $('#prodSku').focus();
        }
      });
    }
  });
});
