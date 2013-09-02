/// <reference path="libs/_references.js" />
betMania = betMania || {};

(function () {
    var layout;
    betMania.router = new kendo.Router({
        init: function () {
            RSVP.all([betMania.views.admin.getMain(),
               betMania.views.admin.getProfileBox()])
               .then(function (results) {
                   layout = results[0];
                   var profileBoxHtml = results[1];

                   var profileBoxVM = betMania.viewModels.userProfileViewModel;
                   var profileBoxView = new kendo.View(profileBoxHtml, { model: profileBoxVM });

                   // If the user is logged in
                   if (betMania.data.isUserLogged()) {
                       profileBoxVM.set("nickname", betMania.data.getNickname());
                       profileBoxVM.set("balance", betMania.data.balance());
                   }

                   var mainAdminVM = betMania.viewModels.adminViewModel;
                   var mainAdminView = new kendo.View(layout, { model: mainAdminVM });

                   layout.showIn("#profile-box", profileBoxView);
                   layout.render('#layout');

                   
               }, function (err) {
                   alert(JSON.stringify(err))
                   console.log(err);
               });
        }
    });

    betMania.router.route("/admin/addMatch", function () {

    });

    betMania.router.route("/admin/matches/:id", function (id) {
        betMania.views.admin.getSingleMatchView()
            .then(function (singleMatchHTML) {
                var singleMatchVM = betMania.viewModels.singleMatchAdminVM;

                var singleMatchView = new kendo.View(singleMatchHTML, { model: singleMatchVM });

                layout.showIn("#page", singleMatchView);

            });
    });

    betMania.router.route("/admin/matches", function () {
        betMania.views.admin.getMatchesView()
            .then(function (matchesHTML) {
                var adminVM = betMania.viewModels.adminMatchesViewModel()
                    //.then(function (adminVM) {
                var matchesView = new kendo.View(matchesHTML, { model: adminVM });
                adminVM.updateMatches()
                $(function () {
                    layout.showIn("#page", matchesView);
                    adminVM.getKendoGrid("#kendo-grid");
                })
                    //})
            })
    });

    betMania.router.route("/admin/users", function () {
        betMania.views.admin.getUsersAdminView()
            .then(function (usersHTML) {
                var usersVM = betMania.viewModels.usersAdminVM();
                var usersView = new kendo.View(usersHTML, { model: usersVM });

                usersVM.getUsers();
                layout.showIn("#page", usersView);
            })

    })

    betMania.router.route("/admin/users/:id", function (id) {
        betMania.views.admin.getSingleUserView()
           .then(function (singleUserHtml) {
               var singleMatchVM = betMania.viewModels.singleUserAdminVM;

               var singleMatchView = new kendo.View(singleUserHtml, { model: singleMatchVM });

               layout.showIn("#page", singleMatchView);

           });
    });

    betMania.router.route("/admin/deleteUser/:id", function (id) {

    });

    betMania.router.start();
        //}, function (err) {
        //    alert(JSON.stringify(err));
        //    console.log(err);
        //}
    //);
}())