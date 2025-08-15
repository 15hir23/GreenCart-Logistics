import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const success = await register(email, password, role);
    if (success) {
      navigate("/dashboard");
    } else {
      setLocalError(error);
    }
  };

 return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-emerald-200/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-teal-200/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-32 right-10 w-18 h-18 bg-lime-200/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-green-300/20 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-300/25 rotate-12 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
        <div className="absolute top-1/2 left-1/6 w-10 h-10 bg-teal-300/15 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        
        {/* Moving Gradient Orbs */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-l from-teal-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-0 w-32 h-32 bg-gradient-to-bl from-lime-400/10 to-emerald-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 z-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-white border-2 border-green-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 group">
              <img 
                src="/image.svg" // or "/image.png"
                alt="Cart"
                className="h-8 w-8 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 hover:scale-105 transition-transform duration-300 cursor-pointer select-none">
              <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Green</span>
              <span className="bg-gradient-to-r from-lime-500 to-teal-500 bg-clip-text text-transparent">Cart</span>
            </h1>
            <p className="text-gray-600 font-medium">Create Your Account</p>
          </div>

          {/* Error Message */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                {localError || error}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-200 focus:border-green-400 transition-all duration-300 hover:border-green-300 bg-gray-50 hover:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-200 focus:border-green-400 transition-all duration-300 hover:border-green-300 bg-gray-50 hover:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Account Type
              </label>
              <div className="relative group">
                <select
                  id="role"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-200 focus:border-green-400 transition-all duration-300 hover:border-green-300 bg-gray-50 hover:bg-white cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="manager" className="py-2">
                    👨‍💼 Manager
                  </option>
                  <option value="admin" disabled className="py-2 text-gray-400">
                    👤 User (Coming Soon)
                  </option>
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-3 focus:ring-green-200 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2"></span>
                  Create Account
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <Link
              to="/login"
              className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-green-50 group"
            >
              <span className="mr-2 group-hover:scale-110 transition-transform duration-300"></span>
              Sign in here
              <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;