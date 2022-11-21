using DigitalScreensMap_API.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public interface IVesselRepository
    {
        Task<IEnumerable<Vessel>> GetAllVessels();
        Task<ActionResult<Vessel>> GetVessel(long id);

        Task AddVessel(Vessel vessel);


        Task<int> RemoveVessel(long? id);

        Task UpdateVessel(Vessel vessel);
    }
}
