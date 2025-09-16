import { useState, useEffect } from "react";
import {
  Car,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Activity,
  Navigation,
  Power,
  PowerOff,
  Users,
  Route,
  Timer,
  Calendar,
} from "lucide-react";
import {
  useGetDriverDashboardQuery,
  useGetDriverStatsQuery,
  useSetOnlineStatusMutation,
  useUpdateLocationMutation,
} from "@/redux/features/driver/driver.api";
import { useGetAvailableRidesQuery } from "@/redux/features/ride/ride.api";
import { toast } from "sonner";

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { data: dashboardData, isLoading: dashboardLoading } =
    useGetDriverDashboardQuery(undefined);
  const { data: statsData, isLoading: statsLoading } = 
    useGetDriverStatsQuery(undefined);
  const { data: availableRides } = useGetAvailableRidesQuery(undefined);
  const [setOnlineStatus] = useSetOnlineStatusMutation();
  const [updateLocation] = useUpdateLocationMutation();

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get current location");
        }
      );
    }
  }, []);

  // Update location when it changes
  useEffect(() => {
    if (currentLocation && isOnline) {
      updateLocation(currentLocation);
    }
  }, [currentLocation, isOnline, updateLocation]);

  const handleToggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      await setOnlineStatus({ isOnline: newStatus }).unwrap();
      setIsOnline(newStatus);
      toast.success(
        newStatus ? "You are now online!" : "You are now offline"
      );
    } catch (error) {
      toast.error("Failed to update online status");
      console.error("Error updating status:", error);
    }
  };

  if (dashboardLoading || statsLoading) {
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Driver Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your driving overview
            </p>
          </div>

          {/* Online Status Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isOnline
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {isOnline ? (
                  <Power className="h-4 w-4" />
                ) : (
                  <PowerOff className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleOnlineStatus}
              className={`px-4 py-2 rounded-lg font-medium ${
                isOnline
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Today's Earnings
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${dashboardData?.todayEarnings || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Today's Rides
                </p>
                <p className="text-2xl font-bold">{dashboardData?.todayRides || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Rating
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{dashboardData?.totalRating || 0}</p>
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Active Rides
                </p>
                <p className="text-2xl font-bold">{dashboardData?.activeRides || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Rides */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Route className="h-5 w-5 text-green-600" />
                  <span>Available Rides</span>
                </h2>
                <div className="text-sm text-muted-foreground">
                  {availableRides?.length || 0} rides available
                </div>
              </div>

              <div className="space-y-4">
                {availableRides && availableRides.length > 0 ? (
                  availableRides.map((ride: any) => (
                    <div
                      key={ride.id || ride._id}
                      className="border rounded-lg p-4 hover:border-green-200 dark:hover:border-green-800"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Navigation className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{ride.distance || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600">
                            ${ride.estimatedFare || ride.fare || 0}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Timer className="h-4 w-4" />
                          <span>
                            Requested {ride.requestedAt || new Date(ride.createdAt).toLocaleTimeString() || "Unknown"}
                          </span>
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          Accept Ride
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No rides available at the moment
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {isOnline
                        ? "Stay online to receive ride requests"
                        : "Go online to start receiving rides"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Performance</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Rides
                  </span>
                  <span className="font-medium">{statsData?.totalRides || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completion Rate
                  </span>
                  <span className="font-medium text-green-600">
                    {statsData?.completionRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Avg Response
                  </span>
                  <span className="font-medium">{statsData?.responseTime || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Hours
                  </span>
                  <span className="font-medium">{statsData?.totalHours || 0}h</span>
                </div>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Earnings Summary</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    This Week
                  </span>
                  <span className="font-medium text-green-600">
                    ${dashboardData?.weeklyEarnings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    This Month
                  </span>
                  <span className="font-medium text-green-600">
                    ${dashboardData?.monthlyEarnings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Earned
                  </span>
                  <span className="font-bold text-green-600">
                    ${statsData?.totalEarnings || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3">
                  <Users className="h-4 w-4" />
                  <span>View Ride History</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3">
                  <DollarSign className="h-4 w-4" />
                  <span>Earnings Report</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3">
                  <MapPin className="h-4 w-4" />
                  <span>Update Location</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;