using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using DigitalScreensMap_API.Auth;
using DigitalScreensMap_API.Models;
using DigitalScreensMap_API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
//using TestAuth2Mvc.Identity;

namespace DigitalScreensMap_API.Controllers
{


    //[Produces("application/json")]
    //[Authorize]
    [Route("api/[controller]")]
    //[ApiController]
    public class UsersController : Controller
    {
        private IUserRepository _user;

        //private readonly LdapUserManager _userManager;
        //private readonly LdapSignInManager _signInManager;
        private readonly ILogger _logger;


        public UsersController(IUserRepository user)
        {
            _user = user;
        }

        //public UsersController(LdapUserManager userManager, LdapSignInManager signInManager)
        //{
        //    this._userManager = userManager;
        //    this._signInManager = signInManager;

        //}

        [HttpPost]
        [Route("login")]
        public IActionResult Post([FromBody] User model)
        {
            var user = _user.Authenticate(model.Username, model.Password);
            if (user == null)
            {
                return BadRequest(new { message = "Username or Password is incorrect" });
            }
            return Ok(user);
        }


        //[HttpPost]
        //[Route("login2")]
        //public async Task<IActionResult> Signin([FromBody] User model)
        //{

        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
        //            if (result.Succeeded) {
        //                return Ok();
        //            }
        //        } catch(Exception)
        //        {
        //            return BadRequest(new { message = "Username or Password is incorrect" });
        //        }
               
        //    }
        //    return Ok();
        //}


        [Route("iisauth")]
        [HttpGet]
        public IActionResult IISAuthorize()
        {
            var name = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name)?.Value;
            return new ContentResult() { Content = $@"IIS authorized. AD: {name}" };
        }

        [HttpGet]
        public ActionResult<string> Get()
        {
            return Ok("Anyone can access this !");
        }

        [HttpGet("admin")]
        [Authorize(Roles = DemoSimpleRoleProvider.ADMIN)]
        public ActionResult<string> GetAdmin()
        {
            return Ok("You just made an admin call !");
        }

        [HttpGet("basic")]
        [Authorize(Roles = DemoSimpleRoleProvider.BASIC_USER)]
        public ActionResult<string> GetBasic()
        {
            var userSid = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.PrimarySid)?.Value;
            if(!HttpContext.User.Identity.IsAuthenticated)
            {
                HttpContext.Response.StatusCode = 401;
                HttpContext.Response.Headers.Add("www-authenticate",
                    new StringValues(new string[] { "Negotiate", "NTLM" }));

                HttpContext.Response.WriteAsync("Unauthorized Windows User");
                return null;
                //return Ok("Unauthorized Windows User");
            } else
            {
                return Ok("Congrats ! You just made a basic user call !" + userSid + "name: "+HttpContext.User.Identity.Name);
            }
  
         
        }

        //[Authorize("admin-only")]
        [HttpGet("secret")]
        public IActionResult Secret()
        {
            //var identity = ((ClaimsIdentity)HttpContext.User.Identity);
            //var name = identity.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
            //var email = identity.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name")?.Value;
            //return new OkObjectResult(new { name, email });
            var userSid = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.PrimarySid)?.Value;
            return Ok("Congrats ! You just made a basic user call !" + userSid);
        }


        [HttpGet("ldap")]
        public IActionResult CheckLdap()
        {
            string domain = "dc.fleet.zone";         /*"LDAP://LdapdomainNameOrIp.com" throws error*/
            int port = 389;
            string user = "artur.lipin@fleet.zone";
            string password = "itmaster345-";
            bool isValied = new LdapManager(domain, port).Validate(user, password);
            if(isValied)
            {
                return Ok("valid");
            } else
            {
                return Ok("not valid");
            }
        }

    }
}