// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DAL;
using Quick_Application1.ViewModels;
using AutoMapper;
using DAL.Models;
using Microsoft.Extensions.Logging;
using Quick_Application1.Helpers;
using Microsoft.Extensions.Options;

namespace Quick_Application1.Controllers
{
    [Route("api/[controller]")]
    public class OrderController : Controller
    {
        private IUnitOfWork _unitOfWork;
        readonly ILogger _logger;
        readonly IEmailSender _emailer;


        public OrderController(IUnitOfWork unitOfWork, ILogger<OrderController> logger, IEmailSender emailer)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailer = emailer;
        }



        // GET: api/values
        [HttpGet]
        public IActionResult Get()
        {
            var allOrders = _unitOfWork.Orders.GetAll();
            return Ok(Mapper.Map<IEnumerable<OrderViewModel>>(allOrders));
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetByUser(string userId)
        {
            var allOrders = _unitOfWork.Orders.GetAll();
            return Ok(Mapper.Map<IEnumerable<OrderViewModel>>(allOrders));
        }



        [HttpGet("throw")] 
        public IEnumerable<OrderViewModel> Throw()
        {
            throw new InvalidOperationException("This is a test exception: " + DateTime.Now);
        }


        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value: " + id;
        }



        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }



        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }



        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
