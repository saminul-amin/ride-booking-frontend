import { useState } from "react";
import {
  Users,
  Car,
  Route,
  TrendingUp,
  UserCheck,
  Activity,
  MapPin,
  Star,
  DollarSign,
  Calendar,
  BarChart3,
  Shield,
  Clock,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useGetAllDriversQuery,
  useGetOnlineDriversQuery,
  useGetAllRidesQuery,
  useDeleteDriverProfileMutation,
} from "@/redux/features/admin/admin.api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");

  const { data: allUsers, isLoading: usersLoading } = useGetAllUsersQuery(undefined);
  const { data: allDrivers, isLoading: driversLoading } = useGetAllDriversQuery(undefined);
  const { data: onlineDrivers, isLoading: onlineDriversLoading } = useGetOnlineDriversQuery(undefined);
  const { data: allRides, isLoading: ridesLoading } = useGetAllRidesQuery(undefined);
  const [deleteDriver] = useDeleteDriverProfileMutation();

  const handleDeleteDriver = async (driverId: string) => {
    try {
      await deleteDriver(driverId).unwrap();
      toast.success("Driver deleted successfully");
    } catch (error) {
      toast.error("Failed to delete driver");
      console.error("Error deleting driver:", error);
    }
  };

  // Calculate statistics from real data
  const totalUsers = allUsers?.length || 0;
  const totalDrivers = allDrivers?.length || 0;
  const onlineDriversCount = onlineDrivers?.length || 0;
  const totalRides = allRides?.length || 0;
  
  const completedRides = allRides?.filter((ride: any) => ride.status === "completed")?.length || 0;
  const activeRides = allRides?.filter((ride: any) => ride.status === "in_progress")?.length || 0;
  const pendingRides = allRides?.filter((ride: any) => ride.status === "pending")?.length || 0;

  // Calculate earnings from completed rides
  const totalEarnings = allRides?.reduce((total: number, ride: any) => {
    if (ride.status === "completed" && ride.fare) {
      return total + ride.fare;
    }
    return total;
  }, 0) || 0;

  const todayRides = allRides?.filter((ride: any) => {
    const rideDate = new Date(ride.createdAt || ride.requestedAt);
    const today = new Date();
    return rideDate.toDateString() === today.toDateString();
  })?.length || 0;

  if (usersLoading || driversLoading || ridesLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-accent rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-accent rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 bg-accent rounded-lg lg:col-span-2"></div>
              <div className="h-96 bg-accent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your ride-hailing platform
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
                selectedTab === "overview"
                  ? "bg-green-500 text-white"
                  : "bg-accent text-accent-foreground hover:bg-accent/60"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab("drivers")}
              className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
                selectedTab === "drivers"
                  ? "bg-green-500 text-white"
                  : "bg-accent text-accent-foreground hover:bg-accent/60"
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setSelectedTab("rides")}
              className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
                selectedTab === "rides"
                  ? "bg-green-500 text-white"
                  : "bg-accent text-accent-foreground hover:bg-accent/60"
              }`}
            >
              Rides
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Drivers</p>
                <p className="text-2xl font-bold">{totalDrivers}</p>
                <p className="text-xs text-green-600 mt-1">
                  {onlineDriversCount} online
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Rides</p>
                <p className="text-2xl font-bold">{totalRides}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {todayRides} today
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Route className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedTab === "overview" && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Platform Overview</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Active Rides</span>
                    </div>
                    <p className="text-2xl font-bold">{activeRides}</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Pending Rides</span>
                    </div>
                    <p className="text-2xl font-bold">{pendingRides}</p>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <p className="text-2xl font-bold">{completedRides}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Recent Activity</h3>
                  {allRides?.slice(0, 5).map((ride: any) => (
                    <div key={ride.id || ride._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            ride.status === "completed" ? "bg-green-500" :
                            ride.status === "in_progress" ? "bg-blue-500" : "bg-yellow-500"
                          }`}></div>
                          <div>
                            <p className="font-medium">
                              {ride.user?.name || ride.passenger?.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {ride.pickupLocation?.address || ride.pickup || "Unknown pickup"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${ride.fare || 0}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {ride.status || "pending"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-8">
                      No rides found
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "drivers" && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                  <Car className="h-5 w-5 text-green-600" />
                  <span>Driver Management</span>
                </h2>

                <div className="space-y-4">
                  {allDrivers?.map((driver: any) => (
                    <div key={driver.id || driver._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            onlineDrivers?.some((od: any) => (od.id || od._id) === (driver.id || driver._id))
                              ? "bg-green-500" : "bg-gray-400"
                          }`}></div>
                          <div>
                            <p className="font-medium">
                              {driver.user?.name || driver.name || "Unknown Driver"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {driver.user?.email || driver.email || "No email"}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs">
                                  {driver.rating || driver.totalRating || "No rating"}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {driver.totalRides || 0} rides
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right mr-4">
                            <p className="text-sm font-medium">
                              ${driver.totalEarnings || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Total earned</p>
                          </div>
                          <button
                            onClick={() => handleDeleteDriver(driver.id || driver._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-8">
                      No drivers found
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "rides" && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                  <Route className="h-5 w-5 text-purple-600" />
                  <span>Ride Management</span>
                </h2>

                <div className="space-y-4">
                  {allRides?.map((ride: any) => (
                    <div key={ride.id || ride._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            ride.status === "completed" ? "bg-green-500" :
                            ride.status === "in_progress" ? "bg-blue-500" : "bg-yellow-500"
                          }`}></div>
                          <span className="font-medium capitalize">
                            {ride.status || "pending"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            ${ride.fare || ride.estimatedFare || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                          <div>
                            <p className="font-medium">Pickup</p>
                            <p className="text-sm text-muted-foreground">
                              {ride.pickupLocation?.address || ride.pickup || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                          <div>
                            <p className="font-medium">Destination</p>
                            <p className="text-sm text-muted-foreground">
                              {ride.dropoffLocation?.address || ride.destination || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          User: {ride.user?.name || ride.passenger?.name || "Unknown"}
                        </span>
                        <span>
                          Driver: {ride.driver?.user?.name || ride.driver?.name || "Unassigned"}
                        </span>
                        <span>
                          {new Date(ride.createdAt || ride.requestedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-8">
                      No rides found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platform Health */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Platform Health</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Online Drivers</span>
                  <span className="font-medium text-green-600">
                    {onlineDriversCount}/{totalDrivers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="font-medium text-green-600">
                    {totalRides > 0 ? ((completedRides / totalRides) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-medium">{totalUsers}</span>
                </div>
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Revenue Summary</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                  <span className="font-bold text-green-600">
                    ${totalEarnings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg per Ride</span>
                  <span className="font-medium">
                    ${completedRides > 0 ? (totalEarnings / completedRides).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed Rides</span>
                  <span className="font-medium">{completedRides}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3">
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3">
                  <Car className="h-4 w-4" />
                  <span>Driver Analytics</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3">
                  <Route className="h-4 w-4" />
                  <span>Ride Reports</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3">
                  <Calendar className="h-4 w-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;