using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BetMania.Database
{
    public class Bet
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }

        // Navigation properties
        public int MatchId { get; set; }
        public virtual Match Match { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public int BetTypeId { get; set; }
        public virtual BetType BetType { get; set; }
    }
}
