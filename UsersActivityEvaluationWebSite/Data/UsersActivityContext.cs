using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using UsersActivityEvaluationWebSite.Models;

namespace UsersActivityEvaluationWebSite.Data
{
    public class UsersActivityContext : DbContext
    {
       /* public UsersActivityContext(DbContextOptions<UsersActivityContext> options) : base(options)
        {
        }*/

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Database=users_activity_evaluation;Username=web_app;Password=web_app_pass");
        }
    }
}
