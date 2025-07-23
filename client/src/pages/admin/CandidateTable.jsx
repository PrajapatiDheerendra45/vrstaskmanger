import React, { useState } from 'react';

const dummyCandidates = [
  {
    id: 1,
    name: 'Ravi Sharma',
    email: 'ravi@example.com',
    phone: '9876543210',
    position: 'Frontend Developer',
    experience: '2 Years',
    status: 'Shortlisted',
  },
  {
    id: 2,
    name: 'Priya Verma',
    email: 'priya@example.com',
    phone: '9998887776',
    position: 'Backend Developer',
    experience: '3 Years',
    status: 'Interviewed',
  },
  {
    id: 3,
    name: 'Amit Singh',
    email: 'amit@example.com',
    phone: '8887776665',
    position: 'Full Stack Developer',
    experience: '4 Years',
    status: 'Rejected',
  },
  {
    id: 4,
    name: 'Neha Patel',
    email: 'neha@example.com',
    phone: '7776665554',
    position: 'UI/UX Designer',
    experience: '1.5 Years',
    status: 'Hired',
  },
];

const statusColor = {
  Shortlisted: 'bg-yellow-100 text-yellow-800',
  Interviewed: 'bg-blue-100 text-blue-800',
  Hired: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function CandidateTable() {
  const [search, setSearch] = useState('');

  const filteredCandidates = dummyCandidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(search.toLowerCase()) ||
    candidate.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Candidate List</h2>
        <input
          type="text"
          placeholder="Search by name or position..."
          className="mt-2 px-4 py-2 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No candidates found.
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{candidate.name}</td>
                  <td className="px-4 py-3">{candidate.email}</td>
                  <td className="px-4 py-3">{candidate.phone}</td>
                  <td className="px-4 py-3">{candidate.position}</td>
                  <td className="px-4 py-3">{candidate.experience}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[candidate.status]}`}>
                      {candidate.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}