/// <reference path="../libs/_references.js" />
var betMania = betMania || {};

betMania.data = (function () {
    var balance = function (newBalance) {
        if (newBalance) {
            localStorage.setItem("balance", newBalance);
        }
        else {
            return localStorage.getItem("balance");
        }
    };

    var saveUserData = function(user){
        localStorage.setItem("sessionKey", user.sessionKey);
        localStorage.setItem("nickname", user.nickname);
        balance(user.balance);
    }

    var clearUserData = function () {
        localStorage.removeItem("sessionKey");
        localStorage.removeItem("nickname");
        localStorage.removeItem("balance")
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
        },
        balance: balance
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

            return betMania.requester.postJSON(this.baseUrl + "login", user)
                .then(function (result) {
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

            return betMania.requester
                .putJSON(this.baseUrl + "addmoney/" + ammount, {}, headers)
                .then(function () {
                    var oldBalance = balance();
                    balance(parseFloat(oldBalance) + parseFloat(ammount));
                });
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

            return betMania.requester.putJSON(this.baseUrl + "modify", user, headers)
             .then(function () {
                 balance(user.balance);
             });
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
            options = options || {};

            var queryStartAdded = false;

            var url = this.baseUrl;
            
            if (options.category) {                
                url += "?category=" + options.category + "&";
                queryStartAdded = true;
            }
            
            if (!queryStartAdded) {
                url += "?"
                queryStartAdded = true;
            }

            url += "status=" + (options.status || "0") + "&";                
                        
            url += "my=" + (options.my || "false") + "&";
            headers["X-sessionKey"] = getSessionKey();
           
            url += "page=" + (options.page || "0") + "&";
           
            url += "take=" + (options.take || "10");            

            return betMania.requester.getJSON(url, headers);           
        },

        getMatch: function (id) {
            var headers = {
                "X-sessionKey": getSessionKey() || " "
            }
            var url = this.baseUrl + id;
            return betMania.requester.getJSON(url, headers);
        },

        addNew: function (match) {
            if (!match) {
                throw new {"message":"match is undefined!"}
            }

            var headers = {
                "X-sessionKey": getSessionKey()
            }

            return betMania.requester.postJSON(this.baseUrl, match, headers);
        },

        bet: function (matchId, amount, betType) {
            var headers = {
                "X-sessionKey": getSessionKey()
            }

            var betModel = {
                "amount": amount,
                "betType": betType
            }

            return betMania.requester
                .postJSON(this.baseUrl + "bet/" + matchId, betModel, headers)
                .then(function (betModel) {
                    var oldBalance = balance();
                    balance(oldBalance - betModel.ammount);
                    return betModel;
                });
        },
    });

    return new DataPersister("/api"); 
}());
