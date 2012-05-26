
$(document).ready(function(){
  $('.reportfetchforms').submit(function(event){
    event.preventDefault();
    var reportCategory = $(this).data('category');
    var reportid = $('#all-'+reportCategory+'-reports').val();

    $.get('/analytics/report/'+reportid+'?reportCategory='+reportCategory,function(data){
      $('#'+reportCategory+'-table').html(data);
      fetchDataTable(reportCategory,reportid);
    });
    
  });
  
});