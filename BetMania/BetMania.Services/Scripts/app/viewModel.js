/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.viewModels = (function () {

    var loginRegisterViewModel = kendo.observable({
        loginUsername: "",
        loginPassword: "",
        registerUsername: "",
        registerNickname: "",
        registerPassword: "",
        login: function () {
            return betMania.data.users
                .login(this.get("loginUsername"), this.get("loginPassword"))
                .then(function (userData) {
                    betMania.viewModels.userProfileViewModel.set("nickname", userData.nickname);
                    betMania.viewModels.userProfileViewModel.set("balance", userData.balance);
                    betMania.viewModels.userProfileViewModel.set("isLogged", true);
                    betMania.ui.toggleNavigation();
                    betMania.router.navigate("/");
                },
                function (errorData) {
                    var message = JSON.parse(errorData.responseText).message;
                    betMania.ui.showErrorBox(message);
                });
        },
        register: function () {
            return betMania.data.users
                .register(this.get("registerUsername"), this.get("registerPassword"), this.get("registerNickname"))
                .then(function (userData) {
                    betMania.viewModels.userProfileViewModel.set("nickname", userData.nickname);
                    betMania.viewModels.userProfileViewModel.set("balance", userData.balance);
                    betMania.viewModels.userProfileViewModel.set("isLogged", true);
                    betMania.ui.toggleNavigation();
                    betMania.router.navigate("/");
                },
                function (errorData) {
                    var message = JSON.parse(errorData.responseText).message;
                    betMania.ui.showErrorBox(message);
                })
        }
    });

    var userProfileViewModel = kendo.observable({
        isLogged: false,
        nickname: "Anonymous",
        balance: "none"
    });

    var matchViewModel = kendo.observable({
        matches: [],
        my: false,
        category: "football", // TODO : empty string
        status: "0",
        updateMatches: function () {
            var data;
            var self = this;

            betMania.data.matches.getMatches({
                category: self.category,
                status: self.status,
                my: self.my
            }).then(function (result) {
                console.log(result);
                self.set("matches", result);

            },
            function (errorData) {
                console.log(errorData);
            });
        },
        goToMatch: function (ev) {
            var id = $(ev.delegateTarget).data("id");
            betMania.router.navigate("/match/" + id);
        }
        
    });

    var singleMatchViewModel = kendo.observable({
        match: [],
        betTypeValue: "Home",
        coefficient: 0,
        betAmount: 0,
        profit: 0,
        betTypesSource: new kendo.data.DataSource({
            data: [],
            transport: {
                read: {
                    url: "api/bets/bettypes",
                    dataType: "json"
                }
            }
        }),
        changeBetAmount: function (ev) {
            var amount = parseFloat(ev.currentTarget.value);
            this.set("betAmount", amount);
            this.updateProfit();
        },
        updateProfit: function () {
            var currentBetType = this.get("betTypeValue").toLowerCase();
            var coefficient = 0;
            switch (currentBetType) {
                case "home": coefficient = this.get("match[0].homeCoefficient"); break;
                case "away": coefficient = this.get("match[0].awayCoefficient"); break;
                case "draw": coefficient = this.get("match[0].drawCoefficient"); break;
                default: coefficient = 0;
            }
            this.set("coefficient", parseFloat(coefficient));
            var profit = this.get("coefficient") * this.get("betAmount");
            profit = Number(profit.toFixed(2));
            this.set("profit", profit);
        },
        bet: function () {
            betMania.data.matches.bet(this.get("match[0].id"), this.get("betAmount"), this.get("betTypeValue"))
            .then(function (bet) {
                var newBalance = betMania.data.balance() - bet.amount;
                betMania.data.balance(newBalance);
                betMania.viewModels.userProfileViewModel.set("balance", newBalance);
            },
            function (errorData) {
                var message = JSON.parse(errorData.responseText).message;
                betMania.ui.showErrorBox(message);
            });
        }
    });

    return {
        loginRegisterViewModel: loginRegisterViewModel,
        userProfileViewModel: userProfileViewModel,
        matchViewModel: matchViewModel,
        singleMatchViewModel: singleMatchViewModel
    };
}());
    
  