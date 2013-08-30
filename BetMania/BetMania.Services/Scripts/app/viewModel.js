/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.viewModelFactory = (function () {
    var data = null;

    function getLoginRegisterViewModel(successCallback) {
        var viewModel = {
            username: "DonchoMinkov",
            password: "123456q",
            login: function () {
                data.users.login(this.get("username"), this.get("password"))
					.then(function () {
					    if (successCallback) {
					        successCallback();
					    }
					});
            },
            register: function () {
                data.users.register(this.get("username"), this.get("password"))
					.then(function () {
					    if (successCallback) {
					        successCallback();
					    }
					});
            }
        };
        return kendo.observable(viewModel);
    };

    return {
        getLoginRegisterViewModel: getLoginRegisterViewModel,
        setPersister: function (persister) {
            data = persister
        }
    };
}());
    
  