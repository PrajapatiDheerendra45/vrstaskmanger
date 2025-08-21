import { useEffect, useState } from "react";
import axios from "axios";

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [candidateList, setCandidateList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [updateFormData, setUpdateFormData] = useState({
    userType: "Candidate",
    name: "",
    email: "",
    mobile: "",
    service: "",
    amount: "",
    paymentMethod: "UPI",
    transactionId: "",
    remarks: "",
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const candidateRes = await axios.get("/api/v1/candidate/get");
      setCandidateList(candidateRes.data);

      const companyRes = await axios.get("/api/v1/company/get");
      setCompanyList(companyRes.data);
    } catch (err) {
      console.error("Error fetching form data:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get("/api/v1/payment/get");
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

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

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setUpdateFormData({
      userType: payment.userType,
      name: payment.name,
      email: payment.email,
      mobile: payment.mobile,
      service: payment.service,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      remarks: payment.remarks || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (updateFormData.userType === "Candidate") {
        const selected = candidateList.find((s) => s.fullName === value);
        if (selected) {
          setUpdateFormData({
            ...updateFormData,
            name: selected.fullName,
            email: selected.email,
            mobile: selected.phone,
          });
        }
      } else {
        const selected = companyList.find((c) => c.companyName === value);
        if (selected) {
          setUpdateFormData({
            ...updateFormData,
            name: selected.companyName,
            email: selected.email,
            mobile: selected.phone,
          });
        }
      }
    } else {
      setUpdateFormData({ ...updateFormData, [name]: value });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/v1/payment/update/${editingPayment._id}`, updateFormData);

      if (res?.data?.status) {
        alert('✅ Payment updated successfully');
        setShowUpdateModal(false);
        setEditingPayment(null);
        await fetchPayments();
      } else {
        alert('❌ Failed to update payment');
      }
    } catch (err) {
      alert("❌ Error updating payment");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this payment? This action cannot be undone.');
    if (!confirm) return;

    try {
      const res = await axios.delete(`/api/v1/payment/delete/${id}`);

      if (res?.data?.status) {
        alert('✅ Payment deleted successfully');
        await fetchPayments();
      } else {
        alert('❌ Failed to delete payment');
      }
    } catch (err) {
      alert("❌ Error deleting payment");
      console.error(err);
    }
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
              <th className="text-left px-6 py-3">Actions</th>
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
                  <td className="px-6 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center text-gray-500 py-6">
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

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Update Payment</h3>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setEditingPayment(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* User Type + Service */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">User Type</label>
                  <select
                    name="userType"
                    value={updateFormData.userType}
                    onChange={handleUpdateChange}
                    className="w-full border px-4 py-2 rounded"
                  >
                    <option value="Candidate">Candidate</option>
                    <option value="Company">Company</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium">Service</label>
                  <select
                    name="service"
                    value={updateFormData.service}
                    onChange={handleUpdateChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                  >
                    <option value="">Select</option>
                    <option>Training</option>
                    <option>Internship</option>
                    <option>Project Work</option>
                    <option>Consulting</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Name Selector */}
              <div>
                <label className="block font-medium">
                  {updateFormData.userType === "Candidate"
                    ? "Candidate Name"
                    : "Company Name"}
                </label>
                <select
                  name="name"
                  value={updateFormData.name}
                  onChange={handleUpdateChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Select Name</option>

                  {updateFormData.userType === "Candidate"
                    ? candidateList.map((user) => (
                        <option key={user._id} value={user.fullName}>
                          {user.fullName}
                        </option>
                      ))
                    : companyList.map((company) => (
                        <option key={company._id} value={company.companyName}>
                          {company.companyName}
                        </option>
                      ))}
                </select>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={updateFormData.email}
                    onChange={handleUpdateChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={updateFormData.mobile}
                    onChange={handleUpdateChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                  />
                </div>
              </div>

              {/* Amount & Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={updateFormData.amount}
                    onChange={handleUpdateChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={updateFormData.paymentMethod}
                    onChange={handleUpdateChange}
                    className="w-full border px-4 py-2 rounded"
                  >
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Card</option>
                  </select>
                </div>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block font-medium">Transaction ID / UTR</label>
                <input
                  type="text"
                  name="transactionId"
                  value={updateFormData.transactionId}
                  onChange={handleUpdateChange}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-medium">Remarks (Optional)</label>
                <textarea
                  name="remarks"
                  value={updateFormData.remarks}
                  onChange={handleUpdateChange}
                  rows={3}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setEditingPayment(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
