var colMap = {
  'Edit': {
    'sName': '\'cms\'',
    'display_name': '',
    'sWidth': '10%',
    'sClass': "center",
    'bSortable': false,
    'bSearchable': false
  },
  '`id`': {
    'sName': '`id`',
    'display_name': 'ID',
    'sWidth': '10%'
  },
  '`title`': {
    'sName': '`title`',
    'display_name': 'Title'
  },
  '`identifier`': {
    'sName': '`identifier`',
    'display_name': 'Identifier'
  },
  '`status`': {
    'sName': '`status`',
    'display_name': 'Status',
    'sWidth': '10%',
    'sClass': 'center'
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
  $('#colls').html(html);

  var aoColumns = sColumns.map(function (data, index, arr) {
    return colMap[data];
  });
  var oTable = $('#cmsPageListTable').dataTable({
    "bProcessing": true,
    "bRetrieve": true,
    "bServerSide": true,
    "sAjaxSource": "/settings/cms/all",
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

  $('#cmsPageListTable thead.listHead input').keyup(function () { /* Filter on the column (the index) of this element */
    oTable.fnFilter(this.value, $('#cmsPageListTable thead.listHead input').index(this));
  });

  $('#cmsPageListTable td a.cms-item').live('click', function () {
    viewEditPage($(this).data('id'));
  });
}

function viewEditPage(id) {
  if (!id || '' === id) {
    alert('No page to edit');
    return;
  }
  $.get('/settings/cms/view/' + id, function (html) {
    $('#cmsPageListDetailDiv').html(html);
    initTinyMceEditor();
    $('.active').removeClass('active');
    $('#cmsPageListDetail').addClass('active');
    $('#cmsPageListDetailDiv').addClass('active');
  });
}


function updateIdentifier() {
  var identifierField = $('#cmsItemDetail input[name=identifier]');
  if ($('#cmsItemDetail input[name=useTitleId]').is(':checked')) {
    identifierField.attr('readonly', 'readonly');
    // generateUrlKey is defined in /js/catalog/common.js
    identifierField.val(generateUrlKey($('#cmsItemDetail input[name=title]').val()));
  } else if (identifierField.attr('readonly')) {
    identifierField.removeAttr('readonly');
  }
}

function initTinyMceEditor() {
  tinyMCE.init({
    mode: "exact",
    theme: "advanced",
    elements: "cmsContentEditor",
    plugins: "advhr,table,advimage,advlink,inlinepopups,insertdatetime,preview,print,contextmenu,nonbreaking,xhtmlxtras",
    theme_advanced_buttons1: "bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
    theme_advanced_buttons2: "bullist,numlist,|,link,image,code,|,insertdate,inserttime,preview,|,forecolor,backcolor|,print,|,tablecontrols",
    theme_advanced_buttons3: "",
    theme_advanced_toolbar_location: "top",
    theme_advanced_toolbar_align: "left",
    theme_advanced_statusbar_location: "bottom",
    theme_advanced_resizing: true
  });
}
function addSnippet(element) {
  var img_src = $(element).clone().get(0).innerHTML;
  var editor =  tinymce.editors.length>1?tinymce.editors[tinymce.editors.length-1]: tinymce.editors[0];
  var new_p = editor.getDoc().createElement('p');
  var new_img = editor.getDoc().createElement('img');
  $(new_img).attr('src', $(img_src).attr('src'));
  $(new_p).append(new_img);
  editor.execCommand('mceInsertContent', false, new_p.innerHTML);
}

function checkSubmit() {
  return ('' !== $('#uploadImage').val() && ututils.isImage($('#uploadImage').val()));
}

function createCmsImageModal() {
  $('#cmsViewDiv').modal({
    show: false,
    backdrop: false,
    keyboard: false
  });

  $('#cmsViewDiv button.hide').live('click', function () {
    $('#cmsViewDiv').modal('hide');
  });
  $('#addImages').live('click', function (ev) {
    ev.preventDefault();
    $('#cmsViewDiv').modal('show');
  });

  $('#cmsViewDiv').bind('shown', function () {
    fetchCmsImages();
  });
}

function fetchCmsImages() {
  $.get('/settings/cms/browse', function (data) {
    var html = '';
    if ('success' === data.message && data.images) {
      var i = 0;
      for (i; i < data.images.length; i++) {
        html += '<span style="padding: 2px"><a href="#" class="cmsImage"><img src="' + data.images[i] + '" width="120px" height="120px" /></a></span>';
      }
    }
    $('#cmsImagesDiv').html(html);
  });
}

$(function () {
  fetchTableData();
  
  createCmsImageModal();

  $("a[href='#cmsPageList']").click(function (e) {
    refreshDataTable('cmsPageListTable');
  });

  $('.cmsImage').live('click', function () {
    addSnippet(this);
    $('#cmsViewDiv').modal('hide');
  });

  $('.addNewCmsPageBtn').live('click',function () {
    viewEditPage('new');
  });

  $('#cancelCmsBtn').live('click',function(){
    tinyMCE.execCommand('mceRemoveControl',false,'cmsContentEditor');
    $('.active').removeClass('active');
    $('#cmsPageList').addClass('active');
    $('#cmsPageListDiv').addClass('active');
    $('#cmsPageListDetailDiv').html('');
   });
  $('#cmsItemDetail input[name=title]').live('keyup', function () {
    updateIdentifier();
  });

  $('#cmsItemDetail input[name=useTitleId]').live('change', function () {
    updateIdentifier();
  });
});