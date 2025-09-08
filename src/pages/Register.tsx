import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Car,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name is too long" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required" })
      .regex(/^[+]?[\d\s\-\(\)]{10,}$/, {
        message: "Please enter a valid phone number",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
    role: z.enum(["rider", "driver"]),
    vehicleModel: z.string().optional(),
    vehiclePlate: z.string().optional(),
    termsAccepted: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.termsAccepted === true, {
    message: "You must accept the terms and conditions to continue",
    path: ["termsAccepted"],
  })
  .refine(
    (data) => {
      if (data.role === "driver") {
        return data.vehicleModel && data.vehicleModel.length > 0;
      }
      return true;
    },
    {
      message: "Vehicle model is required for drivers",
      path: ["vehicleModel"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "driver") {
        return data.vehiclePlate && /^[A-Z0-9\-]+$/i.test(data.vehiclePlate);
      }
      return true;
    },
    {
      message: "License plate is required for drivers",
      path: ["vehiclePlate"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "rider",
      vehicleModel: "",
      vehiclePlate: "",
      termsAccepted: false,
    },
  });

  const selectedRole = watch("role");
  const termsAccepted = watch("termsAccepted");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
      ...(data.role === "driver" && {
        vehicleModel: data.vehicleModel,
        vehiclePlate: data.vehiclePlate,
      }),
    };

    try {
      await registerUser(userInfo).unwrap();
      // console.log("Registration successful:", data);
      toast.success("Account created successfully! Please login to continue.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            RideBook
          </h1>
          <p className="text-muted-foreground mt-2">
            Join thousands of riders and drivers
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Fill in your details to get started with RideBook
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register("name")}
                    className={`pl-10 transition-all duration-200 focus:ring-green-500 focus:border-green-500 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={`pl-10 transition-all duration-200 focus:ring-green-500 focus:border-green-500 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                    className={`pl-10 transition-all duration-200 focus:ring-green-500 focus:border-green-500 ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Account Type
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) =>
                    setValue("role", value as "rider" | "driver", { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rider">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Rider - Book rides</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="driver">
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4" />
                        <span>Driver - Provide rides</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Driver-specific fields */}
              {selectedRole === "driver" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel" className="text-sm font-medium">
                      Vehicle Model
                    </Label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="vehicleModel"
                        type="text"
                        placeholder="e.g., Toyota Corolla 2020"
                        {...register("vehicleModel")}
                        className={`pl-10 transition-all duration-200 focus:ring-green-500 focus:border-green-500 ${
                          errors.vehicleModel
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.vehicleModel && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.vehicleModel.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehiclePlate" className="text-sm font-medium">
                      License Plate Number
                    </Label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="vehiclePlate"
                        type="text"
                        placeholder="e.g., ABC-1234"
                        {...register("vehiclePlate")}
                        className={`pl-10 transition-all duration-200 focus:ring-green-500 focus:border-green-500 ${
                          errors.vehiclePlate
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.vehiclePlate && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.vehiclePlate.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...register("password")}
                    className={`pl-10 pr-10 transition-all duration-200 focus:ring-green-500 focus:border-green-500 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
                    className={`pl-10 pr-10 transition-all duration-200 focus:ring-green-500 focus:border-green-500 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setValue("termsAccepted", checked as boolean, { shouldValidate: true })
                  }
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto font-medium text-green-600 hover:text-green-700 hover:underline cursor-pointer"
                    >
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto font-medium text-green-600 hover:text-green-700 hover:underline cursor-pointer"
                    >
                      Privacy Policy
                    </Button>
                  </Label>
                </div>
              </div>
              {errors.termsAccepted && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.termsAccepted.message}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?
                </span>{" "}
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-medium text-green-600 hover:text-green-700 hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;