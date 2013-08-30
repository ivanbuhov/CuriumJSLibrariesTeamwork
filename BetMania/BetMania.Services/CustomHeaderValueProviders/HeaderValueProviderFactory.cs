using System.Web.Http.Controllers;
using System.Web.Http.ValueProviders;
using BetMania.Services.CustomHeaderValueProviders;

namespace BetMania.Services.CustomHeaderValueProviders
{
    public class HeaderValueProviderFactory<T> : ValueProviderFactory where T : class
    {
        public override IValueProvider GetValueProvider(HttpActionContext actionContext)
        {
            var headers = actionContext.ControllerContext.Request.Headers;
            return new HeaderValueProvider<T>(headers);
        }
    }
}