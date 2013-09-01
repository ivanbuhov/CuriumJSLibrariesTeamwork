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

    //betMania.views.admin.getMain().then(function (layout) {
    //    layout = layout
    //})

    //betMania.router.route("/admin", function () {
    //   layout.showIn("#page","<h1>Main Layout page</h1>")
    //});

    betMania.router.route("/admin/addMatch", function () {

    });

    betMania.router.route("/admin/matches", function () {
        betMania.views.admin.getMatchesView()
            .then(function (matchesHTML) {
                betMania.viewModels.adminMatchesViewModel()
                    .then(function (adminVM) {
                        var matchesView = new kendo.View(matchesHTML, {model:adminVM});                       
                        matchesView.render("#wrapper");
                    })
            })
    });

    betMania.router.route("/admin/users", function () {

    })

    betMania.router.route("/admin/modifyUser/:id", function (id) {

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