/**
 * Get user uploaded SKU data and render it in a data table. Expects a JSON response
 * with data as array of table row objects and a ordered column headers and column Names 
 * DOM Id of the element where datatable needs to be rendered
 * */

function getDataTableFromDataAndColList(data, colNames, colTitles, domId) {
  var dataSet = [],
      row = [],
      iter = 0,
      err = '';
  for (var i = 0; i < colNames.length; i++) {
    if (!data[0].hasOwnProperty(colNames[i])) {
      err = 'Error constructing Data Table:: Specified Cols does not exist';
      return err;
    }
  }
  if (data) {
    for (iter = 0; iter < data.length; iter++) {
      row = [];
      for (var i = 0; i < colNames.length; i++) {
        row.push(data[iter][colNames[i]]);
      }
      dataSet.push(row);

    }
  }

  var colSet = colTitles.map(function (data, index, arr) {
    return {
      'sTitle': data
    };
  });
  $('#' + domId).dataTable({
    "aaData": dataSet,
    "aoColumns": colSet,
    "bDestroy": true,
    "sPaginationType": "full_numbers"
  });
  return err;
}