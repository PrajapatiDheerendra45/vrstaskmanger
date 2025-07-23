import { useState } from "react";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    userType: "Student",
    name: "",
    email: "",
    mobile: "",
    service: "",
    amount: "",
    paymentMethod: "UPI",
    transactionId: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment Submitted:", formData);

    // 👇 Add axios POST here if needed
    // await axios.post("/api/payment", formData);

    alert("Payment details submitted successfully!");
    setFormData({
      userType: "Student",
      name: "",
      email: "",
      mobile: "",
      service: "",
      amount: "",
      paymentMethod: "UPI",
      transactionId: "",
      remarks: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">💳 Payment Submission Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="Student">Student</option>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 2000"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <label className="block font-medium">Transaction ID / UTR</label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="e.g. UPI123456"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Remarks (optional)</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional info..."
            className="w-full border px-4 py-2 rounded"
          />
        </div>

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
