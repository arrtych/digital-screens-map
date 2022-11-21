using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Exceptions
{
    public class NotFoundError : ApiError
    {
        public NotFoundError(): base(404, HttpStatusCode.NotFound.ToString())
        {
        }


        public NotFoundError(string message): base(404, HttpStatusCode.NotFound.ToString(), message)
        {
        }
    }
}
