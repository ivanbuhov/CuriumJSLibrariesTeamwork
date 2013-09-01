/// <reference path="../libs/_references.js" />
var betMania = betMania || {};
//betMania.data = betMania.data.getDataPersister("/api");


(function () {

    RSVP.all(
        [betMania.views.getLayout(),
        betMania.views.getProfileBoxView()])
    .then(function (results) {

        // Initializes the layout
        var layout = results[0];
        var profileBoxHtml = results[1];
        var profileBoxVM = betMania.viewModels.userProfileViewModel;
        var profileBoxView = new kendo.View(profileBoxHtml, { model: profileBoxVM });

        // If the user is logged in
        if (betMania.data.isUserLogged()) {
            profileBoxVM.set("nickname", betMania.data.getNickname());
            profileBoxVM.set("balance", betMania.data.balance());
            profileBoxVM.set("isLogged", true);
        }

        betMania.router = new kendo.Router({
            init: function () {
                layout.showIn("#profile-box", profileBoxView);
                layout.render('#application');
                betMania.ui.toggleNavigation();
            }
        });


        // Initializes the routes

        // all matches default route
        betMania.router.route('/', function () {
            betMania.views.getMatchesTableView()
				.then(function (matchesTableHtml) {
				    var matchesVM = betMania.viewModels.matchViewModel;
				    matchesVM.set("my", false);
				    matchesVM.updateMatches();
				    var view = new kendo.View(matchesTableHtml, { model: matchesVM });
				    layout.showIn("#page", view);
				    betMania.ui.initAllMatchesControls();
				});
        });

        // my matches default route
        betMania.router.route('/mymatches', function () {
            if (!betMania.data.isUserLogged()) {
                betMania.router.navigate("/login");
            }

            betMania.views.getMatchesTableView()
				.then(function (matchesTableHtml) {
				    var matchesVM = betMania.viewModels.matchViewModel;
				    matchesVM.set("my", true);
				    matchesVM.updateMatches();
				    var view = new kendo.View(matchesTableHtml, { model: matchesVM });
				    layout.showIn("#page", view);
				    betMania.ui.initAllMatchesControls();
				});
        });

        // login route
        betMania.router.route('/login', function () {

            if (betMania.data.isUserLogged()) {
                betMania.router.navigate("/");
            }
            else {
                // get ViewModel
                var loginVM = betMania.viewModels.loginRegisterViewModel;
                betMania.views.getLoginRegisterView()
				.then(function (loginViewHtml) {
				    var view = new kendo.View(loginViewHtml, { model: loginVM });
				    layout.showIn("#page", view);
				});
            }

        });

        // logout route
        betMania.router.route('/logout', function () {
            if (!betMania.data.isUserLogged()) {
                betMania.router.navigate("/");
            }
            else {
                betMania.data.users.logout()
                .then(function () {
                    betMania.viewModels.userProfileViewModel.set("nickname", "Anonymous");
                    betMania.viewModels.userProfileViewModel.set("balance", "none");
                    betMania.viewModels.userProfileViewModel.set("isLogged", false);
                    betMania.ui.toggleNavigation();
                    betMania.router.navigate("/");
                });
            }
        });

        betMania.router.route('/match/:id', function (id) {
            var singleMatchVM = betMania.viewModels.singleMatchViewModel;
            betMania.data.matches.getMatch(id)
            .then(function (match) {
                singleMatchVM.set("match", [match]);
                return betMania.views.getSingleMatchView();
            }, function (errorData) {
                // TODO: fix me
            })
            .then(function (singleMatchHtml) {
                var view = new kendo.View(singleMatchHtml, { model: singleMatchVM });
                layout.showIn("#page", view);
                kendo.init($("#page"));
            });
        });

        $(function () {
            betMania.router.start();
            betMania.ui.init();
        });

    });
}());