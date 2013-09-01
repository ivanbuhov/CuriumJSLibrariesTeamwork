using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using BetMania.Services.Helpers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace BetMania.Services
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
           

           //config.Routes.MapHttpRoute(
           //     name: "BetApi",
           //     routeTemplate: "api/matches/{}",
           //     defaults: new { controller = "Matches", action = "getmatchbyid" }
           // );

            //config.Routes.MapHttpRoute(
            //    name: "BetApi",
            //    routeTemplate: "api/matches/{matchId}",
            //    defaults: new { controller = "Matches" }
            //);

            config.Routes.MapHttpRoute(
                name: "BetTypesApi",
                routeTemplate: "api/bets/bettypes",
                defaults: new { controller = "Bets", action = "bettypes" }
            );

            config.Routes.MapHttpRoute(
                name: "BetApi",
                routeTemplate: "api/matches/bet/{matchId}",
                defaults: new { controller = "Matches", action = "bet" }
            );

            config.Routes.MapHttpRoute(
                name: "AddMoneyApi",
                routeTemplate: "api/user/addmoney/{amount}",
                defaults: new { controller = "User", action = "addmoney" }
            );

            config.Routes.MapHttpRoute(
                name: "UserApi",
                routeTemplate: "api/user/{action}/{id}",
                defaults: new 
                { 
                    controller = "User", 
                    id = RouteParameter.Optional 
                }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Uncomment the following line of code to enable query support for actions with an IQueryable or IQueryable<T> return type.
            // To avoid processing unexpected or malicious queries, use the validation settings on QueryableAttribute to validate incoming queries.
            // For more information, visit http://go.microsoft.com/fwlink/?LinkId=279712.
            //config.EnableQuerySupport();

            // To disable tracing in your application, please comment out or remove the following line of code
            // For more information, refer to: http://www.asp.net/web-api
            config.EnableSystemDiagnosticsTracing();

            // Add dependency resolver
            config.DependencyResolver = new DefaultDependencyResolver();

            // Change the names of the properties of the outputed JSON to be camelCase
            var formatters = GlobalConfiguration.Configuration.Formatters;
            var jsonFormatter = formatters.JsonFormatter;
            var settings = jsonFormatter.SerializerSettings;
            settings.Formatting = Formatting.Indented;
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
