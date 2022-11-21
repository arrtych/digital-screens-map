using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Models
{
    public class Room
    {
        //[Key]
        public long RoomId { get; set; }
        public string Name { get; set; }

        //public string ImageSource { get; set; }

        public long? VesselId { get; set; }
        public Vessel Vessel { get; set; }

        public ICollection<Monitor> Monitor { get; set; }

        public Image Image { get; set; }

    }
}
