import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Users,
  Car,
  CreditCard,
  Shield,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I book a ride?",
      answer: "Simply open the RideBook app, set your pickup location, enter your destination, choose your ride type, and tap 'Book Now'. You'll be matched with a nearby driver instantly.",
      category: "general"
    },
    {
      id: 2,
      question: "What payment methods are accepted?",
      answer: "We accept cash, credit/debit cards, digital wallets, and mobile banking. You can add and manage payment methods in your profile settings.",
      category: "payment"
    },
    {
      id: 3,
      question: "How do I become a RideBook driver?",
      answer: "Register through our driver portal, upload required documents (license, vehicle registration, insurance), pass our background check, and attend a brief orientation session.",
      category: "driver"
    },
    {
      id: 4,
      question: "Is RideBook safe?",
      answer: "Yes! All drivers undergo background checks, rides are GPS tracked, we have 24/7 support, emergency SOS features, and comprehensive insurance coverage for all trips.",
      category: "safety"
    },
    {
      id: 5,
      question: "Can I schedule rides in advance?",
      answer: "Yes, you can schedule rides up to 7 days in advance. Just select 'Schedule Ride' on the booking screen and choose your preferred date and time.",
      category: "general"
    },
    {
      id: 6,
      question: "How is the fare calculated?",
      answer: "Fares are calculated based on distance, time, demand, and base rates. You'll see the estimated fare before confirming your booking, with no hidden charges.",
      category: "payment"
    },
    {
      id: 7,
      question: "What if I need to cancel my ride?",
      answer: "You can cancel your ride before the driver arrives. Cancellation fees may apply if you cancel after the driver has started moving toward your pickup location.",
      category: "general"
    },
    {
      id: 8,
      question: "How do driver earnings work?",
      answer: "Drivers keep 80% of the fare plus tips. Earnings are calculated automatically and can be viewed in real-time through the driver dashboard.",
      category: "driver"
    },
    {
      id: 9,
      question: "What should I do if I forgot something in the car?",
      answer: "Contact the driver through the app immediately after your trip. If unavailable, use our in-app lost and found feature or contact customer support.",
      category: "general"
    },
    {
      id: 10,
      question: "How do I report a safety concern?",
      answer: "Use the emergency SOS button during rides, report through the app after your trip, or contact our 24/7 safety hotline. All reports are taken seriously and investigated promptly.",
      category: "safety"
    }
  ];

  const categories = [
    { key: "all", label: "All Questions", icon: HelpCircle },
    { key: "general", label: "General", icon: Users },
    { key: "driver", label: "For Drivers", icon: Car },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "safety", label: "Safety", icon: Shield },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Got Questions?
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              {" "}
              We've Got Answers
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to the most common questions about using RideBook, 
            from booking your first ride to becoming a driver partner.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              variant={activeCategory === category.key ? "default" : "outline"}
              className={`
                ${activeCategory === category.key
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 cursor-pointer"
                }
              `}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search terms or browse different categories.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <Card
                  key={faq.id}
                  className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedItems.includes(faq.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-20 text-center">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Still Need Help?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can't find the answer you're looking for? Our support team is here to help 24/7.
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 cursor-pointer">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Faq;