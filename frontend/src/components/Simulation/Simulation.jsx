import React, { useState } from "react";
import { runSimulation } from "../../services/api";  
import DeliveryChart from "../Charts/DeliveryChart";  
import FuelCostChart from "../Charts/FuelCostChart";  

const Simulation = () => {
  const [formData, setFormData] = useState({
    availableDrivers: 1,
    startTime: "",
    maxHoursPerDay: 8,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "availableDrivers" || name === "maxHoursPerDay"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const simStartTime = formData.startTime
      ? formData.startTime.slice(11, 16) 
      : "";
    try {
      const payload = {
        availableDrivers: formData.availableDrivers,
        startTime: simStartTime,  
        maxHoursPerDay: formData.maxHoursPerDay,
      };

      const res = await runSimulation(payload);
      setResult(res);
    } catch (err) {
      setError("Failed to run simulation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 hover:scale-105 transition-transform duration-300 cursor-pointer select-none">
            <span className="mr-3"></span>
            <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Logistics</span>
            <span className="bg-gradient-to-r from-lime-500 to-teal-500 bg-clip-text text-transparent"> Simulation</span>
          </h1>
          <p className="text-gray-600 text-lg">Optimize your delivery routes and analyze performance metrics</p>
        </div>

        {/* Simulation Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-500">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-2xl">🎛️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Simulation Parameters</h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Available Drivers
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      name="availableDrivers"
                      min="1"
                      value={formData.availableDrivers}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-200 focus:border-green-400 transition-all duration-300 hover:border-green-300 bg-gray-50 hover:bg-white"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Max Hours per Day
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      name="maxHoursPerDay"
                      min="1"
                      max="24"
                      value={formData.maxHoursPerDay}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-200 focus:border-green-400 transition-all duration-300 hover:border-green-300 bg-gray-50 hover:bg-white"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Start Time
                </label>
                <div className="relative group">
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-green-200 focus:border-green-400 transition-all duration-300 hover:border-green-300 bg-gray-50 hover:bg-white"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-3 focus:ring-green-200 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-lg">Running Simulation...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center text-lg">
                    <span className="mr-3"></span>
                    Run Simulation
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Results Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                <span className="mr-3">📊</span>
                Simulation Results
              </h2>
              <p className="text-gray-600">Analysis complete! Here are your optimization insights</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">💰</span>
                  </div>
                  <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">Profit</span>
                </div>
                <h3 className="font-bold text-gray-700 mb-2">Total Profit</h3>
                <p className="text-3xl font-bold text-green-600">₹{result.totalProfit}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <span className="text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-lg">Performance</span>
                </div>
                <h3 className="font-bold text-gray-700 mb-2">Efficiency Score</h3>
                <p className="text-3xl font-bold text-blue-600">{result.efficiencyScore}%</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">✅</span>
                  </div>
                  <span className="text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">On-Time</span>
                </div>
                <h3 className="font-bold text-gray-700 mb-2">On-Time Deliveries</h3>
                <p className="text-3xl font-bold text-emerald-600">{result.onTimeDeliveries}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <span className="text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded-lg">Late</span>
                </div>
                <h3 className="font-bold text-gray-700 mb-2">Late Deliveries</h3>
                <p className="text-3xl font-bold text-red-600">{result.lateDeliveries}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">📈</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Delivery Performance</h3>
                </div>
                <DeliveryChart
                  data={[
                    { name: "On-time", value: result.onTimeDeliveries },
                    { name: "Late", value: result.lateDeliveries },
                  ]}
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-xl">⛽</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Fuel Cost Analysis</h3>
                </div>
                <FuelCostChart
                  data={result.fuelCostBreakdown.map((fc) => ({
                    name: `Route ${fc.routeId}`,
                    value: fc.totalCost,
                  }))}
                />
              </div>
            </div>

            {/* Driver Assignments */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Driver Assignments</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.driverAssignments.map((driver) => (
                  <div key={driver.driverId} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg text-gray-800">
                        <span className="mr-2">🚛</span>
                        Driver {driver.driverId}
                      </h4>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                        ₹{driver.totalProfit}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <span className="mr-2">⏱️</span>
                        Hours: <span className="font-medium ml-1">{driver.totalHours.toFixed(2)}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="mr-2">📦</span>
                        Orders: <span className="font-medium ml-1">{driver.assignedOrders.join(", ")}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Performance Metrics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="mr-3 text-xl">⛽</span>
                  <div>
                    <p className="text-sm text-gray-600">Total Fuel Cost</p>
                    <p className="font-bold text-gray-800">₹{result.performanceMetrics.totalFuelCost}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="mr-3 text-xl">🎁</span>
                  <div>
                    <p className="text-sm text-gray-600">Total Bonuses</p>
                    <p className="font-bold text-green-600">₹{result.performanceMetrics.totalBonuses}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="mr-3 text-xl">⚠️</span>
                  <div>
                    <p className="text-sm text-gray-600">Total Penalties</p>
                    <p className="font-bold text-red-600">₹{result.performanceMetrics.totalPenalties}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="mr-3 text-xl">🕒</span>
                  <div>
                    <p className="text-sm text-gray-600">Avg Delivery Time</p>
                    <p className="font-bold text-gray-800">{result.performanceMetrics.averageDeliveryTime} mins</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="mr-3 text-xl">📊</span>
                  <div>
                    <p className="text-sm text-gray-600">Utilization Rate</p>
                    <p className="font-bold text-blue-600">{result.performanceMetrics.utilizationRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;