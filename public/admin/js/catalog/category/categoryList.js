$(function () {
  var selectedNode = null;
  var dataReorder;
  $("#createNode").click(function () {
    $("#categoriesAll").jstree("create");
  });

  $("#createRootNode").click(function () {
    $('#categoriesAll').jstree("deselect_all");
    $("#categoriesAll").jstree("create",-1);
  });

  $("#deleteNode").click(function (data) {
    $('#confirmDeletePopup').modal({
      keyboard: true,show:true, backdrop:'static'
    }).show();
  });
  $("#categoriesAll").jstree({
    "json_data" : {
      "ajax" : {
        "url" : '/category/listall',
        "data" : function (n) {
        }
      }
    },"sort" : function (a, b) {
      return parseInt(jQuery(a).attr("position"),10) > parseInt(jQuery(b).attr("position"),10) ? 1 : -1;
    },
    "plugins" : [ "themes", "json_data","ui","dnd","crrm","sort"]
  }).bind("select_node.jstree", function (e, data) {
    var cat_id = data.rslt.obj.data("id");
    if(cat_id) {
      $.get('/category/'+cat_id,function(html){
        if(html) {
          $('#categoryDetailsDiv').html(html);
          var catId = $('#catId').val();
          var catName = $('#catName').val();
          $('#assocCatId').val(catId);
          $('#catProdHdName').text('Category Name - ' + catName);
          $('#catProdHdId').text('Category id - ' + catId);
          $('#unAssocCatId').val(catId);
          $('#catUnProdHdName').text('Category Name - ' + catName);
          $('#catUnProdHdId').text('Category id - ' + catId);
          fetchCatUnProds();
          fetchCatProds();
        } else {
          if(res.error)
            $('#categoryDetailsDiv').html(err);
          else
            $('#categoryDetailsDiv').html('Could not find category.');
        }
      });
    }
  }).bind("move_node.jstree", function (event, data){
    $('#moveCatStat').text('Working....');
    var treeInstance = data.inst;
    var node = data.rslt.o;
    var parentNode = treeInstance._get_parent(node),parentNodeId;
    if(parentNode != -1) parentNodeId = parentNode.data("id");
    else parentNodeId = -1;
    var oldParentNode = data.rslt.op,oldParentNodeId;
    if (!oldParentNode.data("id")) oldParentNodeId = -1;
    else oldParentNodeId = oldParentNode.data("id");
    var nodeId = data.rslt.o.data("id");
    var nodeName = data.rslt.o.text();
    if(parentNode != -1) parentNodeId = parentNode.data("id");
    else parentNodeId = -1;
    dataReorder = {
        'oldParentNode' : oldParentNodeId,
        'node' : nodeId,
        'newParentNode' : parentNodeId,
        'nodeName' : nodeName,
        'relNode' : data.rslt.r.attr("id"),
        'relPosition' : data.rslt.p
    };
    var oName = data.rslt.o.children("a").text();
    var rName = data.rslt.r.children("a").text();
    var newpName = (parentNodeId == -1) ? 'root' : parentNode.children("a").text();
    var oldpName = (oldParentNodeId == -1) ? 'root' : oldParentNode.children("a").text();
    if (data.rslt.p == 'last')
      $('#moveConMsg').html('Moving ' + oName + '<br>Old Parent: ' + oldpName + '<br>New Parent: ' + rName );
    else
      $('#moveConMsg').html('Moving ' + oName + '<br>Old Parent: ' + oldpName + '<br>New Parent: ' + newpName + ' ( ' + data.rslt.p + ' ' + rName + ' )');
    $('#confirmMovePopup').modal({
      keyboard: true,show:true, backdrop:'static'
    }).show();
  }).bind("rename_node.jstree",function(event, data){
    var parentId = - 1;
    if($("#categoriesAll").jstree('get_selected').data("id"))
      parentId = $("#categoriesAll").jstree('get_selected').data("id");
    var childName = data.rslt.name;
    var catUrl = generateUrlKey(childName);
    var dataNewNode = {
        'catId' : -1,
        'catName' : childName,
        'catParentId' : parentId,
        'catViz' : 1,
        'catUrl' : catUrl,
        'catStat' : 0
    };
    $.post('/category/save',dataNewNode,function(res){
      $('#categoriesAll').jstree("refresh");
      if(res.error) {
        $('#moveCatStat').text('Failure in creating category.');
      }
      else {
        selectedNode = '#'+res.newId;
        $('#moveCatStat').text('Category created successfully.');
      }
    });
  }).bind("reselect.jstree", function () {
    if(selectedNode){
      $('#categoriesAll').jstree("deselect_all");
      jQuery("#categoriesAll").jstree("select_node", selectedNode);
      setTimeout(function () {
        showMessage('#saveCatDetStat','success','Saved successfully');
      },250);
      selectedNode = null;
    }
    $('#categoriesAll').jstree("loaded",-1);
  }).bind('loaded.jstree', function (e, data) {
    data.inst.get_container().find('li').each(function (i) {
      if($(this).data('is_disabled') === true)
        $(this).children()[1].setAttribute("style","color:#FF0000");
    });
  });

  $("#catMoveCancel").click(function () {
    $('#confirmMovePopup').modal('hide');
    $('#categoriesAll').jstree("refresh");
    $('#moveCatStat').text('');
  });

  $("#catMoveOk").click(function () {
    $.post('/category/reorder',dataReorder, function(res){
      if(res.error)
        $('#moveCatStat').text('Could not move the category.');
      else
        $('#moveCatStat').text('Successfully moved category.');
      $('#categoriesAll').jstree("refresh");
    });
    $('#confirmMovePopup').modal('hide');
  });


  $("#catModalCancel").click(function () {
    $('#confirmDeletePopup').modal('hide');
  });

  $("#catModalOk").click(function () {
    var cat_id = $("#categoriesAll").jstree('get_selected').data("id");
    if(cat_id) {
      $.post('/category/remove/'+cat_id,function(res){
        if(res.error)
          $('#moveCatStat').text('Failure.');
        else {
          $('#moveCatStat').text('Successfully deleted');
          $("#categoriesAll").jstree("remove");
        }
      });
    } else {
      $('#moveCatStat').text('Select one item to delete.');
    }
    $('#confirmDeletePopup').modal('hide');
  });
});