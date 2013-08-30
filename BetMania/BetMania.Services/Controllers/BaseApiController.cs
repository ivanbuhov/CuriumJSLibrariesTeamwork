using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BetMania.Services.Controllers
{
    public class BaseApiController : ApiController
    {
        protected T ProcessOperation<T>(Func<T> operation)
        {
            try
            {
                return operation();
            }
            catch (Exception e)
            {
                HttpResponseMessage errorMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e.Message);
                throw new HttpResponseException(errorMessage);
            }
        }
    }
}
