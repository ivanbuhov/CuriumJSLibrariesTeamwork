using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BetMania.Services.Models
{
    public class RegisterUserDTO
    {
        public string Username { get; set; }
        public string Nickname { get; set; }
        public string AuthCode { get; set; }
    }
}