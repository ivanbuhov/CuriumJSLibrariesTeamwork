/// <reference path="q.js" />
/// <reference path="jquery-2.0.2.intellisense.js" />

var game = game || {};

game.ui = (function () {

    var jProfileOptions;
    var jChangeProfile;
    var jWrapper;
    var jPages;
    var jNavButtons;
    var jMatchesTables;
    var jBetTypeOptions;
    var jErrorContainer;
    var jErrorText;
    var jLoadingImage;
    var jMatchesTypeOptions;
    var jMatchesOwnerOptions;

    var init = function () {
        initVarialbes();
        addEventListeners();
    }

    var initVarialbes = function () {
        jProfileOptions = $("#profile-options");
        jChangeProfile = $("#change-profile");
        jWrapper = $("#wrapper");
        jPages = jWrapper.children(".page");
        jNavButtons = $("#menu a");
        jMatchesTables = $(".matches");
        jBetTypeOptions = $(".bet-type");
        jErrorContainer = $("#error-container");
        jErrorText = jErrorContainer.find("#error-text");
        jLoadingImage = $("#loading");
        jMatchesTypeOption = $("#matches-type-option");
        jMatchesOwnerOptions  = $("#matches-owner-option");
    }

    var addEventListeners = function () {
        // New
        $("#error-close").on("click", function () { hideErrorBox(); });
        jChangeProfile.on("click", function () { jProfileOptions.slideToggle(); });
        jNavButtons.on("click", function (ev) { var pageNumber = $(ev.target.parentNode).index() + 1; game.ui.showPage(pageNumber); });
        jMatchesTables.on("change", ".bet-amount input", function (ev) { game.ui.updateProfit(ev.target.parentNode.parentNode); });
        for (var i = 0; i < jBetTypeOptions.length; i++) {
            var widget = widgets.optionsWidget(jBetTypeOptions[i], ["Home wins x 1.20", "Draw x 1.50", "Away wins x 2.30", "None"], 3, false);
            widget.getContentElement().on("valueChanged", function (ev) {
                game.ui.updateProfit(ev.target.parentNode.parentNode);
            });
        }
        widgets.optionsWidget(jMatchesTypeOption, ["All", "Finished", "In porgress", "Upcoming"], 0, false);
        widgets.optionsWidget(jMatchesOwnerOptions, ["All", "My"], 0, false);
    }

    var showLoading = function () {
        jLoadingImage.show();
    }

    var hideLoading = function () {
        jLoadingImage.hide();
    }

    var showPage = function(pageNumber)
    {
        var n = parseInt(pageNumber);
        jPages.hide().filter(":nth-child(" + n + ")").fadeIn(400);
    }

    var showErrorBox = function (message) {
        jErrorText.text(message);
        jErrorContainer.fadeIn(400);
    }

    var hideErrorBox = function() {
        jErrorContainer.fadeOut(400);
    }

    var updateProfit = function (tdElement) {

        var jTdElement = $(tdElement);

        var amount = parseFloat(jTdElement.find(".bet-amount input").val());
        var coeff = parseFloat(jTdElement.find(".options-widget .options-content .selected").text());
        var profit = Number((amount * coeff).toFixed(2));
        if (profit != profit) {
            profit = 0;
        }
        jTdElement.find(".bet-profit span").text(profit);
    }

    return {
        init: init,
        showLoading: showLoading,
        hideLoading: hideLoading,
        showPage: showPage,
        showErrorBox: showErrorBox,
        hideErrorBox: hideErrorBox,
        updateProfit: updateProfit,
        showMyBetsTable: showMyBetsTable
    }

})();