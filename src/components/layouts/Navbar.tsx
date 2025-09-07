import { useState } from "react";
import { Menu, X, Sun, Moon, User, ChevronDown } from "lucide-react";
import type { IRole } from "@/types";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock user state - replace with your actual auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<IRole>("RIDER"); // 'rider', 'driver', 'admin'

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
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
      { label: "Book Ride", href: "/rider/book" },
      { label: "My Rides", href: "/rider/rides" },
      { label: "Profile", href: "/rider/profile" },
    ],
    DRIVER: [
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

  const currentNavItems = isLoggedIn
    ? roleBasedNavItems[userRole]
    : publicNavItems;

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900/95 border-gray-800"
          : "bg-white/95 border-gray-200"
      } backdrop-blur-sm border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span
                className={`ml-2 text-xl font-bold bg-clip-text text-transparent ${
                  isDarkMode
                    ? "bg-gradient-to-r from-green-300 to-green-500"
                    : "bg-gradient-to-r from-green-400 to-green-600"
                }`}
              >
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
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-green-500 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-green-400"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side - Theme toggle, Profile/Auth */}
          <div className="hidden md:flex items-center space-x-4 cursor-pointer">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {userRole}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    <div className="py-1">
                      <a
                        href="/profile"
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Profile Settings
                      </a>
                      <a
                        href="/settings"
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Account Settings
                      </a>
                      <hr
                        className={`my-1 ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      />
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          isDarkMode
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-600 hover:bg-gray-100"
                        }`}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer">
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-800 text-yellow-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden border-t transition-all duration-200 ${
            isDarkMode
              ? "border-gray-800 bg-gray-900/95"
              : "border-gray-200 bg-white/95"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentNavItems.map((item: any) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isDarkMode
                    ? "hover:bg-gray-800 hover:text-green-400"
                    : "hover:bg-gray-100 hover:text-green-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-2">
              <button
                className={`w-full text-left px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Sign In
              </button>
              <button className="w-full text-left px-3 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:from-green-600 hover:to-green-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
