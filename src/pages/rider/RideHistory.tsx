import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  MapPin,
  Clock,
  Star,
  Calendar,
  CreditCard,
  ChevronLeft,
  Search,
  Car,
  CheckCircle,
  XCircle,
  Navigation,
  AlertCircle,
} from "lucide-react";
import { useGetRideHistoryQuery } from "@/redux/features/ride/ride.api";

const RideHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: rideHistoryData,
    isLoading,
    error,
  } = useGetRideHistoryQuery(undefined);

  const rideHistory = rideHistoryData?.data;
  // console.log("Ride History Data:", rideHistory);

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "IN_PROGRESS":
        return <Navigation className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRides = useMemo(() => {
    if (!rideHistory || !Array.isArray(rideHistory)) return [];

    return rideHistory?.filter((ride: any) => {
      const matchesSearch =
        ride.pickupLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destinationLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.id?.toString().includes(searchTerm);

      return matchesSearch;
    });
  }, [rideHistory, searchTerm]);

  const stats = useMemo(() => {
    if (!rideHistory || !Array.isArray(rideHistory))
      return { total: 0, completed: 0, totalSpent: 0, avgRating: 0 };

    const completed = rideHistory.filter(
      (ride) => ride.status?.toUpperCase() === "COMPLETED"
    );
    const totalSpent = rideHistory.reduce(
      (sum: number, ride: any) => sum + (ride.fare || 0),
      0
    );
    const ratedRides = rideHistory.filter((ride) => ride.rating > 0);
    const avgRating =
      ratedRides.length > 0
        ? ratedRides.reduce(
            (sum: number, ride: any) => sum + (ride.rating || 0),
            0
          ) / ratedRides.length
        : 0;

    return {
      total: rideHistory.length,
      completed: completed.length,
      totalSpent,
      avgRating,
    };
  }, [rideHistory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Error Loading History
            </h2>
            <p className="text-muted-foreground mb-6">
              Unable to load your ride history. Please try again later.
            </p>
            <button
              onClick={() => navigate("/rider/dashboard")}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // console.log("Filtered Rides:", filteredRides);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-green-600 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Ride History</h1>
                <p className="text-green-100">View all your past rides</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Car className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rides</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
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
                  ${stats.totalSpent.toFixed(2)}
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
                  {stats.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Only */}
        <div className="bg-card border rounded-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Ride History Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Your Rides</h3>
          </div>

          {/* Headers - Desktop */}
          <div className="hidden md:block border-b bg-accent/20">
            <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
              <div className="col-span-4">Route</div>
              <div className="col-span-3">Date</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Rating</div>
            </div>
          </div>

          <div className="p-6">
            {filteredRides.length > 0 ? (
              <div className="space-y-4">
                {filteredRides.map((ride: any) => (
                  <Link
                    key={ride.id}
                    to={`/rider/ride/${ride.id}`}
                    className="block"
                  >
                    <div className="p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-green-200">
                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {ride.pickupLocation?.address} → {ride.destinationLocation?.address}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {new Date(ride.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(ride.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(ride.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                ride.status
                              )}`}
                            >
                              {ride.status}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-2">
                          {ride.rating ? (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{ride.rating}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Not rated
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm">
                                {ride.pickup} → {ride.destination}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ID: #{ride.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(ride.status)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                ride.status
                              )}`}
                            >
                              {ride.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {new Date(ride.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{ride.duration || "N/A"}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold">
                              ${(ride.fare || 0).toFixed(2)}
                            </span>
                            {ride.rating ? (
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{ride.rating}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                No rating
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">
                      No rides found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-green-500 hover:text-green-600 font-medium"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No rides yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start your journey by booking your first ride
                    </p>
                    <Link
                      to="/rider/book-ride"
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200"
                    >
                      Book Your First Ride
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideHistory;