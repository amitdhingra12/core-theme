define([
    "modules/jquery-mozu",
    'modules/api',
    "underscore",
    "hyprlive",
    "modules/backbone-mozu",
    "hyprlivecontext",
    "modules/models-customer",
    "modules/models-cart",
    "modules/models-b2b-account",
    "modules/product-picker/product-modal-view",
    "modules/product-picker/product-picker-view",
    "modules/models-product",
    "modules/b2b-account/wishlists",
    'modules/mozu-quotes-grid/mozuquotesgrid-view',
    'modules/mozu-grid/mozugrid-pagedCollection',
    "modules/views-paging",
    'modules/editable-view',
    "modules/models-quotes"], 
    function ($, api, _, Hypr, Backbone, HyprLiveContext,
    CustomerModels, CartModels, B2BAccountModels, ProductModalViews,
    ProductPicker, ProductModels, WishlistModels, MozuGrid, MozuGridCollection,
    PagingViews, EditableView, QuoteModels) {
        
    var childPopupView = Backbone.MozuView.extend({
        templateName: "modules/b2b-account/account-hierarchy/addchild-account-modal",
        initialize: function () {
           Backbone.MozuView.prototype.initialize.apply(this, arguments);          
           
        },
        render: function (parentAccounts) {
            var self = this;        
          
            Backbone.MozuView.prototype.render.apply(this, arguments);
            
            if (!self.model.get("b2bAccounts")) {                   
                self.model.set("b2bAccounts", parentAccounts.attributes.accounts);
                    self.render();
            } 
        },
         renderView: function() {             
            var self = this;           
            this.$el.html(this.template);
            this.$el.modal({show:true}); // dont show modal on instantiation
          },    
          createAccount: function()
          {
            var json = JSON.parse(JSON.stringify(
            {
                "users":  [
                  {
                      "emailAddress": $("#digital-fulfillment-email").val(),
                      "userName": $("#companyName").val(),
                      "firstName": $("#firstName").val(),
                      "lastName": $("#lastName").val(),
                      "localeCode": "en-US",
                      "acceptsMarketing": "false",
                      "isActive": true
                  }
                ],
                "parentAccountId": $( ".mz-l-formfieldgroup-halfsize" ).val(),
                "companyOrOrganization":$( "#companyName" ).val(),
                "accountType": "B2B"
            }));
            
             var apib2bAccount = new B2BAccountModels.b2bAccount(json);
             apib2bAccount.apiModel.create();         
          }       
    });
       return {
        'childPopupView': childPopupView        
    };
});
