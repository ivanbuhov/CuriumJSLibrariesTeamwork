using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BetMania.Database
{
    public class MatchCategory
    {
        public MatchCategory()
        {
            this.Matches = new HashSet<Match>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        // Navigation properties
        public virtual ICollection<Match> Matches { get; set; }
    }
}
