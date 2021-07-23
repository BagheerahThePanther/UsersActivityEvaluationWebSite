using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace UsersActivityEvaluationWebSite.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        [Timestamp]
        public DateTime DateRegistration { get; set; }

        [Required]
        [Timestamp]
        public DateTime DateLastActivity { get; set; }

        public override string ToString() => JsonSerializer.Serialize<User>(this);

    }
}
