using CoffeeAdminV2.BusinessLogic_old;
using CoffeeAdminV2.Repositories_old;
using CoffeeAdminV2.model_old;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Services;

namespace CoffeeAdminV2.controller
{
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]    
    [System.Web.Script.Services.ScriptService]
    public class AdminWebService : System.Web.Services.WebService 
    {
        SqlConnection cn = new SqlConnection(@"Data Source=chav-adk11-1;Initial Catalog=Coffee;Integrated Security=True;MultipleActiveResultSets=True");
        const int TIMEOUT = 30; 

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<coffee> getCoffees_WS()
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getCoffees_CM();
        }        
        
        [WebMethod]
        public List<coffeeIDandQuantity> getOrdersByMonth_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrdersByMonth_CM(month, year);
        }

        [WebMethod]
        public List<orderSummary> getOrdersByMonthForUser_WS(int month, int year, string userName)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrdersByMonthForUser_CM(month, year, userName);
        }

        [WebMethod]
        public List<string> getOrderNamesAll_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesAll_CM(month, year);
        }

        [WebMethod]
        public List<string> getOrderNamesPaid_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesPaid_CM(month, year);
        }

        [WebMethod]
        public List<string> getOrderNamesNotPaid_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesNotPaid_CM(month, year);
        }

        [WebMethod]
        public List<string> getOrderNamesReceived_WS(int month, int year)
        {
            CoffeeManager manager = new CoffeeManager();
            return manager.getOrderNamesReceived_CM(month, year);
        }

        [WebMethod]
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
    } 
}