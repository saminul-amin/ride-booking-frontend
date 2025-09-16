import { useState } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { ModeToggle } from "./ModeToggler";
import { Link, useNavigate } from "react-router";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hook";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: userInfo, isLoading, isError } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();

  console.log(userInfo);
  const isLoggedIn = !!userInfo && !isError && !loggedOut;
  const userRole = userInfo?.data?.role;

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const publicNavItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "How it Works", href: "/how-it-works" },
  ];

  const roleBasedNavItems = {
    RIDER: [
      { label: "Dashboard", href: "/rider/dashboard" },
      { label: "Book Ride", href: "/rider/book-ride" },
      { label: "My Rides", href: "/rider/rides" },
      { label: "Profile", href: "/rider/profile" },
    ],
    driver: [
      { label: "Dashboard", href: "/driver/dashboard" },
      { label: "Active Rides", href: "/driver/active" },
      { label: "Earnings", href: "/driver/earnings" },
      { label: "Profile", href: "/driver/profile" },
    ],
    ADMIN: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Users", href: "/admin/users" },
      { label: "Rides", href: "/admin/rides" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  };

  console.log(isLoggedIn);
  const currentNavItems = isLoggedIn
    ? roleBasedNavItems[userRole as keyof typeof roleBasedNavItems]
    : publicNavItems;

  console.log(isLoggedIn, userRole)
  const handleLogout = async () => {
    try {
      await logout(undefined);
      dispatch(authApi.util.resetApiState());
      setLoggedOut(true);
      toast("Successfully logged out!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Add this before your return statement
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Just show logo while loading */}
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              RideBook
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent cursor-pointer hover:from-green-500 hover:to-green-700 transition-all duration-200">
                RideBook
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item: any) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-medium transition-all duration-200   cursor-pointer rounded-lg hover:text-green-500"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side - Theme toggle, Profile/Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:scale-105 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-green-600 hover:shadow-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {userRole}
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 hover:rotate-180" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border">
                    <div className="py-1">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm transition-all duration-200 hover:bg-accent hover:text-primary cursor-pointer hover:pl-6"
                      >
                        Profile Settings
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm transition-all duration-200 hover:bg-accent hover:text-primary cursor-pointer hover:pl-6"
                      >
                        Account Settings
                      </a>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm transition-all duration-200 text-destructive hover:bg-accent cursor-pointer hover:pl-6 hover:text-red-600"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="px-4 py-2 text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 cursor-pointer rounded-lg hover:bg-accent/50 hover:shadow-md">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer hover:shadow-lg hover:shadow-green-500/25">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <ModeToggle />

            <button
              onClick={toggleMenu}
              className="p-2 rounded-md transition-all duration-200 hover:bg-accent cursor-pointer hover:scale-110 hover:shadow-md"
            >
              {isOpen ? (
                <X className="h-6 w-6 transition-transform duration-200 hover:rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200 hover:scale-110" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentNavItems.map((item: any) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-accent hover:text-primary cursor-pointer hover:pl-6 hover:shadow-md"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile Auth Buttons */}
            {!isLoggedIn && (
              <div className="pt-4 space-y-2">
                <Link to="/login">
                  <button className="w-full text-left px-3 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-accent hover:text-primary cursor-pointer hover:pl-6 hover:shadow-md">
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="w-full text-left px-3 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:from-green-600 hover:to-green-700 cursor-pointer hover:pl-6 hover:shadow-green-500/25">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
