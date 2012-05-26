/* ----------------------- Admin Tab ----------------- */
/*
function rendercrmTemplateDetails(div, templates) {
    var html = '';
    $(div).html('');
    if (templates.length > 0) {
        $('#templates_info').show();
        var html = new EJS({
            url: '/ejs/cs/crmtemplatedetails.ejs'
        }).render({
            'templates': templates
        });
        $(div).html(html);
    } else {
        $('#messageStatus').text('No data found');
    }
}*/

function getTemplateDetails() {
  var templateName = $('#email-templates').val();
  if (templateName === 0 || '' === templateName || 'undefined' === templateName) {
    $('#mailMessage').addClass('label error').html('Please select one mail template');
    $('#delTemplateBtn').attr('disabled', false);
    setTimeout(function () {
      $('#mailMessage').removeClass('label error').html('');
    }, 2000);
    return;
  }

  $.get('/cs/template/' + templateName, function (res) {
    if (res.err) {
      $('#templateUpdate').text(res.err);
    } else {
      $('#templateUpdateForm').show();
      $('#templateName').attr('readonly', 'readonly');
      var templateDetail = res.templates[0];
      $('#templateId').val(templateDetail.id);
      $('#templateName').val(templateDetail.name);
      $('#templateLabel').val(templateDetail.label);
      $('#templateSubject').val(templateDetail.subject);
      $('#templateBccList').val(templateDetail.bcc);
      $('#isSysTemplate').attr('checked', templateDetail.sys_template == 1);
      $('#isTemplateEnabled').attr('checked', templateDetail.is_enabled == 1);
      $('#templateBody').val(templateDetail.body);
      tinymce.get('templateBody').setContent($('#templateBody').val());
      $('#templateName').removeAttr('disabled');
      $('#templateUpdate').text("");
    }
  });
}

function addNewTemplate() {
  $('#templateUpdateForm').show();
  $('#email-templates').val("");
  $('#templateId').val("");
  $('#templateName').val("");
  $('#templateLabel').val("");
  $('#templateName').removeAttr('disabled');
  $('#templateName').removeAttr('readonly');
  $('#templateSubject').val("");
  $('#templateBccList').val("");
  $('#isSysTemplate').attr('checked', false);
  $('#isTemplateEnabled').attr('checked', true);
  $('#templateBody').val("");
  tinymce.get('templateBody').setContent('');
  $('#templateUpdate').text("");
}

function validateAdminForm() {
  if (($('#templateName').val() == '')) {
    return "false";
  }
  if (($('#templateLabel').val() == '')) {
    return "false";
  }
  return "true";
}

$('#templateUpdateForm').submit(function (event) {
  event.preventDefault();
  $('#delTemplateBtn').attr('disabled', false);
  tinyMCE.activeEditor.save();
  var validateForm = validateAdminForm();
  $('#mailMessage').addClass('label notice').html('Updating mail template #' + $('#templateName').val());
  if (validateForm == "true") {
    var id = $('#templateId').val();
    if (id !== '') {
      var t = setTimeout(function () {
        $('#templateUpdate').text('Error communicating with server');
      }, 25000);
      $.post('/cs/templates/update/', $(this).serialize(), function (res) {
        clearTimeout(t);
        if (res.status == 'success') {
          $('#mailMessage').addClass('label notice').html("Mail template #" + $('#templateName').val() + " updated successfully.");
          setTimeout(function () {
            $('#mailMessage').removeClass('label notice').html('');
          }, 3000);
        } else {
          $('#templateUpdateForm').show();
          $('#mailMessage').addClass('label error').html(res.status);

        }
      });
    } else {
      var t = setTimeout(function () {
        $('#templateUpdate').text('Error communicating with server');
      }, 25000);
      $.post('/cs/templates/update/', $(this).serialize(), function (res) {
        clearTimeout(t);
        if (res.status == 'success') {
          $('#email-templates').append('<option value=\'' + res.result.insertId + '\'> ' + $('#templateLabel').val() + ' </option> ');
          $('#mailMessage').addClass('label notice').html("New Mail Template added  successfully.");
          setTimeout(function () {
            $('#mailMessage').removeClass('label notice').html('');
          }, 3000);
        } else {
          $('#templateUpdateForm').show();
          $('#mailMessage').addClass('label error').html(res.status);

        }
      });

    }
    $('#templateUpdateForm').hide();
  } else {
    $('#mailMessage').text("Template name/label can not be empty");
  }
});

function initAdminTab() {
  $('#templateUpdateForm').hide();
  $('#editTemplateBtn').click(function () {
    $('#delTemplateBtn').attr('disabled', false);
    tinyMCE.triggerSave(false, true);
    getTemplateDetails();
  });

  $('#addTemplateBtn').click(function () {
    addNewTemplate();
  });

  $('#delTemplateBtn').click(function () {
    var id = $('#email-templates option:selected').val();
    if ((undefined !== id) && (null !== id) && ("" !== id)) {
      $('#templateUpdateForm').hide();
      $.get('/cs/templates/remove/' + id, function (response) {
        if ('success' === response.status) {
          $('#mailMessage').addClass('label notice').html("Mail template disabled successfully.");
          setTimeout(function () {
            $('#mailMessage').removeClass('label notice').html('');
          }, 3000);
        } else {
          $('#mailMessage').addClass('label notice').html(response.message);
          setTimeout(function () {
            $('#mailMessage').removeClass('label notice').html('');
          }, 3000);
        }
      });
    } else {
      $('#mailMessage').addClass('label error').html("No Template Selected for Deletion.");
      setTimeout(function () {
        $('#mailMessage').removeClass('label error').html('');
      }, 3000);
    }
  });
  initTinyMCE();
}

/**
 * Tinymce Create drop down to add template code for specific fields like
 * orderid,name etc.
 */

function initTinyMCE() {
  tinymce.create('tinymce.plugins.codePlugin', {
    createControl: function (n, cm) {
      function addAttribute(m, attr) {
        m.add({
          title: attr,
          onclick: function () {
            tinyMCE.activeEditor.execCommand('mceInsertContent', false, '{{=orderinfo.' + attr + '}}');
          }
        });
      }

      switch (n) {
      case 'codedropdown':
        var c = cm.createMenuButton('codedropdown', {
          title: 'orderTokens',
          image: '/images/addOrderToken.png',
          icons: false
        });
        $.get('/cs/templates/tokens', function (res) {
          c.onRenderMenu.add(function (c, m) {
            for (var i = 0; i < res.attributes.length; i++) {
              var attribute = res.attributes[i];
              addAttribute(m, attribute);
            }
          });
        });
        // Return the new menu button instance
        return c;
      }
      return null;
    }
  });


  tinymce.create('tinymce.plugins.userTokenPlugin', {
    createControl: function (n, cm) {

      /**
       * Get call to fetch the token keys
       *  INFO
       */

      function addAttribute(m, attr) {
        m.add({
          title: attr,
          onclick: function () {
            tinyMCE.activeEditor.execCommand('mceInsertContent', false, '{{=usertokens.' + attr + '}}');
          }
        });
      }

      switch (n) {
      case 'userToken':
        var c = cm.createMenuButton('userToken', {
          title: 'userTokens',
          image: '/images/addUserToken.png',
          icons: false
        });

        $.get('/cs/templates/usertokens', function (res) {
          c.onRenderMenu.add(function (c, m) {
            for (var key in res.attributes) {
              var attribute = key;
              addAttribute(m, attribute);
            }
          });
        });
        // Return the new menu button instance
        return c;
      }
      return null;
    }
  });

  // Register plugin with a short name
  tinymce.PluginManager.add('usertoken', tinymce.plugins.userTokenPlugin);

  // Register plugin with a short name
  tinymce.PluginManager.add('dropcode', tinymce.plugins.codePlugin);

  /*
   *  Initilize tinymce
   */
  tinyMCE.init({
    // General options
    mode: "exact",
    elements: "templateBody",
    editor_selector: /utlarge/,
    theme: "advanced",
    plugins: "usertoken,dropcode,advhr,advimage,advlink,inlinepopups,insertdatetime,preview,print,contextmenu,nonbreaking,xhtmlxtras",

    // Theme options
    theme_advanced_buttons1: "codedropdown,userToken,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
    theme_advanced_buttons2: "bullist,numlist,|,link,image,code,|,insertdate,inserttime,preview,|,forecolor,backcolor|,print",
    theme_advanced_buttons3: "",
    theme_advanced_toolbar_location: "top",
    theme_advanced_toolbar_align: "left",
    theme_advanced_statusbar_location: "bottom",
    theme_advanced_resizing: true,

    // Replace values for the template plugin
    template_replace_values: {
      username: "Some User",
      staffid: "991234"
    }
  });
};

/* ----------------------- Main ------------------------ */

$(function () {
  initAdminTab();
});
