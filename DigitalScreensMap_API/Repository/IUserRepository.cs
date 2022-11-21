using DigitalScreensMap_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public interface IUserRepository
    {
        User Authenticate(string userName, string password);
    }
}
