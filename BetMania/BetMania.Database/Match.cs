using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BetMania.Database
{
    public class Match
    {
        public Match()
        {
            this.Bets = new HashSet<Bet>();
        }

        public int Id { get; set; }
        public string Home { get; set; }
        public string Away { get; set; }
        public double HomeCoefficient { get; set; }
        public double DrawCoefficient { get; set; }
        public double AwayCoefficient { get; set; }
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
        public DateTime StartTime { get; set; }
        public bool IsFinished { get; set; }

        // Navigation Properties
        public int CategoryId { get; set; }
        public virtual MatchCategory Category { get; set; }
        public virtual ICollection<Bet> Bets { get; set; }
    }
}
