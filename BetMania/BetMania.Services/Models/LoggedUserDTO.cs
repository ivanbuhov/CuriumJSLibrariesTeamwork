using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BetMania.Services.Models
{
    
    public class LoggedUserDTO
    {
        public string Nickname { get; set; }
        public string SessionKey { get; set; }
        public decimal Balance { get; set; }
        public string Avatar { get; set; }
        public bool IsAdmin { get; set; }
    }
}