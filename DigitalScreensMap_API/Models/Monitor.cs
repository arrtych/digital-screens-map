
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Models
{
    public class Monitor
    {

        public long MonitorId { get; set; }

        [Required]
        public string Code { get; set; }

        public string Name { get; set; }


        public long? RoomId { get; set; }
        public Room Room { get; set; }


        public long? VesselId { get; set; }
        public Vessel Vessel { get; set; }


        public string IpAddress { get; set; }

        public string MacAddress { get; set; }

        public string Info { get; set; }


        public Position Position { get; set; }

    }
}
