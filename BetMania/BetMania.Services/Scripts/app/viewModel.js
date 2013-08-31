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
                    console.log(userData);
                },
                function (errorData) {
                    console.log(errorData);
                });
        },
        register: function () {
            return betMania.data.users
                .register(this.get("registerUsername"), this.get("registerNickname"), this.get("registerPassword"))
                .then(function (userData) {
                    console.log(userData);
                },
                function (errorData) {
                    console.log(errorData);
                })
        }
    });

    return {
        loginRegisterViewModel: loginRegisterViewModel
    };
}());
    
  