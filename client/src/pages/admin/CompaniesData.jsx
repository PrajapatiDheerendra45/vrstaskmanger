import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // All possible status options
  const statusOptions = [
    "pending",
    "collaborated",
    "not_collaborated",
    "rejected",
    "under_review",
    "approved",
    "declined",
    "on_hold",
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/v1/company/get");
        setCompanies(res.data);
        setFilteredCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.companyName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [search, companies]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`/api/v1/company/delete/${id}`);
        const updated = filteredCompanies.filter((c) => c._id !== id);
        setFilteredCompanies(updated);
        setCompanies(companies.filter((c) => c._id !== id));
        alert("Deleted successfully!");
      } catch (err) {
        console.error("Error deleting company:", err);
        alert("Delete failed!");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmUpdate = window.confirm(`
Do you want to update the status to "${newStatus}"?`);
    if (!confirmUpdate) return;

    try {
      const res = await axios.put(`/api/v1/company/update/${id}`, {
        status: newStatus,
      });

      const updated = filteredCompanies.map((company) =>
        company._id === id ? { ...company, status: newStatus } : company
      );
      setFilteredCompanies(updated);
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleUpdate = (company) => {
    setEditingCompany({
      _id: company._id,
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      industry: company.industry,
      address: company.address,
      city: company.city,
      state: company.state,
      zip: company.zip,
      status: company.status,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/v1/company/update/${editingCompany._id}`, editingCompany);
      const updated = filteredCompanies.map(company => 
        company._id === editingCompany._id ? res.data : company
      );
      setFilteredCompanies(updated);
      setCompanies(companies.map(company => 
        company._id === editingCompany._id ? res.data : company
      ));
      setShowUpdateModal(false);
      setEditingCompany(null);
      alert("Company updated successfully!");
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company.");
    }
  };

  const handleUpdateChange = (e) => {
    setEditingCompany({
      ...editingCompany,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Company List</h1>

      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by company name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded shadow w-full max-w-sm"
        />
      </div>

      <div className="overflow-x-auto shadow rounded-lg border">
        <table className="min-w-full text-sm text-left table-auto bg-white">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3">Company Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">HR Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{company.companyName}</td>
                <td className="px-4 py-2">{company.email}</td>
                <td className="px-4 py-2">{company.phone}</td>
                <td className="px-4 py-2">{company.industry}</td>
                <td className="px-4 py-2">{company.city}</td>
                <td className="px-4 py-2">{company.state}</td>
                <td className="px-4 py-2">
                  {company?.createdBy?.name || company.hrname}
                </td>
                <td className="px-4 py-2 capitalize font-semibold">
                  <select
                    value={company.status}
                    onChange={(e) =>
                      handleStatusChange(company._id, e.target.value)
                    }
                    className="px-2 py-1 border rounded bg-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 space-x-2 flex flex-wrap">
                  <button
                    onClick={() => handleUpdate(company)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(company._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showUpdateModal && editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Update Company</h3>
            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={editingCompany.companyName}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingCompany.email}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editingCompany.phone}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={editingCompany.industry}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editingCompany.address}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={editingCompany.city}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={editingCompany.state}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={editingCompany.zip}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={editingCompany.status}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
                >
                  Update Company
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setEditingCompany(null);
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
