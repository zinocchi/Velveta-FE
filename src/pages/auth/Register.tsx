import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { AxiosError } from "axios";
import VelvetaLogo from "../../assets/icon/velveta.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FaUser, FaUserShield } from "react-icons/fa";

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  expected_pin?: string;
  next_pin?: string;
}

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    work_pin: "",
    newsletter: true,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [expectedPin, setExpectedPin] = useState<string | null>(null);
  const [nextPin, setNextPin] = useState<string | null>(null);
  const [availablePins, setAvailablePins] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWorkPin, setShowWorkPin] = useState(false);

  useEffect(() => {
    if (loginMode === "admin") {
      fetchAvailablePins();
    }
  }, [loginMode]);

  const fetchAvailablePins = async () => {
    try {
      const response = await api.get('/admin/available-pins');
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
    
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : newValue,
    });

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleWorkPinVisibility = () => {
    setShowWorkPin(!showWorkPin);
  };

  const handleModeSwitch = (mode: "user" | "admin") => {
    setLoginMode(mode);
    setForm({
      fullname: "",
      email: "",
      username: "",
      password: "",
      password_confirmation: "",
      work_pin: "",
      newsletter: true,
      terms: false,
    });
    setErrors({});
    setExpectedPin(null);
    setNextPin(null);
    setSuccessMessage(null);
    
    if (mode === "admin") {
      fetchAvailablePins();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.terms) {
      setErrors({ terms: ["You must agree to the terms"] });
      return;
    }

    // Validasi password match
    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: ["Passwords do not match"] });
      return;
    }

    // Validasi work pin untuk admin
    if (loginMode === "admin" && !form.work_pin) {
      setErrors({ work_pin: ["Work PIN is required"] });
      return;
    }

    // Validasi format work pin (VELVETA01, VELVETA02, dll)
    if (loginMode === "admin" && !/^VELVETA\d{2}$/.test(form.work_pin)) {
      setErrors({ work_pin: ["Work PIN must be in format: VELVETA01, VELVETA02, etc"] });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      let response;
      
      if (loginMode === "admin") {
        // ADMIN REGISTER
        response = await api.post("/admin/register", {
          fullname: form.fullname,
          email: form.email,
          username: form.username,
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

        setSuccessMessage("Admin registration successful! Redirecting to dashboard...");

        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
        
      } else {
        // USER REGISTER - langsung di halaman yang sama
        response = await api.post("/register", {
          fullname: form.fullname,
          email: form.email,
          username: form.username,
          password: form.password,
          password_confirmation: form.password_confirmation,
        });

        const data = response.data;
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccessMessage("User registration successful! Redirecting to homepage...");

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
              work_pin: [error.response.data.message || `Expected PIN: ${error.response.data.expected_pin}`]
            });
          }
        } else {
          setErrors({
            general: [error.response?.data?.message || "Registration failed. Please try again."]
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-['Segoe_UI',sans-serif]">
      {/* Success Alert */}
      {successMessage && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>

      <header className="fixed top-0 left-0 w-full bg-white text-black py-3 px-6 shadow-md z-50 flex justify-between items-center">
        <div className="logo">
          <img src={VelvetaLogo} alt="Velveta Logo" className="h-14" />
        </div>
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 font-['Montserrat',sans-serif] text-gray-800">
            Create an Account
          </h2>

          {/* SWITCH ROLE */}
          <div className="flex justify-between gap-4 mb-8">
            {/* User Registration Card */}
            <button
              onClick={() => handleModeSwitch("user")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                loginMode === "user"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}>
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-full ${
                  loginMode === "user" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  <FaUser className="w-6 h-6" />
                </div>
                <span className={`font-medium ${
                  loginMode === "user" ? "text-red-600" : "text-gray-700"
                }`}>
                  Register as User
                </span>
                {loginMode === "user" && (
                  <span className="text-xs text-red-600 font-medium">Selected</span>
                )}
              </div>
            </button>

            {/* Admin Registration Card */}
            <button
              onClick={() => handleModeSwitch("admin")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                loginMode === "admin"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}>
              <div className="flex flex-col items-center gap-2">
                <div className={`p-3 rounded-full ${
                  loginMode === "admin" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  <FaUserShield className="w-6 h-6" />
                </div>
                <span className={`font-medium ${
                  loginMode === "admin" ? "text-red-600" : "text-gray-700"
                }`}>
                  Register as Admin
                </span>
                {loginMode === "admin" && (
                  <span className="text-xs text-red-600 font-medium">Selected</span>
                )}
              </div>
            </button>
          </div>

          {/* Available PIN Info - Hanya untuk admin */}
          {loginMode === "admin" && availablePins.length > 0 && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Available Work PINs:</h4>
              <div className="flex flex-wrap gap-2">
                {availablePins.map((pin) => (
                  <span
                    key={pin}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      pin === expectedPin
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {pin} {pin === expectedPin && "✓"}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Use PIN in sequence. Next available: {expectedPin || "Loading..."}
              </p>
            </div>
          )}

          {/* Info untuk user */}
          {loginMode === "user" && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You are registering as a regular user. Click "Register as Admin" for admin registration.
              </p>
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">
              * indicates required field
            </p>

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {Object.entries(errors).map(([field, fieldErrors]) => (
                    field !== "general" && fieldErrors.map((error, idx) => (
                      <li key={`${field}-${idx}`}>{error}</li>
                    ))
                  ))}
                </ul>
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {errors.general[0]}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat',sans-serif]">
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
                    value={form.fullname}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.fullname ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullname && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullname[0]}</p>
                  )}
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
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>
                  )}
                </div>
              </div>

              {/* Account Information Section */}
              <div className="pt-2 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat',sans-serif]">
                  Account Information
                </h3>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    * Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200`}
                    placeholder="Choose a username"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Username must be 4-20 characters
                  </p>
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username[0]}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
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
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 pr-12`}
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>
                    )}
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
                        type={showConfirmPassword ? "text" : "password"}
                        id="password_confirmation"
                        name="password_confirmation"
                        required
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 pr-12`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-xs text-red-500 mt-1">{errors.password_confirmation[0]}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.
                </p>
              </div>

              {/* Admin Work PIN Section - Hanya untuk admin */}
              {loginMode === "admin" && (
                <div className="pt-2 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat',sans-serif]">
                    Admin Verification
                  </h3>

                  <div>
                    <label
                      htmlFor="work_pin"
                      className="block text-sm font-medium mb-2 text-gray-700"
                    >
                      * Work PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showWorkPin ? "text" : "password"}
                        id="work_pin"
                        name="work_pin"
                        required={loginMode === "admin"}
                        value={form.work_pin}
                        onChange={handleChange}
                        placeholder="VELVETA01"
                        maxLength={9}
                        className={`w-full px-4 py-3 border ${
                          errors.work_pin ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200 pr-12 font-mono uppercase`}
                      />
                      <button
                        type="button"
                        onClick={toggleWorkPinVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                      >
                        {showWorkPin ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Format: VELVETA01, VELVETA02 (6 digits after VELVETA)
                      </p>
                      {expectedPin && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          Next: {expectedPin}
                        </span>
                      )}
                    </div>
                    {errors.work_pin && (
                      <p className="text-xs text-red-500 mt-1">{errors.work_pin[0]}</p>
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
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-300 border-gray-300"
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
                      <p className="text-xs text-red-500 mt-1">{errors.terms[0]}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Newsletter Option - Hanya untuk admin */}
              {loginMode === "admin" && (
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={form.newsletter}
                      onChange={handleChange}
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

              {/* Success Message for Next PIN - Admin Only */}
              {nextPin && loginMode === "admin" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">
                    ✅ Registration successful! Next available PIN: <span className="font-mono font-bold">{nextPin}</span>
                  </p>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(loginMode === "admin" ? "/admin/login" : "/login")}
                  className="px-6 py-3 bg-white text-red-600 font-medium rounded-full shadow-sm border border-red-600 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.terms}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    loginMode === "admin" ? "Register as Admin" : "Register as User"
                  )}
                </button>
              </div>
            </form>

            {/* Google Registration - Hanya untuk user */}
            {loginMode === "user" && (
              <>
                <div className="flex items-center my-8">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 w-full bg-red-600 text-white rounded-md py-3 mt-4">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.3 1.5 8.2 2.8l6-6C34.9 2.7 29.8 0 24 0 14.7 0 6.7 5.4 2.8 13.2l7 5.5C11.7 13.2 17.3 9.5 24 9.5z" />
                    <path fill="#34A853" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.9-2.1 5.3-4.4 7l6.8 5.3C43.7 37.3 46.1 31.3 46.1 24.5z" />
                    <path fill="#4A90E2" d="M24 48c6.5 0 11.9-2.1 15.9-5.7l-6.8-5.3C30.6 38.2 27.5 39.5 24 39.5c-6.6 0-12.2-4.4-14.3-10.3l-7 5.5C6.8 42.7 14.7 48 24 48z" />
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
                onClick={() => navigate(loginMode === "admin" ? "/admin/login" : "/login")}
                className="text-red-600 font-medium hover:text-red-800 transition duration-200"
              >
                Sign in here
              </button>
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