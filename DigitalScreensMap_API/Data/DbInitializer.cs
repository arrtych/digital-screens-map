using DigitalScreensMap_API.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Data
{
    public class DbInitializer
    {

        public static void Initialize(IApplicationBuilder applicationBuilder)
        {
            /*
            MonitorContex context = applicationBuilder.ApplicationServices.GetRequiredService<MonitorContex>();
            context.Database.EnsureCreated();
            if (!context.Vessels.Any())
            {
             
            }

            var Vessels = new Vessel[]
            {
                new Vessel
                {
                    Name = "Megastar"
                }
            };

            var Rooms = new Room[]
            {
                new Room
                {
                    Id= 1,
                    Name = "Bussiness lounge"
                },
                new Room
                {
                    Id=2,
                    Name = "Superstore",
                    ImageSource =  "images/seapub.PNG"
                }
            };

            var Monitors = new Monitor[]
            {
                new Monitor
                {
                    Id= 1,
                    Code = "BL035",
                    Name = "DS Megastar BL035",
                   IP_address = "10.116.26.44"
                }
            };

            foreach(Vessel v in Vessels)
            {
                context.Vessels.Add(v);
            }
            foreach (Room r in Rooms)
            {
                context.Rooms.Add(r);
            }
            foreach (Monitor m in Monitors)
            {
                context.Monitors.Add(m);
            }
            context.SaveChanges();

    */
        }
        
    }
}
