var oTable;
var rowNumber=1;
boxes = $("input.data");

function checkForEnter(event){
  if (event.which ==13){
    event.preventDefault();
    currentBoxNumber = boxes.index(this);
    if (currentBoxNumber+1>=boxes.length){
      nextBox = boxes[0];
    }
    else
    {
      nextBox= boxes[currentBoxNumber+1];
    }

    nextBox.focus();
    nextBox.select();
    return false;

  }
}

function refreshTable() {
  oTable.fnClearTable();
  $('#bulk-submit').hide();
}

function refreshForm(){
  $('#skuid').focus().select();
  $('.data').val("");
  $('.checks').removeAttr('checked');

  $('.data').each(function(){
    var currentId = $(this).attr('id');
    $('#'+currentId+'-div').removeClass('error');
    $('#'+currentId+'error').html('');
  });
  rowNumber=1;    
}

function submitForm(){

  $('#submit-sku').attr('disabled','disabled');
  var error=false;
  var skuid = $('#skuid').val();
  var qty = $('#qty').val();
  var location = $('#location').val();
  $('.data').each(function(){
    var currentId = $(this).attr('id');
    $('#'+currentId+'-div').removeClass('error');
    $('#'+currentId+'error').html('');
    $(this).val($.trim($(this).val()));
    if($(this).val()==''){
      $('#'+currentId+'-div').addClass('error');
      $('#'+currentId+'error').html("This field is required");
      error = true;
    }

    var fieldId=$(this).attr('id');
    if((fieldId==='skuid' || fieldId==='qty') && !error){
      if(fieldId==='skuid'){
        $('#restocktable tbody tr').each(function(){
          if ($(this).children('td:nth-child(2)').html()===skuid){
            $('#skuiderror').html('skuid already feed');
            error = true;
          }
        });
        if(error){
          $('#'+currentId+'-div').addClass('error');
        }
      }
      if(fieldId==='qty'){
          if(isNaN(qty) || parseInt(qty)<= 0 || !ututils.validatePositiveNumber(qty)){
            $('#qtyerror').html('Valid quantity is required');
            $('#'+currentId+'-div').addClass('error');
            error = true;
          }

      }
    }

  });

  if (!$('#imagechanged').is(':checked') &&  !$('#mrpchanged').is(':checked') && !$('#otherissue').is(':checked')){
    $('#exceptionerror').html('No exception type selected');
    $('#exception-div').addClass('error');
    error = true;
  }
  else{
    $('#exceptionerror').html('');
    $('#exception-div').removeClass('error');
  }

  if(!error){
    $.get('/inventory/restock/sku/'+skuid,function(object){
      if(object['status']==='success'){
        var data = object['info'];
        oTable.fnAddData([rowNumber,data.sku,data.brand,data.name,qty,location,$('#imagechanged').is(':checked'),$('#mrpchanged').is(':checked'),$('#otherissue').is(':checked'),data.id,'<div id="delete-row-'+rowNumber+'" class="deleteRow" onclick="javascript:deleteRow(this);">delete</div>']);
        rowNumber = rowNumber+1;
        $('#restocktable tbody tr td:nth-child(10)').hide();
        $('#skuid').focus().select();
        $('.data').val('');
        $('#submit-sku').removeAttr('disabled');
        $('.checks').removeAttr('checked');
        $('.data').each(function(){
          var currentId = $(this).attr('id');
          $('#'+currentId+'-div').removeClass('error');
        });
        $('#bulk-submit').show();
      }
      else{
          $('#skuiderror').html("Enter a valid skuid");
          $('#skuid-div').addClass('error');
          $('#submit-sku').removeAttr('disabled');
      }
    });

  }
  else{
    $('#submit-sku').removeAttr('disabled');
  }

  return false;

}


function deleteRow(x){
  var i = $(x).attr('id');
  var rowId = i.replace('delete-row-','');
  oTable.fnDeleteRow(rowId-1);
  rowNumber =1;
  if (!$('#restocktable tbody tr:first-child td:first-child').hasClass('dataTables_empty')){
    $('#restocktable tbody tr').each(function(){
      $(this).find('td:last-child div').attr('id','delete-row-'+rowNumber);
      $(this).children('td:first-child:not(.dataTables_empty)').html(rowNumber);
      rowNumber++;
      });
  }
  if (rowNumber===1){
      $('#bulk-submit').hide();
  }
}

function fade(){
  $('#submit-status').fadeOut("slow");
}

function initReorderException(){
  $('#skuid').focus().select();
  $('#bulk-submit').hide();
  $('#restockForm').submit(submitForm);

       
  $(boxes).keypress(checkForEnter);
  oTable = $('#restocktable').dataTable({
         "bFilter":false,
         "bPaginate":false,
         "bSort":false,
         "aoColumns": [
           {"sTitle":"S.No"},
           { "sTitle": "SKU_ID" },
           { "sTitle": "Brand" },
           { "sTitle": "Title" ,"sWidth":"30%"},
           { "sTitle": "QTY" },
           { "sTitle": "Location"},
           { "sTitle":"Image Changed"},
           { "sTitle":"MRP Changed"},
           { "sTitle":"Other Issues"},
           { "sTitle":"Product Id"},
           { "sTitle":"Action"},
        ]

  });

 $('#restocktable thead tr th:nth-child(10)').hide();
  var columns =['sku','brand_value','short_description','qty','location','image_changed','mrp_changed','other_issues','product_id'];

  
  $('#dataTableForm').submit(function(event){
    function createMap(callback){
      var dataMap={};
      var i =0;
      if (!$('#restocktable tbody tr:first-child td:first-child').hasClass('dataTables_empty')){
        $('#restocktable tbody tr').each(function(){
          dataMap[i]={};
          var j =0;
          $(this).children('td:gt(0)').filter(":lt(9)").each(function(){
            dataMap[i][columns[j]] = $(this).html();
            j++;
          });

          i++;
        });
        callback(dataMap);
      }
    }

    createMap(function(dm){
      var status;
      timer = setTimeout(function(){
         $('#submit-status').addClass('label warning').text('Data Submission failure');
         },60000);

      $.post('/inventory/restock/feed/',dm,function(data){
        refreshForm();
        refreshTable();
        if (data.status==='success'){
          status = 'Data Saved Successfully';
          $('#submit-status').addClass('label success');
        }
        else{
          status= 'Form Submission Failed';
        }

        $('#submit-status').text(status);
        $('#submit-status').show();
        clearTimeout(timer);
        setTimeout('fade();',3000);
      });
    });

    event.preventDefault();
    return false;

  });


$('#bulk-submit').click(function(){
  $('#dataTableForm').submit();
});
}



$(document).ready(function(){
  initReorderException();

});
