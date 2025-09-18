import { useState } from "react";
import {
  User,
  Car,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import {
  useGetAvailableRidesQuery,
  useUpdateRideStatusMutation,
  useAcceptRideMutation,
} from "@/redux/features/ride/ride.api";
import { toast } from "sonner";

const RideStatus = {
  REQUESTED: "requested",
  ACCEPTED: "accepted",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

const ActiveRide = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const {
    data: rideHistoryData,
    isLoading,
    error,
    refetch,
  } = useGetAvailableRidesQuery(undefined);
  const [updateRideStatus] = useUpdateRideStatusMutation();
  const [acceptRide] = useAcceptRideMutation();

  const rideHistory = rideHistoryData?.data;
  
  const activeRide = rideHistory?.find((ride: any) =>
    [RideStatus.REQUESTED].includes(ride.status)
  );

  console.log("Active Ride", activeRide);

  const handleAcceptRide = async () => {
    if (!activeRide?._id) return;

    setIsAccepting(true);
    try {
      await acceptRide(activeRide._id).unwrap();

      toast.success("Ride accepted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to accept ride");
      console.error("Error accepting ride:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!activeRide?.id) return;

    setIsUpdating(true);
    try {
      await updateRideStatus({
        id: activeRide.id,
        statusData: { status: newStatus },
      }).unwrap();

      toast.success(`Ride status updated to ${newStatus.replace("_", " ")}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update ride status");
      console.error("Error updating ride status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case RideStatus.REQUESTED:
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case RideStatus.ACCEPTED:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case RideStatus.PICKED_UP:
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case RideStatus.IN_TRANSIT:
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case RideStatus.COMPLETED:
        return "text-green-700 bg-green-200 dark:bg-green-800/30";
      case RideStatus.CANCELLED:
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case RideStatus.ACCEPTED:
        return RideStatus.PICKED_UP;
      case RideStatus.PICKED_UP:
        return RideStatus.IN_TRANSIT;
      case RideStatus.IN_TRANSIT:
        return RideStatus.COMPLETED;
      default:
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case RideStatus.ACCEPTED:
        return "Mark as Picked Up";
      case RideStatus.PICKED_UP:
        return "Start Trip";
      case RideStatus.IN_TRANSIT:
        return "Complete Ride";
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-accent rounded w-1/4"></div>
            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                <div className="h-6 bg-accent rounded w-1/3"></div>
                <div className="h-4 bg-accent rounded w-1/2"></div>
                <div className="h-4 bg-accent rounded w-1/2"></div>
                <div className="h-10 bg-accent rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Available Rides
            </h2>
            <p className="text-muted-foreground mb-4">
              Unable to load available ride information.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeRide) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent mb-6">
            Available Rides
          </h1>
          <div className="bg-card rounded-lg border p-12 text-center">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Available Rides</h2>
            <p className="text-muted-foreground">
              There are no available rides at the moment. Check back later!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Available Rides
        </h1>

        {/* Ride Information */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Ride Request</h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                activeRide.status
              )}`}
            >
              {activeRide.status.replace("_", " ").toUpperCase()}
            </div>
          </div>

          {/* Rider Information */}
          {activeRide.rider && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Rider Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{activeRide.rider.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{activeRide.rider.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Trip Details */}
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Trip Details
          </h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
              <div className="flex-1">
                <p className="font-medium">Pickup Location</p>
                <p className="text-muted-foreground">
                  {activeRide.pickupLocation?.address}
                </p>
                {activeRide.pickupLocation && (
                  <p className="text-xs text-muted-foreground">
                    {activeRide.pickupLocation?.latitude},{" "}
                    {activeRide.pickupLocation?.longitude}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-green-500 rounded-full mt-1"></div>
              <div className="flex-1">
                <p className="font-medium">Destination</p>
                <p className="text-muted-foreground">
                  {activeRide.destinationLocation?.address}
                </p>
                {activeRide.destinationLocation && (
                  <p className="text-xs text-muted-foreground">
                    {activeRide.destinationLocation?.latitude},{" "}
                    {activeRide.destinationLocation?.longitude}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {activeRide.status === RideStatus.REQUESTED && (
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAcceptRide}
                disabled={isAccepting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 flex-1"
              >
                <CheckCircle className="h-6 w-6" />
                <span>{isAccepting ? "Accepting..." : "Accept Ride"}</span>
              </button>

              <button
                onClick={() => handleStatusUpdate(RideStatus.CANCELLED)}
                disabled={isAccepting}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <XCircle className="h-5 w-5" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        )}

        {/* Status Update Actions for Accepted Rides */}
        {(activeRide.status === RideStatus.ACCEPTED ||
          activeRide.status === RideStatus.PICKED_UP ||
          activeRide.status === RideStatus.IN_TRANSIT) && (
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {getNextStatus(activeRide.status) && (
                <button
                  onClick={() =>
                    handleStatusUpdate(getNextStatus(activeRide.status)!)
                  }
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>{getNextStatusLabel(activeRide.status)}</span>
                </button>
              )}

              {activeRide.status !== RideStatus.COMPLETED &&
                activeRide.status !== RideStatus.CANCELLED && (
                  <button
                    onClick={() => handleStatusUpdate(RideStatus.CANCELLED)}
                    disabled={isUpdating}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Cancel Ride</span>
                  </button>
                )}
            </div>
          </div>
        )}

        {/* Completion Message */}
        {(activeRide.status === RideStatus.COMPLETED ||
          activeRide.status === RideStatus.CANCELLED) && (
          <div className="bg-card rounded-lg border p-6">
            <div className="text-center">
              {activeRide.status === RideStatus.COMPLETED ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-green-600">
                    Ride Completed!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Thank you for completing this ride successfully.
                  </p>
                  <p className="text-lg font-semibold">
                    Earnings:{" "}
                    <span className="text-green-600">${activeRide.fare}</span>
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-red-600">
                    Ride Cancelled
                  </h3>
                  <p className="text-muted-foreground">
                    This ride has been cancelled.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRide;