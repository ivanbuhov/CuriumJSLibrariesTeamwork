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

    function getLoginRegisterView() {
        return getTemplate("login-register-form");
    }

    function getLayout() {
        return getTemplate("layout")
        .then(function (layoutHtml) {
            return new kendo.Layout(layoutHtml);
        });
    }

    function getMatchesTableView() {
        return getTemplate("matches-table");
    }

    return {
        getLoginRegisterView: getLoginRegisterView,
        getMatchesTableView: getMatchesTableView,
        getLayout: getLayout
    };
}());