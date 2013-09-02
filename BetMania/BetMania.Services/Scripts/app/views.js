/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.views = (function () {

    var rootUrl = "Scripts/partials/";
    var templates = {};

    function getTemplate(name) {
        var promise = new RSVP.Promise(function (resolve, reject) {
            if (templates[name]) {
                resolve(templates[name])
            }
            else {
                $.ajax({
                    url: rootUrl + name + ".html",
                    type: "GET",
                    success: function (templateHtml) {
                        templates[name] = templateHtml;
                        resolve(templateHtml);
                    },
                    error: function (err) {
                        reject(err)
                    }
                });
            }
        });
        return promise;
    }

    function getLayout() {
        return getTemplate("layout")
        .then(function (layoutHtml) {
            return new kendo.Layout(layoutHtml);
        });
    }

    function getLoginRegisterView() {
        return getTemplate("login-register-form");
    }

    function getMatchesTableView() {
        return getTemplate("matches-table");
    }

    function getProfileBoxView() {
        return getTemplate("profile-box");
    }

    function getLoggedSingleMatchView() {
        return getTemplate("logged-single-match");
    }

    function getUnloggedSingleMatchView() {
        return getTemplate("unlogged-single-match");
    }

    return {
        getLayout: getLayout,
        getLoginRegisterView: getLoginRegisterView,
        getMatchesTableView: getMatchesTableView,
        getProfileBoxView: getProfileBoxView,
        getLoggedSingleMatchView: getLoggedSingleMatchView,
        getUnloggedSingleMatchView: getUnloggedSingleMatchView
    };
}());