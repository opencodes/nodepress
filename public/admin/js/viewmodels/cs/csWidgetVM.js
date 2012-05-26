/**
 * Define KeysViewModel class - code representation of data and operation on crmwidget view
 */
var KeysViewModel = function() {
  var that = this;

  // UserKeys object having id, user name and widget Key as properties
  function UserKeys(data) {
    this.id = ko.observable(data.id);
    this.name = ko.observable(data.name);
    this.key = ko.observable(data.key);
  }

  
  this.newName = ko.observable().extend({ // custom message
    required : {
      message : 'Please supply User Name.'
    },
    pattern : {
      message : 'Invalid User Name',
      params : '^[A-Za-z0-9_.@-]{1,120}$'
    }

  }); // bind to value property of name input field when selectedKey is null
 
 this.newKey = ko.observable().extend({  // custom message
   required: { message: 'Please supply Widget Key.' }
 }); //bind to value property of key input field when selectedKey is null

 this.errors = ko.validation.group(this);
 
  //Declare bindings referenced from the view

  this.shouldShowForm = ko.observable(false);//bind to visible property of form
  this.actionType = ko.observable(); //bind to value attribute of submit button 
  this.isEditName = ko.observable(false); //bind to enable property of name input field
  this.isEditKey = ko.observable(false); //bind to enable property of key input field
  this.isSelectUsers = ko.observable(true); //bind to enable property of name drop-down list
  this.keys = ko.observableArray([]); //populate option values in drop-down list, bind to options property

  this.selectedKey = ko.observable(); // bind to value property of name drop-down list
  

  this.styleType = ko.observable(); //bind to class attribute of displayed message
  this.msgText = ko.observable(); // bind to html property of the message 

  
  
  //bind to click property of add icon
  this.addKey = function() {
    this.selectedKey(null).shouldShowForm(true).actionType("Add").styleType("")
        .msgText("");
    this.isEditName(true).isEditKey(true).isSelectUsers(false);
  };

  //bind to click property of edit button 
  this.editKey = function() {
    this.shouldShowForm(true).actionType("Update").styleType("").msgText("");
    this.isEditName(false).isEditKey(true).isSelectUsers(true);
  };

  //bind to click property of reset button 
  this.resetKey = function() {
    this.selectedKey(null).shouldShowForm(false).isSelectUsers(true).styleType("").msgText("").newName("").newKey("");
    $('span.validationMessage').css({
      'display': 'none'
    });
  };

  //bind to click property of delete icon 
  this.removeKey = function() {
    this.shouldShowForm(true).actionType("Delete").styleType("").msgText("");
    this.isEditName(false).isEditKey(false).isSelectUsers(true);

  };
  //bind to click property of select box 
  this.isSelectClick = function() {
    this.styleType("").msgText("");
  };

  //bind to submit property of the form
  this.onSubmitForm = function() {
    var ctAction = this.actionType();
    switch (ctAction) {
    case 'Add':
      if ( this.errors().length == 0) {
        var vals = {
          name : this.newName(),
          key : this.newKey()
        };
        $.post('/cs/crmwidget/add/', vals, function(res) {
          var allKeysPostAdd = $.map(res.result, function(item) {
              return new UserKeys(item)
            });
            that.keys(allKeysPostAdd);
            that.styleType("label notice marginTop").msgText(
                "New crmWidget added  successfully.").shouldShowForm(false)
                .isSelectUsers(true);
            
           that.newName("").newKey("");
           $('span.validationMessage').css({'display':'none'});
          
        },"json").error(function(res) {//error handling
            that.styleType("label error marginTop").msgText("Failed to add crmWidget");
          });
        } else {
          this.errors.showAllMessages();
          $('span.validationMessage').css({'display':'inline'});
  
      } //end of  validation

      break;
    case 'Update':
      $.post('/cs/crmwidget/update/', ko.toJS(this.selectedKey()), function(res) {
        that.styleType("label notice marginTop").msgText(
          " crmWidget updated  successfully.").shouldShowForm(false).selectedKey(null)
          
      },"json").error(function(res) {//error handling
        that.styleType("label error marginTop").msgText("Failed to update crmWidget");
      });

      break;
    case 'Delete':
      $.post('/cs/crmwidget/delete/', {id : ko.toJS(this.selectedKey()).id}, function(res) {
        var allKeysPostAdd = $.map(res.result, function(item) {
            return new UserKeys(item)
          });
          that.keys(allKeysPostAdd);
          that.styleType("label notice marginTop").msgText(
              " crmWidget deleted  successfully.").shouldShowForm(false);
       
      },"json").error(function(res) {//error handling
        that.styleType("label error marginTop").msgText("Failed to delete crmWidget");
      });

      break;
    default:
      console.log("Action Type Not Selected");
    }
  };

  //Load initial state from server, convert it to UserKeys instances, then populate this.keys attached to 
  //options property of select box

  $.getJSON('/cs/crmwidget', function(res) {
    var mappedUserKeys = $.map(res.result, function(item) {
        return new UserKeys(item)
      });
      //pass array of mappedUserKeys object to set options binding
      that.keys(mappedUserKeys);
    
 
  }).error(function(res) {//error handling
    that.styleType("label error marginTop").msgText("Failed to load widget user names");
  });

};

/**
 * Assosciate KeysViewModel object to be used for bindings used in the view
 */

ko.applyBindings(new KeysViewModel(), document.getElementById("crmWidget"));
