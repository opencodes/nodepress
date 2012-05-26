/* ----------------------- acl_group Tab ----------------- */

function renderGroupDetails(div, groupName, groups) {
  var html = '';
  $('#group_status').text('').hide();
  $(div).html('');
  if (groups != null) {
    $('#group_info').show();
    $('#grp_name').val(groupName);
    var html = new EJS({
      url : '/ejs/user/acl_group_details.ejs'
    }).render({
      'groups' : groups
    });
    $(div).html(html);
  } else {
    $('#group_status').text('No data found').show();
  }
}

function getGroupDetails() {
  $('#add_groups').hide();
  $('#message_status').text('').hide();
  var groupName = $('#acl-groups').val();
  if (groupName === 0 || '' === groupName || 'undefined' === groupName) {
    $('#grpMessage').addClass('label error').html('Please select one group name');
    $('#delGroupsBtn').attr('disabled', false);
    setTimeout(function() {
      $('#grpMessage').removeClass('label error').html('');
    }, 2000);
    return;
  }

  var t = setTimeout(function() {
    $('#grpMessage').addClass('label error').html(
        'Error communicating with server');
    setTimeout(function() {
      $('#grpMessage').removeClass('label error').html('');
    }, 2000);
  }, 25000);
  $.get('/user/getGroupDetails.json/' + groupName, function(res) {
    clearTimeout(t);
    if (res.response === 'success') {
      var groups = JSON.parse(res.details);
      renderGroupDetails('#groupDetails', groupName, groups);
    } else {
      if (res.error_message) {
        $('#grpMessage').addClass('label error').html(res.error_message);
        setTimeout(function() {
          $('#grpMessage').removeClass('label error').html('');
        }, 2000);
      } else {
        $('#message_status').text('unable to get details').show();
      }
    }
  });
}

function addGroups() {
  $('#message_status').text('').hide();
  $('#group_info').hide();
  $('#acl-groups').val("");
  $('#group_names').val("");
  $('#resource_names').text("");
  $('#addNewGroupPerms :checked').each(function() {
    if ($(this).val() === 'GET')
      $(this).attr('checked', true);
    else
      attr('checked', false);
  });
  $('#add_groups').show();
}

function addNewGroups() {
  $('#message_status').text('').hide();
  var groupNamesStr = $('#group_names').val().trim();
  var groups = splitString(groupNamesStr);
  var resourcesStr = $('#resource_names').val();
  var resources = splitString(resourcesStr);

  var perms = [];
  $('#addNewGroupPerms :checked').each(function() {
    perms.push($(this).val());
  });

  var t = setTimeout(function() {
    $('#newGrpsMessage').addClass('label error').html('Error communicating with server');
    setTimeout(function() {
      $('#newGrpsMessage').removeClass('label error').html('');
    }, 2000);
  }, 25000);
  $.post('/user/assignResourceToRole.json', {
    'role' : groups,
    'resources' : resources,
    'perms' : perms
  }, function(res) {
    clearTimeout(t);
    if (res.response === "success") {
      $('#group_info').hide();
      $('#add_groups').hide();
      groups.forEach(function(group) {
        $('#acl-groups').append('<option value=\'' + group + '\'> ' + group + ' </option> ');
      });
      $('#message_status').text('added new roles with required perms').show();
    } else {
      if (res.error_message) {
        $('#newGrpsMessage').addClass('label error').html(res.error_message);
        setTimeout(function() {
          $('#newGrpsMessage').removeClass('label error').html('');
        }, 2000);
      } else {
        $('#message_status').text('unable to add new roles').show();
      }
    }
    $('#delGroupsBtn').attr('disabled', false);
  });
}

function deleteGroups() {
  $('#message_status').text('').hide();
  var groupName = $('#acl-groups').val();
  if (groupName === 0 || '' === groupName || 'undefined' === groupName) {
    $('#grpMessage').addClass('label error').html('Please select one group name');
    setTimeout(function() {
      $('#grpMessage').removeClass('label error').html('');
    }, 2000);
    return;
  }
  var t = setTimeout(function() {
    $('#grpMessage').addClass('label error').html('Error communicating with server');
    setTimeout(function() {
      $('#grpMessage').removeClass('label error').html('');
    }, 2000);
  }, 25000);
  $.post('/user/removeRole.json', {
    'role' : groupName
  }, function(res) {
    clearTimeout(t);
    if (res.response === "success") {
      $('#group_info').hide();
      $('#add_groups').hide();
      $('#acl-groups option[value="' + groupName + '"]').remove();
      $('#message_status').text('removed ' + groupName).show();
    } else {
      if (res.error_message) {
        $('#grpMessage').addClass('label error').html(res.error_message);
        setTimeout(function() {
          $('#grpMessage').removeClass('label error').html('');
        }, 2000);
      } else {
        $('#message_status').text('unable to remove ' + groupName).show();
      }
    }
  });
}

function groupRemove() {
  var role = $('#grp_name').val();

  var checked = $("#groupDetails :checked");
  var resources = [];
  checked.each(function() {
    if ($(this).hasClass('groupCheckBoxAcl'))
      resources.push($(this).val());
  });

  if (resources.length == 0) {
    $('#grpUpdateMessage').addClass('label error').html('Please check required checkboxes before submit');
    setTimeout(function() {
      $('#grpUpdateMessage').removeClass('label error').html('');
    }, 2000);
    return;
  }

  var t = setTimeout(function() {
    $('#grpUpdateMessage').addClass('label error').html('Error communicating with server');
    setTimeout(function() {
      $('#grpUpdateMessage').removeClass('label error').html('');
    }, 2000);
  }, 25000);
  $.post('/user/removeRolesResource.json', {
    'role' : role,
    'resources' : resources
  }, function(res) {
    clearTimeout(t);
    if (res.response === "success") {
      $('#group_info').hide();
      $('#message_status').text('removed resources').show();
    } else {
      if (res.error_message) {
        $('#grpUpdateMessage').addClass('label error').html(res.error_message);
        setTimeout(function() {
          $('#grpUpdateMessage').removeClass('label error').html('');
        }, 2000);
      } else {
        $('#message_status').text('unable to remove resource').show();
      }
    }
  });
}

function initAclGroupTab() {
  $('#group_info').hide();
  $('#add_groups').hide();
  $('#message_status').text('').hide();

  $('#editGroupsBtn').click(function() {
    getGroupDetails();
  });

  $('#addGroupsBtn').click(function() {
    addGroups();
  });

  $('#newgrpsBtn').click(function() {
    $('#delGroupsBtn').attr('disabled', true);
    addNewGroups();
  });

  $('#delGroupsBtn').click(function() {
    deleteGroups();
  });

  $('#addResourceForm').submit(function(event) {
    event.preventDefault();

    var role = $('#grp_name').val();
    var resourcesText = $('#resources').val().trim();
    var resources = splitString(resourcesText);

    var perms = [];
    $('#addResourcePerms :checked').each(function() {
      perms.push($(this).val());
    });

    var t = setTimeout(function() {
      $('#grpAddMessage').addClass('label error').html('Error communicating with server');
      setTimeout(function() {
        $('#grpAddMessage').removeClass('label error').html('');
      }, 2000);
    }, 25000);
    $.post('/user/assignResourceToRole.json', {
      'role' : role,
      'resources' : resources,
      'perms' : perms
    }, function(res) {
      clearTimeout(t);
      if (res.response === "success") {
        $('#group_info').hide();
        $('#add_groups').hide();
        $('#message_status').text('assigned new resources with required perms').show();
        } else {
          if (res.error_message) {
            $('#grpAddMessage').addClass('label error').html(res.error_message);
            setTimeout(function() {
              $('#grpAddMessage').removeClass('label error').html('');
            }, 2000);
          } else {
            $('#message_status').text('unable to assign new resources').show();
          }
        }
      });
  });

  $('#grpRemoveBtn').click(function(event) {
    groupRemove();
  });

  $('#grpUpdateBtn').click(function(event) {
    var role = $('#grp_name').val();

    var checked = $("#groupDetails :checked");
    var resources = [];
    checked.each(function() {
      if ($(this).hasClass('groupCheckBoxAcl'))
        resources.push($(this).val());
    });

    if (resources.length == 0) {
      $('#grpUpdateMessage').addClass('label error').html('Please check required checkboxes before submit');
      setTimeout(function() {
        $('#grpUpdateMessage').removeClass('label error').html('');
      }, 2000);
      return;
    }

    var updates = [];
    resources.forEach(function(resource) {
      var perms = [];
      checked.each(function() {
        if ($(this).hasClass("groupPermCheckBox" + resource))
          perms.push($(this).val());
      });
      var update = {
        'resource' : resource,
        'perms' : perms
      };
      updates.push(update);
    });

    var t = setTimeout(function() {
      $('#grpUpdateMessage').addClass('label error').html('Error communicating with server');
      setTimeout(function() {
        $('#grpUpdateMessage').removeClass('label error').html('');
      }, 2000);
    }, 25000);
    $.post('/user/updateRolePerms.json', {
      'role' : role,
      'updates' : updates
    }, function(res) {
      clearTimeout(t);
      if (res.response === "success") {
        $('#group_info').hide();
        $('#message_status').text('updated perms').show();
      } else {
        if (res.error_message) {
          $('#grpUpdateMessage').addClass('label error').html(res.error_message);
          setTimeout(function() {
            $('#grpUpdateMessage').removeClass('label error').html('');
          }, 2000);
        } else {
          $('#message_status').text('unable to update perms').show();
        }
      }
    });
  });

  $('#selectAllGroup').click(function() {
    if ($(this).attr('checked') == 'checked')
      $(':checkbox').attr('checked', 'checked');
    else
      $(':checkbox').removeAttr('checked');
  });

};

function splitString(str) {
  return str.split(/[,\r\n]+/);
}

$(function() {
  initAclGroupTab();
});