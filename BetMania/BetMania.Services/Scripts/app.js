/// <reference path="../libs/_references.js" />
var betMania = betMania || {};


(function () {
    var layout;
    var betmania = betMania.viewsFactory;
   
    betMania.viewsFactory.getLayoutView()
    .then(function (layoutHtml) {

        layout = new kendo.Layout(layoutHtml);
        var data = betMania.data.getDataPersister("/api");

        var router = new kendo.Router({
            init: function () {
                layout.render('#application');
            }
        });

        //mymatches default route
        router.route('/', function () {
            layout.showIn('#content', '');
        });

        router.route('/home', function () {
            layout.showIn('#content', '');
        });

        //User routes
        router.route('/user/login', function () {

            if (data.users.getNickname()) {
                router.navigate("/");
            }
            else {
                betMania.viewsFactory.getLoginRegisterView()
				    .then(function (loginViewHtml) {
				        var loginVm = betMania.viewModelFactory.getLoginRegisterVM(
						    function () {
						        router.navigate("/");
						    });
				        var view = new kendo.View(loginViewHtml, { model: loginVm });
				        layout.showIn("#page", view);
				    });
            }

        });

        router.route('/user/logout', function () {
            layout.showIn('#content', '');
        });

        //Matches routes
        router.route('/allmatches', function () {
            layout.showIn('#content','');
        });

        $(function () {
            router.start();
        });

    });
}());