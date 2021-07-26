using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UsersActivityEvaluationWebSite
{
    public class UsersTable
    {
        public UsersTable() { }
        public UsersTable(int userID, DateTime dateReg, DateTime dateLastAct)
        {
            UserID = userID;
            DateRegistration = dateReg.ToString("dd.MM.yyyy");
            DateLastActivity = dateLastAct.ToString("dd.MM.yyyy");
        }
        public int UserID { get; set; }

        public string DateRegistration { get; set; }

        public string DateLastActivity { get; set; }
    }
}
