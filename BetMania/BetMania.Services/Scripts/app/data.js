/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.data = (function () {
    
    var sessionKey = "";

    var saveUserData = function(user){
        localStorage.setItem("sessionKey", user.sessionKey);
        localStorage.setItem("nickname", user.nickname);
        sessionKey = user.sessionKey;
    }

    var loadUserData = function(){
        sessionKey = localStorage.getItem("sessionKey");
    }

    var getNickname = function(){
        return localStorage.getItem("nickname");
    }
    
    var isUserLogged = function(){
        var sessionkey = localStorage.getItem("sessionKey");
        var nickname = localStorage.getItem("nickname");

        if (!sessionkey || !nickname) {
            return false;
        }
        return true;
    }

    var DataPersister = Class.create({
        init: function (baseUrl) {
            this.baseUrl = baseUrl;
            this.users = new UsersPersister(baseUrl + "/user/");
            this.matches = new MatchesPersister(baseUrl + "/matches/");
        },
        isUserLogged: function(){            
            return isUserLogged();
        },
        loadUserData:function(){
            loadUserData();
        },
        getNickname: function(){
            return getNickname();
        }
    });

    var UsersPersister = Class.create({
        init: function(baseUrl){
            this.baseUrl = baseUrl;
        },
        login: function(username, password){
            var user = {
                username: username,
                authCode: CryptoJS.SHA1(username + password).toString()
            }

            return betMania.requester.postJSON(this.baseUrl + "login", user).
                then(function (result) {
                    saveUserData(user);
                });
        },
        register: function (username, password, nickname) {
            var user = {
                username: username,
                nickname: nickname,
                authCode: CryptoJS.SHA1(username + password).toString()
            }

            return betMania.requester.postJSON(this.baseUrl + "register", user).
                then(function (result) {
                    saveUserData(user);
                });
        },
        logout: function () {        
            var headers = {
                "X-sessionKey": sessionKey
            }

            return betMania.requester.putJSON(this.baseUrl, {}, headers);
        }
    });

    var MatchesPersister = Class.create({

    });

    return {
        getDataPersister: function (baseUrl) {
            return new DataPersister(baseUrl);
        }
    }
}());