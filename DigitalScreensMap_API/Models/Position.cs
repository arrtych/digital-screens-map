using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Models
{
    public class Position
    {
        //[ForeignKey("Monitor")]
        public long PositionId { get; set; }

        public int x1 { get; set; }

        public int x2 { get; set; }
        public int y1 { get; set; }

        public int y2 { get; set; }

        public long MonitorId { get; set; }
        public Monitor Monitor { get; set; }
    }
}
