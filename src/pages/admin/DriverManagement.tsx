import { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Star,
  Route,
  DollarSign,
  Eye,
  Trash2,
  Activity,
  TrendingUp,
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
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: allDriversData, isLoading: driversLoading } = useGetAllDriversQuery(undefined);
  const { data: onlineDriversData, isLoading: onlineDriversLoading } = useGetOnlineDriversQuery(undefined);
  const { data: allRidesData } = useGetAllRidesQuery(undefined);
  const [deleteDriver] = useDeleteDriverProfileMutation();

  const allDrivers = allDriversData?.data || [];
  const onlineDrivers = onlineDriversData?.data || [];
  const allRides = allRidesData?.data || [];

  // Filter drivers based on search term and status
  const filteredDrivers = allDrivers?.filter((driver: any) => {
    const matchesSearch = 
      driver.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const isOnline = onlineDrivers?.some((od: any) => (od.id || od._id) === (driver.id || driver._id));
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "online" && isOnline) ||
      (filterStatus === "offline" && !isOnline) ||
      (filterStatus === "verified" && driver.isVerified) ||
      (filterStatus === "unverified" && !driver.isVerified);

    return matchesSearch && matchesFilter;
  }) || [];

  // Calculate driver statistics
  const totalDrivers = allDrivers?.length || 0;
  const onlineDriversCount = onlineDrivers?.length || 0;
  const verifiedDrivers = allDrivers?.filter((driver: any) => driver.isVerified)?.length || 0;
  
  const newDriversThisMonth = allDrivers?.filter((driver: any) => {
    const driverDate = new Date(driver.createdAt);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return driverDate.getMonth() === currentMonth && driverDate.getFullYear() === currentYear;
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
      if (selectedDriver && (selectedDriver.id || selectedDriver._id) === driverId) {
        setSelectedDriver(null);
      }
    } catch (error) {
      toast.error("Failed to delete driver");
      console.error("Error deleting driver:", error);
    }
  };

  // Get driver's rides
  const getDriverRides = (driverId: string) => {
    return allRides?.filter((ride: any) => 
      (ride.driver?.id || ride.driver?._id || ride.driverId) === driverId
    ) || [];
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
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Drivers</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Drivers</p>
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
                <p className="text-muted-foreground text-sm font-medium">Online Now</p>
                <p className="text-2xl font-bold text-green-600">{onlineDriversCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalDrivers > 0 ? ((onlineDriversCount / totalDrivers) * 100).toFixed(1) : 0}% active
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
                <p className="text-muted-foreground text-sm font-medium">Verified</p>
                <p className="text-2xl font-bold text-purple-600">{verifiedDrivers}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalDrivers > 0 ? ((verifiedDrivers / totalDrivers) * 100).toFixed(1) : 0}% verified
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">New This Month</p>
                <p className="text-2xl font-bold text-orange-600">{newDriversThisMonth}</p>
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
                    const isOnline = onlineDrivers?.some((od: any) => (od.id || od._id) === (driver.id || driver._id));
                    const driverRides = getDriverRides(driver.id || driver._id);
                    
                    return (
                      <div
                        key={driver.id || driver._id}
                        className="border rounded-lg p-4 hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer transition-colors"
                        onClick={() => handleDriverSelect(driver)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center relative">
                              <span className="text-blue-600 font-medium">
                                {(driver.user?.name || driver.name)?.charAt(0).toUpperCase() || "D"}
                              </span>
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                isOnline ? "bg-green-500" : "bg-gray-400"
                              }`}></div>
                            </div>
                            <div>
                              <p className="font-medium">{driver.user?.name || driver.name || "Unknown Driver"}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{driver.user?.email || driver.email || "No email"}</span>
                                </div>
                                {(driver.user?.phone || driver.phone) && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{driver.user?.phone || driver.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {driver.isVerified && (
                                <div className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                                  <Star className="h-3 w-3 text-purple-600" />
                                  <span className="text-xs text-purple-600 font-medium">Verified</span>
                                </div>
                              )}
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                                isOnline
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                              }`}>
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
                                handleDeleteDriver(driver.id || driver._id);
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
                              <DollarSign className="h-3 w-3" />
                              <span>${driver.totalEarnings || 0} earned</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{driver.rating || driver.totalRating || "No rating"}</span>
                            </div>
                          </div>
                          <span>
                            Joined {new Date(driver.createdAt).toLocaleDateString()}
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
                    className="p-1 hover:bg-accent rounded transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                      <span className="text-blue-600 font-medium text-xl">
                        {(selectedDriver.user?.name || selectedDriver.name)?.charAt(0).toUpperCase() || "D"}
                      </span>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        onlineDrivers?.some((od: any) => (od.id || od._id) === (selectedDriver.id || selectedDriver._id))
                          ? "bg-green-500" : "bg-gray-400"
                      }`}></div>
                    </div>
                    <h4 className="font-semibold">{selectedDriver.user?.name || selectedDriver.name || "Unknown Driver"}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDriver.user?.email || selectedDriver.email || "No email"}
                    </p>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                        onlineDrivers?.some((od: any) => (od.id || od._id) === (selectedDriver.id || selectedDriver._id))
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600"
                      }`}>
                        {onlineDrivers?.some((od: any) => (od.id || od._id) === (selectedDriver.id || selectedDriver._id)) ? (
                          <Power className="h-3 w-3" />
                        ) : (
                          <PowerOff className="h-3 w-3" />
                        )}
                        <span className="text-xs font-medium">
                          {onlineDrivers?.some((od: any) => (od.id || od._id) === (selectedDriver.id || selectedDriver._id)) ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Phone</span>
                      <span className="text-sm font-medium">
                        {selectedDriver.user?.phone || selectedDriver.phone || "Not provided"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">License</span>
                      <span className="text-sm font-medium">
                        {selectedDriver.licenseNumber || "Not provided"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Verified</span>
                      <span className={`text-sm font-medium ${
                        selectedDriver.isVerified ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedDriver.isVerified ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Rides</span>
                      <span className="text-sm font-medium">
                        {getDriverRides(selectedDriver.id || selectedDriver._id).length || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Earnings</span>
                      <span className="text-sm font-medium text-green-600">
                        ${selectedDriver.totalEarnings || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {selectedDriver.rating || selectedDriver.totalRating || "No rating"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Joined</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedDriver.createdAt).toLocaleDateString()}
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

            {/* Quick Stats */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Platform Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Online Rate</span>
                  <span className="font-medium text-green-600">
                    {totalDrivers > 0 ? ((onlineDriversCount / totalDrivers) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verification Rate</span>
                  <span className="font-medium">
                    {totalDrivers > 0 ? ((verifiedDrivers / totalDrivers) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New This Month</span>
                  <span className="font-medium text-orange-600">
                    +{newDriversThisMonth}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>Send Notification</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3 transition-colors">
                  <TrendingUp className="h-4 w-4" />
                  <span>View Analytics</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-accent flex items-center space-x-3 transition-colors">
                  <Filter className="h-4 w-4" />
                  <span>Advanced Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;