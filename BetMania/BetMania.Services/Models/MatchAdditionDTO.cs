﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BetMania.Services.Helpers;

namespace BetMania.Services.Models
{
    public class MatchAdditionDTO
    {
        public string Home { get; set; }
        public string Away { get; set; }
        public double HomeCoefficient { get; set; }
        public double DrawCoefficient { get; set; }
        public double AwayCoefficient { get; set; }
        public int HomeScore { get; set; }
        public int AwayScore { get; set; }
        public int CategoryId { get; set; }
        public DateTime StartTime { get; set; }
        public MatchStatusQuery Status { get; set; }
    }
}