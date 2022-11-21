using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalScreensMap_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DigitalScreensMap_API.Models;
using System.IO;
using DigitalScreensMap_API.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace DigitalScreensMap_API.Controllers
{
    //[Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class MonitorsController : Controller
    {
        private IMonitorRepository _monitors;

        public MonitorsController(IMonitorRepository monitorRepository)
        {
            _monitors = monitorRepository;
        }




        /// <summary>
        /// Get all Monitors.
        /// </summary>
        /// 
        [HttpGet()]
        [Route("All")]
        public async Task<IEnumerable<Monitor>> Get()
        {
            return await _monitors.GetAllMonitors();
        }

        /// <summary>
        /// Get all Monitors from Room by Room Id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet()]
        [Route("All/room/{id}")]
        public async Task<IEnumerable<Monitor>> GetMonitorsByRoom(long id)
        {
            return await _monitors.GetMonitorsByRoom(id);
        }

        /// <summary>
        /// Get specific Monitor by Monitor Code.
        /// </summary>
        /// <param name="code"></param>
        [HttpGet("{code}")]
        public async Task<ActionResult<Monitor>> Get(string code)
        {
            if( code != null)
            {
             
                return Ok(await _monitors.GetMonitor(code));
            } else
            {
                return NotFound(new NotFoundError());
            }
            

        }


        /// <summary>
        /// Create a Monitor.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/monitors/add
        ///    {
        ///
        ///        "code": "Ga03",
        ///        "name": "Serenade Ga03",
        ///        "roomId": 2,
        ///        "room": null,
        ///        "vesselId": 2,
        ///        "vessel": null,
        ///        "ipAddress": "10.116.26.44",
        ///        "macAaddress": "222",
        ///        "info": "222"
        ///    }
        ///
        /// </remarks>
        /// <param name="monitor"></param>
        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> Post ([FromBody]Monitor monitor)
        {         
            if(ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
            await _monitors.AddMonitor(monitor);
            return Ok(monitor);
        }


        /// <summary>
        /// Update specific Monitor by Monitor Code.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/monitors/update/{code}
        ///    {
        ///        "monitorId": 5,
        ///        "code": "Ga01",
        ///        "name": "Serenade Ga01",
        ///        "roomId": 1,
        ///        "room": null,
        ///        "vesselId": 1,
        ///        "vessel": null,
        ///        "ipAddress": "10.116.26.44",
        ///        "macAddress": "F4 4D 30 63 F6 6F",
        ///        "info": "just 222"
        ///    }
        ///
        /// </remarks>
        /// <param name="code"></param>
        /// <param name="monitor"></param>
        [HttpPut("Update/{code}")]
        public async Task<IActionResult> Put (string code, [FromBody]Monitor monitor)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            if (code != monitor.Code)
            {
                return BadRequest();
            }
            try
            {
               await  _monitors.UpdateMonitor(monitor);
                return Ok(new { status = true, message = "Monitor updated Successfully" });
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }

        }


        /// <summary>
        /// Delete a specific Monitor by Monitor Code.
        /// </summary>
        /// <param name="code"></param>
        [HttpPost]
        [Route("Remove")]
        public async Task<IActionResult> Delete (string? code)
        {

            int result = 0;

            if (code == null)
            {
                return BadRequest();
            }

            try
            {
                result = await _monitors.RemoveMonitor(code);
                if (result == 0)
                {
                    return NotFound();
                }
                return Ok(new { status = true, message = "Monitor deleted Successfully" });
            }
            catch (Exception)
            {

                return BadRequest();
            }
        }




      



    }
}