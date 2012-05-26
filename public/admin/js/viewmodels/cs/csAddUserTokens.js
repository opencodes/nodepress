/**
 * Define TokensViewModel class - code representation of data and operation on userToken view
 */
var TokensViewModel = function () {
    var that = this;
    //UserTokens object having id, token name and token values as properties

    function UserTokens(data) {
      this.id = ko.observable(data.id);
      this.name = ko.observable(data.name);
      this.value = ko.observable(data.value);
      if (data.sys_token == 0) {
        this.showTinyMce = ko.observable(true);
        this.sys_token = ko.observable(false);
      } else {
        this.showTinyMce = ko.observable(false);
        this.sys_token = ko.observable(true);
      }
    }

    this.newName = ko.observable().extend({ // custom message
      required: {
        message: 'Please supply Token Name.'
      },
      pattern: {
        message: 'Invalid Token Name',
        params: '^[A-Za-z0-9_]{1,100}$'
      }

    }); // bind to value property of name input field when selectedValue is null
    this.newValue = ko.observable(); //bind to value property of value input field when selectedVlaue is null
    this.newSysToken = ko.observable(true);
    this.errors = ko.validation.group(this);

    //Declare bindings referenced from the view
    this.shouldShowForm = ko.observable(false); //bind to visible property of form
    this.actionType = ko.observable();
    this.isEditName = ko.observable(false); //bind to enable property of name input field
    this.isEditToken = ko.observable(false);
    this.isEditSysToken = ko.observable(false); //bind to enable property of Token input field
    this.isSelectUsers = ko.observable(true); //bind to enable property of name dropdown
    this.tokens = ko.observableArray([]); //populate option values in dropdown, bind to options property
    this.selectedToken = ko.observable(); // bind to value property of name dropdown
    this.styleType = ko.observable(); //bind to class attribute of displayed message
    this.msgText = ko.observable();
    this.newSysTinyVal = ko.observable(true);
    this.newSysVal = ko.observable(false); // bind to html property of the message 
    //bind to click property of add icon
    this.addToken = function () {
      this.selectedToken(null).shouldShowForm(true).actionType("Add").styleType("").msgText("");
      this.isEditName(true).isEditToken(true).isSelectUsers(false).isEditSysToken(true).newSysToken(true).newSysVal(false).newSysTinyVal(true);
      this.newName("").newValue("");
      $('span.validationMessage').css({
        'display': 'none'
      });
    };

    //bind to click property of edit button 
    this.editToken = function () {
      this.shouldShowForm(true).actionType("Update").styleType("").msgText("");
      this.isEditName(false).isEditToken(true).isSelectUsers(true).isEditSysToken(false);
    };

    //bind to click property of reset button 
    this.resetToken = function () {
      this.selectedToken(null).shouldShowForm(false).isSelectUsers(true).styleType("").msgText("");
      this.newName("").newValue("");
      $('span.validationMessage').css({
        'display': 'none'
      });
    };

    //bind to submit property of the form
    this.onSubmitForm = function () {
      var ctAction = this.actionType();
      switch (ctAction) {
      case 'Add':
        if (this.errors().length == 0) {
          var vals = {
            name: this.newName(),
            value: $('#tokenValue').html(),
            sys_token: this.newSysToken
          };
          $.post('/cs/userTokens/add/', vals, function (res) {
            var alltokensPostAdd = $.map(res.result, function (item) {
              return new UserTokens(item);
            });
            that.tokens(alltokensPostAdd);
            that.styleType("label notice marginTop").msgText("New User Token added  successfully.").shouldShowForm(false).isSelectUsers(true);
            that.newName("").newValue("");
            $('span.validationMessage').css({
              'display': 'none'
            });

          }, "json").error(function (res) { //error handling
            that.styleType("label error marginTop").msgText("Failed to add User Token");
          });
        } else {
          this.errors.showAllMessages();
          $('span.validationMessage').css({
            'display': 'inline'
          });

        } //end of token name validation
        break;
      case 'Update':
        var vals = {
          id: ko.toJS(this.selectedToken()).id,
          name: ko.toJS(this.selectedToken()).name,
          value: $('#tokenValue').html(),
          sys_token: ko.toJS(this.selectedToken()).sys_token
        };
        $.post('/cs/userTokens/update/', vals, function (res) {
          var alltokensPostUpdate = $.map(res.result, function (item) {
            return new UserTokens(item);
          });
          that.tokens(alltokensPostUpdate);
          that.styleType("label notice marginTop").msgText(" User Token updated  successfully.").shouldShowForm(false).selectedToken(null)
          that.newName("").newValue("");
          $('span.validationMessage').css({
            'display': 'none'
          });
        }, "json").error(function (res) { //error handling
          that.styleType("label error marginTop").msgText("Failed to update User Token");
        });

        break;

      default:
        console.log("Action Type Not Selected");
      }
    };

    //Load initial state from server, convert it to UserTokens instances, then populate this.tokens attached to 
    //options property of select box
    $.getJSON('/cs/userTokens', function (res) {
      var mappedUserTokens = $.map(res.attributes, function (item) {
        return new UserTokens(item)
      });
      //pass array of mappedUserTokens object to set options binding
      that.tokens(mappedUserTokens);


    }).error(function (res) { //error handling
      that.styleType("label error marginTop").msgText("Failed to load widget user names");
    });

    };

/**
 * Tinymce knockoutjs binding
 */
ko.bindingHandlers.tinymce = {
  init: function (element, valueAccessor, allBindingsAccessor, context) {
    var options = allBindingsAccessor().tinymceOptions || {};
    var modelValue = valueAccessor();

    //handle edits made in the editor
    options.setup = function (ed) {
      ed.onChange.add(function (ed, l) {
        if (ko.isWriteableObservable(modelValue)) {
          modelValue(l.content);
        }
      });
    };

    function mceConfig(id) {
      var mce_config = {
        theme: 'advanced',
        plugins: "advhr,advimage,advlink,inlinepopups,insertdatetime,preview,print,contextmenu,nonbreaking,xhtmlxtras",
        // Theme options
        theme_advanced_buttons1: "bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2: "bullist,numlist,|,link,image,code,|,insertdate,inserttime,preview,|,forecolor,backcolor|,print",
        theme_advanced_buttons3: "",
        theme_advanced_toolbar_location: "top",
        theme_advanced_toolbar_align: "left",
        theme_advanced_statusbar_location: "bottom",
        theme_advanced_resizing: true,
      };
      return mce_config;

    }
    var mce_config = mceConfig(element.id);
    setTimeout(function () {
      $('#'+element.id).tinymce(mce_config, options);
    }, 0);

  },
  update: function (element, valueAccessor, allBindingsAccessor, context) {
    //handle programmatic updates to the observable
    var value = ko.utils.unwrapObservable(valueAccessor());
    $(element).html(value);
  }
};
/**
 * Assosciate TokensViewModel object to be used for bindings used in the view
 */

ko.applyBindings(new TokensViewModel(), document.getElementById("addUserToken"));