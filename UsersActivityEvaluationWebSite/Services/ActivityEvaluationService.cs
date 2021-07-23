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
            using (UsersActivityContext context = new UsersActivityContext())
            {
                if ((context.Users != null) && (context.Users.Count() > 0)) {
                    List<Models.User> users = context.Users.Where(user => (DateTime.Now - user.DateRegistration).TotalDays >= Convert.ToDouble(days)).ToList();

                    int usersInstalled = users.Count;
                    int usersRetained = users.Where(user => (user.DateLastActivity - user.DateRegistration).TotalDays >= Convert.ToDouble(days)).ToList().Count;
                    return 100 * (Convert.ToDouble(usersRetained) / Convert.ToDouble(usersInstalled));
                }
                else return 0;
            }
        }

        public int[] GetHistogram()
        {
            using (UsersActivityContext context = new UsersActivityContext())
            {
                List<Models.User> users = context.Users.ToList();
                int[] lifetimeToNumberOfUsers = new int[Convert.ToUInt32(Math.Ceiling(users.Max(user => (user.DateLastActivity - user.DateRegistration).TotalDays))) + 1];
                Array.Clear(lifetimeToNumberOfUsers, 0, lifetimeToNumberOfUsers.Length);
                foreach(var user in users)
                {
                    lifetimeToNumberOfUsers[Convert.ToUInt32(Math.Ceiling((user.DateLastActivity - user.DateRegistration).TotalDays))]++;
                }
                return lifetimeToNumberOfUsers;
            }
        }


    }
}
