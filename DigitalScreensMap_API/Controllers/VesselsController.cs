using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalScreensMap_API.Models;
using DigitalScreensMap_API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace DigitalScreensMap_API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class VesselsController : Controller
    {
        private IVesselRepository _vessels;

        public VesselsController(IVesselRepository vessels)
        {
            _vessels = vessels;
        }

        /// <summary>
        /// Get all Vessels.
        /// </summary>
        [HttpGet()]
        [Route("All")]
        public async Task<IEnumerable<Vessel>> Get()
        {
            return await _vessels.GetAllVessels();
        }


        /// <summary>
        /// Get Vessel by Vessel Id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet("{id}")]
        public async Task<ActionResult<Vessel>> Get(long id)
        {
            return await _vessels.GetVessel(id);
        }


        /// <summary>
        /// Create a Vessel.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST api/vessels/add
        ///    {
        ///
        ///        "name": "Megastar"
        ///    }
        ///
        /// </remarks>
        /// <param name="vessel"></param>
        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> Post([FromBody]Vessel vessel)
        {
            if (ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
            await _vessels.AddVessel(vessel);
            return Ok(vessel);
        }


        /// <summary>
        /// Update specific Vessel by Vessel Id.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/vessels/update/{vesselId}
        ///    {
        ///        "vesselId": 1,
        ///        "name": "Megastar1",
        ///        "rooms": null,
        ///        "monitors": null
        ///    }
        ///
        /// </remarks>
        /// <param name="id"></param>
        /// <param name="vessel"></param>
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Put(long id, [FromBody]Vessel vessel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                await _vessels.UpdateVessel(vessel);
                return Ok(new { status = true, message = "Vessel updated Successfully" });
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }

        }


        /// <summary>
        /// Delete specific Vessel by Vessel Id.
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
                result = await _vessels.RemoveVessel(id);
                if (result == 0)
                {
                    return NotFound();
                }
                return Ok(new { status = true, message = "Vessel deleted Successfully" });
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}