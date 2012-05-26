/* ---------------------------DataTable--------------------*/
/**
 *global variable for datatable
 */
var reportDataTable = {};

function fetchDataTable(reportCategory, report_id) {
  reportDataTable[reportCategory] = $('#datatableReport-'+reportCategory).dataTable({
                "bProcessing" : true,
                "bServerSide" : true,
                "sAjaxSource" : "/analytics/reportData/"+report_id,
                "aaSorting" : [
                  [1, 'desc']
                ],
                "iDisplayLength" : 25,
                "sPaginationType" : "full_numbers",
                "bAutoWidth" : false,
                "sDom": '<"H"li>rt<"F">ip',
                /*"oTableTools": {
                            "sSwfPath": "/swf/copy_cvs_xls_pdf.swf",
                            "aButtons": [ "copy", "csv", ]
                                      },*/
                "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                  for (var i = 1; i < (aData.length); i++) { //1st column is dummy id and last column is id of courier company
                    if (aData[i] === null) $('td:eq(' + (i) + ')', nRow).html('null'); // i-1 because first is dummy
                  }
                  return nRow;
                }
              });

    $(".datatableReportHead-"+reportCategory+" input").keyup(function () {
      reportDataTable[reportCategory].fnFilter(this.value, $(".datatableReportHead-"+reportCategory+" input").index(this));
    });
  
}

/* ----------------------- Main ------------------------ */
$(function() {
    $('.export_report').live('click',function (event) {
      event.preventDefault();
      var reportCategory = $(this).data('category');
      var tableParams = reportDataTable[reportCategory].oApi._fnAjaxParameters(reportDataTable[reportCategory].fnSettings());
      var obj = '';
      var oper = '';
      for (var i = 0; i < tableParams.length; i++) {
        obj += oper;
        obj += tableParams[i]['name'] + '=' + encodeURIComponent(tableParams[i]['value']);
        oper = '&';
      }
      obj = 'reportId='+$('#reportId-'+reportCategory).val() + '&'+obj;
      $("form#export_all_report_items_form-"+reportCategory).attr("action", "/analytics/report/exportall?" + obj).submit();
  });

});
