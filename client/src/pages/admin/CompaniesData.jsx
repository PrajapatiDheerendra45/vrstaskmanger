import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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

  // Search filter
  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.companyName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [search, companies]);

  // Sorting logic
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredCompanies].sort((a, b) => {
      const valA = a[field]?.toLowerCase?.() || "";
      const valB = b[field]?.toLowerCase?.() || "";

      if (order === "asc") return valA.localeCompare(valB);
      else return valB.localeCompare(valA);
    });

    setFilteredCompanies(sorted);
  };

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Company List</h1>

      {/* Search Filter */}
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
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("companyName")}>
                Company Name {sortField === "companyName" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort("state")}>
                State {sortField === "state" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3">HR Name</th>
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
                <td className="px-4 py-2">{company?.createdBy?.name || company.hrname}</td>
                <td className="px-4 py-2 space-x-2 flex">
                  <button
                    onClick={() => alert("Update flow")}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
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
