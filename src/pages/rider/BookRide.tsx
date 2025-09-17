import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Clock,
  CreditCard,
  Car,
  Navigation,
  Calendar,
  Users,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useRequestRideMutation } from "@/redux/features/ride/ride.api";
import { toast } from "sonner";

interface BookRideFormData {
  pickup: string;
  destination: string;
  rideType: string;
  scheduledTime?: string;
  passengers: number;
  notes?: string;
}

const BookRide = () => {
  const navigate = useNavigate();
  const [requestRide, { isLoading }] = useRequestRideMutation();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<BookRideFormData>({
    mode: "onChange",
    defaultValues: {
      pickup: "",
      destination: "",
      rideType: "STANDARD",
      scheduledTime: "",
      passengers: 1,
      notes: "",
    },
  });

  const watchedValues = watch();

  const rideTypes = [
    {
      id: "STANDARD",
      name: "Standard",
      description: "Affordable rides for everyday travel",
      icon: Car,
      price: "From $5",
      eta: "3-5 min",
    },
    {
      id: "PREMIUM",
      name: "Premium",
      description: "Comfortable rides with extra space",
      icon: Car,
      price: "From $8",
      eta: "2-4 min",
    },
    {
      id: "SHARED",
      name: "Shared",
      description: "Share your ride and save money",
      icon: Users,
      price: "From $3",
      eta: "5-8 min",
    },
  ];

  const onSubmit = async (data: BookRideFormData) => {
    try {
      await requestRide(data).unwrap();
      toast.success("Ride requested successfully!");
      navigate("/rider/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to request ride");
      console.error("Failed to request ride:", error);
    }
  };

  const canProceedToStep2 = watchedValues.pickup && watchedValues.destination;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/rider/dashboard"
              className="p-2 hover:bg-green-400/20 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Book a Ride</h1>
              <p className="text-green-100">Where would you like to go?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-all duration-200 ${
                step >= 1
                  ? "bg-green-500 text-white"
                  : "bg-accent text-muted-foreground"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 rounded-full transition-all duration-200 ${
                step >= 2 ? "bg-green-500" : "bg-accent"
              }`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-all duration-200 ${
                step >= 2
                  ? "bg-green-500 text-white"
                  : "bg-accent text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Location Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <span>Trip Details</span>
                </h3>

                <div className="space-y-4">
                  {/* Pickup Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pickup Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-green-500" />
                      <input
                        {...register("pickup", {
                          required: "Pickup location is required",
                          minLength: {
                            value: 3,
                            message:
                              "Pickup location must be at least 3 characters",
                          },
                        })}
                        type="text"
                        placeholder="Enter pickup address"
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.pickup ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.pickup && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pickup.message}
                      </p>
                    )}
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Destination *
                    </label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-5 w-5 text-green-500" />
                      <input
                        {...register("destination", {
                          required: "Destination is required",
                          minLength: {
                            value: 3,
                            message:
                              "Destination must be at least 3 characters",
                          },
                        })}
                        type="text"
                        placeholder="Enter destination address"
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                          errors.destination ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.destination && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.destination.message}
                      </p>
                    )}
                  </div>

                  {/* Scheduled Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Scheduled Time (Optional)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-green-500" />
                      <input
                        {...register("scheduledTime")}
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave empty for immediate pickup
                    </p>
                  </div>

                  {/* Number of Passengers */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Passengers
                    </label>
                    <select
                      {...register("passengers", {
                        valueAsNumber: true,
                        min: {
                          value: 1,
                          message: "At least 1 passenger required",
                        },
                        max: {
                          value: 6,
                          message: "Maximum 6 passengers allowed",
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.passengers ? "border-red-500" : ""
                      }`}
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} passenger{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    {errors.passengers && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passengers.message}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      {...register("notes", {
                        maxLength: {
                          value: 200,
                          message: "Notes must be less than 200 characters",
                        },
                      })}
                      placeholder="Any special instructions for the driver..."
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.notes ? "border-red-500" : ""
                      }`}
                    />
                    {errors.notes && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    canProceedToStep2
                      ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-105"
                      : "bg-accent text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Continue to Ride Type
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Ride Type Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Car className="h-5 w-5 text-green-500" />
                  <span>Choose Ride Type</span>
                </h3>

                <div className="grid gap-4">
                  {rideTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => setValue("rideType", type.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          watchedValues.rideType === type.id
                            ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                            : "border-border hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                watchedValues.rideType === type.id
                                  ? "bg-green-500 text-white"
                                  : "bg-accent"
                              }`}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">{type.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {type.price}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{type.eta}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <input
                  {...register("rideType", {
                    required: "Please select a ride type",
                  })}
                  type="hidden"
                />
                {errors.rideType && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.rideType.message}
                  </p>
                )}
              </div>

              {/* Trip Summary */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium">{watchedValues.pickup}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">
                      {watchedValues.destination}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ride Type:</span>
                    <span className="font-medium">
                      {
                        rideTypes.find((t) => t.id === watchedValues.rideType)
                          ?.name
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Passengers:</span>
                    <span className="font-medium">
                      {watchedValues.passengers}
                    </span>
                  </div>
                  {watchedValues.scheduledTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="font-medium">
                        {new Date(watchedValues.scheduledTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border rounded-lg font-medium hover:bg-accent transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isValid && !isLoading
                      ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-105"
                      : "bg-accent text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Requesting...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Request Ride</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookRide;
