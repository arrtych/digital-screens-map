using DigitalScreensMap_API.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public interface IRoomRepository
    {
        Task<IEnumerable<Room>> GetAllRooms();
        Task<ActionResult<Room>> GetRoom(long id);

        Task AddRoom(Room room);


        Task<int> RemoveRoom(long? id);

        Task UpdateRoom(Room room);
    }
}
