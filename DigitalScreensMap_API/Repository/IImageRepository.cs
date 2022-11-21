using DigitalScreensMap_API.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public interface IImageRepository
    {

        void SaveImage(Image img);

        Task<Image> GetImage(long id);

        Task<int> RemoveImage(long? id);
    }
}
