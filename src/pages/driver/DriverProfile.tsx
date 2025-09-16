import {
  User,
  Mail,
  Phone,
  Car,
  Shield,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

// User interface definition
interface IVehicleInfo {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  driverStatus?: string;
  isOnline?: boolean;
  vehicleInfo?: IVehicleInfo;
  earnings: number;
  createdAt?: string;
  updatedAt?: string;
}

const DriverProfile = () => {
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);

  console.log("Driver Profile - User Info:", userInfo);

  const user = userInfo?.data as IUser;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-accent rounded w-1/4"></div>
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="h-6 bg-accent rounded w-1/3"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-accent rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Driver Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            View your profile information
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Full Name
              </label>
              <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{user.name}</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number
              </label>
              <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            </div>

            {/* Driver Status */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Driver Status
              </label>
              <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30">
                  APPROVED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-6">Account Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="font-semibold">${user.earnings || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-semibold">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-semibold capitalize">{user.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;