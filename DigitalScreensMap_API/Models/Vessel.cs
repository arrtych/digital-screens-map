using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Models
{
    public class Vessel
    {
   
        public long? VesselId { get; set; }

        [Required]
        public string Name { get; set; }


        //public long MonitorId { get; set; }
        //public Monitor Monitor { get; set; }



        public ICollection<Room> Rooms { get; set; }
        public ICollection<Monitor> Monitors { get; set; }


    }
}
