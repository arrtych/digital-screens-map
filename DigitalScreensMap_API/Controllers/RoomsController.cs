using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalScreensMap_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DigitalScreensMap_API.Models;
using System.IO;

namespace DigitalScreensMap_API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class RoomsController : Controller
    {
        private IRoomRepository _rooms;

        public RoomsController(IRoomRepository roomRepository)
        {
            _rooms = roomRepository;
        }


        /// <summary>
        /// Get all Rooms.
        /// </summary>
        [HttpGet()]
        [Route("All")]
        public async Task<IEnumerable<Room>> Get()
        {
            return await _rooms.GetAllRooms();
        }


        /// <summary>
        /// Get specific Room by Room Id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> Get(long id)
        {
            return await _rooms.GetRoom(id);
        }


        /// <summary>
        /// Create a Room.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/rooms/add
        ///{
        ///
        ///    "name": "Bussiness lounge",
        ///    "vesselId": 1,
        ///    "vessel": null,
        ///    "monitor": null,
        ///    "image": null
        ///}
        ///
        /// </remarks>
        /// <param name="room"></param>
        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> Post([FromBody]Room room)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
            await _rooms.AddRoom(room);
            return Ok(room);
        }


        /// <summary>
        /// Update specific Room by Room Id.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/rooms/update/{roomId}
        ///    {
        ///        "roomId": 3,
        ///        "name": "Superstore3",
        ///        "vesselId": 1,
        ///        "vessel": null,
        ///        "monitor": null,
        ///        "image": null
        ///    }
        ///
        /// </remarks>
        /// <param name="id"></param> 
        /// <param name="room"></param> 
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Put(long id, [FromBody]Room room)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _rooms.UpdateRoom(room);
                return Ok(new { status = true, message = "Room updated Successfully" });
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }

        }


        /// <summary>
        /// Delete a specific Room by Room Id.
        /// </summary>
        /// <param name="id"></param>
        [HttpPost]
        [Route("Remove")]
        public async Task<IActionResult> Delete(long? id)
        {
            int result = 0;
            if (id == null)
            {
                return BadRequest();
            }
            try
            {
                result = await _rooms.RemoveRoom(id);
                if (result == 0)
                {
                    return NotFound();
                }
                return Ok(new { status = true, message = "Room deleted Successfully" });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }


    }
}