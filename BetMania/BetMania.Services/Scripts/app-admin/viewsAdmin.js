/// <reference path="../libs/_references.js" />
betMania = betMania || {};
betMania.views = betMania.views || {};

betMania.views.admin = (function () {
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

    var getMainAdminView = function () {        
        return getTemplate("adminLayout")
            .then(function (layOutHtml) {
                return new kendo.Layout(layOutHtml);
            });
    };

    var getProfileBoxView = function () {
        return getTemplate("profile-box");
    }

    var getMatchesView = function () {
        return getTemplate("matches")
    }

    var getSingleMatchView = function () {
        return getTemplate("single-match-edit");
    }

    var getUsersAdminView = function () {
        return getTemplate("users-admin");
    }

    var getSingleUserView = function () {
        return getTemplate("single-user-admin");
    }

    return {
        getMain: getMainAdminView,
        getProfileBox: getProfileBoxView,
        getMatchesView: getMatchesView,
        getSingleMatchView: getSingleMatchView,
        getUsersAdminView: getUsersAdminView,
        getSingleUserView: getSingleUserView
    }
}());