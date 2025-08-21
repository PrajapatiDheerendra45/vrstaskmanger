import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InterviewScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hrList, setHrList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [updateFormData, setUpdateFormData] = useState({
    candidateId: "",
    interviewDate: "",
    interviewTime: "",
    interviewType: "In-Person",
    hr: "",
    company: "",
    status: "Scheduled",
    notes: "",
  });

  const statusOptions = [
    'Scheduled',
    'In progress',
    'Pending',
    'Completed',
    'Selected',
    'Cancelled',
    'Rescheduled',
  ];

  useEffect(() => {
    fetchSchedules();
    fetchFormData();
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [candidateSearch, statusFilter, schedules]);

  const fetchFormData = async () => {
    try {
      const candidateRes = await axios.get("/api/v1/candidate/get");
      setCandidates(candidateRes.data);

      const user = JSON.parse(localStorage.getItem("auth"));
      
      // Get HR list (only show current user if they are HR)
      if (user?.user?.role === 'hr' || user?.user?.role === 'admin') {
        const hrRes = await axios.get("/api/v1/users/getusers");
        setHrList(hrRes?.data?.users || []);
      } else {
        // For regular users, only show themselves
        setHrList([user?.user]);
      }

      const companyRes = await axios.get("/api/v1/company/get");
      const collaboratedCompanies = companyRes.data.filter(
        (company) => company.status === "collaborated"
      );
      setCompanyList(collaboratedCompanies);
    } catch (err) {
      console.error("Fetch form data error:", err);
    }
  };

  const fetchSchedules = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("auth"));
      const userId = user?.user?._id;
      const res = await axios.get(`/api/v1/interview/getbyId/${userId}`);
      const data = res.data.interview;

      const enrichedData = await Promise.all(
        data.map(async (item) => {
          let candidateName = 'N/A';
          let hrName = 'N/A';

          try {
            const candidateRes = await axios.get(`/api/v1/candidate/candidate/${item.candidateId}`);
            candidateName = candidateRes?.data?.data.fullName;
          } catch (err) {
            console.warn('Candidate fetch failed', err);
          }

          try {
            const hrRes = await axios.get(`/api/v1/users/getusers/${item.hr}`);
            hrName = hrRes.data.user.name;
          } catch (err) {
            console.warn('HR fetch failed', err);
          }

          return {
            ...item,
            candidateName,
            hrName,
          };
        })
      );

      setSchedules(enrichedData);
    } catch (error) {
      console.error('Failed to fetch interview data:', error);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;
    if (candidateSearch) {
      filtered = filtered.filter((item) =>
        item.candidateName.toLowerCase().includes(candidateSearch.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    setFilteredSchedules(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      'In progress': 'bg-blue-100 text-blue-800',
      Scheduled: 'bg-purple-100 text-purple-800',
      Selected: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
      Rescheduled: 'bg-orange-100 text-orange-800',
      Completed: 'bg-green-200 text-green-900',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirm = window.confirm(`Do you really want to change status to "${newStatus}"?`);
    if (!confirm) return;

    try {
      const res = await axios.put(`/api/v1/interview/update/${id}`, { status: newStatus });

      if (res.data.success) {
        await fetchSchedules();
        alert('✅ Status updated successfully');
      } else {
        alert('❌ Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('❌ Error updating status');
    }
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setUpdateFormData({
      candidateId: interview.candidateId,
      interviewDate: interview.interviewDate,
      interviewTime: interview.interviewTime,
      interviewType: interview.interviewType,
      hr: interview.hr,
      company: interview.company,
      status: interview.status,
      notes: interview.notes || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/v1/interview/update/${editingInterview._id}`, updateFormData);

      if (res?.data?.success) {
        alert('✅ Interview updated successfully');
        setShowUpdateModal(false);
        setEditingInterview(null);
        await fetchSchedules();
      } else {
        alert('❌ Failed to update interview');
      }
    } catch (err) {
      alert("❌ Error updating interview");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this interview? This action cannot be undone.');
    if (!confirm) return;

    try {
      const res = await axios.delete(`/api/v1/interview/delete/${id}`);

      if (res?.data?.success) {
        alert('✅ Interview deleted successfully');
        await fetchSchedules();
      } else {
        alert('❌ Failed to delete interview');
      }
    } catch (err) {
      alert("❌ Error deleting interview");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📅 Interview Schedules</h2>

      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by candidate name..."
          value={candidateSearch}
          onChange={(e) => setCandidateSearch(e.target.value)}
          className="border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring w-full sm:w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring w-full sm:w-1/4"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Candidate Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Interview Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredSchedules.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.candidateName}</td>
                <td className="px-4 py-3 capitalize">{item.company}</td>
                <td className="px-4 py-3">{item.interviewDate}</td>
                <td className="px-4 py-3">{item.interviewTime}</td>
                <td className="px-4 py-3">{item.interviewType}</td>
                <td className="px-4 py-3">
                  <select
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">{item.notes || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
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
            ))}
            {filteredSchedules.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No interview schedules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Update Interview</h3>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setEditingInterview(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Candidate</label>
                <select
                  name="candidateId"
                  value={updateFormData.candidateId}
                  onChange={handleUpdateChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  required
                >
                  <option value="">-- Select Candidate --</option>
                  {candidates.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={updateFormData.interviewDate}
                    onChange={handleUpdateChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    name="interviewTime"
                    value={updateFormData.interviewTime}
                    onChange={handleUpdateChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interview Type</label>
                <select
                  name="interviewType"
                  value={updateFormData.interviewType}
                  onChange={handleUpdateChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                >
                  <option>In-Person</option>
                  <option>Online</option>
                  <option>Telephonic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <select
                  name="company"
                  value={updateFormData.company}
                  onChange={handleUpdateChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  required
                >
                  <option value="">-- Select Collaborated Company --</option>
                  {companyList.map((company) => (
                    <option key={company._id} value={company.companyName}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">HR</label>
                <select
                  name="hr"
                  value={updateFormData.hr}
                  onChange={handleUpdateChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                  required
                >
                  <option value="">-- Select HR --</option>
                  {hrList.map((hr) => (
                    <option key={hr._id} value={hr._id}>
                      {hr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={updateFormData.notes}
                  onChange={handleUpdateChange}
                  rows="3"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setEditingInterview(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduleTable;
