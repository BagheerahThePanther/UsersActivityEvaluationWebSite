using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

using UsersActivityEvaluationWebSite.Data;

namespace UsersActivityEvaluationWebSite.Services
{
    public class ActivityEvaluationService
    {
        public ActivityEvaluationService(IWebHostEnvironment webHostEnvironment)
        {
            WebHostEnvironment = webHostEnvironment; 
        }

        public IWebHostEnvironment WebHostEnvironment { get; }

        public double GetRollingRetention(int days)
        {
            using UsersActivityContext context = new UsersActivityContext();
            if ((context.Users != null) && (context.Users.Count() > 0))
            {
                List<Models.User> users = context.Users.Where(user => (DateTime.Now - user.DateRegistration).TotalDays >= Convert.ToDouble(days)).ToList();

                int usersInstalled = users.Count;
                int usersRetained = users.Where(user => (user.DateLastActivity - user.DateRegistration).TotalDays >= Convert.ToDouble(days)).ToList().Count;
                return 100 * (Convert.ToDouble(usersRetained) / Convert.ToDouble(usersInstalled));
            }
            else return 0;
        }

        public List<UserLifetime> GetHistogram()
        {
            using UsersActivityContext context = new UsersActivityContext();
            List<Models.User> users = context.Users.ToList();
            List<UserLifetime> usersLifetime = new List<UserLifetime>();
            foreach(var user in users)
            {
                usersLifetime.Add(new UserLifetime(user.UserID, Convert.ToInt32(Math.Round((user.DateLastActivity - user.DateRegistration).TotalDays))));
            }
            return usersLifetime;
        }
    }
}
