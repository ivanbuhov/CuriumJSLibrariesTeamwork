using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BetMania.Database
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Nickname { get; set; }
        public string AuthCode { get; set; }
        public string Avatar { get; set; }
        public decimal Balance { get; set; }
        public string SessionKey { get; set; }
        public bool IsAdmin { get; set; }
    }
}
