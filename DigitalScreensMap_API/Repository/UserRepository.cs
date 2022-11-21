using DigitalScreensMap_API.Data;
using DigitalScreensMap_API.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppSettings _appSettings;
        private readonly MonitorContex _db;

        public UserRepository(MonitorContex db, IOptions<AppSettings> appSettings)
        {
            _db = db;
            _appSettings = appSettings.Value;
        }
        //public UserRepository(IOptions<AppSettings> appSettings)
        //{
        //    _appSettings = appSettings.Value;
        //}

        //private List<User> users = new List<User>()
        //{
        //    new User{Id =1, FirstName="Admin",LastName = "Adminov", Username="admin", Password="test12345" }
        //};
        public User Authenticate(string userName, string password)
        {    
            var user = _db.Users.SingleOrDefault(x => x.Username == userName && x.Password ==password);
            if (user == null) return null;


            //If user is found
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role , "Admin"),
                    new Claim(ClaimTypes.Version, "v1")
                }),
                Expires = DateTime.UtcNow.AddDays(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);
            user.Password = null;
            return user;

        }

    }
}
