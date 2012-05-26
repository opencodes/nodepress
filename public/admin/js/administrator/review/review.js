var colMap = {
    '`Select`': {
    'sName': '\'abc\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false
  },
  '`id`': {
    'sName': '`id`',
    'bVisible': false
  },
  '`product_id`': {
    'sName': '`product_id`',
    'display_name': 'Product Id'
  },
  '`customer_name`': {
    'sName': '`customer_name`',
    'display_name': 'Name'
  },
  '`created_at`': {
    'sName': '`created_at`',
    'display_name': 'Reviewed on'
  },
  '`heading`': {
    'sName': '`heading`',
    'display_name': 'Heading'
  },
  '`detail_review`': {
    'sName': '`detail_review`',
    'display_name': 'Review'
  }
};


function fetchTableData() {
  var sColumns = [],
      sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#cols').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data]
  });


  var rTable = $('#reviewListTable').dataTable({

    "bProcessing": false,
    "bServerSide": true,
    "sAjaxSource": "/settings/review/all",
    "aaSorting": [
      [1, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "oLanguage": {
      "sSearch": "Search all columns:"
    }

  });

  $("thead input").keyup(function ()  { /* Filter on the column (the index) of this element */
    rTable.fnFilter(this.value, $("thead input").index(this));
  });
  

}


function refreshDataTable() {
  $('#reviewListTable').dataTable().fnDraw();
}

$(document).ready(function () {
  fetchTableData();
  $("a[href='#reviewlist']").click(function (e) {
    refreshDataTable();
  });

   $('#reviewSeletAll').click(function () {
      if ($(this).attr('checked') == 'checked')
        $(':checkbox').attr('checked', 'checked');
     else 
      $(':checkbox').removeAttr('checked');
   });

$('.review_action').click(function(evt){
    evt.preventDefault();
   $(':checked').attr('readOnly','true');
   $('#review_action_type').val($(this).val());
   $('#review_status').addClass('label notice').text('updating...');
   $('#review_approval_form').trigger('submit');
    });
$('#review_approval_form').submit(function(evt){
  evt.preventDefault();
  $.post('/settings/review/approval',$(this).serialize(),function(err, response){
          if ('success' === response.toString().toLowerCase()) {
              $('#review_status').addClass('label success').text('successfully updated.');
           setTimeout(function(){
              $('#review_status').removeClass('label success').text('');
               }, 2000);
              window.setTimeout('location.reload()', 2000);
          }else{
             $('#review_status').addClass('label error').text('Failed.');
             $(':checked').attr('readOnly','false');
           }
      
     });
  

  
  })
  
});
