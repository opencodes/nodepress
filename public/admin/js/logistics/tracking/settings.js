function fetchRtoMessages(messageType) {
  if (typeof messageType === 'undefined' || '' === messageType) {
    messageType = 'both';
  }
  if ('both' === messageType || 'approve' === messageType) {
    $.getJSON('/logistics/tracking/messages/approve', function (response) {
      if ('success' === response.status) {
        var html = new EJS({
          url: '/ejs/logistics/tracking/rto-admin.ejs'
        }).render('approveMessageInfo', {
          type: 'Approve',
          messages: response.messages
        });
        $('#approveMessageInfo').html(html);
      }
    });
  }
  if ('both' === messageType || 'receive' === messageType) {
    $.getJSON('/logistics/tracking/messages/receive', function (response) {
      if ('success' === response.status) {
        var html = new EJS({
          url: '/ejs/logistics/tracking/rto-admin.ejs'
        }).render('receiveMessageInfo', {
          type: 'Receive',
          messages: response.messages
        });
        $('#receiveMessageInfo').html(html);
      }
    });
  }
}

function initRtoAdminTab() {
  fetchRtoMessages();

  $('#newRtoMessage').keydown(function (event) {
    if (event.keyCode === 13) {
      if ('' !== $('#newRtoMessage').val()) {
        $('#newRtoMessageType').focus().select();
      }
    }
  });
  $('#newRtoMessageType').keydown(function (event) {
    if (event.keyCode === 13) {
      if ('' !== $('#newRtoMessageType').val()) {
        $('#newRtoMessageBtn').focus().select();
      }
    }
  });
  $("a[href='#adminRto']").click(function (e) {
    if (!$('#newRtoMessage').val()) {
      setTimeout(function () {
        $('#newRtoMessage').focus().select();
      }, 500);
    }
  });

  $("a.rtoMessageItem").live('click', function (e) {
    var self = $(this);
    if (!confirm('Do you want to remove \'' + self.data('type') + '\' tracking message: \'' + self.data('message') + '\'?')) {
      return false;
    }
    $.post("/logistics/tracking/messages/remove", {
      "messageId": self.data('id'),
      "messageType": self.data('type')
    }, function (response) {
      if ('success' === response.status) {
        // successful message remove
        fetchRtoMessages(self.data('type'));
      } else {
        alert((response.message || 'Unable to process request') + 'Please try again later.');
      }
    });
  });

  function resetAddNewRto() {
    $('#rtoNewMessageLabel').removeClass('label important notice warning').text('');
    $('#newRtoMessage').attr('readOnly', false);
    $('#newRtoMessageType').attr('readOnly', false);
    $('#newRtoMessageBtn').attr('disabled', false);
    $('#newRtoMessage').val('');
    $('#newRtoMessageType').val('');
    $('#newRtoMessage').focus().select();
  }
  $('#rtoNewMessageForm').submit(function (event) {
    event.preventDefault();
    var message = $('#newRtoMessage').val(),
        messageType = $('#newRtoMessageType').val(),
        timer;
    if (typeof message === 'undefined' || '' === message) {
      $('#rtoNewMessageLabel').addClass('label important').text('Enter RTO Message');
      $('#newRtoMessage').focus().select();
      return;
    }
    if (typeof messageType === 'undefined' || '' === messageType) {
      $('#rtoNewMessageLabel').addClass('label important').text('Select RTO Message Type');
      $('#newRtoMessageType').focus().select();
      return;
    }
    $('#rtoNewMessageLabel').addClass('label notice').text('Adding RTO message');
    $('#newRtoMessage').attr('readOnly', true);
    $('#newRtoMessageType').attr('readOnly', true);
    $('#newRtoMessageBtn').attr('disabled', true);
    timer = setTimeout(function () {
      $('#rtoNewMessageLabel').removeClass('notice').addClass('warning').text('Error communicating with server');
    }, 60000);
    $.post('/logistics/tracking/messages/add', $(this).serialize(), function (response) {
      var rtoUpdateElem = null,
          msg = response.status || 'Request Failed';
      if ('success' === msg.toString().toLowerCase()) {
        fetchRtoMessages(messageType);
        $('#rtoNewMessageLabel').removeClass('notice').addClass('success').text('New RTO message added');
        if ('approve' === messageType) {
          rtoUpdateElem = '#rtoApprovalCode';
        } else if ('receive' === messageType) {
          rtoUpdateElem = '#rtoRejectMessage';
        }
        if ($(rtoUpdateElem)) {
          var restoreOption = '<option value="' + response.result.insertId + '">&nbsp;' + response.message + '&nbsp;</option>';
          $(rtoUpdateElem).append(restoreOption);
        }
      } else {
        $('#rtoNewMessageLabel').text(msg);
      }
      clearTimeout(timer);
      setTimeout(resetAddNewRto, 1000);
    });
    return false;
  });
}
$(function () {
  initRtoAdminTab();
});