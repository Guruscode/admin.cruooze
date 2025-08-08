"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Car, Wallet, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from "firebase/firestore";
import { getDashboardStats, getRidesTrendData } from "@/lib/dashboardStatsService";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRides, setTotalRides] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ridesTrendData, setRidesTrendData] = useState<{ month: string; rides: number }[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      setError(null);
      console.log("Fetching statistics, user:", user);

      if (!user) {
        setError("No authenticated user. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const today = new Date("2025-08-08T17:04:00+01:00"); // 05:04 PM WAT, August 08, 2025
        const fromTimestamp = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 1)); // Start of August 2025
        const toTimestamp = Timestamp.fromDate(today);

        // Test Firestore connection
        const testDoc = await getDoc(doc(db, "orders", "071ddd91-5e0e-416c-871b-876efd7035cf"));
        console.log("Test doc fetch:", testDoc.exists(), testDoc.data());

        // Fetch dashboard stats
        const stats = await getDashboardStats();
        setTotalDrivers(stats.totalDrivers);
        setTotalRides(stats.totalRides);
        setTotalPayments(stats.totalPayments);
        setTotalCustomers(stats.totalCustomers);
        setTotalReviews(stats.totalReviews);

        // Fetch rides trend data
        const trendData = await getRidesTrendData();
        setRidesTrendData(trendData);

      } catch (err) {
        console.error("Detailed error fetching statistics:", err);
        setError(`Failed to load statistics. Error: ${err.message}. Please check Firebase configuration, permissions, or index status at https://console.firebase.google.com/v1/r/project/express-voyages/firestore/indexes.`);
        setTotalDrivers(0);
        setTotalRides(0);
        setTotalPayments(0);
        setTotalCustomers(0);
        setTotalReviews(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [user]);

  // Open canvas panel for charts
  const handleShowCharts = () => {
    window.xaiCanvasPanel?.open({
      title: "E-Hailing Statistics",
      content: `
        <canvas id="ridesChart" style="max-width: 400px; margin: 20px;"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
          const ridesCtx = document.getElementById('ridesChart').getContext('2d');
          new Chart(ridesCtx, {
            type: 'bar',
            data: {
              labels: ${JSON.stringify(ridesTrendData.map((d) => d.month))},
              datasets: [{
                label: 'Total Rides',
                data: ${JSON.stringify(ridesTrendData.map((d) => d.rides))},
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            },
            options: {
              scales: { y: { beginAtZero: true } },
              plugins: { legend: { display: true } }
            }
          });
        </script>
      `,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your e-hailing station statistics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Welcome back,</span>
          <span className="text-sm font-medium">{user?.fullName || "User"}</span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center text-muted-foreground">Loading statistics...</div>
      )}

      {/* Dashboard Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Drivers</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalDrivers}</h3>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Rides</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalRides}</h3>
              </div>
              <div className="bg-green-100 rounded-full p-2">
                <Car className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Payments</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalPayments}</h3>
              </div>
              <div className="bg-orange-100 rounded-full p-2">
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Customers</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalCustomers}</h3>
              </div>
              <div className="bg-purple-100 rounded-full p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalReviews}</h3>
              </div>
              <div className="bg-teal-100 rounded-full p-2">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Button */}
      {/* <div className="text-center">
        <button
          onClick={handleShowCharts}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Charts
        </button>
      </div> */}
    </motion.div>
  );
}