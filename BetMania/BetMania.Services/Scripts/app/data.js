/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.data = (function () {
    
    var saveUserData = function(user){
        localStorage.setItem("sessionKey", user.sessionKey);
        localStorage.setItem("nickname", user.nickname);
    }

    var clearUserData = function () {
        localStorage.removeItem("sessionKey");
        localStorage.removeItem("nickname");
    }

    var loadUserData = function(){
        sessionKey = localStorage.getItem("sessionKey");
    }

    var getNickname = function(){
        return localStorage.getItem("nickname");
    }

    var getSessionKey = function () {
        return localStorage.getItem("sessionKey");
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
                    saveUserData(result);
                    return result;
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
                    saveUserData(result);
                    return result;
                });
        },
        logout: function () { 
            var headers = {
                "X-sessionKey": getSessionKey()
            }

            return betMania.requester.putJSON(this.baseUrl + "logout", {}, headers)
                .then(function () {
                    clearUserData();
                });
        },
        addMoney: function (ammount) {
            var headers = {
                "X-sessionKey": getSessionKey()
            }

            return betMania.requester.putJSON(this.baseUrl + "addmoney/" + ammount, {}, headers);
        },
        getUsers: function () {
            var headers = {
                "X-sessionKey": getSessionKey()
            }

            return betMania.requester.getJSON(this.baseUrl + "getusers/", headers)
            
        },
        deleteUser: function (userId) {
            var headers = {
                "X-sessionKey": getSessionKey()
            }

            return betMania.requester.deleteJSON(this.baseUrl + "delete/" + userId, headers);
        },
        modify: function (user) {
            var headers = {
                "X-sessionKey": getSessionKey()
            }

            return betMania.requester.putJSON(this.baseUrl + "modify", user, headers);            
        }

    });

    var MatchesPersister = Class.create({
        init: function (baseUrl) {
            this.baseUrl = baseUrl;
        },
        /* takes options {} with properties category, status, my, page, take
        * {category:"football",my:true}
        */
        getMatches: function (options) {
            var headers = {
                "X-sessionKey":""
            };
            var queryStartAdded = false;

            var url = this.baseUrl;
            var checkForQuery = function () {
                if (!queryStartAdded) {
                    url += "?"
                    queryStartAdded = true;
                }
            }

            if (options.category) {                
                url += "?category=" + options.category + "&";
                queryStartAdded = true;
            }

            if (options.status) {
                checkForQuery();
                url += "status=" + options.status + "&";                
            }
            else {
                checkForQuery();
                url += "status=all&";
            }

            if (options.my) {
                checkForQuery();
                url += "my=" + true + "&";
                headers["X-sessionKey"] = getSessionKey();
            }

            if (options.page) {
                checkForQuery();
                url += "page=" + options.page + "&";
            }

            if (options.take) {
                checkForQuery();
                url += "take=" + options.take;
            }

            return betMania.requester.getJSON(url, headers)
            .then(function (response, status, my) {
                debugger;
            }, function (err) {
                debugger;
            });
        }
    });

    return new DataPersister("/api"); 
}());