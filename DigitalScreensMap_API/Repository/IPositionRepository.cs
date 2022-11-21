using DigitalScreensMap_API.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public interface IPositionRepository
    {
        Task<IEnumerable<Position>> GetAllPositions();
        Task<ActionResult<Position>> GetPositionsById(long id);

        Task AddPosition(Position position);


        Task<int> RemovePosition(long? id);

        Task UpdatePosition(Position position);

        Task<IEnumerable<Position>> GetPositionsByMonitor(long? id);
    }
}
