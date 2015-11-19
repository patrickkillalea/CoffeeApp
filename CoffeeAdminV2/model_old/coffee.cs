using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeAdminV2.model_old
{
    public class coffee
    {
        public int coffeeID { get; set; }
        public string coffeeName { get; set; }
        public decimal unitPrice { get; set; }
        public bool availability { get; set; }
        public string shortDescription { get; set; }
        public string longDescription { get; set; }
        public int intensity { get; set; }
        public string image { get; set; }
    }
}