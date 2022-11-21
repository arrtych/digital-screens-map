using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using DigitalScreensMap_API.Data;
using DigitalScreensMap_API.Models;
using DigitalScreensMap_API.Repository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DigitalScreensMap_API.Controllers
{
    [Route("api/[controller]")]
    public class ImageUploadController : Controller
    {
        private readonly IImageRepository _images;
        public ImageUploadController(IImageRepository imageRepository)
        {
            _images = imageRepository;
        }



        /// <summary>
        /// Save Image with Room Id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="uploadedFile"></param>
        [Route("add/image/{id}")]
        [HttpPost]
        public FileContentResult AddImage([FromRoute] long id, IFormFile uploadedFile)
        {
            var inMemoryFileStream = new MemoryStream();
            uploadedFile.CopyTo(inMemoryFileStream);
            Image img = new Image();
            img.ImageData = inMemoryFileStream.ToArray();
            img.RoomId = id;

            inMemoryFileStream.Close();
            inMemoryFileStream.Dispose();
            _images.SaveImage(img);

            return File(inMemoryFileStream.ToArray(), "image/png");

        }



        /// <summary>
        /// Get specific Image by Room Id.
        /// </summary>
        /// <param name="id"></param>
        [HttpGet]
        [Route("get/image/{id}")]
        public async Task<IActionResult> GetImageById(long id)
        {
            Image img = await _images.GetImage(id);
            var fileMemStream = new MemoryStream();
            if (img != null)
            {
                byte[] fileBytes = img.ImageData;
                fileMemStream = new MemoryStream(fileBytes);
                return File(fileMemStream.ToArray(), "image/png");
            } else
            {
                //throw new ArgumentException($"Cant find image with id: {id}."); 500
                return NotFound($"Cant find image with id: {id}.");
            }
            
        }

        /// <summary>
        /// Delete a specific Image by Room Id.
        /// </summary>
        /// <param name="id"></param>
        [HttpPost]
        [Route("remove/image/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {

            int result = 0;

            if (id == null)
            {
                return BadRequest();
            }

            try
            {
                result = await _images.RemoveImage(id);
                if (result == 0)
                {
                    return NotFound();
                }
                return Ok(new { status = true, message = "Image was deleted Successfully" });
            }
            catch (Exception)
            {

                return BadRequest();
            }
        }





    }
}