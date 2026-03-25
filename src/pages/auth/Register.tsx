import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api/config";
import type { AxiosError } from "axios";
import VelvetaLogo from "../../assets/icon/velveta.jpeg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FaUser, FaUserShield } from "react-icons/fa";

import { LoadingSpinner } from "../../components/ui/loading/LoadingSpinner";
import { Alert } from "../../components/ui/Alert";
import { cn } from "../../libs/utils";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  expected_pin?: string;
  next_pin?: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  work_pin: string;
  newsletter: boolean;
  terms: boolean;
}

type RegisterMode = "user" | "admin";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<RegisterMode>("user");

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    work_pin: "",
    newsletter: true,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [expectedPin, setExpectedPin] = useState<string | null>(null);
  const [nextPin, setNextPin] = useState<string | null>(null);
  const [availablePins, setAvailablePins] = useState<string[]>([]);

  const [alertState, setAlertState] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWorkPin, setShowWorkPin] = useState(false);

  // Fetch available pins when mode is admin
  useEffect(() => {
    if (mode === "admin") {
      fetchAvailablePins();
    }
  }, [mode]);

  const showAlert = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setAlertState({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setAlertState((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const fetchAvailablePins = async () => {
    try {
      const response = await api.get("/admin/available-pins");
      const pins = response.data.available_pins.map((p: any) => p.work_pin);
      setAvailablePins(pins);

      if (pins.length > 0) {
        setExpectedPin(pins[0]);
      }
    } catch (error) {
      console.error("Failed to fetch available pins:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google/redirect";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    const newValue = name === "work_pin" ? value.toUpperCase() : value;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleModeSwitch = (newMode: RegisterMode) => {
    setMode(newMode);
    setForm({
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      work_pin: "",
      newsletter: true,
      terms: false,
    });
    setErrors({});
    setExpectedPin(null);
    setNextPin(null);
    setAlertState((prev) => ({ ...prev, show: false }));

    if (newMode === "admin") {
      fetchAvailablePins();
    }
  };

  const validateForm = (): boolean => {
    // Check terms
    if (!form.terms) {
      setErrors({ terms: ["You must agree to the terms"] });
      return false;
    }

    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: ["Passwords do not match"] });
      return false;
    }

    if (mode === "admin") {
      if (!form.work_pin) {
        setErrors({ work_pin: ["Work PIN is required"] });
        return false;
      }

      if (!/^VELVETA\d{2}$/.test(form.work_pin)) {
        setErrors({
          work_pin: [
            "Invalid PIN format. Must be VELVETA followed by 2 digits (e.g., VELVETA01)",
          ],
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setAlertState((prev) => ({ ...prev, show: false }));

    try {
      let response;

      if (mode === "admin") {
        response = await api.post("/admin/register", {
          username: form.username,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          work_pin: form.work_pin,
        });

        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.next_pin) {
          setNextPin(data.next_pin);
        }

        showAlert(
          "Admin registration successful! Redirecting to dashboard...",
          "success",
        );

        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        response = await api.post("/register", {
          username: form.username,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        });

        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showAlert(
          "User registration successful! Redirecting to homepage...",
          "success",
        );

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as AxiosError<ApiErrorResponse>;

        if (error.response?.status === 422) {
          if (error.response.data?.errors) {
            setErrors(error.response.data.errors);
          }

          if (error.response.data?.expected_pin) {
            setExpectedPin(error.response.data.expected_pin);
            setErrors({
              work_pin: [
                error.response.data.message ||
                  `Expected PIN: ${error.response.data.expected_pin}`,
              ],
            });
          }
        } else {
          setErrors({
            general: [
              error.response?.data?.message ||
                "Registration failed. Please try again.",
            ],
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Notification */}
      {alertState.show && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <Alert
            type={alertState.type}
            message={alertState.message}
            dismissible
            onDismiss={() =>
              setAlertState((prev) => ({ ...prev, show: false }))
            }
            className="shadow-lg max-w-sm"
          />
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white text-black py-3 px-6 shadow-md z-40 flex justify-between items-center">
        <div className="logo">
          <img src={VelvetaLogo} alt="Velveta Logo" className="h-14" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 font-['Montserrat'] text-gray-800">
            Create an Account
          </h2>

          {/* Role Selection */}
          <div className="flex justify-between gap-4 mb-8">
            {/* User Registration Card */}
            <button
              onClick={() => handleModeSwitch("user")}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 transition-all duration-300",
                mode === "user"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
              )}
              disabled={isLoading}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "p-3 rounded-full transition-colors",
                    mode === "user"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600",
                  )}>
                  <FaUser className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "font-medium",
                    mode === "user" ? "text-red-600" : "text-gray-700",
                  )}>
                  Register as User
                </span>
                {mode === "user" && (
                  <span className="text-xs text-red-600 font-medium">
                    Selected
                  </span>
                )}
              </div>
            </button>

            {/* Admin Registration Card */}
            <button
              onClick={() => handleModeSwitch("admin")}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 transition-all duration-300",
                mode === "admin"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
              )}
              disabled={isLoading}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "p-3 rounded-full transition-colors",
                    mode === "admin"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600",
                  )}>
                  <FaUserShield className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "font-medium",
                    mode === "admin" ? "text-red-600" : "text-gray-700",
                  )}>
                  Register as Admin
                </span>
                {mode === "admin" && (
                  <span className="text-xs text-red-600 font-medium">
                    Selected
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Available PIN Info - Admin only */}
          {mode === "admin" && availablePins.length > 0 && (
            <div className="mb-4">
              <Alert
                type="info"
                title="Available Work PINs"
                message={
                  <div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availablePins.map((pin) => (
                        <span
                          key={pin}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            pin === expectedPin
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : "bg-gray-100 text-gray-600",
                          )}>
                          {pin} {pin === expectedPin && "✓"}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Use PIN in sequence. Next available:{" "}
                      {expectedPin || "Loading..."}
                    </p>
                  </div>
                }
                className="mb-4"
              />
            </div>
          )}

          {/* Registration Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">
              * indicates required field
            </p>

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <Alert
                type="error"
                title="Please fix the following errors:"
                message={
                  <ul className="list-disc list-inside text-sm">
                    {Object.entries(errors).map(
                      ([field, fieldErrors]) =>
                        field !== "general" &&
                        fieldErrors.map((error, idx) => (
                          <li key={`${field}-${idx}`}>{error}</li>
                        )),
                    )}
                  </ul>
                }
                className="mb-6"
              />
            )}

            {errors.general && (
              <Alert
                type="error"
                message={errors.general[0]}
                className="mb-6"
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat']">
                  Personal Information
                </h3>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-2 text-gray-700">
                    * Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={cn(
                      "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed",
                      errors.username ? "border-red-500" : "border-gray-300",
                    )}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.username[0]}
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-gray-700">
                    * Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={cn(
                      "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed",
                      errors.email ? "border-red-500" : "border-gray-300",
                    )}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Account Information Section */}
              <div className="pt-2 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat']">
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-2 text-gray-700">
                      * Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed",
                          errors.password
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 disabled:opacity-50">
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password_confirmation"
                      className="block text-sm font-medium mb-2 text-gray-700">
                      * Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="password_confirmation"
                        name="password_confirmation"
                        required
                        value={form.password_confirmation}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed",
                          errors.password_confirmation
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 disabled:opacity-50">
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password_confirmation[0]}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 8 characters long and include at
                  least one uppercase letter, one lowercase letter, and one
                  number.
                </p>
              </div>

              {/* Admin Work PIN Section */}
              {mode === "admin" && (
                <div className="pt-2 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat']">
                    Admin Verification
                  </h3>

                  <div>
                    <label
                      htmlFor="work_pin"
                      className="block text-sm font-medium mb-2 text-gray-700">
                      * Work PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showWorkPin ? "text" : "password"}
                        id="work_pin"
                        name="work_pin"
                        required={mode === "admin"}
                        value={form.work_pin}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="VELVETA01"
                        maxLength={9}
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 pr-12 font-mono uppercase disabled:bg-gray-100 disabled:cursor-not-allowed",
                          errors.work_pin
                            ? "border-red-500"
                            : "border-gray-300",
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowWorkPin(!showWorkPin)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 disabled:opacity-50">
                        {showWorkPin ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {expectedPin && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          Next: {expectedPin}
                        </span>
                      )}
                    </div>
                    {errors.work_pin && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.work_pin[0]}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Terms Section */}
              <div className="pt-2">
                <div className="flex items-start mt-6">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      required
                      checked={form.terms}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-300 border-gray-300 disabled:opacity-50"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-red-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-red-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.terms && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.terms[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Newsletter Option - Admin only */}
              {mode === "admin" && (
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={form.newsletter}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-300 border-gray-300"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newsletter" className="text-gray-700">
                      I want to receive news and updates via email
                    </label>
                  </div>
                </div>
              )}

              {/* Next PIN Info - Admin only */}
              {nextPin && mode === "admin" && (
                <Alert
                  type="success"
                  message={`Registration successful! Next available PIN: ${nextPin}`}
                  className="mb-4"
                />
              )}

              {/* Form Buttons */}
              <div className="pt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white text-red-600 font-medium rounded-full shadow-sm border border-red-600 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !form.terms}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">Registering...</span>
                    </>
                  ) : mode === "admin" ? (
                    "Register as Admin"
                  ) : (
                    "Register as User"
                  )}
                </button>
              </div>
            </form>

            {/* Google Registration - User only */}
            {mode === "user" && (
              <>
                <div className="flex items-center my-8">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full bg-red-600 text-white rounded-md py-3 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.5 0 6.3 1.5 8.2 2.8l6-6C34.9 2.7 29.8 0 24 0 14.7 0 6.7 5.4 2.8 13.2l7 5.5C11.7 13.2 17.3 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.9-2.1 5.3-4.4 7l6.8 5.3C43.7 37.3 46.1 31.3 46.1 24.5z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M24 48c6.5 0 11.9-2.1 15.9-5.7l-6.8-5.3C30.6 38.2 27.5 39.5 24 39.5c-6.6 0-12.2-4.4-14.3-10.3l-7 5.5C6.8 42.7 14.7 48 24 48z"
                    />
                  </svg>
                  <span>Register with Google</span>
                </button>
              </>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-red-600 font-medium hover:text-red-800 transition duration-200 bg-transparent border-none">
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pb-8">
        <p>© {new Date().getFullYear()} Velveta. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
