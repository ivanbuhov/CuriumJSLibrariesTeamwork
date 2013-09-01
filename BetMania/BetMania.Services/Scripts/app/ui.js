/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.ui = {

    toggleNavigation: function () {
        if (betMania.data.isUserLogged()) {
            $("#login-nav-button").hide();
            $("#logout-nav-button").show();
        }
        else {
            $("#login-nav-button").show();
            $("#logout-nav-button").hide();
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