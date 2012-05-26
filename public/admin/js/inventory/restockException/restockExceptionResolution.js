

  var colMap = {
      'select'                  : {'sName':'\'~\'',
                                    'display_name':'<input type="checkbox" name="check_all" id="check_all" onclick="checkAll(this);">',
                                    'bSortable':false
                                  },
      '`id`'                    : {'sName':'`id`',
                                    'display_name':'Log Id'
                                  },
      '`logged_at`'             : {'sName':'`logged_at`',
                                    'display_name':'Log Date'
                                  },
      '`sku`'                   : {'sName':'`sku`',
                                   'display_name':'SKU_ID'
                                  },
      '`brand_value`'           : {'sName':'`brand_value`',
                                   'display_name':'Brand'
                                  },
      '`short_description`'     : {'sName':'`short_description`',
                                   'display_name':'Title'
                                  },
      '`qty`'                   : {'sName':'`qty`',
                                   'display_name':'Qty'
                                  },
      '`location`'              : {'sName':'`location`',
                                   'display_name':'Location'
                                  },
      '`image_changed`'         : {'sName':'`image_changed`',
                                   'display_name':'Image changed'
                                   },
      '`mrp_changed`'           : {'sName':'`mrp_changed`',
                                   'display_name':'MRP changed'
                                   },
      '`other_issues`'          : {'sName':'`other_issues`',
                                   'display_name':'Other issues'
                                  }
  };


function fetchTableData(){


    var sColumns = [], sHeaders = [];
  
    for (var k in colMap) {
      sColumns.push(k);
      sHeaders.push(colMap[k]['display_name']);
    }

    var html='<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
    $('#colls').html(html);

    var aoColumns = sColumns.map(function(data,index,arr) {
      return colMap[data]
    });

    var oTable = $('#restockExceptionTable').dataTable( {

      "bProcessing": false,
      "bServerSide": true,
      "sAjaxSource": "/inventory/restock/exceptionqueue",
      "aaSorting" : [[1,'asc']],
      "aoColumns": aoColumns,
      "sPaginationType": "full_numbers",
      "bAutoWidth":false,
      "sDom"  : '<"H"lip>rt<"F">ip',
      "fnDrawCallback": function(data) { $('#check_all').removeAttr('checked'); },
      "oLanguage":{
        "sSearch":"Search all columns:"
      }

    });

  $('#restockExceptionResolutionForm').submit( function(event) {
    var sData = $('input', oTable.fnGetNodes()).serialize();
    if (sData===''){
      $('#status').text('Nothing selected')
                  .addClass('label notice')
                  .removeClass('warning success')
                  .show();
    }
    else{
      $.post('/inventory/restock/resolveexception/',sData,function(data){
        var status='';
        if(data.status==='success'){
          status = 'Resolution done successfully.';
          $('#status').addClass('label success')
                      .removeClass('warning notice');
          refreshDataTable();
        }
        else{
          status = "Error in Submission";
          $('#status').addClass('label warning')
                      .removeClass('success notice');
        }
        $('#status').text(status)
                    .show();
        setTimeout("$('#status').fadeOut('slow');",3000);

        });
    }
    event.preventDefault();
    return false;
   } );



$('#restockExceptionTable thead input[type="text"]').keyup( function () {
		/* Filter on the column (the index) of this element */
		oTable.fnFilter( this.value, $("#restockExceptionTable thead input").index(this) );
	} );

  
}

function checkAll(x){
  if($(x).is(':checked')){
    $("#restockExceptionTable tbody input[type='checkbox']").attr('checked','checked');
  }
  else{
    $("#restockExceptionTable tbody input[type='checkbox']").removeAttr('checked');
  }
}

function refreshDataTable(){
 if (!ututils.isDataTable($('#restockExceptionTable')[0])) { //isDataTable() is in ututils.js
    fetchTableData();
  }
  else {
    $('#restockExceptionTable').dataTable().fnDraw();
  }
}

$(document).ready(function(){
  
  $("a[href='#exception-resolution']").click(function(e){refreshDataTable();});
  
});





