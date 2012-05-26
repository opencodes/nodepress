/**
 *maps columns for datatable
 */
var colMap = {
    'Select':{ 'sName':'\'abc\'',
      'display_name':'Select',
      'bSortable':false,
      'bSearchable':false
    },
    'entity_id'                    : {'sName':'entity_id',
      'display_name':'Vendor Id',
      'sWidth':'1%'
    },
    'vendor_name'                  : {'sName':'vendor_name',
      'display_name':'Vendor Name'
    },
    'contact_person'             : {'sName':'contact_person',
      'display_name':'Contact Person'
    },
    'contact_number'             : {'sName':'contact_number',
      'display_name':'Contact Number'
    },
    'email_id'             : {'sName':'email_id',
      'display_name':'Email-Id'
    },
    'address'                 : {'sName':'address',
      'display_name':'Address'
    },
    'payment_terms'                 : {'sName':'payment_terms',
      'display_name':'Payment Terms'
    },
    'vendor_status'                 : {'sName':'vendor_status',
      'display_name':'Vendor Status'
    },
    'remarks'                 : {'sName':'remarks',
      'display_name':'Remarks'
    }

};

/**
 *global variable for datatable
 */
var vendorTable={};

/**
 *fetches and populates vendor datatable
 */
function fetchVendorTable(){
  $('#vendorlist').show();
  var sColumns = [], sHeaders = [];

  for (var k in colMap) {
    sColumns.push(k);
    sHeaders.push(colMap[k]['display_name']);
  }

  var html='<tr><td>' + sHeaders.join('</td><td>') + '</td></tr>';
  $('#colls').html(html);

  var aoColumns = sColumns.map(function(data,index,arr) {
    return colMap[data];
  });

  vendorTable = $('#vendorListTable').dataTable({
    "bProcessing": true,
    "bServerSide": true,
    "sAjaxSource": "/inventory/vendors/all",
    "aaSorting" : [[2,'desc']],
    "aoColumns": aoColumns,
    "iDisplayLength":25,
    "sPaginationType": "full_numbers",
    "bAutoWidth":false,
    "sDom"  : '<"H"lip>rt<"F">ip',
    "oLanguage":{
      "sSearch":"Search all columns:"
    },
    "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      var rowid=aData[1];
      $(nRow).attr("id", rowid);
      return nRow;
    }
  }).makeEditable({
    "sUpdateURL": "/inventory/vendor/editvendordetails",
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
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  },
                  {
                    indicator: 'Saving...',
                    tooltip: 'Click to edit',
                    type: 'textarea',
                    submit: 'save',
                    cancel: 'cancel',
                    callback: function(){
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  },
                  {
                    indicator: 'Saving...',
                    tooltip: 'Click to edit',
                    type: 'textarea',
                    submit: 'save',
                    cancel: 'cancel',
                    callback: function(){ 
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  },
                  {
                    indicator: 'Saving...',
                    tooltip: 'Click to edit',
                    type: 'textarea',
                    submit: 'save',
                    cancel: 'cancel',
                    callback: function(){
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  },
                  {
                    indicator: 'Saving...',
                    tooltip: 'Click to edit',
                    type: 'textarea',
                    submit: 'save',
                    cancel: 'cancel',
                    callback: function(){
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  },
                  {
                    indicator: 'Saving...',
                    tooltip: 'Click to edit',
                    type: 'textarea',
                    submit: 'save',
                    cancel: 'cancel',
                    callback: function(){
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  },
                  {
                    indicator: 'Saving...',
                    tooltip: 'Click to edit',
                    type: 'select',
                    data: "{'active':'active', 'inactive':'inactive'}",
                    submit: 'save',
                    cancel: 'cancel',
                    callback: function(){
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  },
                  {
                    indicator: 'Saving...',
                    tooltip: 'Click to edit',
                    type: 'textarea',
                    submit: 'save',
                    cancel: 'cancel',
                    callback: function(){ 
                      if(JSON.parse(this.textContent).value==='Please login, before you edit')
                        alert(JSON.parse(this.textContent).value);
                      $('#vendorListTable').dataTable().fnDraw(); }
                  }]
  });
  $("thead input").keyup( function () {
    //  Filter on the column (the index) of this element 
    vendorTable.fnFilter( this.value, $("thead input").index(this) );
  });
  $("thead select").change(function(){
    vendorTable.fnFilter( this.value, 0);
  });
};

/**
 * vendor deactivation
 */
$('#deactivate_vendor').click(function (event){
  var checked = $("input[@type=checkbox]:checked"); //find all checked checkboxes + radio buttons  
  var vendorIds = [];
  checked.each(function () {
    vendorIds.push($(this).val());
  });
  if (vendorIds.length > 0) {
    $.post('/inventory/vendors/deactivate', {
      'vendorIds': vendorIds
    }, function (res) {
      if(res.loginRequested)
        alert(res.loginRequested);
      //redraw table
      $('#vendorListTable').dataTable().fnDraw();
    });
  }
});

/**
 * save vendor
 */
$('#modal-addVendorForm').submit(function(event){
  $('#msg_addvendor').text('Saving Vendor Details');
  event.preventDefault();
  var contactNumber = $('#contact_number').val();
  if(!ututils.validateTelephone(contactNumber)){
    $("#vendorNumberActionResponse").html('<div class="alert-message block-message error" style="padding:5px;"> Invalid contact number</div>');
      setTimeout(function() {
        $("#vendorNumberActionResponse").html('');
      }, 2000);
    return;
  }
  var email = $('#email_id').val();
  if(!ututils.validateEmail(email)){
    $("#vendorEmailActionResponse").html('<div class="alert-message block-message error" style="padding:5px;"> Invalid email address</div>');
      setTimeout(function() {
        $("#vendorEmailActionResponse").html('');
      }, 2000);
    return;
  }
  var t = setTimeout(function() {
    $('#msg_addvendor').text('Error communicating with server');
  }, 60000);
  $.post('/inventory/vendors/addvendor', $(this).serialize(), function(res) {
    resetForm();
    clearTimeout(t);
    alert(res.status);
    $('#msg_addvendor').text('ENTER VENDOR DETAILS');
    $('#modal-addVendorForm').modal('hide');
    $('#vendorListTable').dataTable().fnDraw();
  });
});

$('#modal-addVendorForm').modal({
  backdrop:'static',
  keyboard:true
});
$('#add_vendor').click(function(event){
  $('#modal-addVendorForm').modal('show');
});
$('#close_vendor_modal').click(function(event){
  $('#modal-addVendorForm').modal('hide');
});


/**
 * add vendor form reset
 * */
function resetForm() {
  $('#vendor_name').val('');
  $('#contact_person').val('');
  $('#contact_number').val('');
  $('#email_id').val('');
  $('#address').val('');
  $('#payment_terms').val('');
  $('#remarks').val('');
}

/**
 * on load
 */
$(function() {
  fetchVendorTable();
});