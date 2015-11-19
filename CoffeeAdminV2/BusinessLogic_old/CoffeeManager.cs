using CoffeeAdminV2.model_old;
using CoffeeAdminV2.Repositories_old;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CoffeeAdminV2.BusinessLogic_old
{
    public class CoffeeManager
    {
        internal List<coffee> getCoffees_CM()
        {
            CoffeeRepository repository = new CoffeeRepository();
            return repository.getCoffees_Rp();
        }

        internal List<coffeeIDandQuantity> getOrdersByMonth_CM(int month, int year)
        {
            List<coffeeIDandQuantity> listToReturn = new List<coffeeIDandQuantity>();

            if (month > 0 && month < 13)
            {
                CoffeeRepository repository = new CoffeeRepository();
                List<order> orderList = repository.getOrdersByMonth_RP(month, year);

                IEnumerable distinctCoffeeIDs = (from ls in orderList select ls.coffeeID).Distinct().AsEnumerable();
                foreach (int ID in distinctCoffeeIDs)
                {
                    coffeeIDandQuantity temp = new coffeeIDandQuantity();
                    int quantity = (from ls in orderList where ls.coffeeID == ID select ls.quantity).Sum();
                    temp.quantity = quantity;
                    temp.coffeeID = ID;
                    listToReturn.Add(temp);
                }

                return listToReturn;
            }
            else
                throw new Exception("Invalid Month supplied. Month must be 1-12");
        }

        internal List<orderSummary> getOrdersByMonthForUser_CM(int month, int year, string userName)
        {
            List<orderSummary> listToReturn = new List<orderSummary>();

            if (month > 0 && month < 13)
            {
                CoffeeRepository repository = new CoffeeRepository();
                List<order> orderList = repository.getOrdersByMonthForUser_RP(month, year, userName);

                //IEnumerable distinctCoffeeIDs = (from ls in orderList select ls.coffeeID).Distinct();

               List<orderSummary> summaryList = (from ls in orderList
                               group ls by ls.coffeeID
                                   into grp
                                   select new orderSummary
                                   {
                                       coffeeID = grp.Key,
                                       quantity = grp.Sum(q => q.quantity),
                                       total = grp.Sum(t => t.total),
                                       orderPaid = grp.All(p => p.orderPaid),
                                       orderReceived = grp.All(r => r.orderReceived)
                                   }).ToList();
                /*
                foreach (int ID in distinctCoffeeIDs)
                {
                    orderSummary temp = new orderSummary();
                    int quantity = (from ls in orderList where ls.coffeeID == ID select ls.quantity).Sum();
                    decimal total = (from ls in orderList where ls.coffeeID == ID select ls.total).Sum();
                    temp.quantity = quantity;
                    temp.coffeeID = ID;
                    temp.total = total;
                    
                    listToReturn.Add(temp);
                }
                */
                return summaryList;
            }
            else
                throw new Exception("Invalid Month supplied. Month must be 1-12");
        }

        internal List<string> getOrderNamesAll_CM(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            CoffeeRepository repository = new CoffeeRepository();
            List<string> names = repository.getOrderNamesAll_RP(month, year);

            IEnumerable data = (from ls in names select ls).Distinct();

            foreach(var d in data)
                listToReturn.Add(d.ToString());

            return listToReturn;
        }

        internal List<string> getOrderNamesPaid_CM(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            CoffeeRepository repository = new CoffeeRepository();
            List<string> names = repository.getOrderNamesPaid_RP(month, year);

            IEnumerable data = (from ls in names select ls).Distinct();

            foreach (var d in data)
                listToReturn.Add(d.ToString());

            return listToReturn;
        }

        internal List<string> getOrderNamesNotPaid_CM(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            CoffeeRepository repository = new CoffeeRepository();
            List<string> names = repository.getOrderNamesNotPaid_RP(month, year);

            IEnumerable data = (from ls in names select ls).Distinct();

            foreach (var d in data)
                listToReturn.Add(d.ToString());

            return listToReturn;
        }

        internal List<string> getOrderNamesReceived_CM(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            CoffeeRepository repository = new CoffeeRepository();
            List<string> names = repository.getOrderNamesReceived_RP(month, year);

            IEnumerable data = (from ls in names select ls).Distinct();

            foreach (var d in data)
                listToReturn.Add(d.ToString());

            return listToReturn;
        }

        internal List<string> getOrderNamesNotReceived_CM(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            CoffeeRepository repository = new CoffeeRepository();
            List<string> names = repository.getOrderNamesNotReceived_RP(month, year);

            IEnumerable data = (from ls in names select ls).Distinct();

            foreach (var d in data)
                listToReturn.Add(d.ToString());

            return listToReturn;
        }

        internal void changePaidStatus_CM(int month, int year, string userName, bool newPaidStatus)
        {
            if (month > 0 && month < 13)
            {
                CoffeeRepository repository = new CoffeeRepository();
                if(newPaidStatus)
                    repository.changePaidToTrue_RP(month, year, userName);
                else
                    repository.changePaidToFalse_RP(month, year, userName);
            }
            else
                throw new Exception("Invalid Month supplied. Month must be 1-12");
        }

        internal void changeReceivedStatus_CM(int month, int year, string userName, bool newReceivedStatus)
        {
            if (month > 0 && month < 13)
            {
                CoffeeRepository repository = new CoffeeRepository();
                if (newReceivedStatus)
                    repository.changeReceivedToTrue_RP(month, year, userName);
                else
                    repository.changeReceivedToFalse_RP(month, year, userName);
            }
            else
                throw new Exception("Invalid Month supplied. Month must be 1-12");
        }
    }
}