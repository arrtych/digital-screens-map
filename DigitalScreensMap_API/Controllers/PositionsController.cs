using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalScreensMap_API.Models;
using DigitalScreensMap_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DigitalScreensMap_API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class PositionsController : Controller
    {
        private IPositionRepository _positions;

        public PositionsController(IPositionRepository positions)
        {
            _positions = positions;
        }


        /// <summary>
        /// Get all Positions of all Monitors.
        /// </summary>
        [HttpGet()]
        [Route("All")]
        public async Task<IEnumerable<Position>> Get()
        {
            return await _positions.GetAllPositions();
        }


        /// <summary>
        /// Get all Positions from Monitor by Monitor Id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet()]
        [Route("All/monitor/{id}")]
        public async Task<IEnumerable<Position>> GetPositionsByMonitor(long id)
        {
            return await _positions.GetPositionsByMonitor(id);
        }


        /// <summary>
        /// Create a Position.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/positions/add
        ///    {
        ///
        ///        "x1": 585,
        ///        "x2": 585,
        ///        "y1": 546,
        ///        "y2": 586,
        ///        "monitorId": 6,
        ///        "monitor": null
        ///    }
        ///
        /// </remarks>
        /// <param name="position"></param>
        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> Post([FromBody]Position position)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
            await _positions.AddPosition(position);
            return Ok(position);
        }


        /// <summary>
        /// Update specific Position by Position Id.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/positions/update/{positionId}
        ///    {
        ///        "positionId": 3,
        ///        "x1": 584,
        ///        "x2": 584,
        ///        "y1": 228,
        ///        "y2": 323,
        ///        "monitorId": 5,
        ///        "monitor": null
        ///    }
        ///
        /// </remarks>
        /// <param name="id"></param>
        /// <param name="position"></param>
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Put(long id, [FromBody]Position position)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _positions.UpdatePosition(position);
                return Ok(new { status = true, message = "Position updated Successfully" });
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }

        }


        /// <summary>
        /// Delete a specific Position by Monitor Id.
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
                result = await _positions.RemovePosition(id);
                if (result == 0)
                {
                    return NotFound();
                }
                return Ok(new { status = true, message = "Positions of monitor with id:"+ id +" was deleted successfully" });
            }
            catch (Exception)
            {

                return BadRequest();
            }
        }






    }
}