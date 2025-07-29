import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../db/firebase";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { ChartArea, ChartBar, SunMedium } from "lucide-react";
import { DollarSign, ShoppingBag } from "react-feather";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const AdminAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });
  const [monthlySales, setMonthlySales] = useState({
    labels: [],
    datasets: [],
  });
  const [totalSales, setTotalSales] = useState({
    totalProductsSold: 0,
    totalCashflow: 0,
  });

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const allOrders = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.orders && userData.orders.length > 0) {
            allOrders.push(...userData.orders);
          }
        });

        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching all users' orders: ", error);
      }
    };

    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const salesByCategory = {};
      const salesByMonth = {};

      orders.forEach((order) => {
        const orderDate = new Date(order.orderDate);
        const month = orderDate.toLocaleString("default", { month: "short" });

        order.items.forEach((item) => {
          // Sales by category
          if (!salesByCategory[item.category]) {
            salesByCategory[item.category] = 0;
          }
          salesByCategory[item.category] +=
            item.quantity * (item.discountedPrice || item.price);

          // Sales by month
          if (!salesByMonth[month]) {
            salesByMonth[month] = 0;
          }
          salesByMonth[month] +=
            item.quantity * (item.discountedPrice || item.price);
        });
      });

      setSalesData({
        labels: Object.keys(salesByCategory),
        datasets: [
          {
            label: "Sales by Category",
            data: Object.values(salesByCategory),
            backgroundColor: "teal",
          },
        ],
      });

      setMonthlySales({
        labels: Object.keys(salesByMonth),
        datasets: [
          {
            label: "Monthly Sales",
            data: Object.values(salesByMonth),
            borderColor: "teal",
            backgroundColor: "teal",
          },
        ],
      });
    }
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) {
      let totalProductsSold = 0;
      let totalCashflow = 0;

      orders.forEach((order) => {
        order.items.forEach((item) => {
          totalProductsSold += item.quantity;
          totalCashflow += item.quantity * (item.discountedPrice || item.price);
        });
      });

      setTotalSales({
        totalProductsSold,
        totalCashflow,
      });
    }
  }, [orders]);

  return (
    <div className="AdminAnalytics">
      <main>
        <header id="heading">
          <div className="title">📊 Sales & Analytics</div>
        </header>
        <div className="charts">
          <div className="sales-summary">
            <p>
              <ShoppingBag className="icon" />
              Total Products Sold <span>{totalSales.totalProductsSold}</span>
            </p>
            <p>
              <DollarSign className="icon" />
              Total Sales{" "}
              <span className="total-sales">
                INR {totalSales.totalCashflow}
              </span>
            </p>
          </div>
          {salesData.labels.length > 0 ? (
            <div className="chart-container">
              <h2>Sales by Category</h2>
              <Bar data={salesData} options={{ responsive: true }} />
            </div>
          ) : (
            <p>No sales data available for categories.</p>
          )}
          {monthlySales.labels.length > 0 ? (
            <div className="chart-container">
              <h2>Monthly Sales</h2>
              <Line data={monthlySales} options={{ responsive: true }} />
            </div>
          ) : (
            <p>No monthly sales data available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
