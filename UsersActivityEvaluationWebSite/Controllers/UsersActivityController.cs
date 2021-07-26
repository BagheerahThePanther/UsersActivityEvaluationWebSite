using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

using UsersActivityEvaluationWebSite.Services;
using Microsoft.AspNetCore.Http;
using UsersActivityEvaluationWebSite.Models;
using UsersActivityEvaluationWebSite.Data;

namespace UsersActivityEvaluationWebSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            return JsonConvert.SerializeObject(ActivityEvaluationService.GetRollingRetention(day));
        }

        [HttpGet("/lifetime_histogram")]
        public ActionResult<string> GetLifetimeHistogram(int day)
        {
            return JsonConvert.SerializeObject(ActivityEvaluationService.GetHistogram());
        }

        [HttpGet("/users_table")]
        public ActionResult<string> GetUsersTable()
        {
            using UsersActivityContext context = new UsersActivityContext();
            List<User> rows = context.Users.ToList();
            return Ok(JsonConvert.SerializeObject(rows.Select(row => new UsersTable(row.UserID, row.DateRegistration, row.DateLastActivity))));
        }

        [HttpPost("/users_table")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateUsersTable([FromBody] object usersJson)
        {
            try
            {
                string json = usersJson.ToString();
                User[] users = JsonConvert.DeserializeObject<User[]>(json);
                using UsersActivityContext context = new UsersActivityContext();
                context.Users.RemoveRange(context.Users);
                context.Users.AddRange(users);
                context.SaveChanges();
                return Ok(context.Users.Count());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

    }
}
