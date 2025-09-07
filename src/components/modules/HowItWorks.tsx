import { useState } from "react";
import {
  Smartphone,
  MapPin,
  Car,
  CreditCard,
  Star,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Users,
  DollarSign,
  Navigation,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string;
}

interface ProcessConfig {
  label: string;
  title: string;
  subtitle: string;
  steps: Step[];
  color: string;
  bgColor: string;
}

type ProcessKeys = "rider" | "driver";

const HowItWorks = () => {
  const [activeProcess, setActiveProcess] = useState<ProcessKeys>("rider");

  const riderSteps: Step[] = [
    {
      icon: Smartphone,
      title: "Open App & Set Location",
      description: "Launch RideBook and enter your pickup location",
      details:
        "Our smart location detection automatically finds your current position, or you can manually set your pickup point.",
    },
    {
      icon: MapPin,
      title: "Choose Destination",
      description: "Enter where you want to go and see fare estimate",
      details:
        "Get instant fare calculations based on distance, traffic conditions, and current demand in your area.",
    },
    {
      icon: Car,
      title: "Get Matched with Driver",
      description: "We find the nearest available driver for you",
      details:
        "Our algorithm matches you with verified drivers nearby, showing their rating, vehicle details, and estimated arrival time.",
    },
    {
      icon: Navigation,
      title: "Track Your Ride",
      description: "Monitor your driver's arrival and trip progress",
      details:
        "Real-time GPS tracking lets you see exactly where your driver is and follow your route during the trip.",
    },
    {
      icon: CreditCard,
      title: "Pay & Rate",
      description: "Complete payment and rate your experience",
      details:
        "Pay securely through the app with multiple payment options and rate your driver to help maintain service quality.",
    },
  ];

  const driverSteps: Step[] = [
    {
      icon: CheckCircle,
      title: "Complete Registration",
      description: "Sign up and verify your documents",
      details:
        "Submit your driving license, vehicle registration, and insurance documents for quick verification.",
    },
    {
      icon: Clock,
      title: "Go Online",
      description: "Set your availability to start receiving requests",
      details:
        "Toggle your status to online whenever you're ready to accept ride requests and start earning.",
    },
    {
      icon: Users,
      title: "Accept Ride Requests",
      description: "Review and accept incoming ride requests",
      details:
        "See passenger details, pickup location, and estimated fare before deciding to accept each ride request.",
    },
    {
      icon: Navigation,
      title: "Pick Up & Drive",
      description: "Navigate to pickup and complete the trip",
      details:
        "Use built-in GPS navigation to reach the pickup point and safely transport passengers to their destination.",
    },
    {
      icon: DollarSign,
      title: "Earn Money",
      description: "Get paid instantly after each completed ride",
      details:
        "Receive payment directly to your account after each trip, with detailed earnings breakdowns and instant payouts.",
    },
  ];

  const processConfig: Record<ProcessKeys, ProcessConfig> = {
    rider: {
      label: "For Riders",
      title: "Book Your Perfect Ride",
      subtitle:
        "Get from point A to B safely and affordably in just a few taps",
      steps: riderSteps,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    driver: {
      label: "For Drivers",
      title: "Start Earning Today",
      subtitle:
        "Turn your car into a money-making opportunity with flexible hours",
      steps: driverSteps,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  };

  const benefits = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "All drivers are verified and rides are tracked for safety",
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Book rides anytime, anywhere with round-the-clock service",
    },
    {
      icon: Star,
      title: "Highly Rated",
      description: "4.9-star average rating from millions of satisfied users",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description:
        "Pay with cash, card, or digital wallet - whatever works for you",
    },
  ];

  const currentConfig = processConfig[activeProcess];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-800/50 opacity-50"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-tr from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 text-gray-800 dark:text-gray-200 mb-4 border-0">
            <PlayCircle className="w-4 h-4 mr-2" />
            How It Works
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Simple Steps to
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              {" "}
              Get Started
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Whether you're looking for a ride or want to start driving, getting
            started with RideBook is quick and easy.
          </p>
        </div>

        {/* Process Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 inline-flex">
            {Object.entries(processConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveProcess(key as ProcessKeys)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                  activeProcess === key
                    ? "bg-white dark:bg-gray-700 shadow-lg transform scale-105 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Process */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3
              className={`text-3xl lg:text-4xl font-bold mb-4 ${currentConfig.color}`}
            >
              {currentConfig.title}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {currentConfig.subtitle}
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 dark:from-blue-800 dark:via-green-800 dark:to-blue-800 transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {currentConfig.steps.map((step, index) => (
                <Card
                  key={index}
                  className="group bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
                >
                  <CardContent className="p-6 text-center">
                    {/* Step Number */}
                    <div
                      className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 ${currentConfig.bgColor} rounded-full flex items-center justify-center text-sm font-bold ${currentConfig.color} border-4 border-white dark:border-gray-800`}
                    >
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${currentConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <step.icon className={`w-8 h-8 ${currentConfig.color}`} />
                    </div>

                    {/* Content */}
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                      {step.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {step.details}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                RideBook
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join millions of users who trust RideBook for safe, reliable, and
              convenient transportation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <benefit.icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Join the RideBook community today and experience transportation the
            way it should be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 cursor-pointer"
            >
              <Car className="w-5 h-5 mr-2" />
              Book Your First Ride
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white px-8 py-3 cursor-pointer"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Start Earning as Driver
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
