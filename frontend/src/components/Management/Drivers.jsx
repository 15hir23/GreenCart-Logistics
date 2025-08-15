import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  fetchDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../../services/api";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    currentShiftHours: 0,
    pastWeekHours: Array(7).fill(0),
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // CSV parsing helper
  const parseCSV = (file, onComplete, onError) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        onComplete(results.data);
      },
      error: function (err) {
        onError(err);
      },
    });
  };

  // Fetch drivers on mount
  useEffect(() => {
    async function loadDrivers() {
      try {
        const data = await fetchDrivers();
        setDrivers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadDrivers();
  }, []);

  // Handle CSV file upload
  const handleCSVImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    parseCSV(
      file,
      async (rows) => {
        try {
          for (let row of rows) {
            const payload = {
              name: row.name?.trim() || "",
              currentShiftHours: Number(row.currentShiftHours) || 0,
              pastWeekHours: Array(7).fill(0),
              isActive:
                row.isActive?.toLowerCase() === "true" ||
                row.isActive === "1" ||
                row.isActive === true,
            };

            if (payload.name) {
              const newDriver = await createDriver(payload);
              setDrivers((prev) => [...prev, newDriver]);
            }
          }
          alert("CSV imported successfully!");
        } catch (err) {
          console.error("Error importing CSV:", err);
          alert("Failed to import CSV. Check the format.");
        }
      },
      (err) => {
        console.error("CSV parse error:", err);
        alert("Invalid CSV file.");
      }
    );
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("pastWeekHours")) {
      const index = Number(name.slice(-1));
      const updatedHours = [...formData.pastWeekHours];
      updatedHours[index] = Number(value);
      setFormData((prev) => ({ ...prev, pastWeekHours: updatedHours }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Edit handler
  const handleEdit = (driver) => {
    setShowForm(true);
    setEditingDriverId(driver._id);
    setFormData({
      name: driver.name || "",
      currentShiftHours: driver.currentShiftHours || driver.shift_hours || 0,
      pastWeekHours: driver.pastWeekHours || Array(7).fill(0),
      isActive:
        driver.isActive !== undefined
          ? driver.isActive
          : driver.is_active || true,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      if (!formData.name.trim()) {
        setFormError("Name is required");
        setFormLoading(false);
        return;
      }

      const payload = {
        name: formData.name.trim(),
        currentShiftHours: Number(formData.currentShiftHours),
        pastWeekHours: formData.pastWeekHours.map(Number),
        isActive: formData.isActive,
      };

      if (editingDriverId) {
        const updatedDriver = await updateDriver(editingDriverId, payload);
        setDrivers((prev) =>
          prev.map((driver) =>
            driver._id === editingDriverId ? updatedDriver : driver
          )
        );
      } else {
        const newDriver = await createDriver(payload);
        setDrivers((prev) => [...prev, newDriver]);
      }

      setShowForm(false);
      setEditingDriverId(null);
      setFormData({
        name: "",
        currentShiftHours: 0,
        pastWeekHours: Array(7).fill(0),
        isActive: true,
      });
    } catch (error) {
      console.error(error);
      setFormError(
        editingDriverId
          ? "Failed to update driver. Try again."
          : "Failed to create driver. Try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await deleteDriver(driverId);
      setDrivers((prev) => prev.filter((driver) => driver._id !== driverId));
    } catch (error) {
      console.error("Failed to delete driver:", error);
      alert("Failed to delete driver. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Drivers Management</h1>
            <p className="text-gray-600">Manage your delivery team and driver schedules</p>
          </div>
          <div className="flex space-x-3">
            {/* CSV Import */}
            <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors duration-200 shadow-sm flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Import CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                setShowForm((show) => !show);
                if (showForm) {
                  setEditingDriverId(null);
                  setFormData({
                    name: "",
                    currentShiftHours: 0,
                    pastWeekHours: Array(7).fill(0),
                    isActive: true,
                  });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm flex items-center space-x-2"
            >
              {showForm ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Driver</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingDriverId ? "Edit Driver" : "Add New Driver"}
            </h2>
            <form onSubmit={handleSubmit} className="max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter driver name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Shift Hours
                  </label>
                  <input
                    type="number"
                    name="currentShiftHours"
                    value={formData.currentShiftHours}
                    min="0"
                    max="24"
                    step="0.1"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Past Week Hours (7 days)
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {formData.pastWeekHours.map((hour, idx) => (
                    <div key={idx} className="text-center">
                      <label className="text-xs text-gray-500 block mb-1">
                        Day {idx + 1}
                      </label>
                      <input
                        type="number"
                        name={`pastWeekHours${idx}`}
                        value={hour}
                        min="0"
                        max="24"
                        step="0.1"
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    id="isActive"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active Driver
                  </label>
                </div>
              </div>

              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Saving..." : editingDriverId ? "Update Driver" : "Save Driver"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Drivers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Drivers ({drivers.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">ID: {driver._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {driver.currentShiftHours || driver.shift_hours || 0} hours
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          (driver.isActive !== undefined ? driver.isActive : driver.is_active)
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(driver.isActive !== undefined ? driver.isActive : driver.is_active)
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(driver.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(driver)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                          title="Edit Driver"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(driver._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                          title="Delete Driver"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;