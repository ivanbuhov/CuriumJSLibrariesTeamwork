/// <reference path="../libs/_references.js" />

betMania = betMania || {};

(function () {
    betMania.viewModels.adminViewModel = function () {
        return new kendo.observable({
            testAdminViewModel:1,
            getAllUsers: function (msg) {
                alert(msg + " getting users");
            }
        });
    }

    betMania.viewModels.adminMatchesViewModel = function () {
        return betMania.data.matches.getMatches()
            .then(function (result) {
                var data = new kendo.data.DataSource({
                    data: result,
                    schema: {
                        model: { id: "id" }
                    }
                });

                return new kendo.observable({
                    matchesDataSource: data
                });
            }, function (err) {
                console.log(err);
            })
    }

    //return {
    //    adminViewModel: adminViewModel,
    //    adminMatchesViewModel: adminMatchesViewModel
    //}
}());