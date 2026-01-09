// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', formData, keepSignedIn);
    // Navigate after successful login
    // navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full bg-white text-black py-3 px-6 shadow-md z-50 flex justify-between items-center">
        <div className="logo">
          <img src="/velveta.png" alt="Logo" className="h-14" />
        </div>
        <div className="nav-right flex gap-6 items-center">
          {/* Navigation items can be added here */}
        </div>
      </header>

      <main className="pt-32 pb-16 px-5 flex justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-10 font-['Montserrat'] text-gray-800">
            Log in to Your Account
          </h2>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-8">* indicates required field</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="login" className="block text-sm font-medium mb-2 text-gray-700">
                  * Username or Email
                </label>
                <input
                  type="text"
                  id="login"
                  name="login"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200"
                  placeholder="Enter your username or email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                  * Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-500 hover:text-red-600 transition duration-200"
                  >
                    {showPassword ? '🔒' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="keep-signed-in"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-300 border-gray-300"
                />
                <label htmlFor="keep-signed-in" className="ml-3 text-gray-700">
                  Keep me signed in
                </label>
              </div>

              <div className="space-y-2 pt-2">
                <a 
                  href="#" 
                  className="block text-sm text-red-600 hover:text-red-800 transition duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle forgot username
                  }}
                >
                  Forgot your username?
                </a>
                <a 
                  href="#" 
                  className="block text-sm text-red-600 hover:text-red-800 transition duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle forgot password
                  }}
                >
                  Forgot your password?
                </a>
              </div>
              
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition duration-300 text-base"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a 
                href="#" 
                className="text-red-600 font-medium hover:text-red-800 transition duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
              >
                Register now
              </a>
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