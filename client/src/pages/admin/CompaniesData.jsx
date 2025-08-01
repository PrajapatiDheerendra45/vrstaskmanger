import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");

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
    </div>
  );
}
