import { useState, useEffect } from "react";
import {
  Car,
  Edit,
  Save,
  X,
  Calendar,
  FileText,
  Shield,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useGetDriverProfileQuery } from "@/redux/features/driver/driver.api";
import { toast } from "sonner";

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  vehicleType: string;
  capacity: number;
  fuelType: string;
  transmission: string;
  registrationExpiry: string;
  insuranceExpiry: string;
  lastInspection: string;
  inspectionStatus: "valid" | "expired" | "pending";
  documents: {
    registration: boolean;
    insurance: boolean;
    inspection: boolean;
    driverLicense: boolean;
  };
}

interface DriverInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  joinDate: string;
  rating: number;
  totalRides: number;
  status: "active" | "inactive" | "suspended";
  profileImage?: string;
}

const VehicleDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<VehicleInfo | null>(null);

  const {
    data: driverProfile,
    isLoading,
    error,
    refetch,
  } = useGetDriverProfileQuery(undefined);

  // Extract vehicle and driver info from API response
  const vehicleInfo: VehicleInfo | null = driverProfile?.vehicle
    ? {
        make: driverProfile.vehicle.make || "",
        model: driverProfile.vehicle.model || "",
        year: driverProfile.vehicle.year || new Date().getFullYear(),
        color: driverProfile.vehicle.color || "",
        plateNumber: driverProfile.vehicle.plateNumber || "",
        vehicleType: driverProfile.vehicle.type || "sedan",
        capacity: driverProfile.vehicle.capacity || 4,
        fuelType: driverProfile.vehicle.fuelType || "petrol",
        transmission: driverProfile.vehicle.transmission || "manual",
        registrationExpiry: driverProfile.vehicle.registrationExpiry || "",
        insuranceExpiry: driverProfile.vehicle.insuranceExpiry || "",
        lastInspection: driverProfile.vehicle.lastInspection || "",
        inspectionStatus: driverProfile.vehicle.inspectionStatus || "pending",
        documents: {
          registration: driverProfile.vehicle.documents?.registration ?? false,
          insurance: driverProfile.vehicle.documents?.insurance ?? false,
          inspection: driverProfile.vehicle.documents?.inspection ?? false,
          driverLicense:
            driverProfile.vehicle.documents?.driverLicense ?? false,
        },
      }
    : null;

  const driverInfo: DriverInfo | null = driverProfile
    ? {
        name: driverProfile.name || "",
        email: driverProfile.email || "",
        phone: driverProfile.phone || "",
        address: driverProfile.address || "",
        licenseNumber: driverProfile.licenseNumber || "",
        licenseExpiry: driverProfile.licenseExpiry || "",
        joinDate: driverProfile.createdAt || driverProfile.joinDate || "",
        rating: driverProfile.rating || 0,
        totalRides: driverProfile.totalRides || 0,
        status: driverProfile.status || "active",
        profileImage: driverProfile.profileImage,
      }
    : null;

  useEffect(() => {
    if (vehicleInfo && !editedVehicle) {
      setEditedVehicle(vehicleInfo);
    }
  }, [vehicleInfo]);

  const handleEdit = () => {
    setIsEditing(true);
    if (vehicleInfo) {
      setEditedVehicle({ ...vehicleInfo });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedVehicle(vehicleInfo);
  };

  const handleSave = async () => {
    if (!editedVehicle) return;

    try {
      // Here you would call an API to update the vehicle details
      // For now, we'll simulate success
      toast.success("Vehicle details updated successfully!");
      setIsEditing(false);
      refetch(); // Refetch the driver profile
    } catch (error) {
      toast.error("Failed to update vehicle details");
      console.error("Error updating vehicle:", error);
    }
  };

  const handleInputChange = (field: keyof VehicleInfo, value: any) => {
    if (!editedVehicle) return;
    setEditedVehicle({ ...editedVehicle, [field]: value });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
      case "active":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "expired":
      case "suspended":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "pending":
      case "inactive":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = (dateString: string) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-accent rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-accent rounded-lg"></div>
              <div className="h-96 bg-accent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !driverProfile) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Unable to Load Vehicle Details
            </h2>
            <p className="text-muted-foreground mb-4">
              {error
                ? "Failed to fetch driver profile"
                : "No driver profile found"}
            </p>
            <button
              onClick={() => refetch()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Vehicle Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your vehicle information and documentation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer hover:shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Details</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Driver Information */}
          {driverInfo && (
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span>Driver Information</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    {driverInfo.profileImage ? (
                      <img
                        src={driverInfo.profileImage}
                        alt={driverInfo.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{driverInfo.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">
                        {driverInfo.rating.toFixed(1)} ({driverInfo.totalRides}{" "}
                        rides)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{driverInfo.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{driverInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {driverInfo.address || "Address not set"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {formatDate(driverInfo.joinDate)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        driverInfo.status
                      )}`}
                    >
                      {driverInfo.status.charAt(0).toUpperCase() +
                        driverInfo.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      License
                    </span>
                    <span className="text-sm">{driverInfo.licenseNumber}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">
                      License Expiry
                    </span>
                    <span
                      className={`text-sm ${
                        isExpiringSoon(driverInfo.licenseExpiry)
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatDate(driverInfo.licenseExpiry)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Information */}
          {(vehicleInfo || isEditing) && (
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Car className="h-5 w-5 text-green-600" />
                <span>Vehicle Information</span>
              </h2>

              {!vehicleInfo && !isEditing ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No vehicle information available
                  </p>
                  <button
                    onClick={handleEdit}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add Vehicle Details
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Make
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedVehicle?.make || ""}
                          onChange={(e) =>
                            handleInputChange("make", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {vehicleInfo?.make || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Model
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedVehicle?.model || ""}
                          onChange={(e) =>
                            handleInputChange("model", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {vehicleInfo?.model || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Year
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedVehicle?.year || ""}
                          onChange={(e) =>
                            handleInputChange("year", parseInt(e.target.value))
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {vehicleInfo?.year || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Color
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedVehicle?.color || ""}
                          onChange={(e) =>
                            handleInputChange("color", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {vehicleInfo?.color || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Plate Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedVehicle?.plateNumber || ""}
                          onChange={(e) =>
                            handleInputChange("plateNumber", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {vehicleInfo?.plateNumber || "Not set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Vehicle Type
                      </label>
                      {isEditing ? (
                        <select
                          value={editedVehicle?.vehicleType || "sedan"}
                          onChange={(e) =>
                            handleInputChange("vehicleType", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="hatchback">Hatchback</option>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="van">Van</option>
                        </select>
                      ) : (
                        <p className="font-medium capitalize">
                          {vehicleInfo?.vehicleType || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Capacity
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedVehicle?.capacity || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "capacity",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      ) : (
                        <p className="font-medium">
                          {vehicleInfo?.capacity} passengers
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Fuel Type
                      </label>
                      {isEditing ? (
                        <select
                          value={editedVehicle?.fuelType || "petrol"}
                          onChange={(e) =>
                            handleInputChange("fuelType", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="electric">Electric</option>
                          <option value="cng">CNG</option>
                        </select>
                      ) : (
                        <p className="font-medium capitalize">
                          {vehicleInfo?.fuelType || "Not set"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Documentation Status */}
        {vehicleInfo && (
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Documentation Status</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(vehicleInfo.documents).map(([doc, status]) => (
                <div
                  key={doc}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  {status ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium capitalize">
                      {doc.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p
                      className={`text-xs ${
                        status ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {status ? "Submitted" : "Missing"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Registration Expiry</p>
                  <p
                    className={`text-sm ${
                      isExpiringSoon(vehicleInfo.registrationExpiry)
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatDate(vehicleInfo.registrationExpiry)}
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Insurance Expiry</p>
                  <p
                    className={`text-sm ${
                      isExpiringSoon(vehicleInfo.insuranceExpiry)
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatDate(vehicleInfo.insuranceExpiry)}
                  </p>
                </div>
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Last Inspection</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(vehicleInfo.lastInspection)}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                      vehicleInfo.inspectionStatus
                    )}`}
                  >
                    {vehicleInfo.inspectionStatus.charAt(0).toUpperCase() +
                      vehicleInfo.inspectionStatus.slice(1)}
                  </span>
                </div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
