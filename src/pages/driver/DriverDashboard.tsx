import { useState, useEffect } from "react";
import {
  Car,
  DollarSign,
  TrendingUp,
  Navigation,
  Power,
  PowerOff,
  Route,
  Timer,
} from "lucide-react";
import {
  useGetDriverProfileQuery,
  useGetDriverStatsQuery,
  useUpdateLocationMutation,
} from "@/redux/features/driver/driver.api";
import { useGetAvailableRidesQuery } from "@/redux/features/ride/ride.api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const navigate = useNavigate();

  const { data: statsDataData } = useGetDriverStatsQuery(undefined);
  const { data: availableRidesData } = useGetAvailableRidesQuery(undefined);
  const { data: driverProfileData, isLoading: isProfileLoading } =
    useGetDriverProfileQuery(undefined);
  const [updateLocation] = useUpdateLocationMutation();

  const statsData = statsDataData?.data;
  const availableRides = availableRidesData?.data || [];
  const driverProfile = driverProfileData?.data || {};

  console.log("Stats Data:", statsData);
  // console.log("Available Rides:", availableRides);

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

  useEffect(() => {
    if (driverProfile && !isProfileLoading) {
      setIsOnline(driverProfile.onlineStatus === "online");
    }
  }, [driverProfile, isProfileLoading]);

  // Update location when it changes
  useEffect(() => {
    if (currentLocation && isOnline) {
      updateLocation(currentLocation);
    }
  }, [currentLocation, isOnline, updateLocation]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Driver Dashboard
            </h1>
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
              onClick={() => navigate("/driver/availability")}
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
                          <span className="font-medium">
                            {ride.status || "N/A"}
                          </span>
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
                              {ride.pickupLocation?.address ||
                                ride.pickup ||
                                "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                          <div>
                            <p className="font-medium">Destination</p>
                            <p className="text-sm text-muted-foreground">
                              {ride.destinationLocation?.address ||
                                ride.destination ||
                                "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Timer className="h-4 w-4" />
                          <span>
                            Requested{" "}
                            {ride.requestedAt ||
                              new Date(ride.createdAt).toLocaleTimeString() ||
                              "Unknown"}
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
                  <span className="font-medium">
                    {statsData?.basicStats?.totalRides || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Completed Rides
                  </span>
                  <span className="font-medium text-green-600">
                    {statsData?.basicStats?.completedRides || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Recent Rides
                  </span>
                  <span className="font-medium">
                    {statsData?.recentRides.length || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Hours
                  </span>
                  <span className="font-medium">
                    {statsData?.basicStats?.onlineHours.toFixed(2) || 0}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
