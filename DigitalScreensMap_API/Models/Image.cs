using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Models
{
    public class Image
    {

        public long ImageId { get; set; }
        public string ImageTitle { get; set; }

        [JsonConverter(typeof(Base64FileJsonConverter))]
        public byte[] ImageData { get; set; }

        public long RoomId { get; set; }
        public Room Room { get; set; }
    }
}
