
using Microsoft.Extensions.Options;
using DigitalScreensMap_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DigitalScreensMap_API.Data
{
    public class MonitorContex : DbContext
    {

       
        public MonitorContex(DbContextOptions<MonitorContex> options) : base(options)
        {
          
        }
        public DbSet<Monitor> Monitors { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<Vessel> Vessels { get; set; }

        public DbSet<Position> Positions { get; set; }

        public DbSet<Image> Images { get; set; }

        public DbSet<User> Users { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
          
        }

    }
}
