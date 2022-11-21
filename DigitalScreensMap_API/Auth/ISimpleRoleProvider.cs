using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Auth
{
    /// <summary>
    /// Defines the base functionality of the class used to provide applicative roles for a user when using the simple role
    /// authorization.
    /// </summary>
    public interface ISimpleRoleProvider
    {
        #region Public Methods

        /// <summary>
        /// Loads and returns the role names for a given user name.
        /// </summary>
        /// <param name="userName">The login name of the user for which to return the roles.</param>
        /// <returns>
        /// A collection of <see cref="string" /> that describes the roles assigned to the user;
        /// An empty collection of no roles are assigned to the user.
        /// </returns>
        /// <remarks>
        ///     <para>Beware that this method is called for each controller call. It might impact performance.</para>
        ///     <para>
        ///     If Windows authentication is used, the passed <paramref name="userName" />
        ///     is the full user name including the domain or machine name (e.g "CostroDomain\JohnDoe" or
        ///     "JOHN-WORKSTATION\JohnDoe").
        ///     </para>
        ///     <para>
        ///     The returned roles names can be used to restrict access to controllers using the <see cref="AuthorizeAttribute" />
        ///     (<c>[Authorize(Roles="...")]</c>
        ///     </para>
        /// </remarks>
        Task<ICollection<string>> GetUserRolesAsync(string userName);

        #endregion
    }
}
