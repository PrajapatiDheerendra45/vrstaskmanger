import React, { useEffect, useState } from "react";
import axios from "axios";

const GetTaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [staffMap, setStaffMap] = useState({});
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/v1/task/get");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

const filteredTasks = tasks.filter((task) => {
  const staffName = staffMap[task.staffId]?.toLowerCase() || "";

  const nameMatch =
    task.title?.toLowerCase().includes(search.toLowerCase()) ||
    staffName.includes(search.toLowerCase());

  const statusMatch = statusFilter === "" || task.status === statusFilter;

  const dateMatch =
    dateFilter === "" || task.deadline?.slice(0, 10) === dateFilter;

  return nameMatch && statusMatch && dateMatch;
});



const fetchStaffName = async (staffId) => {
  if (!staffMap[staffId]) {
    try {
      console.log("staffId",staffId)
      const res = await axios.get(`/api/v1/users/getusers/${staffId}`);
      console.log("name",res)
      setStaffMap(prev => ({ ...prev, [staffId]: res.data.user.name }));
    } catch (error) {
      console.error("Failed to fetch staff", error);
    }
  }
};

useEffect(() => {
  tasks.forEach(task => {
    if (task.staffId) {
      fetchStaffName(task.staffId);
    }
  });
}, [tasks]);

  return (
    <div className="p-6 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        📋 Task Management
      </h2>

      <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Task or Assignee..."
          className="px-4 py-2 border rounded-md w-full lg:w-1/3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-md w-full lg:w-1/4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="date"
          className="px-4 py-2 border rounded-md w-full lg:w-1/4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 rounded-md text-sm">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Task</th>
              <th className="px-4 py-2 border">Assignee</th>

              <th className="px-4 py-2 border">Priority</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Deadline</th>
              <th className="px-4 py-2 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, idx) => (
              <tr key={task._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border text-center">{idx + 1}</td>
                <td className="px-4 py-2 border">{task.title}</td>
                {console.log("task", task.staffId)}
                <td className="px-4 py-2 border">
                  {staffMap[task.staffId] || "Loading..."}
                </td>

                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold 
                    ${
                      task.priority === "High"
                        ? "bg-red-200 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }
                  `}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold 
                    ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  `}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {new Date(task.deadline).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-2 border">{task.description || "—"}</td>
              </tr>
            ))}

            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  😕 No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetTaskTable;
