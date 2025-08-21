import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statusOptions = [
    "collaborated",
    "not_collaborated",
    "rejected",
    "under_review",
    "approved",
    "declined",
    "on_hold",
  ];

  const statusColors = {
    collaborated: "bg-green-500 text-white",
    not_collaborated: "bg-red-500 text-white",
    rejected: "bg-gray-500 text-white",
    under_review: "bg-yellow-500 text-black",
    approved: "bg-teal-500 text-white",
    declined: "bg-orange-500 text-white",
    on_hold: "bg-purple-500 text-white",
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/v1/company/get");
        const filtered = res.data.filter((c) => c.status !== "pending");
        setCompanies(filtered);
        setFilteredCompanies(filtered);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    let filtered = companies;

    if (search.trim() !== "") {
      filtered = filtered.filter((company) =>
        company.companyName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "") {
      filtered = filtered.filter((company) => company.status === statusFilter);
    }

    setFilteredCompanies(filtered);
  }, [search, statusFilter, companies]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Company List (Non-Pending)</h1>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by company name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded shadow w-full max-w-sm"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded shadow w-full max-w-xs"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg border">
        <table className="min-w-full text-sm text-left bg-white">
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
                <td className="px-4 py-2">{company?.createdBy?.name || company.hrname}</td>
                <td className="px-4 py-2 text-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[company.status] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {company.status.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
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
