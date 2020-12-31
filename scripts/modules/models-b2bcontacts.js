
define(["modules/api", 'underscore', "modules/backbone-mozu", 'modules/models-address',  "hyprlive", "modules/models-product"], function (api, _, Backbone, AddressModels, Hypr, ProductModels, ReturnModels) {

            var B2bContact = Backbone.MozuModel.extend({
            mozuType: 'b2bcontact',           
            idAttribute:'accountid',
            handlesMessages: true,
            initialize: function () {
                var self = this;
            },
            toJSON: function () {
                var self = this,
                    jsonItems = [];
                this.get('items').each(function (item) {
                    jsonItems.push(item.toJSON());
                });
                this.set('items', jsonItems);
                var j = Backbone.MozuModel.prototype.toJSON.apply(this, arguments);
                return j;
            }
        }),
        B2bContactCollection = Backbone.MozuPagedCollection.extend({
            mozuType: 'b2bcontacts',
            defaults: {
                pageSize: 5
            },
            relations: {
                items: Backbone.Collection.extend({
                    model: B2bContact
                })
            }
        });

        
        return {
                        B2bContactCollection: B2bContactCollection,
                        B2bContact:B2bContact   
                    };   

});




// define([
// "modules/api", 
// 'underscore',
// "modules/backbone-mozu",
// 'modules/models-address', 
// "hyprlive", 
// "modules/models-product"], function (api, _, Backbone,AddressModels, Hypr, ProductModels, ReturnModels) {


    
   
//     var B2bContact = Backbone.MozuModel.extend({
//         mozuType: 'b2bcontact',
//         idAttribute: 'accountid',
//         handlesMessages: true,       
//         initialize: function () {
//             var self = this;
//         }, 
//         toJSON: function(){
//             var j = Backbone.MozuModel.prototype.toJSON.apply(this, arguments);
//             return j;
//         }}),

//      B2bContactCollection = Backbone.MozuModel.extend({
//         mozuType: 'b2bcontacts',
//         defaults: {
//             pageSize: 5
//         },
//         relations: {
//             items: Backbone.Collection.extend({
//                 model: B2bContact
//             })
//         }
//     });

//     return {
//             B2bContactCollection: B2bContactCollection,
//             B2bContact:B2bContact   
//         };   


// });