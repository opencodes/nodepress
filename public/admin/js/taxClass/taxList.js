/**
 *maps columns for datatable
 */
var colMap = {
    'Select':{ 'sName':'\'abc\'',
      'display_name':'Select',
      'bSortable':false,
      'bSearchable':false
    },
    'id'                    : {'sName':'id',
      'display_name':'Id',
      'sWidth':'1%'
    },
    'name'                  : {'sName':'name',
      'display_name':'Name'
    },
    'tax'             : {'sName':'tax',
      'display_name':'Tax'
    },
    'surcharge'             : {'sName':'surcharge',
      'display_name':'Surcharge'
    }
};

var taxTable={};

/**
 *fetches and populates tax datatable
 */

function fade(){
	  $('#submit-status').fadeOut(3500);
	}

function fetchTaxTable()
{
  $('#taxclasslist').show();
  var sColumns = [], sHeaders = [];

  for (var k in colMap) 
  {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html='<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function(data,index,arr) 
  {
    return colMap[data];
  });
  taxTable = $('#taxClassListTable').dataTable({
	    "bProcessing": true,
	    "bServerSide": true,
	    "sAjaxSource": "/settings/taxclass/all",
	    "aaSorting" : [[2,'asc']],
	    "aoColumns": aoColumns,
	    "iDisplayLength":25,
	    "sPaginationType": "full_numbers",
	    "bAutoWidth":false,
	    "oLanguage":{
	      "sSearch":"Search all columns:"
	    },
	    "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull) {
	        var rowid=aData[1];
	        $(nRow).attr("id", rowid);
	        return nRow;
	      }
	    }).makeEditable({
	      "sUpdateURL": "/settings/taxclass/edittaxclassdetails",
	      "aoColumns": [
	                    null,
	                    null,
	                    {
	                      indicator: 'Saving...',
	                      tooltip: 'Click to edit',
	                      type: 'textarea',
	                      submit: 'save',
	                      cancel: 'cancel',
	                      callback: function(){ 
	                      if(ututils.isNotEmptyString(JSON.parse(this.textContent).value))
	                      {	
	                          $('#submit-status').html('Error: '+JSON.parse(this.textContent).value).show();
	    	                  fade();
	                      }  
	                      $('#taxClassListTable').dataTable().fnDraw(); }
	                    },
	                    {
	                      indicator: 'Saving...',
	                      tooltip: 'Click to edit',
	                      type: 'textarea',
	                      submit: 'save',
	                      cancel: 'cancel',
	                      callback: function(){
                          if(ututils.isNotEmptyString(JSON.parse(this.textContent).value))
                          {	
                    	    $('#submit-status').html('Error: '+JSON.parse(this.textContent).value).show();
  	                        fade();
                          }  
	                      $('#taxClassListTable').dataTable().fnDraw(); }
	                    },
	                    {
	                      indicator: 'Saving...',
	                      tooltip: 'Click to edit',
	                      type: 'textarea',
	                      submit: 'save',
	                      cancel: 'cancel',
	                      callback: function(){ 
                          if(ututils.isNotEmptyString(JSON.parse(this.textContent).value))
                          {	
                    	     $('#submit-status').html('Error: '+JSON.parse(this.textContent).value).show();
  	                         fade();
                          }  
	                      $('#taxClassListTable').dataTable().fnDraw(); }
	                    
	    }]
	  });
	  $("thead input").keyup( function () {
	    //  Filter on the column (the index) of this element 
	    taxTable.fnFilter( this.value, $("thead input").index(this) );
	  });
	  $("thead select").change(function(){
	    taxTable.fnFilter( this.value, 0);
	  });
	};
	
	$('#delete_taxclass').click(function (event){
		  var checked = $("input[@type=checkbox]:checked"); //find all checked checkboxes + radio buttons  
		  var taxClassIds = [];
		  checked.each(function () {
		    taxClassIds.push($(this).val());
		  });
		  if (taxClassIds.length > 0) {
		    $.post('/settings/taxclass/deletetaxclass', {
		      'taxClassIds': taxClassIds
		    }, function (res) {
		      //redraw table
				  $('#submit-status').html(res.status);
				  $('#submit-status').show();
				  fade();
		      $('#taxClassListTable').dataTable().fnDraw();
		    });
		  }
		});
	
	
	$('#modal-addTaxClassForm').submit(function(event){
		  $('#msg_addtaxclass').text('Saving Tax Class Details');
		  event.preventDefault();
		  var t = setTimeout(function() {
		    $('#msg_addtaxclass').text('Error communicating with server');
		  }, 60000);
		  $.post('/settings/taxclass/addtaxclass', $(this).serialize(), function(res) {
			  resetForm();
		    clearTimeout(t);
		    $('#submit-status').html(res.status);
			  $('#submit-status').show();
			  fade();
		    $('#msg_addtaxclass').text('ENTER TAX CLASS DETAILS');
			$('#modal-addTaxClassForm').modal('hide');
		    $('#taxClassListTable').dataTable().fnDraw();
		  });
		});

		$('#modal-addTaxClassForm').modal({
		  backdrop:'static',
		  keyboard:true
		});
		$('#add_taxclass').click(function(event){
		  $('#modal-addTaxClassForm').modal('show');
		});
		$('#close_taxclass_modal').click(function(event){
		  $('#modal-addTaxClassForm').modal('hide');
		});


		function resetForm() {
			  $('#id').val('');
			  $('#name').val('');
			  $('#tax').val('');
			  $('#surcharge').val('');
			}
/**
 * on load
 */
$(function() {
  fetchTaxTable();
});