import { useState, useEffect } from "react";
import {
  Power,
  PowerOff,
  MapPin,
  Clock,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  useSetOnlineStatusMutation,
  useGetDriverProfileQuery,
} from "@/redux/features/driver/driver.api";
import { toast } from "sonner";

interface Location {
  lat: number;
  lng: number;
}

interface AvailabilityControlProps {
  initialStatus?: boolean;
  driverName?: string;
  onStatusChange?: (isOnline: boolean) => void;
  disabled?: boolean;
}

const AvailabilityControl = ({
  initialStatus = false,
  onStatusChange,
  disabled = false,
}: AvailabilityControlProps) => {
  const [isOnline, setIsOnline] = useState(initialStatus);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [lastStatusChange, setLastStatusChange] = useState<Date | null>(null);

  const { data: driverProfileData, isLoading: isProfileLoading } =
    useGetDriverProfileQuery(undefined);
  const [setOnlineStatus, { isLoading }] = useSetOnlineStatusMutation();

  const driverProfile = driverProfileData?.data;

  useEffect(() => {
    if (driverProfile && !isProfileLoading) {
      const backendStatus = driverProfile.onlineStatus === "online";
      setIsOnline(backendStatus);

      onStatusChange?.(backendStatus);
    }
  }, [driverProfile, isProfileLoading, onStatusChange]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          let errorMessage = "Unable to get current location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          setLocationError(errorMessage);
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser");
    }
  }, []);

  useEffect(() => {
    let watchId: number | null = null;

    if (isOnline && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location watch error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 60000,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline]);

  const handleToggleStatus = async () => {
    if (disabled || isLoading) return;

    const newStatus = !isOnline;
    console.log("Toggling status to:", newStatus);

    if (newStatus) {
      if (!currentLocation && !locationError) {
        toast("Getting location... Please wait and try again");
        return;
      }

      if (locationError) {
        toast(
          "Location access is required to go online. Please enable location permissions and refresh the page."
        );
        return;
      }

      if (
        !currentLocation ||
        typeof currentLocation.lat !== "number" ||
        typeof currentLocation.lng !== "number" ||
        isNaN(currentLocation.lat) ||
        isNaN(currentLocation.lng)
      ) {
        toast("Invalid location data. Please refresh the page and try again.");
        return;
      }
    }

    try {
      const payload: {
        status: string;
        location?: { lat: number; lng: number };
      } = {
        status: newStatus ? "online" : "offline",
      };

      if (newStatus && currentLocation) {
        payload.location = currentLocation;
      }

      await setOnlineStatus(payload).unwrap();

      setIsOnline(newStatus);
      setLastStatusChange(new Date());
      onStatusChange?.(newStatus);

      toast(
        newStatus
          ? "You are now online and ready for rides!"
          : "You are now offline"
      );
    } catch (error: any) {
      let errorMessage = "Failed to update status";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      if (errorMessage.includes("Location is required")) {
        errorMessage = "Location is required to go online. Please enable GPS and try again.";
      }
      toast(errorMessage);
      console.error("Status update error:", error);
    }
  };

  const formatLastStatusChange = () => {
    if (!lastStatusChange) return null;
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - lastStatusChange.getTime()) / (1000 * 60)
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  if (isProfileLoading) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">
                Loading driver status...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              } animate-pulse`}
            />
            <span>Availability Control</span>
          </h2>
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Status */}
          <div
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              isOnline
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20"
            }`}
          >
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <Power className="h-6 w-6 text-green-600" />
              ) : (
                <PowerOff className="h-6 w-6 text-gray-500" />
              )}
              <div>
                <p className="font-medium">{isOnline ? "Online" : "Offline"}</p>
                <p className="text-sm text-muted-foreground">
                  {isOnline ? "Available for rides" : "Not accepting rides"}
                </p>
              </div>
            </div>
          </div>

          {/* Location Status */}
          <div className="p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <MapPin
                className={`h-6 w-6 ${
                  currentLocation ? "text-blue-600" : "text-gray-400"
                }`}
              />
              <div>
                <p className="font-medium">
                  {currentLocation ? "Location Active" : "Location Unavailable"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {locationError || "GPS tracking enabled"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Error Alert */}
        {locationError && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Location Required
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                {locationError}
              </p>
            </div>
          </div>
        )}

        {/* Status Information */}
        {lastStatusChange && (
          <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last updated {formatLastStatusChange()}
              </span>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <div className="space-y-3">
          <button
            onClick={handleToggleStatus}
            disabled={disabled || isLoading}
            className={`w-full px-6 py-4 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              isOnline
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg hover:shadow-red-500/25"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-lg hover:shadow-green-500/25"
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isOnline ? (
                <PowerOff className="h-5 w-5" />
              ) : (
                <Power className="h-5 w-5" />
              )}
              <span>
                {isLoading
                  ? "Updating..."
                  : isOnline
                  ? "Go Offline"
                  : "Go Online"}
              </span>
            </div>
          </button>

          <p className="text-xs text-center text-muted-foreground">
            {isOnline
              ? "You are visible to riders and can receive ride requests"
              : "Turn online to start receiving ride requests and earning money"}
          </p>
        </div>

        {/* Current Location Display (when online) */}
        {isOnline && currentLocation && (
          <div className="border-t pt-4">
            <div className="text-sm space-y-2">
              <p className="font-medium text-muted-foreground">
                Current Location:
              </p>
              <div className="bg-accent/30 p-3 rounded-lg">
                <p className="font-mono text-xs">
                  Lat: {currentLocation.lat.toFixed(6)}
                </p>
                <p className="font-mono text-xs">
                  Lng: {currentLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityControl;
