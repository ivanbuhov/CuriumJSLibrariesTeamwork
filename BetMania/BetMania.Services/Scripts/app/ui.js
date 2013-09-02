/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.ui = {

    init: function () {
        var self = this;
        $("#error-close").on("click", function (ev) {
            self.hideErrorBox();
        });
    },

    showLoading: function () {
        jLoadingImage.show();
    },

    hideLoading: function () {
        jLoadingImage.hide();
    },

    showErrorBox: function (message) {
        $("#error-text").text(message);
        $("#error-container").fadeIn(400);
    },

    hideErrorBox: function () {
        $("#error-container").fadeOut(400);
    },

    toggleNavigation: function () {
        if (betMania.data.isUserLogged()) {
            $("#login-nav-button").hide();
            $("#logout-nav-button").show();
            $("#mymatches-nav-button").show();
        }
        else {
            $("#login-nav-button").show();
            $("#logout-nav-button").hide();
            $("#mymatches-nav-button").hide();
        }
    },

    

    initAllMatchesControls: function () {
        $("#matches-type-select").kendoDropDownList({
            change: function (ev) {
                // change the view model
                betMania.viewModels.matchViewModel.set("status", $("#matches-type-select").val());
            }
        });
        $("#matches-category-select").kendoDropDownList({
            dataTextField: "name",
            dataValueField: "name",
            change: function (ev) {
                // change the view model
                betMania.viewModels.matchViewModel.set("category", $("#matches-category-select").val());
            },
            dataSource: {
                transport: {
                    read: {
                        dataType: "json",
                        url: "/api/categories",
                    }
                }
            },
        });
    }

};