using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace BetMania.Database
{
    public class BetManiaContext : DbContext
    {
        public BetManiaContext()
            : base("name=BetManiaDb") { }

        public DbSet<User> Users { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Bet> Bets { get; set; }
        public DbSet<MatchCategory> MatchCategories { get; set; }
        public DbSet<BetType> BetTypes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Users
            modelBuilder.Entity<User>().Property(u => u.Username).IsRequired();
            modelBuilder.Entity<User>().Property(u => u.AuthCode).IsRequired().IsFixedLength().HasMaxLength(40);
            modelBuilder.Entity<User>().Property(u => u.SessionKey).IsFixedLength().HasMaxLength(50);

            // Matches
            modelBuilder.Entity<Match>().Property(m => m.Home).IsRequired();
            modelBuilder.Entity<Match>().Property(m => m.Away).IsRequired();

            // Match Categories
            modelBuilder.Entity<MatchCategory>().Property(mc => mc.Name).IsRequired();

            // Bet Types
            modelBuilder.Entity<BetType>().Property(bt => bt.Name).IsRequired();
        }
    }
}
