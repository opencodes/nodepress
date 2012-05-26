/* ----------------------- acl_user Tab ----------------- */

function renderUserDetails(div,userName,users,allGroups) {
  var html = '';
  $('#user_status').text('').hide();
  $(div).html('');
  if(users != null) {
    $('#user_info').show();
    $('#user_name').val(userName);
  var html = new EJS({url: '/ejs/user/acl_users_details.ejs'}).render({ 'users': users, 'acl_groups':allGroups});
    $(div).html(html); 
  } else {
    $('#user_status').text('No data found').show();
  }
}

function getUserDetails() {
  $('#add_users').hide();
  $('#user_status').text('').hide();
  var userName = $('#acl-users').val();
  if (userName === 0 || '' === userName || 'undefined' === userName) {
      $('#userMessage').addClass('label error').html('Please select one user name');
      $('#delUsersBtn').attr('disabled', false);
      setTimeout(function () {
          $('#userMessage').removeClass('label error').html('');
      }, 2000);
      return;
  }
  
  var t = setTimeout(function() {
	$('#userMessage').addClass('label error').html('Error communicating with server');
	setTimeout(function () {
	  $('#userMessage').removeClass('label error').html('');
	}, 2000);
  }, 25000);
  $.get('/user/getUserDetails.json/' + userName, function (res) {
	  clearTimeout(t);
      if (res.response==='success') {
        var allGroups = $('#allGroups').val().split(',');
        renderUserDetails('#userDetails',userName,res.details,allGroups);
      } else {
        if(res.error_message){
          $('#userMessage').addClass('label error').html(res.error_message);
          setTimeout(function () {
              $('#userMessage').removeClass('label error').html('');
          }, 2000);
        } else{
          $('#user_status').text('unable to get details').show();
        }
      }
  });
}

function addUsers() {
  $('#user_status').text('').hide();
  $('#user_status').text('').hide();
  $('#user_info').hide();
  $('#acl-users').val("");
  $('#user_ids').val("");
  $('#grp_ids').val("");
  $('#add_users').show();
}

function addNewUsers(){
  $('#user_status').text('').hide();
  var userIdsStr = $('#user_ids').val().trim();
  var userIds = splitString(userIdsStr);
  var grpNames = $('#groupValues').val();
  
  if(grpNames == null || grpNames.length <= 0){
    $('#newUsersMessage').addClass('label error').html('Select atleast one group');
    setTimeout(function () {
        $('#newUsersMessage').removeClass('label error').html('');
    }, 2000);
    return;
  }
  
  var t = setTimeout(function() {
    $('#newUsersMessage').addClass('label error').html('Error communicating with server');
    setTimeout(function () {
        $('#newUsersMessage').removeClass('label error').html('');
    }, 2000);
  }, 25000);
  $.post('/user/assignRolesToUsers.json',{'users':userIds, 'roles':grpNames},function(res){
    clearTimeout(t);
    if (res.response==="success") {
      $('#user_info').hide();
      $('#add_users').hide();
      userIds.forEach(function(user) {
        $('#acl-users').append('<option value=\'' + user + '\'> ' + user + ' </option> ');
      });
      $('#user_status').text('added users to the roles').show();
    } else {
      if(res.error_message){
        $('#newUsersMessage').addClass('label error').html(res.error_message);
        setTimeout(function () {
            $('#newUsersMessage').removeClass('label error').html('');
        }, 2000);
      }else{
        $('#user_status').text('unable to add users').show();
      }
    }
    $('#delUsersBtn').attr('disabled', false);
  });
}

function deleteUser(){
  $('#user_status').text('').hide();
  var userName = $('#acl-users').val();
  if (userName === 0 || '' === userName || 'undefined' === userName) {
      $('#userMessage').addClass('label error').html('Please select one user id');
      setTimeout(function () {
          $('#userMessage').removeClass('label error').html('');
      }, 2000);
      return;
  }
  var t = setTimeout(function() {
    $('#userMessage').addClass('label error').html('Error communicating with server');
    setTimeout(function () {
        $('#userMessage').removeClass('label error').html('');
    }, 2000);
  }, 25000);
  $.post('/user/removeUser.json',{'user':userName},function(res){
    clearTimeout(t);
    if (res.response==="success") {
      $('#user_info').hide();
      $('#add_users').hide();
      $('#acl-users option[value="' + userName + '"]').remove();
      $('#user_status').text('removed ' + userName).show();
    }else{
      if(res.error_message){
        $('#userMessage').addClass('label error').html(res.error_message);
        setTimeout(function () {
            $('#userMessage').removeClass('label error').html('');
        }, 2000);
      }else{
        $('#user_status').text('unable to remove ' + userName).show();
      }
    }
  });
}

function initAclUserTab() {
  $('#user_info').hide();
  $('#add_users').hide();
  $('#user_status').text('').hide();
  
  $('#editUsersBtn').click(function () {
    getUserDetails();
  });
  
  $('#addUsersBtn').click(function () {
    addUsers();
  });
  
  $('#newUsersBtn').click(function () {
    $('#delUsersBtn').attr('disabled', true);
    addNewUsers();
  });
  
  $('#delUsersBtn').click(function () {
    deleteUser();
  });
  
  $('#addRoleForm').submit(function(event) {
    event.preventDefault();
    
    var user = $('#user_name').val();
    function splitResources(resourceStr) {
      return resourceStr.split(/[,\r\n]+/);
    }
    var rolesText = $('#roles').val().trim();
    var roles = splitResources(rolesText);
    
    var t = setTimeout(function() {
      $('#rolesAddMessage').addClass('label error').html('Error communicating with server');
      setTimeout(function () {
          $('#rolesAddMessage').removeClass('label error').html('');
      }, 2000);
    }, 25000);
    $.post('/user/assignRolesToUser.json',{'user':user, 'roles':roles},function(res){
      clearTimeout(t);
      if (res.response==="success") {
        $('#user_info').hide();
        $('#user_status').text('assigned new roles to user').show();
      }else{
        if(res.error_message){
          $('#rolesAddMessage').addClass('label error').html(res.error_message);
          setTimeout(function () {
              $('#rolesAddMessage').removeClass('label error').html('');
          }, 2000);
        }else{
          $('#user_status').text('unable to assign new roles').show();
        }
      }
    });
  });
  
  $('#updateUserRolesBtn').click(function(event){
    var user = $('#user_name').val();
    
    var checked = $("#userDetails :checked"); 
    var roles = [];
    checked.each(function() {
      if($(this).hasClass('userCheckBoxAcl'))
        roles.push($(this).val());
    });
    
    var t = setTimeout(function() {
      $('#updateUserRolesMessage').addClass('label error').html('Error communicating with server');
      setTimeout(function () {
          $('#updateUserRolesMessage').removeClass('label error').html('');
      }, 2000);
    }, 25000);
    $.post('/user/updateUserRoles.json',{'user':user, 'roles':roles},function(res){
      clearTimeout(t);
      if (res.response==="success") {
        $('#user_info').hide();
        $('#user_status').text('updated roles').show();
      }else{
        if(res.error_message){
          $('#updateUserRolesMessage').addClass('label error').html(res.error_message);
          setTimeout(function () {
              $('#updateUserRolesMessage').removeClass('label error').html('');
          }, 2000);
        }else{
          $('#user_status').text('unable to update roles').show();
        }
      }
    });
  });
  
  $('#selectAllUser').click(function(){
    if($(this).attr('checked') == 'checked')
         $(':checkbox').attr('checked','checked');
     else
          $(':checkbox').removeAttr('checked'); 
  });
  
};

$(function() {
  initAclUserTab();
});