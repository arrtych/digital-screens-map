using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;

namespace DigitalScreensMap_API.Auth
{
    /// <summary>
    /// Implements a <see cref="IClaimsTransformation" /> that uses a <see cref="ISimpleRoleProvider" /> to fetch and apply
    /// applicative roles
    /// for a user.
    /// <para>
    /// To use, you need to implement a class that inherit from <see cref="ISimpleRoleProvider" /> and use the
    /// <see cref="SimpleRoleAuthorizationServiceCollectionExtensions.AddSimpleRoleAuthorization{TRoleProvider}" /> extension
    /// method
    /// in the <c>ConfigureServices</c> method of the <c>Startup</c> class to enable the simple role authorization and
    /// associate your simple role provider implementation.
    /// </para>
    /// </summary>
    public class SimpleRoleAuthorizationTransform : IClaimsTransformation
    {
        #region Private Fields

        private static readonly string RoleClaimType = $"http://{typeof(SimpleRoleAuthorizationTransform).FullName.Replace('.', '/')}/role";
        private readonly ISimpleRoleProvider _roleProvider;

        #endregion

        #region Public Constructors

        public SimpleRoleAuthorizationTransform(ISimpleRoleProvider roleProvider)
        {
            _roleProvider = roleProvider ?? throw new ArgumentNullException(nameof(roleProvider));
        }

        #endregion

        #region Public Methods

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            // Cast the principal identity to a Claims identity to access claims etc...
            var oldIdentity = (ClaimsIdentity)principal.Identity;

            // "Clone" the old identity to avoid nasty side effects.
            // NB: We take a chance to replace the claim type used to define the roles with our own.
            var newIdentity = new ClaimsIdentity(
                oldIdentity.Claims,
                oldIdentity.AuthenticationType,
                oldIdentity.NameClaimType,
                RoleClaimType);

            // Fetch the roles for the user and add the claims of the correct type so that roles can be recognized.
            var roles = await _roleProvider.GetUserRolesAsync(newIdentity.Name);
            newIdentity.AddClaims(roles.Select(r => new Claim(RoleClaimType, r)));

            // Create and return a new claims principal
            return new ClaimsPrincipal(newIdentity);
        }

        #endregion
    }
}
