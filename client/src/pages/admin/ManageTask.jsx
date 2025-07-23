import React, { useState } from 'react';

const tasks = [
  { id: 1, name: 'Interview Scheduling', assignee: 'Ravi', status: 'Pending', due: '2025-07-21' },
  { id: 2, name: 'Resume Screening', assignee: 'Asha', status: 'Completed', due: '2025-07-18' },
  { id: 3, name: 'Client Follow-up', assignee: 'Meera', status: 'In Progress', due: '2025-07-20' },
  { id: 4, name: 'Onboarding', assignee: 'Amit', status: 'Pending', due: '2025-07-22' },
];

const GetTaskTable = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === '' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Task List</h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Task or Assignee..."
          className="px-4 py-2 border rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-md">
          <thead className="bg-blue-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">#</th>
              <th className="text-left px-4 py-2 border-b">Task</th>
              <th className="text-left px-4 py-2 border-b">Assignee</th>
              <th className="text-left px-4 py-2 border-b">Status</th>
              <th className="text-left px-4 py-2 border-b">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, idx) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{idx + 1}</td>
                <td className="px-4 py-2 border-b">{task.name}</td>
                <td className="px-4 py-2 border-b">{task.assignee}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{task.due}</td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetTaskTable;