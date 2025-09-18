import {
  MapPin,
  Calendar,
  User,
  Car,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { useGetAllRidesQuery } from "@/redux/features/admin/admin.api";

interface IRide {
  _id: string;
  rideId: string;
  pickupLocation: {
    address: string;
    longitude?: number;
    latitude?: number;
  };
  destinationLocation: {
    address: string;
    longitude?: number;
    latitude?: number;
  };
  fare: number;
  distance: number;
  duration: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  startTime?: string;
  endTime?: string;
  rating?: number;
  riderId?: {
    name: string;
    phone: string;
  };
  driverId?: {
    name: string;
    phone: string;
    vehicleInfo?: {
      make: string;
      model: string;
      licensePlate: string;
    };
  };
}

const AllRides = () => {
  const { data: ridesData, isLoading, error } = useGetAllRidesQuery(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRide, setSelectedRide] = useState<IRide | null>(null);

  const rides = (ridesData?.data as IRide[]) || [];

  const filteredRides = rides?.filter((ride) => {
    const matchesSearch =
      ride?.pickupLocation?.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ride?.destinationLocation?.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ride?.riderId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride?.driverId?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      ride.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "in-progress":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "requested":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-accent rounded w-1/4"></div>
            <div className="bg-card rounded-lg border p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-accent rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Failed to load rides data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            All Rides
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all ride requests
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Ride ID, location, user or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {rides.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Rides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {
                  rides.filter((r) => r.status.toLowerCase() === "active")
                    .length
                }
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {
                  rides.filter((r) => r.status.toLowerCase() === "completed")
                    .length
                }
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {
                  rides.filter((r) => r.status.toLowerCase() === "cancelled")
                    .length
                }
              </p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Rides List */}
        <div className="bg-card rounded-lg border">
          {filteredRides.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No rides found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredRides.map((ride) => (
                <div
                  key={ride._id}
                  className="p-6 hover:bg-accent/20 transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Ride Info */}
                    <div className="lg:col-span-3">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="lg:col-span-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">From</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {ride.pickupLocation?.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">To</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {ride.destinationLocation?.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User & Driver */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        {ride.riderId && (
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{ride.riderId.name}</span>
                          </div>
                        )}
                        {ride.driverId && (
                          <div className="flex items-center gap-2">
                            <Car className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {ride.driverId.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              ride.status
                            )}`}
                          >
                            {ride.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="lg:col-span-1">
                      <button
                        onClick={() => setSelectedRide(ride)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ride Details Modal (Simple overlay) */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ride Details</h3>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-muted-foreground">
                    Status:{" "}
                  </label>
                  <p
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      selectedRide.status
                    )}`}
                  >
                    {selectedRide.status.toUpperCase()}
                  </p>
                </div>
              </div>

              {selectedRide.riderId && (
                <div>
                  <label className="text-sm font-bold text-muted-foreground">
                    User
                  </label>
                  <p>
                    {selectedRide.riderId.name} ( {selectedRide.riderId.phone} )
                  </p>
                </div>
              )}

              {selectedRide.driverId && (
                <div>
                  <label className="text-sm font-bold text-muted-foreground">
                    Driver
                  </label>
                  <p>
                    {selectedRide.driverId.name} ( {selectedRide.driverId.phone}{" "}
                    )
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-muted-foreground">
                  Pickup Location
                </label>
                <p>{selectedRide.pickupLocation?.address}</p>
              </div>

              <div>
                <label className="text-sm font-bold text-muted-foreground">
                  Destination
                </label>
                <p>{selectedRide.destinationLocation?.address}</p>
              </div>

              <div>
                <label className="text-sm font-bold text-muted-foreground">
                  Created At
                </label>
                <p>{new Date(selectedRide.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRides;
