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
                    console.log(errorData);
                    console.log("Must show some error box."); // TODO
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
                    console.log(errorData);
                    console.log("Must show some error box."); // TODO
                })
        }
    });

    var userProfileViewModel = kendo.observable({
        isLogged: false,
        nickname: "Anonymous",
        balance: "none"
    });

    return {
        loginRegisterViewModel: loginRegisterViewModel,
        userProfileViewModel: userProfileViewModel
    };
}());
    
  