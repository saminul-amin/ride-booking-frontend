import { useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Star,
  Route,
  Eye,
  Trash2,
  Power,
  PowerOff,
  Users,
} from "lucide-react";
import {
  useGetAllDriversQuery,
  useGetOnlineDriversQuery,
  useDeleteDriverProfileMutation,
} from "@/redux/features/admin/admin.api";
import { useGetAllRidesQuery } from "@/redux/features/admin/admin.api";
import { toast } from "sonner";

const DriverManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const { data: allDriversData, isLoading: driversLoading } =
    useGetAllDriversQuery(undefined);
  const { data: onlineDriversData, isLoading: onlineDriversLoading } =
    useGetOnlineDriversQuery(undefined);
  const { data: allRidesData } = useGetAllRidesQuery(undefined);
  const [deleteDriver] = useDeleteDriverProfileMutation();

  const allDrivers = allDriversData?.data || [];
  const onlineDrivers = onlineDriversData?.data || [];
  const allRides = allRidesData?.data || [];

  console.log("All Drivers:", allDrivers);

  const filteredDrivers =
    allDrivers?.filter((driver: any) => {
      const matchesSearch =
        driver.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    }) || [];

  const totalDrivers = allDrivers?.length || 0;
  const onlineDriversCount = onlineDrivers?.length || 0;

  const newDriversThisMonth =
    allDrivers?.filter((driver: any) => {
      const driverDate = new Date(driver.createdAt);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      return (
        driverDate.getMonth() === currentMonth &&
        driverDate.getFullYear() === currentYear
      );
    })?.length || 0;

  const handleDriverSelect = (driver: any) => {
    setSelectedDriver(driver);
  };

  const handleCloseDriverDetails = () => {
    setSelectedDriver(null);
  };

  const handleDeleteDriver = async (driverId: string) => {
    try {
      await deleteDriver(driverId).unwrap();
      toast.success("Driver deleted successfully");
      if (selectedDriver && selectedDriver._id === driverId) {
        setSelectedDriver(null);
      }
    } catch (error) {
      toast.error("Failed to delete driver");
      console.error("Error deleting driver:", error);
    }
  };

  console.log("All Rides:", allRides);
  // Get driver's rides
  const getDriverRides = (driverId: string) => {
    return (
      allRides?.filter((ride: any) => ride.driverId?._id === driverId) || []
    );
  };

  if (driversLoading || onlineDriversLoading) {
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
            <div className="h-96 bg-accent rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Driver Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor platform drivers
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Drivers
                </p>
                <p className="text-2xl font-bold">{totalDrivers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Online Now
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {onlineDriversCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalDrivers > 0
                    ? ((onlineDriversCount / totalDrivers) * 100).toFixed(1)
                    : 0}
                  % active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Power className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {newDriversThisMonth}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent joins
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drivers List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>All Drivers</span>
                </h2>
                <div className="text-sm text-muted-foreground">
                  {filteredDrivers.length} drivers found
                </div>
              </div>

              <div className="space-y-4">
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver: any) => {
                    const isOnline = onlineDrivers?.some(
                      (od: any) => od._id === driver._id
                    );
                    const driverRides = getDriverRides(driver.userId?._id);

                    return (
                      <div
                        key={driver.id || driver._id}
                        className="border rounded-lg p-4 hover:border-green-200 dark:hover:border-green-800 cursor-pointer transition-colors"
                        onClick={() => handleDriverSelect(driver)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center relative">
                              <span className="text-green-600 font-medium">
                                {driver.userId?.name?.charAt(0).toUpperCase() ||
                                  "D"}
                              </span>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  isOnline ? "bg-green-500" : "bg-gray-400"
                                }`}
                              ></div>
                            </div>
                            <div>
                              <p className="font-medium">
                                {driver.userId?.name || "Unknown Driver"}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>
                                    {driver.userId?.email || "No email"}
                                  </span>
                                </div>
                                {(driver.userId?.phone || driver.phone) && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>
                                      {driver.userId?.phone || "No phone"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div
                                className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                                  isOnline
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                                }`}
                              >
                                {isOnline ? (
                                  <Power className="h-3 w-3" />
                                ) : (
                                  <PowerOff className="h-3 w-3" />
                                )}
                                <span className="text-xs font-medium">
                                  {isOnline ? "Online" : "Offline"}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDriver(driver._id);
                              }}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Route className="h-3 w-3" />
                              <span>{driverRides.length} rides</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>No rating</span>
                            </div>
                          </div>
                          <span>
                            Joined{" "}
                            {new Date(driver.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No drivers found matching your criteria
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filter settings
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Driver Details Sidebar */}
          <div className="space-y-6">
            {selectedDriver ? (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Driver Details</h3>
                  <button
                    onClick={handleCloseDriverDetails}
                    className="p-1 hover:bg-accent rounded transition-colors cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                      <span className="text-green-600 font-medium text-xl">
                        {selectedDriver.userId?.name?.charAt(0).toUpperCase() ||
                          "D"}
                      </span>
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          onlineDrivers?.some(
                            (od: any) => od._id === selectedDriver._id
                          )
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <h4 className="font-semibold">
                      {selectedDriver.userId?.name || "Unknown Driver"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDriver.userId?.email || "No email"}
                    </p>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status
                      </span>
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                          onlineDrivers?.some(
                            (od: any) => od._id === selectedDriver._id
                          )
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                        }`}
                      >
                        {onlineDrivers?.some(
                          (od: any) => od._id === selectedDriver._id
                        ) ? (
                          <Power className="h-3 w-3" />
                        ) : (
                          <PowerOff className="h-3 w-3" />
                        )}
                        <span className="text-xs font-medium">
                          {onlineDrivers?.some(
                            (od: any) => od._id === selectedDriver._id
                          )
                            ? "Online"
                            : "Offline"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Phone
                      </span>
                      <span className="text-sm font-medium">
                        {selectedDriver.userId?.phone || "Not provided"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Rides
                      </span>
                      <span className="text-sm font-medium">
                        {getDriverRides(selectedDriver.userId?._id).length || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Rating
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">No rating</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Joined
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(
                          selectedDriver.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a driver to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
