using DigitalScreensMap_API.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace DigitalScreensMap_API.Repository
{
    public interface IMonitorRepository
    {
        Task<IEnumerable<Monitor>> GetAllMonitors();
        Task<ActionResult<Monitor>> GetMonitor(string code);

        Task AddMonitor(Monitor monitor);


        Task<int> RemoveMonitor(string? code);

        Task UpdateMonitor(Monitor monitor);


        Task<IEnumerable<Monitor>> GetMonitorsByRoom(long? id);
    }
}
