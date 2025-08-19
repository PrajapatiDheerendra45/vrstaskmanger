import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const userId = JSON.parse(localStorage.getItem("auth"));
  console.log(userId);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(
        `/api/v1/company/getbysingle/${userId.user._id}`
      );
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await axios.delete(`/api/v1/company/delete/${id}`);
      setCompanies(companies.filter((c) => c._id !== id));
      alert("Company deleted successfully!");
    } catch (err) {
      console.error("Error deleting company", err);
      alert("Failed to delete company.");
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
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/v1/company/update/${editingCompany._id}`, editingCompany);
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

 useEffect(() => {
  if (userId?.user?._id) {
    fetchCompanies();
  }
}, [userId.user._id]); // ✅ Ab useEffect sirf ek baar chalega jab userId milega


  // 🔍 Filtered data based on search
  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Company List
      </h2>

      {/* 🔍 Search Box */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by Company Name..."
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-blue-100 text-left text-gray-700">
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Company Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Industry</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">State</th>
              <th className="px-4 py-2 border">Zip</th>
              {/* <th className="px-4 py-2 border">HR Name</th> */}
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td className="px-4 py-2 text-center" colSpan="11">
                  No companies found.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company, index) => (
                <tr key={company._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{company.companyName}</td>
                  <td className="px-4 py-2 border">{company.email}</td>
                  <td className="px-4 py-2 border">{company.phone}</td>
                  <td className="px-4 py-2 border">{company.industry}</td>
                  <td className="px-4 py-2 border">{company.address}</td>
                  <td className="px-4 py-2 border">{company.city}</td>
                  <td className="px-4 py-2 border">{company.state}</td>
                  <td className="px-4 py-2 border">{company.zip}</td>
                  {/* <td className="px-4 py-2 border">{company.hrname}</td> */}
                  <td className="px-4 py-2 border space-x-2 flex">
                    <button
                      onClick={() => handleUpdate(company)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
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
};

export default CompanyTable;
