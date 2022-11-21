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
    public class PositionRepository : IPositionRepository
    {

        private readonly MonitorContex _db;

        public PositionRepository(MonitorContex db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Position>> GetAllPositions()
        {
            try
            {
                return await _db.Positions.ToListAsync();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        //Done
        public async Task<IEnumerable<Position>> GetPositionsByMonitor(long? id)
        {
            try
            {
                return await _db.Positions.Where(p => p.MonitorId == id).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task AddPosition(Position position)
        {
            await _db.Positions.AddAsync(position);
            _db.SaveChanges();
        }

        public async Task<ActionResult<Position>> GetPositionsById(long id)
        {
            return await _db.Positions.FirstOrDefaultAsync(p => p.PositionId == id);
        }



        public async Task UpdatePosition(Position position )
        {
            if(_db.Positions.Any(p =>p.PositionId == position.PositionId))
            {
                _db.Update(position);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<int> RemovePosition(long? id)
        {
            int result = 0;
            if (_db != null)
            {
                var item = await _db.Positions.FirstOrDefaultAsync(m => m.MonitorId == id);
                if (item != null)
                {
                    _db.Positions.Remove(item);
                    result = await _db.SaveChangesAsync();

                }
                return result;
            }
            return result;
        }


    }
}
