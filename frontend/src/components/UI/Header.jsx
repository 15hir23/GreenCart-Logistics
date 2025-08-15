import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

return (
  <header className="bg-white border-b border-gray-200 shadow-md backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo/Brand */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold hover:text-blue-600 transition-colors duration-300 cursor-pointer select-none flex items-center">
            <img 
              src="/image.svg" // or "/image.png" depending on which you're using
              alt="GreenCart Logo"
              className="h-6 w-6 mr-2" // Adjust size as needed
            />
            <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Green</span>
            <span className="bg-gradient-to-r from-lime-500 to-teal-500 bg-clip-text text-transparent">Cart</span>
          </h1>
        </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 px-2 py-1 rounded-md hover:bg-blue-50 group"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-blue-100 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 origin-center -z-0"></div>
                </Link>
                
                {/* Management Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 px-3 py-2 rounded-md hover:bg-blue-50 group active:scale-95"
                  >
                    <span className="relative z-10">Management</span>
                    <svg 
                      className={`ml-2 h-4 w-4 transition-all duration-300 ${showDropdown ? 'rotate-180' : ''} group-hover:text-blue-600`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <div className="absolute inset-0 bg-blue-100 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 origin-center -z-0"></div>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                      <div className="py-1">
                        <Link
                          to="/management/drivers"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 mx-2 rounded-lg font-medium hover:scale-[1.02] active:scale-95"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            -- 👨‍💼 Drivers
                          </span>
                        </Link>
                        <Link
                          to="/management/routes"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 mx-2 rounded-lg font-medium hover:scale-[1.02] active:scale-95"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            -- 🚛 Routes
                          </span>
                        </Link>
                        <Link
                          to="/management/orders"
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 mx-2 rounded-lg font-medium hover:scale-[1.02] active:scale-95"
                          onClick={() => setShowDropdown(false)}
                        >
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            -- 📦 Orders
                          </span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/simulation"
                  className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Run Simulation
                  </span>
                  <div className="absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 px-4 py-2 rounded-md hover:bg-gray-50 group"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gray-100 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                </Link>
                <Link 
                  to="/signup" 
                  className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 overflow-hidden group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                👋 Welcome back!
              </span>
              <button
                onClick={handleLogout}
                className="relative text-gray-700 hover:text-red-600 font-medium transition-all duration-300 px-4 py-2 rounded-md hover:bg-red-50 group active:scale-95"
              >
                <span className="relative z-10 flex items-center">
                  Logout
                </span>
                <div className="absolute inset-0 bg-red-100 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;