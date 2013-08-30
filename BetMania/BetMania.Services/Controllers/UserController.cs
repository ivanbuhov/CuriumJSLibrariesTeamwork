using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BetMania.Database;
using BetMania.Services.Models;
using System.Text;
using System.Web.Http.ValueProviders;
using BetMania.Services.CustomHeaderValueProviders;

namespace BetMania.Services.Controllers
{
    public class UserController : BaseApiController
    {
        // Constants
        private const int MinUsernameLength = 6;
        private const int MaxUsernameLength = 30;
        private const string ValidUsernameCharacters = "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890_.";
        private const string ValidNicknameCharacters = "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890_. -";
        private const string SessionKeyChars = "qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
        private const int SessionKeyLength = 50;
        private const int Sha1Length = 40;

        // Fields
        private BetManiaContext db;
        private readonly Random random;

        public UserController(BetManiaContext dbContext)
        {
            if (dbContext == null)
            {
                throw new ArgumentNullException("dbContext");
            }

            this.db = dbContext;
            this.random = new Random();
        }

        // POST api/user/register
        [HttpPost]
        [ActionName("register")]
        public HttpResponseMessage Register(RegisterUserDTO userModel)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() => {
                // Validation
                this.ValidateUsername(userModel.Username);
                this.ValidateNickname(userModel.Nickname);
                this.ValidateAuthCode(userModel.AuthCode);
                User duplicatedUser = this.db.Users.Where(u => (u.Username == userModel.Username || u.Nickname == userModel.Nickname)).FirstOrDefault();
                if (duplicatedUser != null)
                {
                    throw new InvalidOperationException("The user exists.");
                }
                // Adding to database
                User user = Convert(userModel);
                this.db.Users.Add(user);
                this.db.SaveChanges();
                user.SessionKey = this.GenerateSessionKey(user.Id);
                db.SaveChanges();
                // Return result
                LoggedUserDTO loggedUser = Convert(user);
                return Request.CreateResponse(HttpStatusCode.Created, loggedUser);
            });

            return response;
        }

        // POST api/user/login
        [HttpPost]
        [ActionName("login")]
        public HttpResponseMessage Login(RegisterUserDTO userModel)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                // Validate the model
                this.ValidateUsername(userModel.Username);
                this.ValidateAuthCode(userModel.AuthCode);
                User user = this.db.Users
                    .Where(u => u.Username == userModel.Username && u.AuthCode == userModel.AuthCode).FirstOrDefault();
                if (user == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Wrong username or password");
                }
                if (user.SessionKey == null)
                {
                    user.SessionKey = this.GenerateSessionKey(user.Id);
                    this.db.SaveChanges();
                }

                // Return result
                LoggedUserDTO loggedUser = Convert(user);
                return Request.CreateResponse(HttpStatusCode.OK, loggedUser);
            });

            return response;
        }

        // POST api/user/logout
        [HttpPut]
        [ActionName("logout")]
        public HttpResponseMessage Logout([ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                User user = this.db.Users.Where(u => u.SessionKey == sessionKey).FirstOrDefault();
                if (user != null)
                {
                    user.SessionKey = null;
                    this.db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "To logout first you have to be logged in.");
                }
            });

            return response;
        }

        // PUT api/user/addmoney
        [HttpPut]
        [ActionName("addmoney")]
        public HttpResponseMessage AddMoney( int amount, [ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                if (amount < 0)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Created, "You can't add a negative amount of money in the balance.");
                }
                User user = this.db.Users.Where(u => u.SessionKey == sessionKey).FirstOrDefault();
                if (user != null)
                {
                    user.Balance += amount;
                    this.db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.Created, user.Balance);
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "You are not logged in.");
                }
            });

            return response;
        }

        private void ValidateAuthCode(string authCode)
        {
            if (authCode == null || authCode.Length != UserController.Sha1Length)
            {
                throw new ArgumentException("The password should be encrypted.");
            }
        }

        private void ValidateNickname(string nickname)
        {
            if (nickname == null)
            {
                throw new ArgumentNullException("nickname");
            }
            if (nickname.Length < UserController.MinUsernameLength || nickname.Length > UserController.MaxUsernameLength)
            {
                throw new ArgumentOutOfRangeException(String.Format(
                    "The nickname must be between {0} and {1} characters long.", 
                    UserController.MinUsernameLength, 
                    UserController.MaxUsernameLength));
            }
            if (nickname.Any(ch => !UserController.ValidNicknameCharacters.Contains(ch)))
            {
                throw new ArgumentOutOfRangeException(
                    "Invalid character in the nickname.");
            }
        }

        private void ValidateUsername(string username)
        {
            if (username == null)
            {
                throw new ArgumentNullException("username");
            }
            if (username.Length < UserController.MinUsernameLength || username.Length > UserController.MaxUsernameLength)
            {
                throw new ArgumentOutOfRangeException(String.Format(
                    "The username must be between {0} and {1} characters long.",
                    UserController.MinUsernameLength,
                    UserController.MaxUsernameLength));
            }
            if (username.Any(ch => !UserController.ValidUsernameCharacters.Contains(ch)))
            {
                throw new ArgumentOutOfRangeException(
                    "Username must contain only Latin letters, digits .,_");
            }
        }

        private User Convert(RegisterUserDTO model)
        {
            return new User()
            {
                Id = 0,
                Username = model.Username,
                Nickname = model.Nickname,
                AuthCode = model.AuthCode,
                Avatar = null,
                Balance = 100,
                IsAdmin = false,
                SessionKey = null
            };
        }

        private LoggedUserDTO Convert(User model)
        {
            return new LoggedUserDTO()
            {
                Nickname = model.Nickname,
                SessionKey = model.SessionKey,
                Avatar = model.Avatar,
                Balance = model.Balance,
                IsAdmin = model.IsAdmin
            };
        }

        private string GenerateSessionKey(int userId)
        {
            StringBuilder skeyBuilder = new StringBuilder(SessionKeyLength);
            skeyBuilder.Append(userId);
            while (skeyBuilder.Length < SessionKeyLength)
            {
                var index = random.Next(SessionKeyChars.Length);
                skeyBuilder.Append(SessionKeyChars[index]);
            }
            return skeyBuilder.ToString();
        }
    }
}
