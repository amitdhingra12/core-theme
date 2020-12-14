define(["modules/jquery-mozu", 'modules/api', "underscore", "hyprlive", "modules/backbone-mozu", "hyprlivecontext", 'modules/models-customer'], function ($, api, _, Hypr, Backbone, HyprLiveContext, CustomerModels) {

    var AccountHierarchyView = Backbone.MozuView.extend({
        templateName: "modules/b2b-account/account-hierarchy/account-hierarchy",
        render: function () {
            var self = this;
            Backbone.MozuView.prototype.render.apply(this, arguments);
            self.fixMargins();
        },
        initialize: function () {
            Backbone.MozuView.prototype.initialize.apply(this, arguments);
        },
        fixMargins: function () {
            $(document).ready(function () {
                //close menu if we click on outside of menu
                $(document).on("click", function (event) {
                    if (!$(event.target).closest(".dropdown-content").length && !$(event.target).closest(".three-dots").length) {
                        $(".account-hierarchy .dropdown-content").removeClass("active");
                    }
                });

                //fix margins
                $(".node:not(:has(.caret))").css("margin-left", "-10px");

                //open first node of the tree always
                $(".account-hierarchy>ul.tree li").first().children(".node").children(".caret").addClass("caret-down");
                $(".account-hierarchy>ul.tree li").first().children(".nested").addClass("active");
            });
        },
        toggleNodes: function (e) {
            $(e.currentTarget).parent().parent().children(".nested").toggleClass("active");
            $(e.currentTarget).toggleClass("caret-down");
        },
        showThreeDotsMenu: function (e) {
            $(e.currentTarget).closest('li').children('.dropdown-content').toggleClass("active");
        },
        addChildAccount: function (e) {
            //todo: need to implement this method in future.
        },
        expandAll: function (e) {
            $(".tree .caret").addClass("caret-down");
            $(".nested").addClass("active");
        },
        collapseAll: function (e) {
            $(".tree .caret").removeClass("caret-down");
            $(".nested").removeClass("active");
        },
        viewAccount: function (e) {
            //todo: need to implement this method in future.
            var accountId = e.currentTarget.dataset.mzValue;
        },
        changeParentAccount: function (e) {
            //todo: need to implement this method in future.
            var accountId = e.currentTarget.dataset.mzValue;
        }
    });

    var AccountHierarchyModel = Backbone.MozuModel.extend({
        mozuType: 'accounthierarchy',
        initialize: function () {
            var self = this;
            self.initApiModel();
            self.apiGet({ id: require.mozuData('user').accountId }).then(function (response) {
                self.set("hierarchy", self.processAccountHierarchy(response.data));
                self.syncApiModel();
            });
            self.set("isUserAdmin", self.isUserAdmin());
        },
        isUserHavingBehavior: function (behaviorId) {
            var behaviors = require.mozuData('user').behaviors;
            if (behaviors) {
                return behaviors.includes(behaviorId);
            }
            return false;
        },
        isUserAdmin: function () {
            //Only admin should have 1000 behavior.
            return this.isUserHavingBehavior(1000);
        },
        isUserPurchaser: function () {
            //purchaser have 1005 behavior
            return !this.isUserAdmin() && this.isUserHavingBehavior(1005);
        },
        processAccountHierarchy: function (data) {
            var self = this;
            if (data.hierarchy) {
                self.setAccountOnHierarchy(data.hierarchy, data.accounts);
            }
            return data.hierarchy;
        },
        setAccountOnHierarchy: function (item, accounts, isCurrentAccountChildrens) {
            var self = this;
            // isCurrentAccountChildrens will be null/false initially but when current account is logged in users account then set it to true. so we can use this to show menu on children.
            if (!isCurrentAccountChildrens) {
                //Check whether this is a current logged in users associated account.
                isCurrentAccountChildrens = require.mozuData('user').accountId === item.id;
                //set "View Account" menu on current account.
                item.isViewAccount = isCurrentAccountChildrens && (self.isUserAdmin() || self.isUserPurchaser());
            }
            else {
                //set menu's on all current accounts children accounts.
                item.isViewAccount = self.isUserAdmin() || self.isUserPurchaser();
                item.isChangeParentAccount = self.isUserAdmin();
            }

            item.account = self.getAccount(item.id, accounts);

            if (item.children) {
                //do recursive call for children's 
                self.processAccountHierarchyChildrens(item.children, accounts,
                    isCurrentAccountChildrens
                );
            }
        },
        processAccountHierarchyChildrens: function (childrens, accounts, isCurrentAccountChildrens) {
            var self = this;
            //for top node in hierarchy (which is not a list)
            if (childrens.id) {
                self.setAccountOnHierarchy(childrens, accounts, isCurrentAccountChildrens);
            }
            else {
                //If children is a list then loop over them.
                for (var i = 0; i < childrens.length; i++) {
                    self.setAccountOnHierarchy(childrens[i], accounts, isCurrentAccountChildrens);
                }
            }
        },
        getAccount: function (accountId, accounts) {
            for (var i = 0; i < accounts.length; i++) {
                if (accounts[i].id == accountId)
                    return accounts[i];
            }
        }
    });

    return {
        'AccountHierarchyView': AccountHierarchyView,
        'AccountHierarchyModel': AccountHierarchyModel
    };
});
