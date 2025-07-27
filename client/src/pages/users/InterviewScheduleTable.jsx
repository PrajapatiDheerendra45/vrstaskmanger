import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InterviewScheduleTable = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('/api/v1/interview/get');
        const data = res.data.interviews;

        // Fetch candidate and HR names for each schedule
        const enrichedData = await Promise.all(
          data.map(async (item) => {
            let candidateName = 'N/A';
            let hrName = 'N/A';

            try {
              const candidateRes = await axios.get(`/api/v1/candidate/candidate/${item.candidateId}`);
              console.log("candidateRes",candidateRes)
              candidateName = candidateRes?.data?.data.fullName;
            } catch (err) {
              console.warn('Candidate fetch failed', err);
            }

            try {
              const hrRes = await axios.get(`/api/v1/users/getusers/${item.hr}`);
              console.log("hrRes",hrRes)
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

    fetchSchedules();
  }, []);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📅 Interview Schedules</h2>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Candidate Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">HR Name</th>
              <th className="px-4 py-3">Interview Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {schedules.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.candidateName}</td>
                <td className="px-4 py-3 capitalize">{item.company}</td>
                <td className="px-4 py-3">{item.hrName}</td>
                <td className="px-4 py-3">{item.interviewDate}</td>
                <td className="px-4 py-3">{item.interviewTime}</td>
                <td className="px-4 py-3">{item.interviewType}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-nowrap text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.notes || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
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
