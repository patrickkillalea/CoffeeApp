using Unum.Ireland.Coffee.Services.BusinessLogic;
using Unum.Ireland.Coffee.Services.model;
using Unum.Ireland.Coffee.Services.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;
using System.Text;
using System.Web.Script.Serialization;
using System.DirectoryServices.ActiveDirectory;

namespace Unum.Ireland.Coffee.Services.controller
{
    [WebService(Namespace = "http://Unum.Ireland.Coffee.Services/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]    
    [System.Web.Script.Services.ScriptService]
    public class CoffeeServices : System.Web.Services.WebService 
    {
        // Database connection and timeout
        SqlConnection cn = new SqlConnection(@"Data Source=chav-adk11-1;Initial Catalog=Coffee;Integrated Security=True;MultipleActiveResultSets=True");
        const int TIMEOUT = 30;      

        // === Admin Services ===
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<coffee> getCoffees_WS()
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getCoffees_CM();
        }
        
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<coffeeIDandQuantity> getOrdersByMonth_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrdersByMonth_CM(month, year);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<orderSummary> getOrdersByMonthForUser_WS(int month, int year, string userName)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrdersByMonthForUser_CM(month, year, userName);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<string> getOrderNamesAll_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesAll_CM(month, year);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<string> getOrderNamesPaid_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesPaid_CM(month, year);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<string> getOrderNamesNotPaid_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesNotPaid_CM(month, year);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<string> getOrderNamesReceived_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesReceived_CM(month, year);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<string> getOrderNamesNotReceived_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesNotReceived_CM(month, year);
        }

        [WebMethod]
        public void changePaidStatus_WS(int month, int year, string userName, bool newPaidStatus)
        {
            CoffeeManager manager = new CoffeeManager();
            manager.changePaidStatus_CM(month, year, userName, newPaidStatus);
        }

        [WebMethod]
        public void changeReceivedStatus_WS(int month, int year, string userName, bool newReceivedStatus)
        {
            CoffeeManager manager = new CoffeeManager();
            manager.changeReceivedStatus_CM(month, year, userName, newReceivedStatus);
        }

        // =============================

        // === Ordering App Services ===   
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public int addToOrderTable_WS(string userID, string userName, int quantity, decimal total, int coffeeID, int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.addToOrderTable_CM(userID, userName, quantity, total, coffeeID, month, year);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void updateOrderTable_WS(int quantity, decimal total, int month, int year, int orderID)
        {
            CoffeeManager manager = new CoffeeManager();
            manager.updateOrderTable_CM(quantity, total, month, year, orderID);
        }

        [WebMethod]        
        public void removeRowFromOrderTable_WS(int orderID)
        {
            CoffeeManager manager = new CoffeeManager();
            manager.removeRowFromOrderTable_CM(orderID);
        }

        [WebMethod]
        public void removeAllRowsFromOrderTable_WS(int month, int year, string userID)
        {
            CoffeeManager manager = new CoffeeManager();
            manager.removeAllRowsFromOrderTable_CM(month, year, userID);
        }

        [WebMethod]
        public void setOrderSubmittedOrderTable_WS(int month, int year, string userID)
        {
            CoffeeManager manager = new CoffeeManager();
            manager.setOrderSubmittedOrderTable_CM(month, year, userID);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<order> getOrdersForUser_WS(string userID)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrdersForUser_CM(userID);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public user getCurrentUser()
        {
            IdentityHelper helper = new IdentityHelper();

            string currentDomain = Domain.GetCurrentDomain().Name;
            user currentUser = null;

            currentUser = new user();
            currentUser.lanID = HttpContext.Current.User.Identity.Name;
            currentUser.name = helper.GetUserDisplayName(HttpContext.Current.User.Identity.Name);

            return currentUser;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public user getCurrentUser_WS(string lanId)
        {
            IdentityHelper helper = new IdentityHelper();

            string currentDomain = Domain.GetCurrentDomain().Name;
            user currentUser = null;

            currentUser = new user();
            currentUser.lanID = lanId;
            currentUser.name = helper.GetUserDisplayName(lanId);

            return currentUser;
        }
    } 
}