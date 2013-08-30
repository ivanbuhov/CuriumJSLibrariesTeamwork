var game = game || {};

game.controller = (function () {

    var messagesInterval;

    var init = function () {
        addEventListeners();
        /*
        if (game.data.user.isLoggedIn()) {
            game.ui.updateNavigation("loggedIn");
            game.ui.showPage("game");
            startListeningForMessages();
        } else {
            game.ui.updateNavigation("loggedOut");
            game.ui.showPage("login");
        }
        */
    }

    var addEventListeners = function () {
        /*
        $("#login-button").on("click", loginHandler);
        $("#register-button").on("click", registerHandler);
        $("#logout-nav-button a").on("click", logoutHandler);
        $("#opened-nav-button a").on("click", showOpenedGamesHandler);
        $("#active-nav-button a").on("click", showActiveGamesHandler);
        $("#score-nav-button a").on("click", scoreClickedHandler);
        $("#messages-nav-button a").on("click", messagesClickedHandler);
        $("#create-new-game-button").on("click", createNewGameHandler);
        $("#opened-games-list").on("click", ".button", joinGameHandler);
        $("#active-games-list").on("click", "li", activeGameClickedHandler);
        $("#active-games-list").on("click", ".button", gameStartHandler);
        */
    }

    var showMyBetsTable = function () {
        game.ui.showLoading();
        game.data.user.getUserInfo(1)
        .fin(game.ui.hideLoading)
        .then(function (successData) {
            game.ui.showMyBetsTable(successData);
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var loginHandler = function() {
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        game.ui.showLoading();
        game.data.user.login(username, password)
        .fin(game.ui.hideLoading)
        .then(function () {
            game.ui.updateNavigation("loggedIn");
            game.ui.showPage("game");
            startListeningForMessages();
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var registerHandler = function () {
        var username = $("#register-username").val();
        var nickname = $("#register-nickname").val();
        var password = $("#register-password").val();
        game.ui.showLoading();
        game.data.user.register(username, nickname, password)
        .fin(game.ui.hideLoading)
        .then(function () {
            game.ui.updateNavigation("loggedIn");
            game.ui.showPage("game");
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var logoutHandler = function () {
        game.ui.showLoading();
        game.data.user.logout()
        .fin(game.ui.hideLoading)
        .then(function () {
            clearInterval(messagesInterval);
            game.ui.updateNavigation("loggedOut");
            game.ui.showPage("login");
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var showOpenedGamesHandler = function () {
        var jSubcontent = $(this).siblings(".subcontent");
        jSubcontent.toggle();
        if (jSubcontent.is(":visible")) {
            game.ui.showLoading();
            game.data.game.getOpened()
            .fin(game.ui.hideLoading)
            .then(function (successData) {
                game.ui.updateOpenedGames(successData);
            }, function (errorData) {
                game.ui.showErrorBox(errorData.responseJSON.Message);
            });
        }
    }

    var createNewGameHandler = function () {
        var title = $("#new-game-title").val();
        game.ui.showLoading();
        game.data.game.create(title)
        .fin(game.ui.hideLoading)
        .then(function (successData) {
            // nothing
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var showActiveGamesHandler = function () {
        var jSubcontent = $(this).siblings(".subcontent");
        jSubcontent.toggle();
        if (jSubcontent.is(":visible")) {
            game.ui.showLoading();
            game.data.game.getActive()
            .fin(game.ui.hideLoading)
            .then(function (successData) {
                game.ui.updateActiveGames(successData);
            }, function (errorData) {
                game.ui.showErrorBox(errorData.responseJSON.Message);
            });
        }
    }

    var scoreClickedHandler = function () {
        game.ui.showLoading();
        game.ui.showPage("score");
        game.data.user.getScore()
        .fin(game.ui.hideLoading)
        .then(function (successData) {
            game.ui.updateScore(successData);
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var messagesClickedHandler = function () {
        game.ui.showLoading();
        game.ui.showPage("messages");

        game.data.messages.getAll()
        .fin(game.ui.hideLoading)
        .then(function (successData) {
            game.ui.updateMessages(successData);
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var joinGameHandler = function (event) {
        var button = event.target;
        var li = button.parentNode;
        var ul = li.parentNode;
        var id = $(button).data("id");
        game.ui.showLoading();
        game.data.game.join(id)
        .fin(game.ui.hideLoading)
        .then(function () {
            ul.removeChild(li);
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var startListeningForMessages = function () {
        messagesInterval = setInterval(handleUnreadMessages, 2000);
    }

    var gameStartHandler = function (event) {
        var jTarget = $(event.target);
        var id = jTarget.data("id");
        game.ui.showLoading();
        game.data.game.start(id)
        .fin(game.ui.hideLoading)
        .then(function () {
            jTarget.hide();
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var activeGameClickedHandler = function (event) {
        var id = $(event.target).data("id");
        game.ui.showPage("current");
        game.ui.showLoading();
        game.data.game.getGameData(id)
        .fin(game.ui.hideLoading)
        .then(function (successData) {
            game.ui.drawGame(successData);
        }, function (errorData) {
            game.ui.showErrorBox(errorData.responseJSON.Message);
        });
    }

    var handleUnreadMessages = function () {
        game.data.messages.getUnread()
        .then(function (successData) {
            game.ui.updateUnreadMessages(successData);
        });
    }

    return {
        init: init
    }

})()