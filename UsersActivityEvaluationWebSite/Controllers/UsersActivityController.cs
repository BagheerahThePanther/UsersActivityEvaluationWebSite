using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

using UsersActivityEvaluationWebSite.Services;

namespace UsersActivityEvaluationWebSite.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersActivityController : ControllerBase
    {
        private ActivityEvaluationService ActivityEvaluationService { get; }

        public UsersActivityController(ActivityEvaluationService activityEvaluationService)
        {
            ActivityEvaluationService = activityEvaluationService;
        }

        [HttpGet("/rolling_retention/{day}")]
        public ActionResult<string> GetRollingRetention(int day)
        {
            return JsonSerializer.Serialize(ActivityEvaluationService.GetRollingRetention(day));
        }

        [HttpGet("/lifetime_histogram")]
        public ActionResult<string> GetLifetimeHistogram(int day)
        {
            return JsonSerializer.Serialize(ActivityEvaluationService.GetHistogram());
        }

    }
}
