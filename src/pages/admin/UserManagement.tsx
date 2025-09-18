import { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Star,
  Eye,
  UserCheck,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
} from "@/redux/features/admin/admin.api";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: allUsersData, isLoading: usersLoading } = useGetAllUsersQuery(undefined);
  const { data: selectedUserData2, isLoading: userDetailsLoading } = useGetSingleUserQuery(
    selectedUser!,
    { skip: !selectedUser }
  );

  const allUsers = allUsersData?.data;
  const selectedUserData = selectedUserData2?.data;

  console.log("All Users:", allUsers);

  // Filter users based on search term and status
  const filteredUsers = allUsers?.filter((user: any) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "riders" && user.role === "rider") ||
      (filterStatus === "drivers" && user.role === "driver");

    return matchesSearch && matchesFilter;
  }) || [];

  // Calculate user statistics
  const totalUsers = allUsers?.length || 0;
  let riders = 0, drivers = 0;
  allUsers?.forEach((user: any) => {
    if (user.role === "rider") riders++;
    else if (user.role === "driver") drivers++;
  });
  const newUsersThisMonth = allUsers?.filter((user: any) => {
    const userDate = new Date(user.createdAt);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
  })?.length || 0;

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
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
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor platform users
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="all">All Users</option>
              <option value="drivers">Drivers</option>
              <option value="riders">Riders</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Riders</p>
                <p className="text-2xl font-bold text-green-600">{riders}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalUsers > 0 ? ((riders / totalUsers) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Drivers</p>
                <p className="text-2xl font-bold text-blue-600">{drivers}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalUsers > 0 ? ((drivers / totalUsers) * 100).toFixed(1) : 0}% verified
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
                <p className="text-2xl font-bold text-orange-600">{newUsersThisMonth}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent signups
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
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Users List</span>
                </h2>
                <div className="text-sm text-muted-foreground">
                  {filteredUsers.length} Users
                </div>
              </div>

              <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user: any) => (
                    <div
                      key={user._id}
                      className="border rounded-lg p-4 hover:border-blue-200 dark:hover:border-green-800 cursor-pointer"
                      onClick={() => handleUserSelect(user._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-medium">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name || "Unknown User"}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{user.email || "No email"}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No users found matching your criteria
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filter settings
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Details Sidebar */}
          <div className="space-y-6">
            {selectedUser && selectedUserData ? (
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">User Details</h3>
                  <button
                    onClick={handleCloseUserDetails}
                    className="p-1 hover:bg-accent rounded cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                {userDetailsLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-accent rounded w-3/4"></div>
                    <div className="h-4 bg-accent rounded w-1/2"></div>
                    <div className="h-4 bg-accent rounded w-full"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 font-medium text-xl">
                          {selectedUserData.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <h4 className="font-semibold">{selectedUserData.name || "Unknown User"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedUserData.email || "No email"}
                      </p>
                    </div>

                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm font-medium">
                          {selectedUserData.phone || "Not provided"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Role</span>
                        <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                          
                          <span className="text-xs font-medium">
                            {selectedUserData?.role.toUpperCase() || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {selectedUserData.rating || "No rating"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Joined</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedUserData.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">User Details</h3>
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a user to view details
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

export default UserManagement;