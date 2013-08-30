/// <reference path="q.js" />
/// <reference path="jquery-2.0.2.intellisense.js" />

var game = game || {};

game.data = (function () {
    
    function init(serviceRootUrl) {
        this.user = getUserPersister(serviceRootUrl + "users/");
        this.game = getGamePersister(serviceRootUrl + "game/");
        this.messages = getMessagePersister(serviceRootUrl + "messages/");
    }

    var getUserPersister = function (userServiceRootUrl) {

        var _setNickname = function (nickname) {
            localStorage.setItem("nickname", nickname);
        }

        var _setSessionKey = function (sessionKey) {
            localStorage.setItem("sessionKey", sessionKey);
        }

        var _clearSessionKey = function () {
            localStorage.removeItem("sessionKey");
        }

        var _clearNickname = function () {
            localStorage.removeItem("nickname");
        }

        var getNickname = function () {
            return localStorage.getItem("nickname");
        }

        var getSessionKey = function () {
            return localStorage.getItem("sessionKey");
        }

        var getUserInfo = function(id) {
            return game.requester.getJSON(userServiceRootUrl + id);
        }

        var login = function (username, password) {
            username = escape(username);
            return game.requester.postJSON(userServiceRootUrl + "login", {
                username: username,
                authCode: _sha1(username + password),
            }).then(function (result) {
                _setSessionKey(result.sessionKey);
                _setNickname(result.nickname);
            });
        }

        var register = function (username, nickname, password) {
            username = escape(username);
            nickname = escape(nickname);
            return game.requester.postJSON(userServiceRootUrl + "register", {
                username: username,
                nickname: nickname,
                authCode: _sha1(username + password),
            }).then(function (result) {
                _setSessionKey(result.sessionKey);
                _setNickname(result.nickname);
            });
        }

        var logout = function () {
            return game.requester.getJSON(userServiceRootUrl + "logout/" + getSessionKey())
                .then(function () {
                    _clearSessionKey();
                    _clearNickname();
                });
        }

        var getScore = function () {
            return game.requester.getJSON(userServiceRootUrl + "scores/" + getSessionKey())
        }

        var isLoggedIn = function () {
            return getSessionKey() != null;
        }

        var getData = function () {
            return {
                nickname: getNickname(),
                sessionKey: getSessionKey()
            }
        }

        return {
            //new
            getUserInfo: getUserInfo,

            getNickname: getNickname,
            getSessionKey: getSessionKey,
            login: login,
            register: register,
            logout: logout,
            getScore: getScore,
            isLoggedIn: isLoggedIn,
            getData: getData
        }
    }

    var getGamePersister = function (gameServiceRootUrl) {

        var create = function (title) {
            var settings = { title: title };
            return game.requester.postJSON(gameServiceRootUrl + "create/" + game.data.user.getSessionKey(), settings);
        }

        var getOpened = function () {
            return game.requester.getJSON(gameServiceRootUrl + "open/" + game.data.user.getSessionKey());
        }

        var getActive = function () {
            return game.requester.getJSON(gameServiceRootUrl + "my-active/" + game.data.user.getSessionKey());
        }

        var join = function (id) {
            return game.requester.postJSON(gameServiceRootUrl + "join/" + game.data.user.getSessionKey(), {id: id});
        }

        var start = function (id) {
            return game.requester.getJSON(gameServiceRootUrl + id + "/start/" + game.data.user.getSessionKey());
        }

        var getGameData = function (id) {
            return game.requester.getJSON(gameServiceRootUrl + id + "/field/" + game.data.user.getSessionKey());
        }

        return {
            create: create,
            getOpened: getOpened,
            getActive: getActive,
            join: join,
            start: start,
            getGameData: getGameData
        }
    }

    var getMessagePersister = function (messageServiceRootUrl) {

        var getAll = function () {
            return game.requester.getJSON(messageServiceRootUrl + "all/" + game.data.user.getSessionKey());
        }

        var getUnread = function () {
            return game.requester.getJSON(messageServiceRootUrl + "unread/" + game.data.user.getSessionKey());
        }

        return {
            getAll: getAll,
            getUnread: getUnread
        }
    }

    // Private methods
    var _sha1 = function sha1(str) {
        var utf8_encode = function (strUni) { var strUtf = strUni.replace(/[\u0080-\u07ff]/g, function (c) { var cc = c.charCodeAt(0); return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);}); strUtf = strUtf.replace(/[\u0800-\uffff]/g, function (c) { var cc = c.charCodeAt(0); return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);});return strUtf;}
        var rotate_left = function (n, s) { var t4 = (n << s) | (n >>> (32 - s)); return t4; };
        var cvt_hex = function (val) { var str = ""; var i; var v; for (i = 7; i >= 0; i--) { v = (val >>> (i * 4)) & 0x0f; str += v.toString(16); } return str; }; var blockstart; var i, j; var W = new Array(80); var H0 = 0x67452301; var H1 = 0xEFCDAB89; var H2 = 0x98BADCFE; var H3 = 0x10325476; var H4 = 0xC3D2E1F0; var A, B, C, D, E; var temp;  str = utf8_encode(str); var str_len = str.length;
        var word_array = []; for (i = 0; i < str_len - 3; i += 4) { j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3); word_array.push(j); }
        switch (str_len % 4) { case 0: i = 0x080000000; break; case 1: i = str.charCodeAt(str_len - 1) << 24 | 0x0800000; break; case 2: i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000; break; case 3: i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80; break; } word_array.push(i);
        while ((word_array.length % 16) != 14) { word_array.push(0);} word_array.push(str_len >>> 29); word_array.push((str_len << 3) & 0x0ffffffff); for (blockstart = 0; blockstart < word_array.length; blockstart += 16) { for (i = 0; i < 16; i++) { W[i] = word_array[blockstart + i]; } for (i = 16; i <= 79; i++) { W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1); }
            A = H0; B = H1; C = H2; D = H3; E = H4; for (i = 0; i <= 19; i++) {temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp;} for (i = 20; i <= 39; i++) { temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;E = D; D = C; C = rotate_left(B, 30);B = A;A = temp; }
            for (i = 40; i <= 59; i++) {temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff; E = D; D = C; C = rotate_left(B, 30); B = A; A = temp;} for (i = 60; i <= 79; i++) {temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff; E = D; D = C;C = rotate_left(B, 30);B = A; A = temp;}
            H0 = (H0 + A) & 0x0ffffffff; H1 = (H1 + B) & 0x0ffffffff; H2 = (H2 + C) & 0x0ffffffff; H3 = (H3 + D) & 0x0ffffffff; H4 = (H4 + E) & 0x0ffffffff; } temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4); return temp.toLowerCase();
    }

    var escape = function (str) {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };

        function replaceTag(tag) {
            return tagsToReplace[tag] || tag;
        }

        return str.replace(/[&<>]/g, replaceTag);
    }

    return {
        init: init
    }

})();