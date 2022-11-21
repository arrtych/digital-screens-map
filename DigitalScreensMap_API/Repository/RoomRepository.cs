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
    public class RoomRepository : IRoomRepository
    {

        private readonly MonitorContex _db;

        public RoomRepository(MonitorContex db)
        {
            _db = db;
        }
        public async Task AddRoom(Room item)
        {
            await _db.Rooms.AddAsync(item);
            _db.SaveChanges();
        }

        public async Task<IEnumerable<Room>> GetAllRooms()
        {
            try
            {
                return await _db.Rooms.ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ActionResult<Room>> GetRoom(long id)
        {
            return await _db.Rooms.FirstOrDefaultAsync(m => m.RoomId == id);
        }

        public async Task<int> RemoveRoom(long? id)
        {
            int result = 0;
            if (_db != null)
            {
                var item = await _db.Rooms.FirstOrDefaultAsync(m => m.RoomId == id);
                if (item != null)
                {
                    _db.Rooms.Remove(item);
                    result = await _db.SaveChangesAsync();

                }
                return result;
            }
            return result;
        }



        public async Task UpdateRoom(Room item)
        {
            if (_db.Rooms.Any(x => x.RoomId == item.RoomId))
            {
                _db.Update(item);
                await _db.SaveChangesAsync();
            }
        }
    }
}
