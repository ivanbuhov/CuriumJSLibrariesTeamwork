/// <reference path="../libs/_references.js" />
betMania = betMania || {};

betMania.views.admin = (function () {
    var getMainAdminView = function () {
        return new RSVP.Promise(function (resolve, reject) {
            $.get("partials/admin.html")
                .done(function (result) {
                    resolve(result);
                })
                .fail(function (err) {
                    reject(err)
                });
        })
    };


    return {
        getMain: getMainAdminView
    }
}());