import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyTable = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      await axios.delete(`http://localhost:5000/api/v1/company/delete/${id}`);
      setCompanies(companies.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting company", err);
    }
  };

  const handleUpdate = (id) => {
    alert(`Navigate to update form for company ID: ${id}`);
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
                      onClick={() => handleUpdate(company._id)}
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
    </div>
  );
};

export default CompanyTable;
