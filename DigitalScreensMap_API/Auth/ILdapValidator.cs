using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Auth
{
    /// <summary>
    /// Ldap related contracts
    /// </summary>
    public interface ILdapValidator
    {
        /// <summary>
        /// Check if user in Ldap 
        /// </summary>
        /// <param name="userId">Ldap user name without domain name</param>
        /// <param name="password">Ldap passsword</param>
        bool Validate(string userId, string password);
    }
}
