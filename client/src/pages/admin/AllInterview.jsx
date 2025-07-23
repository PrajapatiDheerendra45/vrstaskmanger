import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const mockData = [
  {
    id: 1,
    candidate: 'Rahul Sharma',
    position: 'Frontend Developer',
    interviewer: 'Neha Jain',
    date: '2025-07-21',
    time: '10:30 AM',
    status: 'Scheduled',
  },
  {
    id: 2,
    candidate: 'Priya Mehta',
    position: 'UI/UX Designer',
    interviewer: 'Rohan Verma',
    date: '2025-07-22',
    time: '2:00 PM',
    status: 'Completed',
  },
  {
    id: 3,
    candidate: 'Aman Singh',
    position: 'Backend Developer',
    interviewer: 'Kavita Sinha',
    date: '2025-07-23',
    time: '11:00 AM',
    status: 'Cancelled',
  },
];

const statusColors = {
  Scheduled: 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const AllInterviewsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    // Replace with real API call
    setInterviews(mockData);
  }, []);

  const filtered = interviews.filter((i) => {
    const matchName = i.candidate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDate = selectedDate ? i.date === selectedDate : true;
    const matchStatus = selectedStatus ? i.status === selectedStatus : true;
    return matchName && matchDate && matchStatus;
  });

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Interviewer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((interview, index) => (
              <tr key={interview.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{interview.candidate}</td>
                <td className="px-4 py-3">{interview.position}</td>
                <td className="px-4 py-3">{interview.interviewer}</td>
                <td className="px-4 py-3">{interview.date}</td>
                <td className="px-4 py-3">{interview.time}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[interview.status]}`}
                  >
                    {interview.status}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No interviews match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllInterviewsTable;