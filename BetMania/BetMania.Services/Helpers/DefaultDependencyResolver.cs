using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Dependencies;
using BetMania.Services.Controllers;
using BetMania.Database;

namespace BetMania.Services.Helpers
{
    public class DefaultDependencyResolver : IDependencyResolver
    {
        public IDependencyScope BeginScope()
        {
            return this;
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == typeof(UserController))
            {
                return new UserController(new BetManiaContext());
            }
            else if (serviceType == typeof(MatchesController))
            {
                return new MatchesController(new BetManiaContext());
            }
            else if (serviceType == typeof(BetsController))
            {
                return new BetsController(new BetManiaContext());
            }
            else if (serviceType == typeof(CategoriesController))
            {
                return new CategoriesController(new BetManiaContext());
            }

            return null;
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return new List<object>();
        }

        public void Dispose()
        {
        }
    }
}