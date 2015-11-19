using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CoffeeAdminV2.model_old
{
    public class orderSummary
    {
        public int coffeeID { get; set; }
        public int quantity { get; set; }
        public decimal total { get; set; }
        public bool orderPaid { get; set; }
        public bool orderReceived { get; set; }
    }
}
