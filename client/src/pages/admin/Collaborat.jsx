import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompanyStatusForm = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [status, setStatus] = useState('');

  const statusOptions = ['Pending', 'Collaborated', 'Cancelled', 'Under Discussion'];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('/api/v1/company/get');
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompanyId || !status) return alert('Please select company and status');

    try {
      await axios.put(`/api/v1/company/status/${selectedCompanyId}`, { status });
      alert('Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Update Company Status</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Company</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
          >
            <option value="">-- Select Company --</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Status</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">-- Select Status --</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Status
        </button>
      </form>
    </div>
  );
};

export default CompanyStatusForm;
