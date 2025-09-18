import { useState } from "react";
import {
  User,
  Search,
  Mail,
  Phone,
  Calendar,
  Route,
  DollarSign,
  Eye
} from "lucide-react";
import {
  useGetAllUsersQuery,
} from "@/redux/features/admin/admin.api";
import { useGetAllRidesQuery } from "@/redux/features/admin/admin.api";

const RiderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRider, setSelectedRider] = useState<any>(null);

  const { data: allUsersData, isLoading: usersLoading } =
    useGetAllUsersQuery(undefined);
  const { data: allRidesData } = useGetAllRidesQuery(undefined);

  const allUsers = allUsersData?.data || [];
  const allRides = allRidesData?.data || [];

  const allRiders = allUsers.filter((user: any) => user.role === 'rider');

  const filteredRiders =
    allRiders?.filter((rider: any) => {
      const matchesSearch =
        rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    }) || [];

  const totalRiders = allRiders?.length || 0;

  const newRidersThisMonth =
    allRiders?.filter((rider: any) => {
      const riderDate = new Date(rider.createdAt);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      return (
        riderDate.getMonth() === currentMonth &&
        riderDate.getFullYear() === currentYear
      );
    })?.length || 0;

  const totalAmountSpent =
    allRides?.reduce((total: number, ride: any) => {
      if (ride.status === "completed" && ride.fare) {
        return total + ride.fare;
      }
      return total;
    }, 0) || 0;

  const handleRiderSelect = (rider: any) => {
    setSelectedRider(rider);
  };

  const handleCloseRiderDetails = () => {
    setSelectedRider(null);
  };

  const getRiderRides = (riderId: string) => {
    return allRides?.filter((ride: any) => ride.riderId?._id === riderId) || [];
  };

  if (usersLoading) {
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
              Rider Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor platform riders
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search riders..."
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
                  Total Riders
                </p>
                <p className="text-2xl font-bold">{totalRiders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  New This Month
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {newRidersThisMonth}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent signups
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  ${totalAmountSpent.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  From completed rides
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Riders List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span>Riders List</span>
                </h2>
                <div className="text-sm text-muted-foreground">
                  {filteredRiders.length} Riders
                </div>
              </div>

              <div className="space-y-4">
                {filteredRiders.length > 0 ? (
                  filteredRiders.map((rider: any) => {
                    const riderRides = getRiderRides(rider._id);

                    return (
                      <div
                        key={rider._id}
                        className="border rounded-lg p-4 hover:border-green-200 dark:hover:border-green-800 cursor-pointer"
                        onClick={() => handleRiderSelect(rider)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-medium">
                                {rider.name?.charAt(0).toUpperCase() || "R"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {rider.name || "Unknown Rider"}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{rider.email || "No email"}</span>
                                </div>
                                {rider.phone && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{rider.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Route className="h-3 w-3" />
                              <span>{riderRides.length} rides</span>
                            </div>
                          </div>
                          <span>
                            Joined{" "}
                            {new Date(rider.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No riders found matching your criteria
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search settings
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rider Details Sidebar */}
          <div className="space-y-6">
            {selectedRider ? (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Rider Details</h3>
                  <button
                    onClick={handleCloseRiderDetails}
                    className="p-1 hover:bg-accent rounded cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-medium text-xl">
                        {selectedRider.name?.charAt(0).toUpperCase() || "R"}
                      </span>
                    </div>
                    <h4 className="font-semibold">
                      {selectedRider.name || "Unknown Rider"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRider.email || "No email"}
                    </p>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Phone
                      </span>
                      <span className="text-sm font-medium">
                        {selectedRider.phone || "Not provided"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Role
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {selectedRider.role || "Rider"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Rides
                      </span>
                      <span className="text-sm font-medium">
                        {getRiderRides(selectedRider._id).length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Joined
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(selectedRider.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Rider Details</h3>
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a rider to view details
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

export default RiderManagement;