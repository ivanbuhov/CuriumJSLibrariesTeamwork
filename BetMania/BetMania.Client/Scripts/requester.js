/// <reference path="Scripts/q.js" />
/// <reference path="Scripts/jquery-2.0.2.js" />

var game = game || {};

game.requester = (function () {

    var request = function (url, type, data) {
        var ajaxDeferred = Q.defer();

        if (data) { data = JSON.stringify(data); }

        $.ajax({
            url: url,
            type: type,
            data: data,
            contentType: "application/json",
            success: function (responseData) {
                ajaxDeferred.resolve(responseData);
            },
            error: function (errorData) {
                ajaxDeferred.reject(errorData);
            }
        });

        return ajaxDeferred.promise;
    }

    var getJSON = function (url) {
        return request(url, "get");
    }

    var postJSON = function (url, data) {
        return request(url, "post", data);
    }

    return {
        getJSON: getJSON,
        postJSON: postJSON
    }
}())