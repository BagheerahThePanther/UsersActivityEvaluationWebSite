using System;

namespace UsersActivityEvaluationWebSite
{
    public class UserLifetime
    {

        public UserLifetime() { }
        public UserLifetime(int userID, int lifeTime) {
            UserID = userID;
            LifeTime = lifeTime;
        }

        public int UserID { get; set; }

        public int LifeTime { get; set; }
    }
}
