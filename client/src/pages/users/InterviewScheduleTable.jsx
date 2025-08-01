import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InterviewScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
  }, []);

  useEffect(() => {
    filterSchedules();
  }, [candidateSearch, statusFilter, schedules]);

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
              </tr>
            ))}
            {filteredSchedules.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No interview schedules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewScheduleTable;
