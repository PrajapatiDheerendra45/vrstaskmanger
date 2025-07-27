import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
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

  const [CandidateList, setCandidateList] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  // Fetch Candidates or companies based on userType
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (formData.userType === "Candidate") {
          const res = await axios.get("/api/v1/candidate/get");
          console.log("res", res);

          setCandidateList(res.data);
        } else {
          const res = await axios.get("/api/v1/company/get");
          setCompanyList(res.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [formData.userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (formData.userType === "Candidate") {
        const selected = CandidateList.find((s) => s.fullName === value);
        if (selected) {
          setFormData({
            ...formData,
            name: selected.fullName,
            email: selected.email,
            mobile: selected.phone,
          });
        }
      } else {
        const selected = companyList.find((c) => c.companyName === value);
        if (selected) {
          setFormData({
            ...formData,
            name: selected.companyName,
            email: selected.email,
            mobile: selected.phone,
          });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await axios.post("/api/v1/payment/create", formData);
      console.log("data", data);
      if (data.data.status) {
        alert(data.data.message);
        // Reset form
        setFormData({
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
      }
    } catch (err) {
      console.error("❌ Payment submission failed:", err);
      alert("Error submitting payment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        💳 Payment Submission Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Type + Service */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
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
              value={formData.service}
              onChange={handleChange}
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
            {formData.userType === "Candidate"
              ? "Candidate Name"
              : "Company Name"}
          </label>
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Select Name</option>

            {formData.userType === "Candidate"
              ? CandidateList.map((user) => (
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
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
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
              value={formData.amount}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
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
            value={formData.transactionId}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="block font-medium">Remarks (Optional)</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows={3}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
