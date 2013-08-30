using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BetMania.Database
{
    public class BetType
    {
        public BetType()
        {
            this.Bets = new HashSet<Bet>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<Bet> Bets { get; set; }
    }
}
