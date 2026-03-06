import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VelvetaLogo from "../../../assets/icon/velveta.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    workPin: "",
  });
  const [loading, setLoading] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setShowAlert(false);

    if (
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.workPin.trim()
    ) {
      showCustomAlert("Email, password, and work PIN must be filled in.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          work_pin: formData.workPin,
        }),
      });

      const data = await response.json();
      console.log("Admin login response:", data); // Debug

      if (response.ok) {
        // 🔥 YANG PENTING: Simpan token dan user data
        localStorage.setItem("token", data.token);
        
        // Pastikan user data punya role admin
        const userData = {
          ...data.user,
          role: 'admin' // Force role admin
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Trigger event storage untuk komponen lain
        window.dispatchEvent(new Event('storage'));
        
        showCustomAlert("Admin login successful! Redirecting...", "success");

        setTimeout(() => {
          // Force reload dengan window.location
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        showCustomAlert(
          data.message || "Login failed. Please check your credentials.",
        );
        setFormData((prev) => ({ ...prev, password: "", workPin: "" }));
      }
    } catch (error) {
      console.error("Login error:", error);
      showCustomAlert("An error occurred. Please try again.");
      setFormData((prev) => ({ ...prev, password: "", workPin: "" }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          Admin Access
        </div>
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2 font-['Montserrat'] text-gray-800">
            Admin Login
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Log in to the administrator dashboard
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">
              * indicates required field
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-700">
                  * Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your admin email"
                />
              </div>

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
                    disabled={loading}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-red-600 transition duration-200 disabled:cursor-not-allowed">
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
                  htmlFor="workPin"
                  className="block text-sm font-medium mb-2 text-gray-700">
                  * Work PIN
                </label>
                <input
                  type="password"
                  id="workPin"
                  name="workPin"
                  required
                  disabled={loading}
                  value={formData.workPin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your work PIN"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit work PIN provided by your administrator
                </p>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed">
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
                      Verifying...
                    </span>
                  ) : (
                    "Login to Admin Dashboard"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-red-600 font-medium hover:text-red-800 transition duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/register");
                }}>
                Register now
              </a>
            </p>
            <div className="text-center mt-8">
              <p className="text-gray-500 text-xs">
                This area is restricted to authorized administrators only.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm pb-8">
        <p>© 2025 Velveta. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;