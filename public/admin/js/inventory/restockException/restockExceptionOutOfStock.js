(function(){

  var colMap = {
      'sku'                    : {'sName':'sku',
                                  'display_name':'SKU'
                                  },
      'short_description'     : {'sName':'short_description',
                                 'display_name':'Title'
                                  }
  };


function fetchOutOfStockDataTable(){


    var sColumns = [], sHeaders = [];

    for (var k in colMap) {
      sColumns.push(k);
      sHeaders.push(colMap[k]['display_name']);
    }

    var html='<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
    $('#colls-out-of-stock').html(html);

    var aoColumns = sColumns.map(function(data,index,arr) {
      return colMap[data]
    });


    var pTable = $('#out-of-stock').dataTable( {

      "bProcessing": false,
      "bServerSide": true,
      "sAjaxSource": "/inventory/restock/outofstock",
      "aaSorting" : [[1,'desc']],
      "aoColumns": aoColumns,
      "sPaginationType": "full_numbers",
      "bAutoWidth":false,
      "sDom"  : '<"H"lip>rt<"F">ip',
      "oLanguage":{
        "sSearch":"Search all columns:"
      }

    });


$('#out-of-stock thead input[type="text"]').keyup( function () {
		/* Filter on the column (the index) of this element */
		pTable.fnFilter( this.value, $("#out-of-stock thead input").index(this) );
	} );


}

function refreshOutOfStockDataTable(){

  if (!ututils.isDataTable($('#out-of-stock')[0])) { //isDataTable() is in ututils.js
    fetchOutOfStockDataTable();
  }
  else {
  $('#out-of-stock').dataTable().fnDraw();
  }
}

$(document).ready(function(){
  $("a[href='#exception-outofstock']").click(function(e){refreshOutOfStockDataTable();});
});

})();





