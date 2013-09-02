using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BetMania.Database;
using BetMania.Services.Models;
using BetMania.Services.Helpers;
using System.Web.Http.ValueProviders;
using BetMania.Services.CustomHeaderValueProviders;


namespace BetMania.Services.Controllers
{
    public class MatchesController : BaseApiController
    {
        private const int MinutesBeforeTheMatchBetsToBeClosed = 15;

        private BetManiaContext db;

        public MatchesController(BetManiaContext db)
        {
            if (db == null)
            {
                throw new ArgumentNullException("db");
            }
            this.db = db;
        }

        // GET api/matches?category=catName&status=1&my=true
        public HttpResponseMessage GetMatches([ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey,
           string category = null, MatchStatusQuery status = MatchStatusQuery.All, bool my = false,
            int skip = 0, int take = 10)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                IQueryable<Match> matchesCollection = this.db.Matches;
                if (my)
                {
                    User user = this.db.Users.Where(u => u.SessionKey == sessionKey).FirstOrDefault();
                    if (user != null)
                    {
                        matchesCollection = matchesCollection.Where(m => m.Bets.Any(b => b.UserId == user.Id));
                    }
                    else
                    {
                        return Request.CreateErrorResponse(HttpStatusCode.NotFound, "You have to be logged in to see your matches");
                    }
                }

                IQueryable<MatchDTO> result = this.ConvertToMatchDTOs(matchesCollection);
                if (category != null)
                {
                    result = result.Where(m => m.Category == category);
                }
                if (status != MatchStatusQuery.All)
                {
                    result = result.Where(m => m.Status == status);
                }

                result = result.OrderByDescending(m => m.StartTime).Skip(skip).Take(take);

                return Request.CreateResponse(HttpStatusCode.OK, result);
            });

            return response;
        }

        // GET api/matches/{id}
        public HttpResponseMessage GetMatch(int id, [ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey = null)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                Match dbModel = this.db.Matches.Find(id);
                if (dbModel == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No match found.");
                }

                HttpResponseMessage message;
                if (sessionKey != null)
                {
                    User user = this.db.Users.Where(u => u.SessionKey == sessionKey).FirstOrDefault();
                    if (user != null)
                    {
                        MatchWithBetsDTO match = this.ConvertToMatchWithBetsDTO(dbModel, user.Id);
                        message = Request.CreateResponse(HttpStatusCode.OK, match);
                        return message;
                    }
                }

                // else
                MatchDTO matchWithoutBets = this.ConvertToMatchDTO(dbModel);
                message = Request.CreateResponse(HttpStatusCode.OK, matchWithoutBets);
                return message;
            });

            return response;
        }

        // POST api/matches/bet/{id}
        [HttpPost]
        [ActionName("bet")]
        public HttpResponseMessage PostBet(int matchId, BetAdditionDTO bet,
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                if (bet.Amount <= 0)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You can make only bets with possitive amount of money.");
                }

                User user = this.db.Users.Where(u => u.SessionKey == sessionKey).FirstOrDefault();
                if (user == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "You have to be logged in to make bets.");
                }
                if (user.Balance - bet.Amount < 0)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "You have no enough money to make the bet.");
                }

                Match match = this.db.Matches.Find(matchId);
                if (match == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "The match doesn't exists.");
                }
                if (match.IsFinished || match.StartTime < DateTime.Now.AddMinutes(MinutesBeforeTheMatchBetsToBeClosed))
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, String.Format(
                        "Sorry! You can bet on matches earlier than {0} minutes before the start of the game.",
                        MinutesBeforeTheMatchBetsToBeClosed));
                }

                BetType betType = db.BetTypes.Where(bt => bt.Name == bet.BetType).FirstOrDefault();
                if (betType == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Invalid bet type.");
                }

                user.Balance -= bet.Amount;
                Bet dbModel = this.ConvertToBet(bet, user, match, betType);
                this.db.Bets.Add(dbModel);
                this.db.Entry<User>(user).State = System.Data.EntityState.Modified;
                this.db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.Created, this.ConvertToBetDTO(dbModel));
            });

            return response;
        }

        // POST api/matches
        public HttpResponseMessage PostMatch([ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey,
            MatchAdditionDTO match)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                User user = this.db.Users.Where(u => u.SessionKey == sessionKey).FirstOrDefault();
                if (user == null || user.IsAdmin == false)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "You have to be administrator to add a new match.");
                }

                Match dbModel = this.ConvertToMatch(match);
                this.db.Matches.Add(dbModel);
                this.db.SaveChanges();

                HttpResponseMessage message = Request.CreateResponse(HttpStatusCode.Created, match);
                message.Headers.Location = new Uri(Url.Link("DefaultApi", new { controller = "Match", id = dbModel.Id }));
                return message;
            });

            return response;
        }

        // PUT api/matches/{id}
        public HttpResponseMessage PutMatch(int id, MatchAdditionDTO match, 
            [ValueProvider(typeof(HeaderValueProviderFactory<string>))] string sessionKey)
        {
            HttpResponseMessage response = this.ProcessOperation<HttpResponseMessage>(() =>
            {
                User user = this.db.Users.Where(u => u.SessionKey == sessionKey).FirstOrDefault();
                if (user == null || user.IsAdmin == false)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "You have to be administrator to  edit match.");
                }

                Match originalMatch = this.db.Matches.Include("Bets").Include("Bets.BetType").Include("Bets.User").Where(m => m.Id == id).FirstOrDefault();
                if (originalMatch == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "No match found.");
                }

                Match updatedMatch = this.ConvertToMatch(match);
                bool haveToCalculateBets = (originalMatch.IsFinished == false && updatedMatch.IsFinished == true);
                this.Update(originalMatch, updatedMatch);
                this.db.SaveChanges();

                if (haveToCalculateBets)
                {
                    if (originalMatch.HomeScore > originalMatch.AwayScore)
                    {
                        foreach (Bet bet in originalMatch.Bets)
                        {
                            if (bet.BetType.Name.ToLower() == "home")
                            {
                                bet.User.Balance += (decimal)originalMatch.HomeCoefficient * bet.Amount;
                            }
                        }
                    }
                    else if (originalMatch.HomeScore < originalMatch.AwayScore)
                    {
                        foreach (Bet bet in originalMatch.Bets)
                        {
                            if (bet.BetType.Name.ToLower() == "away")
                            {
                                bet.User.Balance += (decimal)originalMatch.AwayScore * bet.Amount;
                            }
                        }
                    }
                    else
                    {
                        foreach (Bet bet in originalMatch.Bets)
                        {
                            if (bet.BetType.Name.ToLower() == "draw")
                            {
                                bet.User.Balance += (decimal)originalMatch.DrawCoefficient * bet.Amount;
                            }
                        }
                    }

                    this.db.SaveChanges();
                }

                HttpResponseMessage message = Request.CreateResponse(HttpStatusCode.OK, this.ConvertToMatchDTO(originalMatch));
                return message;
            });

            return response;
        }

        private void Update(Match originalMatch, Match updatedMatch)
        {
            originalMatch.Home = updatedMatch.Home;
            originalMatch.Away = updatedMatch.Away;
            originalMatch.HomeScore = updatedMatch.HomeScore;
            originalMatch.AwayScore = updatedMatch.AwayScore;
            originalMatch.HomeCoefficient = updatedMatch.HomeCoefficient;
            originalMatch.AwayCoefficient = updatedMatch.AwayCoefficient;
            originalMatch.DrawCoefficient = updatedMatch.DrawCoefficient;
            originalMatch.StartTime = updatedMatch.StartTime;
            originalMatch.IsFinished = updatedMatch.IsFinished;
        }

        private IQueryable<MatchDTO> ConvertToMatchDTOs(IQueryable<Match> matches)
        {
            return matches.Select(match => new MatchDTO()
            {
                Id = match.Id,
                Home = match.Home,
                Away = match.Away,
                HomeCoefficient = match.HomeCoefficient,
                DrawCoefficient = match.DrawCoefficient,
                AwayCoefficient = match.AwayCoefficient,
                HomeScore = match.HomeScore,
                AwayScore = match.AwayScore,
                Category = match.Category.Name,
                StartTime = match.StartTime,
                Status = (match.IsFinished) ? MatchStatusQuery.Finished :
                ((DateTime.Now > match.StartTime) ? MatchStatusQuery.InProgress : MatchStatusQuery.Upcoming)
            });
        }

        private MatchDTO ConvertToMatchDTO(Match match)
        {
            return new MatchDTO()
            {
                Id = match.Id,
                Home = match.Home,
                Away = match.Away,
                HomeCoefficient = match.HomeCoefficient,
                DrawCoefficient = match.DrawCoefficient,
                AwayCoefficient = match.AwayCoefficient,
                HomeScore = match.HomeScore,
                AwayScore = match.AwayScore,
                Category = match.Category.Name,
                StartTime = match.StartTime,
                Status = (match.IsFinished) ? MatchStatusQuery.Finished :
                ((DateTime.Now > match.StartTime) ? MatchStatusQuery.InProgress : MatchStatusQuery.Upcoming)
            };
        }

        private MatchWithBetsDTO ConvertToMatchWithBetsDTO(Match match, int userId)
        {
            return new MatchWithBetsDTO()
            {
                Id = match.Id,
                Home = match.Home,
                Away = match.Away,
                HomeCoefficient = match.HomeCoefficient,
                DrawCoefficient = match.DrawCoefficient,
                AwayCoefficient = match.AwayCoefficient,
                HomeScore = match.HomeScore,
                AwayScore = match.AwayScore,
                Category = match.Category.Name,
                StartTime = match.StartTime,
                Status = (match.IsFinished) ? MatchStatusQuery.Finished :
                ((DateTime.Now > match.StartTime) ? MatchStatusQuery.InProgress : MatchStatusQuery.Upcoming),
                Bets = match.Bets.Where(b => b.UserId == userId).Select(b => new BetDTO
                {
                    Id = b.Id,
                    Amount = b.Amount,
                    BetType = b.BetType.Name
                })
            };
        }

        private Match ConvertToMatch(MatchAdditionDTO match)
        {
            return new Match()
            {
                Id = 0,
                Home = match.Home,
                Away = match.Away,
                HomeCoefficient = match.HomeCoefficient,
                DrawCoefficient = match.DrawCoefficient,
                AwayCoefficient = match.AwayCoefficient,
                HomeScore = match.HomeScore,
                AwayScore = match.AwayScore,
                StartTime = match.StartTime,
                CategoryId = match.CategoryId,
                IsFinished = (match.Status == MatchStatusQuery.Finished) ? true : false
            };
        }

        private BetDTO ConvertToBetDTO(Bet bet)
        {
            return new BetDTO()
            {
                Id = bet.Id,
                Amount = bet.Amount,
                BetType = bet.BetType.Name,
                Match = this.ConvertToMatchDTO(bet.Match),
            };
        }

        private Bet ConvertToBet(BetAdditionDTO bet, User user, Match match, BetType betType)
        {
            return new Bet()
            {
                Id = 0,
                Amount = bet.Amount,
                User = user,
                Match = match,
                BetType = betType
            };
        }
    }
}
