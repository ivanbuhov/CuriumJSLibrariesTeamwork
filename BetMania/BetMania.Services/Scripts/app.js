var app = app || {};


app.config = (function () {
    var layout = new kendo.Layout('main-layout');

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
        layout.showIn('#content', '');
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
}());