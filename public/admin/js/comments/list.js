var asInitVals = new Array();
$(document).ready(function() {
  var oTable = $('#datatable-comments').dataTable( {
    "bProcessing": true,
    "sAjaxSource": "/comments/all",
    "bJQueryUI": true,
    "aoColumns": [
      { "mDataProp": function (id) {
        return '<input type=\"checkbox\" value="'+id.id +'">';} },
      { "mDataProp": "id" },
      { "mDataProp": "comment" },
      { "mDataProp": "post_id" },
      { "mDataProp": "posted_by" },
      { "mDataProp": "comment_date" },
      { "mDataProp": function (id) {
        return '<a href=\"/comments/delete/'+id.id +'\" ><i class="icon-remove"></i></a>';} }
      
    ],
    "bAutoWidth": false
    
  } );   	 	 
  $(".searchfilter input").keyup( function () {
    /* Filter on the column (the index) of this element */
    oTable.fnFilter( this.value, $(".searchfilter input").index(this) );
  } );  
  /*
   * Support functions to provide a little bit of 'user friendlyness' to the textboxes in 
   * the footer
   */
  $(".searchfilter input").each( function (i) {
    asInitVals[i] = this.value;
  } );
  
  $(".searchfilter input").focus( function () {
    if ( this.className == "search_init" )
    {
      this.className = "";
      this.value = "";
    }
  } );
  
  $(".searchfilter input").blur( function (i) {
    if ( this.value == "" )
    {
      this.className = "search_init";
      this.value = asInitVals[$(".searchfilter input").index(this)];
    }
  } );
} );