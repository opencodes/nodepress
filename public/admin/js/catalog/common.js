function generateUrlKey(name){
  var nameNew = name.toLowerCase();
  nameNew = nameNew.replace(/[^0-9a-z]+/g, "-");
  return trim(nameNew,'-');
}
function trim(str, chars) {
  return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars) {
  chars = chars || "\\s";
  return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
  chars = chars || "\\s";
  return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function refreshDataTable(tableid) {
  $('#'+tableid).dataTable().fnDraw();
  $('input[type="checkbox"].selectAllProdStatus').removeAttr('checked');
  $('input[type="checkbox"].selectAllProductClass').removeAttr('checked');
  $('input[type="checkbox"].selectAssocProductClass').removeAttr('checked');
  $('input[type="checkbox"].catSAllAssocProdStatClass').removeAttr('checked');
  $('input[type="checkbox"].catSAllUnAssocProdStat').removeAttr('checked');
}

function showMessage(div,css,message){
 $(div).addClass(css).text(message).show();	
 setTimeout(function () {
	 $(div).html('');
 	}, 4000);
}

$(document).ready(function (){
  function setStatus(checkboxClass,tablename,spanId,sendStatus) {
    var checked = $("input['."+checkboxClass+"']:checked");
    var prodIds = [];
    checked.each(function () {
      prodIds.push($(this).val());
    });
    var data = {
      'id': prodIds
    };
    data.status = sendStatus;
    if (prodIds.length > 0) {
      $.post('/products/status', data, function (res) {
        if(res.error)
          showMessage('#' + spanId,'important','Failure');
        else {
          refreshDataTable(tablename);
          $('input[type="checkbox"]').removeAttr('checked');
          showMessage('#' + spanId,'success','Successfully updated status');
        }
      });
    }
  }
  $('#enableProd').live('click',function (event) {
    var status = 1;
    setStatus($(this).data('class'),$(this).data('table'),$(this).data('span'),status);
  });

  $('#disableProd').live('click',function (event) {
    var status = 0;
    setStatus($(this).data('class'),$(this).data('table'),$(this).data('span'),status);
  });

});