var colMap = {
  'Select': {
    'sName': '\'abc\'',
    'display_name': 'Select',
    'bSortable': false,
    'bSearchable': false
  },
  'id': {
    'sName': 'id',
    'display_name': 'Id',
    'sWidth': '1%'
  },
  'title': {
    'sName': 'title',
    'display_name': 'Title'
  },
  'href': {
    'sName': 'href',
    'display_name': 'Url/Href'
  },
  'info': {
    'sName': 'info',
    'display_name': 'Info'
  },
  'start_at': {
    'sName': 'start_at',
    'display_name': 'Start At'
  },
  'end_at': {
    'sName': 'end_at',
    'display_name': 'End At'
  },
  'position': {
    'sName': 'position',
    'display_name': 'Position'
  },
  'active': {
    'sName': 'active',
    'display_name': 'Active'
  }
};

var sliderTable = {};


function fetchSliderTable() {
  var sColumns = [];
  var sHeaders = [];
  var k = null;
  for (k in colMap) {
    if (colMap.hasOwnProperty(k)) {
      sColumns.push(k);
      sHeaders.push(colMap[k]['display_name']);
    }
  }

  var html = '<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });

  var oTable = $('#sliderListTable').dataTable({
    "bProcessing": false,
    "bRetrieve": true,
    "bServerSide": true,
    "bStateSave": true,
    "sAjaxSource": "/marketing/slider/all",
    "aaSorting": [
      [1, 'asc']
    ],
    "aoColumns": aoColumns,
    "iDisplayLength": 25,
    "sPaginationType": "full_numbers",
    "bAutoWidth": false,
    "sDom": '<"H"lip>rt<"F">ip'
    
  });

  $(".sliderlistHead input").keyup(function () { /* Filter on the column (the index) of this element */
    oTable.fnFilter(this.value, $(".sliderlistHead input").index(this));
  });
}

function refreshSliderDataTable(){
  if (!ututils.isDataTable($('#sliderListTable')[0])) { //isDataTable() is in ututils.js
    fetchPrintOrderTableData();
  }
  else {
    $('#sliderListTable').dataTable().fnDraw();
  }
  
  $('#sliderListTable').removeAttr('checked');  

}
function selectDeselectFeature(tableid, checkboxaction) {
  var html = '<strong class="selectcount"> 0 </strong> item selected.';
  $(checkboxaction).html(html);
  
  
  $(tableid + ' input:checkbox').live('click', function (event) {
    var checkedcount = $(tableid + " input:checkbox:checked").length;
    var selectchecked = $(tableid+' th input:checkbox').attr('checked');
    if (selectchecked && selectchecked=='checked') {
      checkedcount -= 1;
    }
    $(checkboxaction + " strong.selectcount").text(checkedcount);
  });
}
$('#selectSliders').click(function () {
  if ($(this).attr('checked') == 'checked') 
    $('.sliderClass').attr('checked', 'checked');
  else 
    $('.sliderClass').removeAttr('checked');
});

function renderSliderDetails(slider_id) {
  $.get('/marketing/slider/info/' + slider_id, function (html) {
    $('#sliderDetailsDiv').html(html);
    $('.active').removeClass('active');
    $('#sliderDetails').addClass('active');
    $('#sliderDetailsDiv').addClass('active');
  });
} 
function renderSliderAddForm() {
  var html = new EJS({
    url: '/ejs/marketing/slider/add.ejs'
  }).render();
    $('#sliderDetailsDiv').html(html);
    $('.active').removeClass('active');
    $('#sliderDetails').addClass('active');
    $('#sliderDetailsDiv').addClass('active');
}
$(document).ready(function(){  
  fetchSliderTable();
  selectDeselectFeature('#sliderListTable','#cbactslider');
  $('#clearsliderSearch').click(function(event){
    $('.search_init').val('');
    $('#sliderListTable').dataTable().fnResetAllFilters();
  });
  $('#sliderListTable tbody tr td:nth-child(2)').live('click', function () {
    renderSliderDetails(Number($(this).text()));
  });
  $('#sliderAdd').live('click', function () {
    renderSliderAddForm();
  });
  
   $("#bulkDelete").click(function () {
    var checkedValues = [];
    var form = $("form#sliderListTableForm");
    var htmls = '';

    $('#sliderListTable input[type="checkbox"]:checked').each(function () {
      htmls += '<input name="sliderId[]"  value="' + $(this).val() + '" type="hidden" />';
    });
    if ('' === htmls) {
      return;
    }
    htmls += '<input type="hidden" name="action" value="delete" />';
    form.html(htmls);
    $.post('/marketing/slider/delete', form.serialize(), function (res) {
      var successcount = res.count;
      refreshSliderDataTable();
      showMessage('#actionResponse','alert-message block-message success', 'Slider saved successfully.');
    });
  });
});






