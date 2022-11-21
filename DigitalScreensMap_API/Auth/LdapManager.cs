using Novell.Directory.Ldap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Auth
{
    /// <summary>
    /// Ldap related tasks manager
    /// </summary>
    public class LdapManager : ILdapValidator
    {
        /// <summary>
        /// Domain name from config file
        /// </summary>
        public readonly string DomainName;
        /// <summary>
        /// Port name form config file, default 389
        /// </summary>
        public readonly int PortNumber;

        public LdapManager(string domainName, int port = 389)
        {
            DomainName = domainName;
            PortNumber = port;      /*LdapConnection.DEFAULT_PORT*/
        }

        /// <summary>
        /// Check if user in Ldap 
        /// </summary>
        /// <param name="userId">Ldap user name without domain name</param>
        /// <param name="password">Ldap passsword</param>
        public bool Validate(string userId, string password)
        {
            try
            {
                string username = UserFullId(userId);
                using (var connection = new LdapConnection { SecureSocketLayer = false })
                {
                    connection.Connect(DomainName, PortNumber);
                    connection.Bind(username, password);
                    return connection.Bound;
                }
            }
            catch (LdapException ex)
            {
               
                return false;
            }
        }

        /// <summary>
        /// User full id 
        /// </summary>
        /// <param name="userId">User name</param>
        /// <returns>userName@domain</returns>
        public string UserFullId(string userId)
        {
            string value = string.Format(@"{0}@{1}", userId, DomainName);
            return value;
        }
    }
}
