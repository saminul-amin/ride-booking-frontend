import { useState, useEffect } from "react";
import {
  Car,
  MapPin,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const testimonials = [
    {
      text: "RideBook made my daily commute so much easier!",
      author: "Sarah Johnson",
      rating: 5,
      role: "Regular Rider",
    },
    {
      text: "As a driver, I love the flexible earning opportunities.",
      author: "Michael Chen",
      rating: 5,
      role: "Driver Partner",
    },
    {
      text: "Safe, reliable, and affordable rides every time.",
      author: "Emily Davis",
      rating: 5,
      role: "Business Traveler",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users" },
    { icon: Car, value: "10K+", label: "Drivers" },
    { icon: MapPin, value: "100+", label: "Cities" },
    { icon: Star, value: "4.9", label: "Rating" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleBookRide = () => {
    if (!pickup || !destination) {
      return;
    }
    // Navigate to booking page or login if not authenticated
    navigate("/register");
  };

  const handleBecomeDriver = () => {
    navigate("/register");
  };

  const handleWatchDemo = () => {
    // Handle demo video or tour
    console.log("Watch demo clicked");
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute bg-grid-pattern inset-0 bg-grid-pattern opacity-5"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-16 w-32 h-32 bg-green-300 dark:bg-green-700 rounded-full opacity-10 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-green-400 dark:bg-green-600 rounded-full opacity-15 animate-pulse"></div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2 text-sm font-medium w-fit"
            >
              <Zap className="w-4 h-4 mr-2" />
              #1 Ride Booking Platform
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  Your Ride,
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Your Way</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
                Book rides instantly, earn as a driver, or manage your fleet.
                Join millions who trust RideBook for safe, reliable
                transportation.
              </p>
            </div>

            {/* Quick Booking Form */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Book Your Ride Now
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    <Input
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="pl-12 py-3 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    <Input
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-12 py-3 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <Button
                    onClick={handleBookRide}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 cursor-pointer"
                  >
                    <Car className="w-5 h-5 mr-2" />
                    Find Your Ride
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleBecomeDriver}
                variant="outline"
                size="lg"
                className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200 px-8 py-3 cursor-pointer"
              >
                <Car className="w-5 h-5 mr-2" />
                Become a Driver
              </Button>
              <Button
                onClick={handleWatchDemo}
                variant="ghost"
                size="lg"
                className="text-gray-600 dark:text-gray-300 hover:text-green-600 px-8 py-3 cursor-pointer"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            {/* Main Visual Card */}
            <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900 border-0 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <CardContent className="p-8">
                {/* App Interface Mockup */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Your Ride
                    </h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      On Time
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Toyota Camry
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          ABC-1234 • 2 min away
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Downtown Office
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          International Airport
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        $24.50
                      </span>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 cursor-pointer"
                      >
                        Track Ride
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Card */}
            <Card className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 border-0 shadow-xl max-w-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {testimonials[currentTestimonial].author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {testimonials[currentTestimonial].author}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Badges */}
            <div className="absolute -top-8 -right-4 space-y-2">
              <Badge className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg">
                <Shield className="w-4 h-4 mr-1" />
                Secure
              </Badge>
              <Badge className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg">
                <Clock className="w-4 h-4 mr-1" />
                24/7 Available
              </Badge>
              <Badge className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified Drivers
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-20 fill-white dark:fill-gray-900"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
