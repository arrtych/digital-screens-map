using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Auth
{
    public class DemoSimpleRoleProvider : ISimpleRoleProvider
    {
        public const string ADMIN = "Admin";
        public const string BASIC_USER = "BasicUser";

        public Task<ICollection<string>> GetUserRolesAsync(string userName)
        {
            ICollection<string> result = new string[0];

         
            if (!string.IsNullOrEmpty(userName))
            {
                if (userName.EndsWith("arturli", StringComparison.OrdinalIgnoreCase))
                    result = new[] { BASIC_USER };
                else if (userName.EndsWith("arturli.adm", StringComparison.OrdinalIgnoreCase))
                    result = new[] { BASIC_USER, ADMIN };
            }

            return Task.FromResult(result);
        }
    }
}
