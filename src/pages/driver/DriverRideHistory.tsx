import { useState } from "react";
import {
  Car,
  Clock,
  DollarSign,
  Star,
  Calendar,
  Filter,
  Route,
  User,
} from "lucide-react";
import { useGetRideHistoryQuery } from "@/redux/features/ride/ride.api";
import { toast } from "sonner";

const DriverRideHistory = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const { data: rideHistory, isLoading, error } = useGetRideHistoryQuery(undefined);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "ongoing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-accent rounded w-1/4"></div>
            <div className="h-12 bg-accent rounded"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-accent rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load ride history");
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load ride history</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </div>
    );
  }

  const rides = rideHistory?.data || [];

  // Filter rides based on status
  const filteredRides = rides.filter((ride: any) => {
    if (filterStatus === "all") return true;
    return ride.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  // Sort rides
  const sortedRides = [...filteredRides].sort((a: any, b: any) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt || b.requestedAt).getTime() - new Date(a.createdAt || a.requestedAt).getTime();
    }
    if (sortBy === "earnings") {
      return (b.fare || 0) - (a.fare || 0);
    }
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">Ride History</h1>
            <p className="text-muted-foreground mt-1">
              View all your completed and past rides
            </p>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm bg-background"
                >
                  <option value="all">All Rides</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm bg-background"
                >
                  <option value="recent">Most Recent</option>
                  <option value="earnings">Highest Earnings</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredRides.length} of {rides.length} rides
            </div>
          </div>
        </div>

        {/* Ride History List */}
        <div className="space-y-4">
          {sortedRides.length > 0 ? (
            sortedRides.map((ride: any) => (
              <div
                key={ride.id || ride._id}
                className="bg-card rounded-lg border p-6 transition-colors hover:border-green-200 dark:hover:border-green-800"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Ride Route */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-medium">Pickup Location</p>
                          <p className="text-sm text-muted-foreground">
                            {ride.pickupLocation?.address || ride.pickup || "Unknown location"}
                          </p>
                        </div>
                      </div>
                      <div className="ml-1.5 w-0.5 h-6 bg-border"></div>
                      <div className="flex items-start space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-medium">Drop-off Location</p>
                          <p className="text-sm text-muted-foreground">
                            {ride.dropoffLocation?.address || ride.destination || "Unknown location"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ride Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(ride.createdAt || ride.requestedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(ride.createdAt || ride.requestedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Route className="h-4 w-4" />
                        <span>{ride.distance || "N/A"}</span>
                      </div>
                      {ride.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{ride.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Passenger Info */}
                    {ride.passenger && (
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Passenger:</span>
                        <span className="font-medium">{ride.passenger.name || "Unknown"}</span>
                      </div>
                    )}
                  </div>

                  {/* Ride Stats */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:text-right">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          ride.status
                        )}`}
                      >
                        {ride.status || "Unknown"}
                      </span>
                    </div>

                    {ride.fare && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-600">${ride.fare}</span>
                      </div>
                    )}

                    {ride.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{ride.rating}</span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Ride ID: {(ride.id || ride._id)?.slice(-8) || "Unknown"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filterStatus === "all" 
                  ? "No ride history found" 
                  : `No ${filterStatus} rides found`}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete some rides to see your history here
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {rides.length > 0 && (
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{rides.length}</p>
                <p className="text-sm text-muted-foreground">Total Rides</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {rides.filter((ride: any) => ride.status?.toLowerCase() === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  ${rides.reduce((sum: number, ride: any) => sum + (ride.fare || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {rides.filter((ride: any) => ride.rating).length > 0
                    ? (
                        rides
                          .filter((ride: any) => ride.rating)
                          .reduce((sum: number, ride: any) => sum + ride.rating, 0) /
                        rides.filter((ride: any) => ride.rating).length
                      ).toFixed(1)
                    : "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRideHistory;