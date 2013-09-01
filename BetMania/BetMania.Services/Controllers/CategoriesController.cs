using BetMania.Database;
using BetMania.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BetMania.Services.Controllers
{
    public class CategoriesController : BaseApiController
    {
        private BetManiaContext db;

        public CategoriesController(BetManiaContext db)
        {
            if (db == null)
            {
                throw new ArgumentNullException("db");
            }
            this.db = db;
        }

        // GET api/categiries
        public HttpResponseMessage GetMatchCategories()
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                var categories = this.Convert(this.db.MatchCategories).ToList();
                HttpResponseMessage message = Request.CreateResponse(HttpStatusCode.OK, categories);
                return message;
            });

            return response;
        }

        private IQueryable<CategoryDTO> Convert(IQueryable<MatchCategory> categories)
        {
            return categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name
            });
        }
    }
}
