import { useEffect, useState } from "react";
import axios from "axios";

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("/api/v1/payment/get");
        setPayments(res.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((item) => {
    const matchName = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "All" || item.userType === filterType;
    return matchName && matchType;
  });

  const totalAmount = filteredPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">💳 Payment Records</h2>

      {/* Total Amount */}
      <div className="mb-4 text-center text-lg font-semibold text-green-600">
        Total Amount: ₹{totalAmount}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border rounded-md shadow-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1); // reset page on filter change
          }}
          className="px-4 py-2 border rounded-md shadow-sm w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Candidate">Candidate</option>
          <option value="Company">Company</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-6 py-3">#</th>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Mobile</th>
              <th className="text-left px-6 py-3">Service</th>
              <th className="text-left px-6 py-3">Amount (₹)</th>
              <th className="text-left px-6 py-3">Payment</th>
              <th className="text-left px-6 py-3">Txn ID</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((item, idx) => (
                <tr
                  key={item._id}
                  className={`border-b ${
                    item.userType === "Candidate"
                      ? "bg-green-200"
                      : item.userType === "Company"
                      ? "bg-yellow-200"
                      : ""
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-3">{startIndex + idx + 1}</td>
                  <td className="px-6 py-3">{item.userType}</td>
                  <td className="px-6 py-3">{item.name}</td>
                  <td className="px-6 py-3">{item.email}</td>
                  <td className="px-6 py-3">{item.mobile}</td>
                  <td className="px-6 py-3">{item.service}</td>
                  <td className="px-6 py-3">₹{item.amount}</td>
                  <td className="px-6 py-3">{item.paymentMethod}</td>
                  <td className="px-6 py-3">{item.transactionId}</td>
                  <td className="px-6 py-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">{item.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center text-gray-500 py-6">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          ⬅️ Previous
        </button>
        <span className="self-center text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default PaymentTable;
