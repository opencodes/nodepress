
var colMap = {
    '\'~\''                   : {'sName': '\'~\'',
      'display_name': 'Select',
      'bSearchable': false,
      'bSortable': false
    },
    '`id`'                    : {'sName':'`id`',
      'display_name':'Coupon Id'
    },
    '`coupon_code`'             : {'sName':'`coupon_code`',
      'display_name':'Coupon Code'
    },
    '`backend`'     : {'sName':'`backend`',
      'display_name':'Backend'
    },
    '`description`'      : {'sName':'`description`',
      'display_name':'Description'
    },
    '`total_usage`'      : {'sName':'`total_usage`',
      'display_name':'Total Usage'
    },
    '`waive_shipping`'      : {'sName':'`waive_shipping`',
      'display_name':'Waive Shipping',
    },
    '`active`'      : {'sName':'`active`',
      'display_name':'Active',
      'bSearchable': false
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
    return colMap[data];
  });
  var oTable = $('#couponListTable').dataTable( {
    "bProcessing":true,
    "bRetrieve": true,
    "bServerSide": true,
    "sAjaxSource": "/settings/coupons/all",
    "aaSorting" : [[1,'asc']],
    "aoColumns": aoColumns,
    "iDisplayLength":25,
    "sPaginationType": "full_numbers",
    "bAutoWidth":false,
    "sDom"  : "lrtip",
    "oLanguage":{
      "sSearch":"Search all columns:"
    }

  });

  $("thead input").keyup( function () {
    /* Filter on the column (the index) of this element */
    oTable.fnFilter( this.value, $("thead input").index(this) );
  } );

}

function refreshDataTable(){
  $('#couponListTable').dataTable().fnDraw();
}

//Add new coupon button handler.
$('#addNewCoupon').click(function () {
  $('#modal_addCoupon').modal({
    backdrop: 'static',
    keyboard: true,
    show: true
  });
  $('#acpn_code').val('');
});

//Reset button on add new coupon modal region handler.
$('button[type=reset]').click(function() {
  $('#acpn_error').html('').hide();
  $('#acpn_code').val('');
  $('#acpn_backend').val('');
});

//Add new coupon modal region form submit handler.
$('#addCouponForm').submit(function() {
  $('#acpn_code').val($('#acpn_code').val().trim());
  if (!ututils.isNotEmptyString($('#acpn_code').val())) {
    //Show the validation error
    $('#acpn_error').html('Please provide a unique code.').show();
  } else {
    $.post("/settings/coupons/add", $('#addCouponForm').serialize(), function(response) {
      if (!response.error) {
        //get the coupon details (id) on details tab and show it
        $('ul.tabs li,div.tab-content div').removeClass('active');
        $('ul li:nth-child(2),div.tab-content div#couponDetails').addClass('active');    
        $('#modal_addCoupon').modal('hide');
        $.getJSON('/settings/coupons/' + response.id, function (coupon) {
          if (coupon)  {
            couponDetailsObj.setData(coupon);
          }
        });
      } else {
        //Show error message
        $('#acpn_error').html(response.error).show();
      }
    });
  }
  
  return false;
});

$(document).ready(function(){
  
  fetchTableData();

  $('#couponListTable td:nth-child(2)').live('click', function () {
    $('ul.tabs li,div.tab-content div').removeClass('active');
    $('ul li:nth-child(2),div.tab-content div#couponDetails').addClass('active');    
    $.getJSON('/settings/coupons/'+parseInt($(this).text()),function(coupon){
      if(coupon){
        couponDetailsObj.setData(coupon); 
      } 
    });
  });
  $("a[href='#couponlist']").click(function(e){refreshDataTable(); });
  
  $('#deleteCoupon').click(function(even){
    var doDelete = confirm("Delete the selected Coupons ?");
    if(doDelete){
      var checked = $("input[@type=checkbox]:checked"); //find all selected boxs
      var couponIds = [];
      checked.each(function () {
        var couponCount = $($(this).parent().parent().children()[5]).text();
        var couponId = $(this).val();
        var coupon = {
          'couponId' : couponId = $(this).val(),
          'couponCount' :  $($(this).parent().parent().children()[5]).text()
        };
        couponIds.push(coupon);
      });

      $.post('/settings/coupons/remove', {'coupons' : couponIds}, function(res){
        if(res.retStatus === 'success'){
          $("#couponStatus").html('<div class="alert-message block-message success"> Successfully Deleted the  Coupons. Delete Count : ' + res.count + '</div>');
        }else{
          $("#couponStatus").html('<div class="alert-message block-message alert-error"> Error Deleting Some of the Coupons. Delete Count : ' + res.count + '</div>');
        }
        var t = setTimeout(function() {
          $("#couponStatus").html('');
        }, 5000);
        refreshDataTable();
      });
    }
  });
});
