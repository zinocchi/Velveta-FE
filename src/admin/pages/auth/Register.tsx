import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import type { AxiosError } from "axios";
import VelvetaLogo from "../../../assets/icon/velveta.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    password_confirmation: "",
    work_pin: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");

  const showCustomAlert = (
    message: string,
    type: "error" | "success" = "error",
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.terms) {
      setErrors({ terms: ["You must agree to the terms"] });
      showCustomAlert("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setErrors({});
    setShowAlert(false);

    try {
      const res = await api.post("/admin/register", form);
      const token = res.data.token;

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      showCustomAlert("Admin account created successfully! Redirecting...", "success");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as AxiosError<{ errors: Record<string, string[]>; message: string }>;
        if (error.response?.status === 422) {
          setErrors(error.response.data?.errors ?? {});
          showCustomAlert("Validation failed. Please check your input.");
        } else {
          showCustomAlert(error.response?.data?.message || "Registration failed. Please try again.");
        }
      } else {
        showCustomAlert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Alert Notification */}
      {showAlert && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div
            className={`border-l-4 rounded-r-lg shadow-lg p-4 max-w-sm ${
              alertType === "error"
                ? "bg-red-50 border-red-500"
                : "bg-green-50 border-green-500"
            }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {alertType === "error" ? (
                  <svg
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    alertType === "error" ? "text-red-700" : "text-green-700"
                  }`}>
                  {alertMessage}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 focus:outline-none focus:ring-2 ${
                  alertType === "error"
                    ? "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-300"
                    : "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-300"
                }`}>
                <span className="sr-only">Close</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <header className="fixed top-0 left-0 w-full bg-white text-black py-3 px-6 shadow-md z-40 flex justify-between items-center">
        <div className="logo">
          <img src={VelvetaLogo} alt="Logo" className="h-14" />
        </div>
        <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
          Admin Registration
        </div>
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-2 font-['Montserrat'] text-gray-800">
            Register Admin Account
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Create a new administrator account
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">
              * indicates required field
            </p>

            {Object.keys(errors).length > 0 && !showAlert && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <ul className="list-disc list-inside">
                  {Object.values(errors)
                    .flat()
                    .map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat']">
                  Personal Information
                </h3>

                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    * Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    required
                    disabled={loading}
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    * Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={loading}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100"
                    placeholder="Enter your email address"
                  />
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
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      * Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        disabled={loading}
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        disabled={loading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-red-600 transition duration-200 disabled:cursor-not-allowed"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5 text-gray-700" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password_confirmation"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      * Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password_confirmation"
                        name="password_confirmation"
                        required
                        disabled={loading}
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        disabled={loading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-red-600 transition duration-200 disabled:cursor-not-allowed"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5 text-gray-700" />
                        ) : (
                          <EyeIcon className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="work_pin"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    * Work PIN
                  </label>
                  <input
                    type="password"
                    id="work_pin"
                    name="work_pin"
                    required
                    disabled={loading}
                    value={form.work_pin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100"
                    placeholder="Enter your work PIN"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit work PIN provided by your organization
                  </p>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.
                </p>
              </div>

              {/* Terms Section */}
              <div className="pt-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      required
                      checked={form.terms}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-300 border-gray-300 disabled:cursor-not-allowed"
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
                      </a>{" "}
                      for administrators
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/login")}
                  disabled={loading}
                  className="px-6 py-3 bg-white text-red-600 font-medium rounded-full shadow-sm border border-red-600 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 disabled:opacity-50"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.terms}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Register Admin"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an admin account?
              <button
                onClick={() => navigate("/admin/login")}
                className="text-red-600 font-medium hover:text-red-800 transition duration-200 ml-1"
              >
                Sign in here
              </button>
            </p>
            <p className="text-gray-500 text-xs mt-4">
              This registration is for authorized administrators only.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm pb-8">
        <p>© {new Date().getFullYear()} Velveta. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminRegister;