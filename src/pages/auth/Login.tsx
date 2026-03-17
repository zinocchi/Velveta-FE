import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import api from "../../services/api/config";
import VelvetaLogo from "../../assets/icon/velveta.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FaUser, FaUserShield } from "react-icons/fa";

// Import components
import { LoadingSpinner } from "../../components/ui/loading/LoadingSpinner";
import { Alert } from "../../components/ui/Alert";
import { cn } from "../../libs/utils";

type LoginMode = "user" | "admin";

interface FormData {
  login: string;
  password: string;
  workPin: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: userLogin, loading: authLoading } = useAuthContext(); 
  
  const [mode, setMode] = useState<LoginMode>("user");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    login: "",
    password: "",
    workPin: "",
  });
  
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [alertState, setAlertState] = useState<{
    show: boolean;
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
  }>({
    show: false,
    message: "",
    type: "error",
  });

  const showAlert = (
    message: string,
    type: 'error' | 'success' | 'warning' | 'info' = 'error'
  ) => {
    setAlertState({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleModeSwitch = (newMode: LoginMode) => {
    setMode(newMode);
    setFormData({ login: "", password: "", workPin: "" });
    setAttemptsLeft(null);
    setBlockedUntil(null);
    setAlertState(prev => ({ ...prev, show: false }));

    if (newMode === "admin") {
      checkAdminLoginStatus();
    }
  };

  const checkAdminLoginStatus = async () => {
    try {
      const response = await api.get("/admin/login-status");
      setAttemptsLeft(response.data.attempts_left);

      if (response.data.is_blocked) {
        const blockedDate = new Date(response.data.blocked_until);
        setBlockedUntil(blockedDate.toLocaleString());
        showAlert(
          `You are blocked until ${blockedDate.toLocaleString()}`,
          "warning"
        );
      }
    } catch (error) {
      console.error("Failed to check login status:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google/redirect";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.login.trim() || !formData.password.trim()) {
      showAlert("Username/email and password must be filled in");
      return;
    }

    if (mode === "admin" && !formData.workPin.trim()) {
      showAlert("Work PIN must be filled in for admin login", "warning");
      return;
    }

    setIsLoading(true);
    setAlertState(prev => ({ ...prev, show: false }));

    try {
      if (mode === "user") {
        await userLogin(formData.login, formData.password);
        showAlert("Login successful! Redirecting...", "success");
        
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const response = await api.post("/admin/login", {
          email: formData.login,
          password: formData.password,
          work_pin: formData.workPin,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          showAlert("Admin login successful! Redirecting to dashboard...", "success");

          setTimeout(() => {
            window.location.href = "/admin/dashboard";
          }, 1500);
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response) {
        const data = err.response.data;

        if (data.blocked) {
          const blockedDate = new Date(data.blocked_until);
          setBlockedUntil(blockedDate.toLocaleString());
          showAlert(data.message || "Account is blocked", "warning");
        } else if (data.attempts_left !== undefined) {
          setAttemptsLeft(data.attempts_left);
          showAlert(
            `${data.message}. ${data.attempts_left} attempts left.`,
            "warning"
          );
        } else {
          showAlert(data.message || "Login failed. Please try again.");
        }
      } else {
        showAlert(err.message || "Login failed. Please try again.");
      }

      setFormData(prev => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || authLoading || !!blockedUntil;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Notification */}
      {alertState.show && (
        <div className="fixed top-24 right-4 z-50 animate-slideIn">
          <Alert
            type={alertState.type}
            message={alertState.message}
            dismissible
            onDismiss={() => setAlertState(prev => ({ ...prev, show: false }))}
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
          <img src={VelvetaLogo} alt="Logo" className="h-14" />
        </div>
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 font-['Montserrat'] text-gray-800">
            Welcome Back
          </h2>

          {/* Role Selection */}
          <div className="flex justify-between gap-4 mb-8">
            {/* User Login Card */}
            <button
              onClick={() => handleModeSwitch("user")}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 transition-all duration-300",
                mode === "user"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
              disabled={isDisabled}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "p-3 rounded-full transition-colors",
                    mode === "user"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <FaUser className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "font-medium",
                    mode === "user" ? "text-red-600" : "text-gray-700"
                  )}
                >
                  Login by User
                </span>
                {mode === "user" && (
                  <span className="text-xs text-red-600 font-medium">
                    Selected
                  </span>
                )}
              </div>
            </button>

            {/* Admin Login Card */}
            <button
              onClick={() => handleModeSwitch("admin")}
              className={cn(
                "flex-1 p-4 rounded-xl border-2 transition-all duration-300",
                mode === "admin"
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
              disabled={isDisabled}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "p-3 rounded-full transition-colors",
                    mode === "admin"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <FaUserShield className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "font-medium",
                    mode === "admin" ? "text-red-600" : "text-gray-700"
                  )}
                >
                  Login by Admin
                </span>
                {mode === "admin" && (
                  <span className="text-xs text-red-600 font-medium">
                    Selected
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Admin Status Info */}
          {mode === "admin" && (
            <div className="mb-4">
              {blockedUntil ? (
                <Alert
                  type="error"
                  message={`Account is blocked until ${blockedUntil}`}
                  className="mb-4"
                />
              ) : attemptsLeft !== null && attemptsLeft < 3 ? (
                <Alert
                  type="warning"
                  message={`${attemptsLeft} login attempts remaining`}
                  className="mb-4"
                />
              ) : null}
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">
              * indicates required field
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email/Username Field */}
              <div>
                <label
                  htmlFor="login"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  * {mode === "admin" ? "Email" : "Username or Email"}
                </label>
                <input
                  type={mode === "admin" ? "email" : "text"}
                  id="login"
                  name="login"
                  required
                  disabled={isDisabled}
                  value={formData.login}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder={
                    mode === "admin"
                      ? "Enter your admin email"
                      : "Enter your username or email"
                  }
                />
              </div>

              {/* Password Field */}
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
                    disabled={isDisabled}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isDisabled}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-red-600 transition duration-200 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Work PIN Field (admin only) */}
              {mode === "admin" && (
                <div>
                  <label
                    htmlFor="workPin"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    * Work PIN
                  </label>
                  <input
                    type="password"
                    id="workPin"
                    name="workPin"
                    required
                    disabled={isDisabled}
                    value={formData.workPin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your 6-digit work PIN"
                    maxLength={9}
                  />
                </div>
              )}

              {/* Keep signed in (user only) */}
              {mode === "user" && (
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="keep-signed-in"
                    checked={keepSignedIn}
                    disabled={isDisabled}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-300 border-gray-300"
                  />
                  <label
                    htmlFor="keep-signed-in"
                    className="ml-3 text-gray-700"
                  >
                    Keep me signed in
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isDisabled}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span className="ml-2">
                        {mode === "admin" ? "Verifying..." : "Signing in..."}
                      </span>
                    </>
                  ) : (
                    mode === "admin" ? "Login as Admin" : "Sign in"
                  )}
                </button>
              </div>
            </form>

            {/* Google Login - User only */}
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
                  className="flex items-center justify-center gap-2 w-full bg-red-600 text-white rounded-md py-3 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                  >
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
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-red-600 font-medium hover:text-red-800 transition duration-200 bg-transparent border-none"
              >
                Register now
              </button>
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