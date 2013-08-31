/// <reference path="libs/_references.js" />
betMania = betMania || {};

(function () {
    betMania.router.route("/admin", function () {
        betMania.views.admin.getMain()
            .then(function (resultHtml) {
                return betMania.viewModels.getAdminViewModel()
            }, function (err) {

            })
            .then()
    });

    betMania.router.route("/admin/addMatch", function () {

    });

    betMania.router.route("/admin/getAllMatches", function () {

    });

    betMania.router.route("/admin/getAllUsers", function () {

    })

    betMania.router.route("/admin/modifyUser/:id", function (id) {

    });

    betMania.router.route("/admin/deleteUser/:id", function (id) {

    });
}())