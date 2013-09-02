/// <reference path="../libs/_references.js" />

betMania = betMania || {};

(function () {
    betMania.viewModels.adminViewModel = function () {
        return new kendo.observable({
            testAdminViewModel:1,
            getAllUsers: function (msg) {
                alert(msg + " getting users");
            }
        });
    }

    betMania.viewModels.adminMatchesViewModel = function () {
        var matches = [];

        //var updateMatches = 

        return new kendo.observable({
            matches: matches,           
            updateMatches: function () {
                var self = this;
                betMania.data.matches.getMatches()
                     .then(function (result) {
                         self.set("matches", result);
                     }, function (err) {
                         console.log(err);
                         return err;
                     });
            },
            editMatch: function (e) {
                var self = this;

                var id = $(e.target).data("id");

                var matchToEdit = self.getMatchById(id);
                matchToEdit.update = function () {
                    betMania.data.matches.modify(this)
                        .then(function () {
                            $("#page").html("<h1>Match is modified!</h1>");
                            setTimeout(function () {
                                betMania.router.navigate("/admin/matches");
                            }, 2000)
                        }, function (err) {
                            betMania.ui.showErrorBox(JSON.parse(err.responseText).message);
                        })
                }

                betMania.viewModels.singleMatchAdminVM = new kendo.observable(matchToEdit);

                betMania.router.navigate("/admin/matches/" + id);
            },
            getMatchById: function (id) {
                var matches = this.matches;
                
                for (var i = 0; i < matches.length; i++) {
                    if(matches[i].id == id){
                        return matches[i];
                    }
                }

                return {};
            }
        });
    }

    betMania.viewModels.usersAdminVM = function () {
        var users = []

        return new kendo.observable({
            users: users,
            getUsers: function () {
                var self = this;
                betMania.data.users.getUsers()
                    .then(function (result) {
                        self.set("users", result);
                    })
            },
            editUser: function (e) {
                var self = this;

                var id = $(e.target).data("id");

                var userToEdit = _.where(self.users, { id: id }, true);
                
                userToEdit.update = function () {
                    betMania.data.users.modify(this)
                        .then(function () {
                            $("#page").html("<h1>User is modified!</h1>");
                            setTimeout(function () {
                                betMania.router.navigate("/admin/users");
                            }, 2000)
                        }, function (err) {
                            betMania.ui.showErrorBox(JSON.parse(err.responseText).message);
                        });
                };
                betMania.viewModels.singleUserAdminVM = new kendo.observable(userToEdit);

                betMania.router.navigate("/admin/users/" + id);
            },
            //create: function () {
            //    betMania.router.navigate("/admin/createUser");
            //},
            deleteUser: function (e) {
                var self = this;

                var id = $(e.target).data("id");

                betMania.data.users.deleteUser(id)
                    .then(function (result) {
                        var index;
                        var users = self.get("users");

                        for (var i = 0; i < users.length; i++) {
                            if (users[i].id == id) {
                                users.splice(i, 1);
                                return;
                            }
                        }

                        self.set("users", users);

                    }, function (err) {
                        betMania.ui.showErrorBox(JSON.parse(err.responseText).message);
                    })

            }
        })
    }

    //betMania.viewModels.singleUserAdminVM = function () {
    //    var user = {};

    //    var update = 

    //    return new kendo.observable(user);
    //}
}());
                //var result = result;
                //var data = new kendo.data.DataSource({
                //    //data: result,
                //    schema: {
                //        model: { id: "id",
                //            fields: {
                //                home: { editable: true, nullable: false },
                //                away: { editable: { required: true }, nullable: false },
                //                homeCoefficient: { type: "number", validation: { required: true, min: 1 } },
                //                awayCoefficient: { type: "boolean" },
                //                drawCoefficient: { type: "number", validation: { min: 0, required: true } }
                //            }
                //        }
                //    },
                //    transport: {
                //        read: function (options) {
                //            options.success(result);
                //        },
                //        destroy: function (options) {
                //            console.log(options);
                //        },
                //        update: function (options) {
                //            console.log(options);
                //        },
                //        edit: function (options) {
                //            console.log(options);
                //        },
                //        create: function (options) {
                //            console.log(options);
                //        }
                //    },

                //});

                //var updateData = function (e) {
                //    var target = e.target;
                //}

                //return new kendo.observable({
                //    matchesDataSource: data,
                //    updateData: function (e) {
                //        var target = e.target;
                //    },
                //    getKendoGrid: function (selector) {
                //        $(selector).kendoGrid({
                //            dataSource: data,
                //            columns: [{ "field": "home", "title": "Home", "width": "200px" },
                //                { "field": "away", title: "Away", "width": "200px" },
                //                { "field": "homeCoefficient", title: "1", "width": "60px" },
                //                { "field": "drawCoefficient", title: "X", "width": "60px" },
                //                { "field": "awayCoefficient", title: "2", "width": "60px" },
                //                { "field": "homeScore", "title": "Res", "width": "60px" },
                //                { "field": "awayScore", "title": "ult", "width": "60px" },
                //                {
                //                    "command": [{
                //                        text: "Delete", click: function (data) {
                //                            console.log(data);
                //                        }
                //                    }, "update"]
                //                }
                //            ],
                //            editable: true,
                //            //toolbar: [{ text: "Create" , click: this.dataSource.transport.create},"save","cacel"]
                //        })
                //    }
        //    });

        //}, function (err) {
        //    console.log(err);
        //})
    //}

    //return {
    //    adminViewModel: adminViewModel,
    //    adminMatchesViewModel: adminMatchesViewModel
    //}
