using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeAdminV2.model_old
{
    public class order
    {
        public string userID { get; set; }
        public string userName { get; set; }
        public int coffeeID { get; set; }
        public int quantity { get; set; }        
        public decimal total { get; set; }
        public int orderID { get; set; }
        public string orderDate { get; set; }
        public bool orderSubmitted { get; set; }
        public bool orderPaid { get; set; }
        public bool orderReceived { get; set; }
    }
}