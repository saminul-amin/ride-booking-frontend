import { useState } from "react";
import {
  Car,
  MapPin,
  Clock,
  Star,
  Calendar,
  CreditCard,
  ChevronRight,
  Plus,
  Activity,
} from "lucide-react";
import { Link } from "react-router";
import {
  useGetRideHistoryQuery,
} from "@/redux/features/ride/ride.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

const RiderDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: userInfoData, isLoading: userLoading } = useUserInfoQuery(undefined);
  const { data: rideHistoryData, isLoading: historyLoading } =
    useGetRideHistoryQuery(undefined);

  const userInfo = userInfoData?.data;
  const rideHistory = rideHistoryData?.data;

  console.log("Ride History:", rideHistory);

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "history", label: "Ride History", icon: Clock },
  ];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {userInfo?.name || "Rider"}!
              </h1>
              <p className="text-green-100 mt-2">Ready for your next ride?</p>
            </div>
            <Link to="/rider/book-ride">
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center space-x-2 cursor-pointer">
                <Plus className="h-5 w-5" />
                <span>Book New Ride</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-accent/30 rounded-lg p-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 justify-center cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-green-500 text-white shadow-md"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Car className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rides</p>
                    <p className="text-2xl font-bold">
                      {rideHistory?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">
                      $
                      {Array.isArray(rideHistory)
                        ? rideHistory
                            .reduce(
                              (sum: number, ride: any) =>
                                sum + (ride.fare || 0),
                              0
                            )
                            .toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">
                      {rideHistory?.length > 0
                        ? (
                            rideHistory.reduce(
                              (sum: number, ride: any) =>
                                sum + (ride.rating || 0),
                              0
                            ) / rideHistory.length
                          ).toFixed(1)
                        : "0.0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Rides */}
            <div className="bg-card border rounded-lg">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Rides</h3>
                  <Link
                    to="/rider/rides"
                    className="text-green-500 hover:text-green-600 font-medium text-sm flex items-center space-x-1 transition-colors duration-200"
                  >
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : rideHistory && rideHistory.length > 0 ? (
                  <div className="space-y-4">
                    {rideHistory.slice(0, 3).map((ride: any) => (
                      <div
                        key={ride.id}
                        className="flex items-center justify-between p-4 bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {ride?.pickupLocation?.address} → {ride?.destinationLocation?.address}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(
                                    ride.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{ride.duration || "N/A"}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${ride.fare?.toFixed(2) || "0.00"}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-muted-foreground">
                              {ride.rating || "Not rated"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      No rides yet. Book your first ride!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-card border rounded-lg">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Ride History</h3>
            </div>
            <div className="p-6">
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : rideHistory && rideHistory.length > 0 ? (
                <div className="space-y-4">
                  {rideHistory?.map((ride: any) => (
                    <div
                      key={ride.id}
                      className="flex items-center justify-between p-4 bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {ride?.pickupLocation?.address} → {ride?.destinationLocation?.address}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(ride.createdAt).toLocaleDateString()}
                              </span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{ride.duration || "N/A"}</span>
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ride.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : ride.status === "CANCELLED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {ride.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${ride.fare?.toFixed(2) || "0.00"}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-sm text-muted-foreground">
                            {ride.rating || "Not rated"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    No ride history available.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default RiderDashboard;
