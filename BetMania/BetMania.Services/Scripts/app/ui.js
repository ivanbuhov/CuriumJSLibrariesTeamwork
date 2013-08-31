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

    initControls: function () {

    }
    

};