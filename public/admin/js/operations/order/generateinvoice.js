var GenerateInvoiceModel = function(items) {  
  var self=this;
    this.hiddenitems= ko.observableArray([]);
    this.items      = ko.observableArray(items);
    this.itemToAdd  = ko.observable("");
    this.itemLength = ko.observable(0);
    this.errorlog   = ko.observableArray([]);
    this.errorLength   = ko.observable(0);
    this.addItem    = function() {
    if (this.itemToAdd() != "" && ututils.validateOrderId(this.itemToAdd())) {
       if(this.itemLength()==0){
         self.hiddenitems([]);
       }
        this.items.push(this.itemToAdd()); 
        this.hiddenitems.push(this.itemToAdd()); 
        this.itemLength(this.itemLength() + 1);
        this.itemToAdd("");   
        self.errorlog([]);
        
    }
    }.bind(this);  
    this.removeItem = function(item){
      this.items.remove(item);
      this.hiddenitems.remove(item);
      this.itemLength(this.itemLength() - 1);
    }.bind(this);
    this.resetDomElements = function(){
      self.errorlog([]);
      self.items([]);
      self.itemLength(0);
      self.errorLength(0);
    }.bind(this); 
    this.generateInvoices = function() { 
    var form = $("form#generate_invoice");
    $("#action").val("process");
    form.attr("action", "/operations/orders/invoice");
    $.post('/operations/orders/checkforinvoice',form.serialize(),function(res) {  
      var orders = res.ordrids;     
      var successcount = 0;
      self.errorlog([]);
      for(var index in orders){
        if(orders[index]=='OK'){
          successcount++;
        }
        else{
          self.errorLength(self.errorLength + 1);
          self.errorlog.push({ 'id':index,'message':orders[index]}); 
          $('.hiddenitems input[value="'+index+'"]').remove();
        }
      }
      
      self.items([]);
      self.itemLength(0);
     if(successcount>0){form.submit(); }
     
    });
    }.bind(this); 
    
}; 
ko.applyBindings(new GenerateInvoiceModel([]),document.getElementById('generate_invoice'));
