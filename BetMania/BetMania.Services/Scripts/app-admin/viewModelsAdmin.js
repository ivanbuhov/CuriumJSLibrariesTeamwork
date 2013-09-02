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
            editMatch: function (id) {
                console.log(i);
            }
        });
    }
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
