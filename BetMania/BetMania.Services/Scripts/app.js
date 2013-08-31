/// <reference path="../libs/_references.js" />
var betMania = betMania || {};
//betMania.data = betMania.data.getDataPersister("/api");


(function () {

    betMania.views.getLayout()
    .then(function (layout) {

        var router = new kendo.Router({
            init: function () {
                layout.render('#application');
            }
        });

        // all matches default route
        router.route('/', function () {
            betMania.views.getMatchesTableView()
				.then(function (matchesTableHtml) {
				    var loginVM = betMania.viewModels.loginRegisterViewModel;
				    var view = new kendo.View(matchesTableHtml, { model: loginVM });
				    layout.showIn("#page", view);
				});
        });

        // my matches default route
        router.route('/mymatches', function () {
            betMania.views.getMatchesTableView()
				.then(function (matchesTableHtml) {
				    var loginVM = betMania.viewModels.loginRegisterViewModel;
				    var view = new kendo.View(matchesTableHtml, { model: loginVM });
				    layout.showIn("#page", view);
				});
        });

        // login route
        router.route('/login', function () {

            if (betMania.data.isUserLogged()) {
                router.navigate("/");
            }
            else {
                // get ViewModel
                var loginVM = betMania.viewModels.loginRegisterViewModel;
                // get View
                betMania.views.getLoginRegisterView()
				.then(function (loginViewHtml) {
				    var view = new kendo.View(loginViewHtml, { model: loginVM });
				    layout.showIn("#page", view);
				});
            }

        });

        // logout route
        router.route('/logout', function () {
            layout.showIn('#page', 'logout');
        });

        $(function () {
            router.start();
        });

    });
}());