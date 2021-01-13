define([
    "modules/jquery-mozu",
    'modules/api',
    "underscore",
    "hyprlive",
    "modules/backbone-mozu",
    "hyprlivecontext",     
    "modules/models-customer",
    'modules/mozu-grid/mozugrid-view',
    'modules/mozu-grid/mozugrid-pagedCollection',   
    "modules/views-paging",
    'modules/editable-view',
    "modules/models-quotes",
    "modules/models-b2bcontacts"], 
    function ($, api, _, Hypr, Backbone, HyprLiveContext, CustomerModels, MozuGrid, MozuGridCollection,
    PagingViews, EditableView, QuoteModels, B2bModels) {
        var timeComponent = "T00:00:00z";
        var filterstring = "";
        var timeout = null;
       
    var B2bContactsMozuGrid = MozuGrid.extend({
        render: function () {
            var self = this;
            MozuGrid.prototype.render.apply(self, arguments);
        }
    });

    var B2bContactsView = Backbone.MozuView.extend({
        templateName: "modules/b2b-account/account-search/accounts-search",
        initialize: function () {       
          Backbone.MozuView.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var self = this;
            Backbone.MozuView.prototype.render.apply(this, arguments);
            var collection = new B2bContactsGridCollectionModel({ autoload: true });  
            this.initializeGrid(collection);     
            this.$modal = this.$('.modal');
        },      
        initializeGrid: function (collection) {
            var self = this;
            self._b2bContactGridView = new B2bContactsMozuGrid({
                el: $('.mz-b2b-contacts-grid'),
                model: collection
            });    
            $('[data-mz-action="addfilter"]').on('keyup input', function(e) {
                e.preventDefault();               
                clearTimeout(timeout);             
                timeout = setTimeout(function () {
                    self.filterGrid(collection, self);
                }, 400);                                 
               
            });    
            $('[data-mz-action="addAddressfilter"]').on('keyup input', function(e) {
                e.preventDefault();                                                
                clearTimeout(timeout);             
                timeout = setTimeout(function () {
                    self.filterGrid(collection, self);
                }, 400); 
            }); 
            $('[data-mz-action="addCityfilter"]').on('keyup input', function(e) {
                e.preventDefault();                                                
                clearTimeout(timeout);             
                timeout = setTimeout(function () {
                    self.filterGrid(collection, self);
                }, 400); 
            });  
            $('[data-mz-action="addStatefilter"]').on('keyup input', function(e) {
                e.preventDefault();                                                
                clearTimeout(timeout);             
                timeout = setTimeout(function () {
                    self.filterGrid(collection, self);
                }, 400); 
            });  
            $('[data-mz-action="addEmailfilter"]').on('keyup input', function(e) {
                e.preventDefault();                                                
                clearTimeout(timeout);             
                timeout = setTimeout(function () {
                    self.filterGrid(collection, self);
                }, 400); 
            });  
            $('[data-mz-action="addCountryfilter"]').on('keyup input', function(e) {
                e.preventDefault();                                                
                clearTimeout(timeout);             
                timeout = setTimeout(function () {
                    self.filterGrid(collection, self);
                }, 400); 
            }); $('[data-mz-action="addZipCodefilter"]').on('keyup input', function(e) {
                e.preventDefault();                                                
                clearTimeout(timeout);             
                timeout = setTimeout(function () {
                    self.filterGrid(collection, self);
                }, 400); 
            });        
                
        },       
        filterGrid:function(collection, self)
        {
            var accountstring ="accountname cont";
            var addressstring = "address.address1 cont";
            var citystring = "address.cityortown sw";
            var statestring = "address.stateorprovince sw";
            var emailstring = "email cont";            
            var countrystring = "address.countrycode sw";            
            var zipcodestring = "address.postalorzipCode sw";
            filterstring = "";
            
                if (($("#searchName").val()!==""))
                {
                    self.createFilterString(accountstring, $("#searchName").val());                    
                }
                if($("#searchAddress").val()!=="")
                {                   
                    self.createFilterString(addressstring, $("#searchAddress").val());                    
                }
                if($("#searchCity").val()!=="")
                {
                    self.createFilterString(citystring, $("#searchCity").val());                    
                }
                if($("#searchState").val()!=="")
                {
                    self.createFilterString(statestring, $("#searchState").val());                         
                }
                if($("#searchEmail").val()!=="")
                {
                    self.createFilterString(emailstring, $("#searchEmail").val());  
                }
                if($("#searchCountry").val()!=="")
                {
                    self.createFilterString(countrystring, $("#searchCountry").val());                     
                }
                if($("#searchZipCode").val()!=="")
                {
                    self.createFilterString(zipcodestring, $("#searchZipCode").val());  
                }
                collection.filterBy(filterstring);

        },
        createFilterString:function(searchstring, searchvalue)
        {
            if (filterstring !== "") 
            {
                filterstring = filterstring + " and ";
            }
            filterstring =filterstring + searchstring + " " + searchvalue; 

        },
        handleDialogCancel:function()
        {            
            this.model.trigger('dialogClose');           
            $(Backbone.MozuView.prototype).hide();
        },        
        renderView: function(template) {
            this.$el.html(this.template);
            this.$el.modal({show:true}); // dont show modal on instantiation
          },
        registerRowActions: function () {
            var self = this;
            var rowActions = this.model.get('rowActions');
            _.each(rowActions, function (action) {
                self[action.action] = function (e) {
                    var rowNumber = $(e.target).parents('.mz-grid-row').data('mzRowIndex');
                    var row = self.model.get('items').at(rowNumber - 1);
                    self.model[action.action](e, row);
                };
            });
        }  
       
    });  

    
    var B2bContactsGridCollectionModel = MozuGridCollection.extend({
        mozuType: 'b2bcontacts',     
        defaultSort: 'email asc',  
        columns: [
            {
                index: 'accountName',
                displayName: 'Account Name',
                sortable: false
            },
            {
                index: 'email',
                displayName: 'Email',
                sortable: false               
            },
            {
                index: 'address',
                displayName: 'Address',
                sortable: false,
                displayTemplate: function(address){
                    var streetaddress = address.address1;
                    return streetaddress;
                }           
            },
            {
                index: 'address',
                displayName: 'City',
                sortable: false,
                displayTemplate: function(address){
                    var cityOrTown = address.cityOrTown;
                    return cityOrTown;
                }           
            },
            {
                index: 'address',
                displayName: 'State',
                sortable: false,
                displayTemplate: function(address){
                    var stateOrProvince = address.stateOrProvince;
                    return stateOrProvince;
                }           
            },
            {
                index: 'address',
                displayName: 'Country',
                sortable: false,
                displayTemplate: function(address){
                    var countryCode = address.countryCode;
                    return countryCode;
                }           
            },
            {
                index: 'address',
                displayName: 'ZipCode',
                sortable: false,
                displayTemplate: function(address){
                    var postalOrZipCode = address.postalOrZipCode;
                    return postalOrZipCode;
                }           
            }
           
        ],relations: {
            items: Backbone.Collection.extend({
                model: B2bModels.B2bContact
            })
        }      
    });

    return {
        'B2bContactsView': B2bContactsView     
    };
});
