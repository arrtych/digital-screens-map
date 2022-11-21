using DigitalScreensMap_API.Data;
using DigitalScreensMap_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalScreensMap_API.Repository
{
    public class ImageRepository : IImageRepository
    {

        private readonly MonitorContex _db;

        public ImageRepository(MonitorContex db)
        {
            _db = db;
        }

        public async Task<Image> GetImage(long id)
        {           
            try
            {
                return await _db.Images.FirstOrDefaultAsync(i => i.RoomId == id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async void SaveImage(Image img)
        {
            await _db.Images.AddAsync(img);
            _db.SaveChanges();
        }


        public async Task<int> RemoveImage(long? id)
        {
            int result = 0;
            if (_db != null)
            {
                var item = await _db.Images.FirstOrDefaultAsync(m => m.RoomId == id);
                if (item != null)
                {
                    _db.Images.Remove(item);
                    result = await _db.SaveChangesAsync();

                }
                return result;
            }
            return result;

        }




    }
}
