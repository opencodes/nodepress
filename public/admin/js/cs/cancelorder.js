/**
 * Render the Cancel-Order Mail form.
 * @param order id to be canceled
 * @param email of the customer
 */
function renderCancelForm(gobutton, orderId, tabInfo, emailId) {
  var orderInfoUrl = '/cs/fetch/' + orderId;
  $.get(orderInfoUrl, function (res) {
    gobutton.attr('disabled', false);

    if (res.status == 'success') {
      var orderInfo = res.result;
      var mailBody = res.mailBody;
      var mailSubject = res.mailSubject;

      var mail = {
        'email': orderInfo.email,
        'orderId': orderInfo.id,
        'body': mailBody,
        'subject': mailSubject
      };

      var html = new EJS({
        url: '/ejs/cs/cancel-mail-container.ejs'
      }).render({
        'orderInfo': orderInfo,
        'tabInfo': tabInfo,
        'mail': mail
      });
      $('#cancelMail-' + tabInfo).show();
      $('#cancelMail-' + tabInfo).html('');
      $('#cancelMail-' + tabInfo).html(html);

      $('#cancelOnly-' + tabInfo).focus().select();

      $('#firstName').val('');
      $('#firstName').val(orderInfo.firstname + " <" + orderInfo.email + ">");

      $('#crmCancelOrderMail-' + tabInfo).show();
      $('#crmCancelStatus-' + tabInfo).hide();
      $('#crmOrderCancelForm-' + tabInfo).submit(function (event) {
        event.preventDefault();
        $.post('/cs/cancel/mail', mail, function (response) {
          if ('success' === response.status) {
            $('#orderStatus_' + orderId).text('canceled');
            $('#sel_' + tabInfo + '_' + orderId + ' option[value="cancel"]').remove();
            $('#crmCancelOrderMail-' + tabInfo).hide();
            $('#crmCancelMessage-' + tabInfo).text('Cancellation processed and email was sent');
            $('#crmCancelStatus-' + tabInfo).show();
          }
        });
      });

      $('#cancelOnly-' + tabInfo).click(function (event) {
        var cancelUrl = '/cs/cancel/orderId/' + orderId;
        $.get(cancelUrl, function (res) {
          if ('success' === res.status) {
            $('#orderStatus_' + orderId).text('canceled');
            $('#sel_' + tabInfo + '_' + orderId + ' option[value="cancel"]').remove();
            $('#crmCancelOrderMail-' + tabInfo).hide();
            $('#crmCancelMessage-' + tabInfo).text('Cancellation processed.');
            $('#crmCancelStatus-' + tabInfo).show();
          }
        });
      });

      $('#confirmationOk-' + tabInfo).click(function (event) {
        closeMessageBox(tabInfo);
      });

      $('#skipCancel-' + tabInfo).click(function (event) {
        closeMessageBox(tabInfo);
      });
    }
  });
}

/*
 * Hide the Cancel-Mail message box
 */
function closeMessageBox(tabInfo) {
  $('#cancelMail-' + tabInfo).hide();
}
