import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import api from "../../api/axios";
import VelvetaLogo from "../../assets/icon/velveta.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FaUser, FaUserShield } from "react-icons/fa";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google/redirect";
  };

  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    workPin: "",
  });

  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<string | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success" | "warning">(
    "error",
  );

  const showCustomAlert = (
    message: string,
    type: "error" | "success" | "warning" = "error",
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  };

  const checkAdminLoginStatus = async () => {
    try {
      const response = await api.get("/admin/login-status");
      setAttemptsLeft(response.data.attempts_left);

      if (response.data.is_blocked) {
        const blockedDate = new Date(response.data.blocked_until);
        setBlockedUntil(blockedDate.toLocaleString());
        showCustomAlert(
          `You are blocked until ${blockedDate.toLocaleString()}`,
          "warning",
        );
      }
    } catch (error) {
      console.error("Failed to check login status:", error);
    }
  };

  const handleModeSwitch = (mode: "user" | "admin") => {
    setLoginMode(mode);
    setFormData((prev) => ({ ...prev, workPin: "" }));
    setAttemptsLeft(null);
    setBlockedUntil(null);

    if (mode === "admin") {
      checkAdminLoginStatus();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(`DEBUG: onSubmit called (${loginMode} mode)`);

    setShowAlert(false);

    if (!formData.login.trim() || !formData.password.trim()) {
      showCustomAlert("Username/email and password must be filled in");
      return;
    }

    if (loginMode === "admin" && !formData.workPin.trim()) {
      showCustomAlert("Work PIN must be filled in for admin login");
      return;
    }

    try {
      if (loginMode === "user") {
        console.log("DEBUG: Calling user login...");
        const result = await login(formData.login, formData.password);
        console.log("DEBUG: User login successful:", result);

        showCustomAlert("Login successful! Redirecting...", "success");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        console.log("DEBUG: Calling admin login...");

        const response = await api.post("/admin/login", {
          email: formData.login,
          password: formData.password,
          work_pin: formData.workPin,
        });

        console.log("DEBUG: Admin login response:", response.data);

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          showCustomAlert(
            "Admin login successful! Redirecting to dashboard...",
            "success",
          );

          setTimeout(() => {
            window.location.href = "/admin/dashboard";
          }, 1500);
        }
      }
    } catch (err: any) {
      console.log(`DEBUG: Error caught in onSubmit (${loginMode} mode):`, err);

      if (err.response) {
        const data = err.response.data;

        if (data.blocked) {
          const blockedDate = new Date(data.blocked_until);
          setBlockedUntil(blockedDate.toLocaleString());
          showCustomAlert(data.message || "Account is blocked", "warning");
        } else if (data.attempts_left !== undefined) {
          setAttemptsLeft(data.attempts_left);
          showCustomAlert(
            `${data.message}. ${data.attempts_left} attempts left.`,
            "warning",
          );
        } else if (data.expected_pin) {
          showCustomAlert(data.message, "warning");
        } else {
          showCustomAlert(data.message || "Login failed. Please try again.");
        }
      } else {
        showCustomAlert(err.message || "Login failed. Please try again.");
      }

      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
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
                : alertType === "warning"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-green-50 border-green-500"
            }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {alertType === "error" && (
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
                )}
                {alertType === "warning" && (
                  <svg
                    className="h-6 w-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                {alertType === "success" && (
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
                    alertType === "error"
                      ? "text-red-700"
                      : alertType === "warning"
                        ? "text-yellow-700"
                        : "text-green-700"
                  }`}>
                  {alertMessage}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 focus:outline-none focus:ring-2 ${
                  alertType === "error"
                    ? "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-300"
                    : alertType === "warning"
                      ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-300"
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
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>

      <header className="fixed top-0 left-0 w-full bg-white text-black py-3 px-6 shadow-md z-40 flex justify-between items-center">
        <div className="logo">
          <img src={VelvetaLogo} alt="Logo" className="h-14" />
        </div>
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 font-['Montserrat'] text-gray-800">
            Welcome Back
          </h2>

          {/* SWITCH ROLE AL GAMBAR - DUA TOMBOL TERPISAH DENGAN IKON */}
          <div className="flex justify-between gap-4 mb-8">
            {/* User Login Card */}
            <button
              onClick={() => handleModeSwitch("user")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                loginMode === "user"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`p-3 rounded-full ${
                    loginMode === "user"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                  <FaUser className="w-6 h-6" />
                </div>
                <span
                  className={`font-medium ${
                    loginMode === "user" ? "text-red-600" : "text-gray-700"
                  }`}>
                  Login by User
                </span>
                {loginMode === "user" && (
                  <span className="text-xs text-red-600 font-medium">
                    Selected
                  </span>
                )}
              </div>
            </button>

            {/* Admin Login Card */}
            <button
              onClick={() => handleModeSwitch("admin")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                loginMode === "admin"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`p-3 rounded-full ${
                    loginMode === "admin"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                  <FaUserShield className="w-6 h-6" />
                </div>
                <span
                  className={`font-medium ${
                    loginMode === "admin" ? "text-red-600" : "text-gray-700"
                  }`}>
                  Login by Admin
                </span>
                {loginMode === "admin" && (
                  <span className="text-xs text-red-600 font-medium">
                    Selected
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Status Info untuk Admin */}
          {loginMode === "admin" && (
            <div className="mb-4">
              {blockedUntil ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  ⚠️ Account is blocked until {blockedUntil}
                </div>
              ) : attemptsLeft !== null && attemptsLeft < 3 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                  ⚠️ {attemptsLeft} login attempts remaining
                </div>
              ) : null}
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">
              * indicates required field
            </p>

            {/* Tampilkan error dari useAuth jika ada (untuk user) */}
            {loginMode === "user" && error && !showAlert && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email/Username Field */}
              <div>
                <label
                  htmlFor="login"
                  className="block text-sm font-medium mb-2 text-gray-700">
                  * {loginMode === "admin" ? "Email" : "Username or Email"}
                </label>
                <input
                  type={loginMode === "admin" ? "email" : "text"}
                  id="login"
                  name="login"
                  required
                  disabled={loading || !!blockedUntil}
                  value={formData.login}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder={
                    loginMode === "admin"
                      ? "Enter your admin email"
                      : "Enter your username or email"
                  }
                />
              </div>

              {/* Password Field */}
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
                    disabled={loading || !!blockedUntil}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={loading || !!blockedUntil}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-red-600 transition duration-200 disabled:cursor-not-allowed">
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-700" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                </div>
              </div>

              {/* Work PIN Field (khusus admin) */}
              {loginMode === "admin" && (
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
                    disabled={loading || !!blockedUntil}
                    value={formData.workPin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your 6-digit work PIN"
                    maxLength={9}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: VELVETA01, VELVETA02, etc
                  </p>
                </div>
              )}

              {/* Keep signed in (hanya untuk user) */}
              {loginMode === "user" && (
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="keep-signed-in"
                    checked={keepSignedIn}
                    disabled={loading}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-300 border-gray-300 disabled:cursor-not-allowed"
                  />
                  <label
                    htmlFor="keep-signed-in"
                    className="ml-3 text-gray-700">
                    Keep me signed in
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !!blockedUntil}
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
                      {loginMode === "admin" ? "Verifying..." : "Signing in..."}
                    </span>
                  ) : loginMode === "admin" ? (
                    "Login as Admin"
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            {/* Google Login - Hanya untuk user */}
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
                  <span>Login with Google</span>
                </button>
              </>
            )}
          </div>

          {/* Register Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {loginMode === "admin" ? (
                <>
                  Don't have admin access?{" "}
                  <a
                    href="#"
                    className="text-red-600 font-medium hover:text-red-800 transition duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/register");
                    }}>
                    Register as Admin
                  </a>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-red-600 font-medium hover:text-red-800 transition duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/register");
                    }}>
                    Register now
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm pb-8">
        <p>© 2025 Velveta. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
