using CoffeeAdminV2.model_old;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace CoffeeAdminV2.Repositories_old
{
    public class CoffeeRepository
    {
        SqlConnection cn = new SqlConnection(@"Data Source=chav-adk11-1;Initial Catalog=Coffee;Integrated Security=True;MultipleActiveResultSets=True");
        const int TIMEOUT = 30;

        internal List<coffee> getCoffees_Rp()
        {
            List<coffee> listToReturn = new List<coffee>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_all_from_CoffeeTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandTimeout = TIMEOUT;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        coffee aCoffee = new coffee();
                        aCoffee.coffeeID = (int)reader["CoffeeID"];
                        aCoffee.coffeeName = reader["CoffeeName"] as string;
                        aCoffee.unitPrice = (decimal)reader["UnitPrice"];
                        aCoffee.availability = (bool)reader["Availability"];
                        aCoffee.shortDescription = reader["ShortDescription"] as string;
                        aCoffee.longDescription = reader["LongDescription"] as string;
                        aCoffee.intensity = (int)reader["Intensity"];
                        aCoffee.image = reader["Image"] as string;
                        listToReturn.Add(aCoffee);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }
                        
        internal List<order> getOrdersByMonth_RP(int month, int year)
        {
            List<order> listToReturn = new List<order>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_coffeeID_and_quantity_by_month_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                cmd.CommandTimeout = TIMEOUT;

                using(SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        order aRecord = new order();
                        aRecord.coffeeID = (int)reader["CoffeeID"];
                        aRecord.quantity = (int)reader["Quantity"];
                        listToReturn.Add(aRecord);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }

        internal List<order> getOrdersByMonthForUser_RP(int month, int year, string UserName)
        {
            List<order> listToReturn = new List<order>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_order_details_by_month_and_user_Ordertable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                cmd.Parameters.Add(new SqlParameter("@userName", SqlDbType.NVarChar)).Value = UserName;
                cmd.CommandTimeout = TIMEOUT;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        order aRecord = new order();
                        aRecord.coffeeID = (int)reader["CoffeeID"];
                        aRecord.quantity = (int)reader["Quantity"];
                        aRecord.total = (decimal)reader["Total"];
                        aRecord.orderPaid = (bool)reader["OrderPaid"];
                        aRecord.orderReceived = (bool)reader["OrderReceived"];
                        listToReturn.Add(aRecord);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }

        internal List<string> getOrderNamesAll_RP(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_all_names_by_month_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                cmd.CommandTimeout = TIMEOUT;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string aName = reader["UserName"] as string;
                        listToReturn.Add(aName);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }

        internal List<string> getOrderNamesPaid_RP(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_all_names_by_month_paid_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                cmd.CommandTimeout = TIMEOUT;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string aName = reader["UserName"] as string;
                        listToReturn.Add(aName);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }

        internal List<string> getOrderNamesNotPaid_RP(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_all_names_by_month_not_paid_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                cmd.CommandTimeout = TIMEOUT;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string aName = reader["UserName"] as string;
                        listToReturn.Add(aName);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }

        internal List<string> getOrderNamesReceived_RP(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_all_names_by_month_received_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                cmd.CommandTimeout = TIMEOUT;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string aName = reader["UserName"] as string;
                        listToReturn.Add(aName);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }

        internal List<string> getOrderNamesNotReceived_RP(int month, int year)
        {
            List<string> listToReturn = new List<string>();

            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Get_all_names_by_month_not_received_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@year", SqlDbType.Int)).Value = year;
                cmd.CommandTimeout = TIMEOUT;

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string aName = reader["UserName"] as string;
                        listToReturn.Add(aName);
                    }
                }

            }
            finally
            {
                cn.Close();
            }

            return listToReturn;
        }        

        internal void changePaidToTrue_RP(int month, int year, string userName)
        {
            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Set_orderPaid_1_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@Year", SqlDbType.Int)).Value = year;
                cmd.Parameters.Add(new SqlParameter("@UserName", SqlDbType.NVarChar)).Value = userName;                
                cmd.CommandTimeout = TIMEOUT;
                cmd.ExecuteNonQuery();
            }
            finally
            {
                cn.Close();
            }            
        }

        internal void changePaidToFalse_RP(int month, int year, string userName)
        {
            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Set_orderPaid_0_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@Year", SqlDbType.Int)).Value = year;
                cmd.Parameters.Add(new SqlParameter("@UserName", SqlDbType.NVarChar)).Value = userName;
                cmd.CommandTimeout = TIMEOUT;
                cmd.ExecuteNonQuery();
            }
            finally
            {
                cn.Close();
            }
        }

        internal void changeReceivedToTrue_RP(int month, int year, string userName)
        {
            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Set_orderReceived_1_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@Year", SqlDbType.Int)).Value = year;
                cmd.Parameters.Add(new SqlParameter("@UserName", SqlDbType.NVarChar)).Value = userName;
                cmd.CommandTimeout = TIMEOUT;
                cmd.ExecuteNonQuery();
            }
            finally
            {
                cn.Close();
            }
        }

        internal void changeReceivedToFalse_RP(int month, int year, string userName)
        {
            try
            {
                cn.Open();
                SqlCommand cmd = new SqlCommand("sp_Set_orderReceived_0_OrderTable_ReDone", cn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@Month", SqlDbType.Int)).Value = month;
                cmd.Parameters.Add(new SqlParameter("@Year", SqlDbType.Int)).Value = year;
                cmd.Parameters.Add(new SqlParameter("@UserName", SqlDbType.NVarChar)).Value = userName;
                cmd.CommandTimeout = TIMEOUT;
                cmd.ExecuteNonQuery();
            }
            finally
            {
                cn.Close();
            }
        }
    }
}