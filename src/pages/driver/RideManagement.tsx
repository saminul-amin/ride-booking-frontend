import { useState } from "react";
import {
  Car,
  User,
  Phone,
  Star,
  DollarSign,
  AlertTriangle,
  Timer,
} from "lucide-react";
import {
  useGetAvailableRidesQuery,
  useAcceptRideMutation,
  useUpdateRideStatusMutation,
  useGetRideHistoryQuery,
} from "@/redux/features/ride/ride.api";
import { toast } from "sonner";

// Ride status types
type RideStatus = 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';

interface RideRequest {
  _id: string;
  rider: {
    name: string;
    phone: string;
    rating?: number;
    profileImage?: string;
  };
  pickup: {
    address: string;
    coordinates?: [number, number];
  };
  destination: {
    address: string;
    coordinates?: [number, number];
  };
  distance?: string;
  duration?: string;
  fare: number;
  createdAt: string;
  status: RideStatus;
  notes?: string;
  paymentMethod?: string;
}

const RideManagement = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'active'>('available');
  // const [sosMode, setSosMode] = useState(false);

  // API hooks
  const { data: availableRidesData, isLoading: availableLoading, error: availableError, refetch: refetchAvailable } = useGetAvailableRidesQuery(undefined);
  const { data: rideHistoryData, isLoading: historyLoading, error: historyError, refetch: refetchHistory } = useGetRideHistoryQuery(undefined);
  const [acceptRide, { isLoading: acceptLoading }] = useAcceptRideMutation();
  const [updateRideStatus, { isLoading: updateLoading }] = useUpdateRideStatusMutation();

  // Extract data from API responses with safety checks
  const availableRides = availableRidesData?.data?.filter((ride: any) => ride && ride.rider) || [];
  const rideHistory = rideHistoryData?.data?.filter((ride: any) => ride && ride.rider) || [];
  
  // Filter active rides from history (rides that are not completed or cancelled)
  const activeRides = rideHistory.filter((ride: RideRequest) => 
    ['accepted', 'picked_up', 'in_transit'].includes(ride.status)
  );

  // Handle ride acceptance
  const handleAcceptRide = async (rideId: string) => {
    if (acceptLoading) return;
    
    try {
      await acceptRide(rideId).unwrap();
      toast.success("Ride accepted successfully!");
      setActiveTab('active');
      refetchAvailable();
      refetchHistory();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to accept ride";
      toast.error(errorMessage);
      console.error("Error accepting ride:", error);
    }
  };

  // Handle status updates
  const handleStatusUpdate = async (rideId: string, newStatus: RideStatus) => {
    if (updateLoading) return;
    
    try {
      await updateRideStatus({ id: rideId, statusData: { status: newStatus } }).unwrap();
      const statusLabel = newStatus.replace('_', ' ').toLowerCase();
      toast.success(`Ride status updated to ${statusLabel}`);
      refetchHistory();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to update ride status";
      toast.error(errorMessage);
      console.error("Error updating status:", error);
    }
  };

  // Get status display info
  const getStatusInfo = (status: RideStatus) => {
    switch (status) {
      case 'pending':
        return { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', label: 'Pending' };
      case 'accepted':
        return { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Accepted' };
      case 'picked_up':
        return { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Picked Up' };
      case 'in_transit':
        return { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'In Transit' };
      case 'completed':
        return { color: 'text-green-700', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Completed' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Cancelled' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-900/20', label: 'Unknown' };
    }
  };

  // Get next status options
  const getNextStatusOptions = (currentStatus: RideStatus) => {
    switch (currentStatus) {
      case 'accepted':
        return ['picked_up', 'cancelled'];
      case 'picked_up':
        return ['in_transit', 'cancelled'];
      case 'in_transit':
        return ['completed'];
      default:
        return [];
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (availableLoading || historyLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle API errors
  if (availableError || historyError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Error Loading Rides</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {(availableError as any)?.data?.message || (historyError as any)?.data?.message || "Failed to load ride data"}
            </p>
            <button 
              onClick={() => {
                refetchAvailable();
                refetchHistory();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Ride Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your ride requests and active rides
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-1 flex">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'available'
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white '
            }`}
          >
            Available ({availableRides.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Active ({activeRides.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'available' ? (
            availableRides.length > 0 ? (
              availableRides.map((ride: RideRequest) => (
                <div key={ride._id} className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{ride.rider?.name || 'Unknown Rider'}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          {ride.rider?.rating && (
                            <>
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{ride.rider.rating}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatDate(ride.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">${ride.fare}</p>
                      {ride.distance && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{ride.distance}</p>
                      )}
                    </div>
                  </div>

                  {/* Route */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-white">{ride.pickup.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-white">{ride.destination.address}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      {ride.rider?.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{ride.rider.phone}</span>
                        </div>
                      )}
                      {ride.paymentMethod && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{ride.paymentMethod}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAcceptRide(ride._id)}
                      disabled={acceptLoading}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        acceptLoading
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {acceptLoading ? "Accepting..." : "Accept"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center">
                <Timer className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Available Rides</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay online to receive ride requests
                </p>
              </div>
            )
          ) : (
            activeRides.length > 0 ? (
              activeRides.map((ride: RideRequest) => {
                const statusInfo = getStatusInfo(ride.status);
                const nextOptions = getNextStatusOptions(ride.status);

                return (
                  <div key={ride._id} className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{ride.rider?.name || 'Unknown Rider'}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">${ride.fare}</p>
                        {ride.distance && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{ride.distance}</p>
                        )}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-900 dark:text-white">{ride.pickup.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-900 dark:text-white">{ride.destination.address}</span>
                      </div>
                    </div>

                    {/* Contact & Status Updates */}
                    <div className="pt-3 border-t space-y-3">
                      {ride.rider?.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a 
                            href={`tel:${ride.rider.phone}`}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {ride.rider.phone}
                          </a>
                        </div>
                      )}

                      {/* Status Update Buttons */}
                      {nextOptions.length > 0 && (
                        <div className="flex space-x-2">
                          {nextOptions.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(ride._id, status as RideStatus)}
                              disabled={updateLoading}
                              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                                updateLoading
                                  ? 'bg-gray-400 cursor-not-allowed text-white'
                                  : status === 'cancelled'
                                  ? 'bg-red-600 hover:bg-red-700 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {updateLoading 
                                ? "Updating..." 
                                : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                              }
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center">
                <Car className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Rides</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Accept available rides to see them here
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RideManagement;