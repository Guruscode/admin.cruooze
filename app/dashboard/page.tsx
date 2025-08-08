"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { Car, Wallet, DollarSign, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/firebase"; // Assuming Firebase is initialized here
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeDrivers, setActiveDrivers] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);

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
        const today = new Date(); // August 08, 2025, 12:10 PM WAT
        const fromTimestamp = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 1)); // Start of August 2025
        const toTimestamp = Timestamp.fromDate(today);

        // Test Firestore connection
        const testDoc = await getDoc(doc(db, "orders", "071ddd91-5e0e-416c-871b-876efd7035cf"));
        console.log("Test doc fetch:", testDoc.exists(), testDoc.data());

        // Query orders for total jobs (Ride Placed status)
        const jobsQuery = query(
          collection(db, "orders"),
          where("createdDate", ">=", fromTimestamp),
          where("createdDate", "<=", toTimestamp),
          where("status", "==", "Ride Placed")
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        console.log("Jobs query result:", jobsSnapshot.size, jobsSnapshot.docs.map(d => d.data()));
        const totalJobsCount = jobsSnapshot.size;
        setTotalJobs(totalJobsCount);

        // Query orders for completed trips and total revenue
        const tripsQuery = query(
          collection(db, "orders"),
          where("createdDate", ">=", fromTimestamp),
          where("createdDate", "<=", toTimestamp),
          where("paymentStatus", "==", true)
        );
        const tripsSnapshot = await getDocs(tripsQuery);
        console.log("Trips query result:", tripsSnapshot.size, tripsSnapshot.docs.map(d => d.data()));
        const completedTripsCount = tripsSnapshot.size;
        const revenue = tripsSnapshot.docs.reduce((sum, doc) => {
          const rate = parseFloat(doc.data().offerRate || "0");
          console.log("Order ID:", doc.id, "Offer Rate:", rate);
          return sum + (isNaN(rate) ? 0 : rate);
        }, 0);
        setCompletedTrips(completedTripsCount);
        setTotalRevenue(revenue);

        // Query drivers for active drivers
        const driversQuery = query(
          collection(db, "drivers"),
          where("isActive", "==", true)
        );
        const driversSnapshot = await getDocs(driversQuery);
        console.log("Drivers query result:", driversSnapshot.size, driversSnapshot.docs.map(d => d.data()));
        const activeDriversCount = driversSnapshot.size;
        setActiveDrivers(activeDriversCount);

      } catch (err) {
        console.error("Detailed error fetching statistics:", err);
        setError(`Failed to load statistics. Error: ${err.message}. Please check Firebase configuration, permissions, or index status at https://console.firebase.google.com/v1/r/project/express-voyages/firestore/indexes.`);
        setTotalJobs(0);
        setTotalRevenue(0);
        setActiveDrivers(0);
        setCompletedTrips(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [user]);

  // Chart data (based on fetched statistics + simulated previous months)
  const jobsData = [totalJobs, Math.floor(totalJobs * 0.8), Math.floor(totalJobs * 0.7), Math.floor(totalJobs * 0.6)]; // Current + prev 3 months
  const revenueData = [totalRevenue, Math.floor(totalRevenue * 0.8), Math.floor(totalRevenue * 0.7), Math.floor(totalRevenue * 0.6)]; // Current + prev 3 months

  // Open canvas panel for charts
  const handleShowCharts = () => {
    window.xaiCanvasPanel?.open({
      title: "E-Hailing Statistics",
      content: `
        <canvas id="jobsChart" style="max-width: 400px; margin: 20px;"></canvas>
        <canvas id="revenueChart" style="max-width: 400px; margin: 20px;"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
          // Bar chart for total jobs
          const jobsCtx = document.getElementById('jobsChart').getContext('2d');
          new Chart(jobsCtx, {
            type: 'bar',
            data: {
              labels: ['Aug 2025', 'Jul 2025', 'Jun 2025', 'May 2025'],
              datasets: [{
                label: 'Total Jobs',
                data: ${JSON.stringify(jobsData)},
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

          // Line chart for revenue
          const revenueCtx = document.getElementById('revenueChart').getContext('2d');
          new Chart(revenueCtx, {
            type: 'line',
            data: {
              labels: ['Aug 2025', 'Jul 2025', 'Jun 2025', 'May 2025'],
              datasets: [{
                label: 'Revenue (₦)',
                data: ${JSON.stringify(revenueData)},
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
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
                <p className="text-sm text-gray-600 mb-2">Total Jobs</p>
                <h3 className="text-2xl font-bold text-gray-900">{totalJobs}</h3>
              </div>
              <div className="bg-blue-100 rounded-full p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">₦{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-green-100 rounded-full p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Active Drivers</p>
                <h3 className="text-2xl font-bold text-gray-900">{activeDrivers}</h3>
              </div>
              <div className="bg-orange-100 rounded-full p-2">
                <Car className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Completed Trips</p>
                <h3 className="text-2xl font-bold text-gray-900">{completedTrips}</h3>
              </div>
              <div className="bg-purple-100 rounded-full p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Button */}
      <div className="text-center">
        <button
          onClick={handleShowCharts}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Charts
        </button>
      </div>
    </motion.div>
  );
}