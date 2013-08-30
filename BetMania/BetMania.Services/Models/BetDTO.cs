using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BetMania.Services.Models
{
    public class BetDTO
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public MatchDTO Match { get; set; }
        public string BetType { get; set; }
    }
}