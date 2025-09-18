import { useState } from "react";
import {
  Car,
  Clock,
  Shield,
  Star,
  Users,
  CreditCard,
  Smartphone,
  BarChart3,
  Navigation,
  DollarSign,
  Calendar,
  Settings,
  AlertTriangle,
  Zap,
  Globe,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight: string;
}

interface TabConfig {
  label: string;
  features: Feature[];
}

type TabKeys = "riders" | "drivers";

const Features = () => {
  const [activeTab, setActiveTab] = useState<TabKeys>("riders");

  const riderFeatures = [
    {
      icon: Smartphone,
      title: "Easy Booking",
      description:
        "Book rides instantly with just a few taps. Set pickup and destination with smart location suggestions.",
      highlight: "One-tap booking",
    },
    {
      icon: Navigation,
      title: "Live Tracking",
      description:
        "Track your driver in real-time with accurate GPS location and estimated arrival times.",
      highlight: "Real-time GPS",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description:
        "Pay with cash, card, or digital wallet. Secure and convenient payment processing.",
      highlight: "Secure payments",
    },
    {
      icon: Star,
      title: "Rate & Review",
      description:
        "Share feedback about your ride experience to help maintain service quality.",
      highlight: "Quality assurance",
    },
    {
      icon: Calendar,
      title: "Ride History",
      description:
        "Access detailed history of all your rides with receipts and route information.",
      highlight: "Complete records",
    },
    {
      icon: AlertTriangle,
      title: "SOS Emergency",
      description:
        "Emergency button for safety with instant location sharing to trusted contacts.",
      highlight: "Safety first",
    },
  ];

  const driverFeatures = [
    {
      icon: DollarSign,
      title: "Flexible Earnings",
      description:
        "Drive on your schedule and earn competitive rates with transparent fare calculations.",
      highlight: "Your schedule",
    },
    {
      icon: BarChart3,
      title: "Earnings Dashboard",
      description:
        "Track daily, weekly, and monthly earnings with detailed analytics and insights.",
      highlight: "Detailed analytics",
    },
    {
      icon: Settings,
      title: "Availability Control",
      description:
        "Go online or offline anytime. Control when you want to receive ride requests.",
      highlight: "Full control",
    },
    {
      icon: Navigation,
      title: "Smart Route Planning",
      description:
        "Get optimized routes to destinations with traffic updates and alternate paths.",
      highlight: "Efficient routes",
    },
    {
      icon: Users,
      title: "Passenger Management",
      description:
        "View passenger details, contact information, and ride preferences before accepting.",
      highlight: "Know your riders",
    },
    {
      icon: Shield,
      title: "Driver Protection",
      description:
        "Comprehensive insurance coverage and 24/7 support for driver safety and security.",
      highlight: "Protected always",
    },
  ];

  const coreFeatures = [
    {
      icon: Globe,
      title: "Multi-City Coverage",
      description:
        "Available in 100+ cities worldwide with local language support",
      stat: "100+ Cities",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock service with instant ride matching",
      stat: "24/7 Service",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Average wait time under 3 minutes in most locations",
      stat: "<3 Min Wait",
    },
    {
      icon: Heart,
      title: "Customer Satisfaction",
      description: "Consistently high ratings from millions of happy users",
      stat: "4.9★ Rating",
    },
  ];

  const tabConfig: Record<TabKeys, TabConfig> = {
    riders: { label: "For Riders", features: riderFeatures },
    drivers: { label: "For Drivers", features: driverFeatures },
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100 to-transparent dark:from-green-900"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need for
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              {" "}
              Smart Transportation
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover why millions choose RideBook for their daily transportation
            needs. From seamless booking to comprehensive management tools,
            we've got everyone covered.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {coreFeatures?.map((feature, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {feature.stat}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role-based Features */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {Object.entries(tabConfig)?.map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as TabKeys)}
                  className={`flex-1 py-6 px-8 text-lg font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === key
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-b-2 border-green-500"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tabConfig[activeTab].features?.map((feature, index: number) => (
                <Card
                  key={index}
                  className="group bg-gray-50 dark:bg-gray-700 border-0 hover:shadow-lg transition-all duration-300 hover:bg-white dark:hover:bg-gray-600"
                >
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                      <feature.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-700 text-xs"
                      >
                        {feature.highlight}
                      </Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Experience the Difference?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join millions of satisfied users and start your journey with
            RideBook today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 cursor-pointer"
            >
              <Car className="w-5 h-5 mr-2" />
              Start Riding
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-3 cursor-pointer"
            >
              <Users className="w-5 h-5 mr-2" />
              Become a Driver
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full opacity-10 translate-x-16 translate-y-16"></div>
      <div className="absolute top-20 left-0 w-24 h-24 bg-green-300 dark:bg-green-700 rounded-full opacity-15 -translate-x-12"></div>
    </section>
  );
};

export default Features;