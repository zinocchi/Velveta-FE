import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; 
import type { AxiosError } from "axios";
import VelvetaLogo from "../../assets/icon/velveta.png";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    password_confirmation: "",
    newsletter: true,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi terms
    if (!form.terms) {
      setErrors({ terms: ["You must agree to the terms"] });
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const res = await api.post("/register", form);
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const error = err as AxiosError<{ errors: Record<string, string[]> }>;
        if (error.response?.status === 422) {
          setErrors(error.response.data?.errors ?? {});
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-['Segoe_UI',sans-serif]">
      <header className="fixed top-0 left-0 w-full bg-white text-black py-3 px-6 shadow-md z-50 flex justify-between items-center">
        <div className="logo">
          <img src={VelvetaLogo} alt="Velveta Logo" className="h-14" />
        </div>
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-10 font-['Montserrat',sans-serif] text-gray-800">
            Create Your Account
          </h2>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">* indicates required field</p>

            {Object.keys(errors).length > 0 && (
              <div className="text-red-500 mb-4">
                <ul>
                  {Object.values(errors).flat().map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat',sans-serif]">
                  Personal Information
                </h3>

                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium mb-2 text-gray-700">
                    * Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    required
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                    * Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Account Information Section */}
              <div className="pt-2 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat',sans-serif]">
                  Account Information
                </h3>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-700">
                    * Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200"
                    placeholder="Choose a username"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username must be 4-20 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                      * Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium mb-2 text-gray-700">
                      * Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        required
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-600 transition duration-200"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 8 characters long and include at least one uppercase letter,
                  one lowercase letter, and one number.
                </p>
              </div>

              {/* Preferences Section */}
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 font-['Montserrat',sans-serif]">
                  Preferences
                </h3>

                <div className="flex items-start mb-4">
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
                      Subscribe to our newsletter
                    </label>
                    <p className="text-gray-500">
                      Get updates on new products, special offers, and more.
                    </p>
                  </div>
                </div>

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
                  </div>
                </div>
              </div>

              {/* Google Login Button */}
              <a
                href="http://localhost:8000/auth/google"
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
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
              </a>

              {/* Form Buttons */}
              <div className="pt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-white text-red-600 font-medium rounded-full shadow-sm border border-red-600 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.terms}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?
              <button
                onClick={() => navigate("/login")}
                className="text-red-600 font-medium hover:text-red-800 transition duration-200 ml-1"
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

export default Register;