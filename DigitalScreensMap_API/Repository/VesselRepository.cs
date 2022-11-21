using DigitalScreensMap_API.Data;
using DigitalScreensMap_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public class VesselRepository : IVesselRepository
    {
        private readonly MonitorContex _db;

        public VesselRepository(MonitorContex db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Vessel>> GetAllVessels()
        {
            try
            {
                return await _db.Vessels.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ActionResult<Vessel>> GetVessel(long id)
        {
            return await _db.Vessels.FirstOrDefaultAsync(m => m.VesselId == id);
        }


        public async Task AddVessel(Vessel vessel)
        {
            await _db.Vessels.AddAsync(vessel);
            _db.SaveChanges();
        }


        public async Task UpdateVessel(Vessel item)
        {
            if (_db.Vessels.Any(x => x.VesselId == item.VesselId))
            {
                _db.Update(item);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<int> RemoveVessel(long? id)
        {
            int result = 0;
            if (_db != null)
            {
                var item = await _db.Vessels.FirstOrDefaultAsync(m => m.VesselId == id);
                if (item != null)
                {
                    _db.Vessels.Remove(item);
                    result = await _db.SaveChangesAsync();

                }
                return result;
            }
            return result;
        }
    }
}
