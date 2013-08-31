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
            catch (InvalidOperationException ex) 
            {
                HttpResponseMessage errorMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
                throw new HttpResponseException(errorMessage);
            }
            catch (ArgumentNullException ex)
            {
                HttpResponseMessage errorMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
                throw new HttpResponseException(errorMessage);
            }
            catch (ArgumentException ex) 
            {
                HttpResponseMessage errorMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
                throw new HttpResponseException(errorMessage);
            }
            catch (NullReferenceException ex)
            {
                HttpResponseMessage errorMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
                throw new HttpResponseException(errorMessage);
            }
            catch (Exception ex)
            {
                HttpResponseMessage errorMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
                throw new HttpResponseException(errorMessage);
            }
        }
    }
}
