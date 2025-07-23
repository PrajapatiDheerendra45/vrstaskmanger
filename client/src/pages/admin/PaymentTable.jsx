import { useState } from "react";

const PaymentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const payments = [
    {
      id: 1,
      type: "Student",
      name: "Aman Verma",
      amount: 5000,
      service: "Internship Assistance",
      date: "2025-07-20",
    },
    {
      id: 2,
      type: "Company",
      name: "TechCorp Pvt Ltd",
      amount: 12000,
      service: "Staff Hiring",
      date: "2025-07-18",
    },
    {
      id: 3,
      type: "Student",
      name: "Riya Sharma",
      amount: 3000,
      service: "Training Fee",
      date: "2025-07-17",
    },
  ];

  const filteredPayments = payments.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Payment Records</h2>

      <input
        type="text"
        placeholder="Search by name..."
        className="mb-4 px-4 py-2 border rounded-md w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-left px-6 py-3">#</th>
              <th className="text-left px-6 py-3">Type</th>
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Service</th>
              <th className="text-left px-6 py-3">Amount (₹)</th>
              <th className="text-left px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((item, idx) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.service}</td>
                  <td className="px-6 py-4">₹{item.amount}</td>
                  <td className="px-6 py-4">{item.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
