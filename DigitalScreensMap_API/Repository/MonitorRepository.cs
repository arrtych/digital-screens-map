using DigitalScreensMap_API.Models;
using DigitalScreensMap_API.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace DigitalScreensMap_API.Repository
{
    public class MonitorRepository : IMonitorRepository
    {
        private readonly MonitorContex _db;

        public MonitorRepository(MonitorContex db)
        {
            _db = db;
        }

        //Done
        public async Task<IEnumerable<Monitor>> GetAllMonitors()
        {
            try
            {
                return await _db.Monitors.ToListAsync();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        //Done
        public async Task<ActionResult<Monitor>> GetMonitor(string Code)
        {
            return await _db.Monitors.FirstOrDefaultAsync(m => m.Code == Code);
        }

        //Done
        public async Task AddMonitor(Monitor item)
        {
            await _db.Monitors.AddAsync(item);
            _db.SaveChanges();
        }

        //Done
        public async Task<IEnumerable<Monitor>> GetMonitorsByRoom(long? id)
        {            
            try
            {
                return  await _db.Monitors.Where(m => m.RoomId == id).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        //Done
        public async Task UpdateMonitor(Monitor item)
        {
            if (_db.Monitors.Any(x => x.Code == item.Code))
            {
                 _db.Update(item);
                await  _db.SaveChangesAsync();
            }
        }


        //Done
        public async Task<int> RemoveMonitor(string? code)
        {
            int result = 0;
            if( _db != null)
            {
                var item = await _db.Monitors.FirstOrDefaultAsync(m => m.Code == code);
                if (item != null)
                {
                    _db.Monitors.Remove(item);
                    result = await _db.SaveChangesAsync();

                }
                return result;
            }
            return result;

        }

        
    }
}
