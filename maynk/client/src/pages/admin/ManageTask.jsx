import React, { useEffect, useState } from "react";
import axios from "axios";

const GetTaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [staffMap, setStaffMap] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [staffList, setStaffList] = useState([]);

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

  // Fetch staff list for edit modal
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get("/api/v1/users/getusers");
        setStaffList(res.data.users);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    fetchStaff();
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
        console.log("staffId", staffId);
        const res = await axios.get(`/api/v1/users/getusers/${staffId}`);
        console.log("name", res);
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

  // Handle edit task
  const handleEdit = (task) => {
    setEditingTask({
      ...task,
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  // Handle update task
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/v1/task/update/${editingTask._id}`, editingTask);
      setTasks(tasks.map(task => task._id === editingTask._id ? res.data : task));
      setShowEditModal(false);
      setEditingTask(null);
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task.");
    }
  };

  // Handle delete task
  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/api/v1/task/delete/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
        alert("Task deleted successfully!");
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      }
    }
  };

  // Handle input change in edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };

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
              <th className="px-4 py-2 border">Created Date</th>
              <th className="px-4 py-2 border">Deadline</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Actions</th>
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
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-IN", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : "—"}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(task.deadline).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-2 border">{task.description || "—"}</td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
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

      {/* Edit Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Staff</label>
                <select
                  name="staffId"
                  value={editingTask.staffId}
                  onChange={handleEditChange}
                  className="w-full mt-1 border rounded-md p-2"
                  required
                >
                  <option value="">Select Staff</option>
                  {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={editingTask.title}
                  onChange={handleEditChange}
                  className="w-full mt-1 border rounded-md p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editingTask.description || ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full mt-1 border rounded-md p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={editingTask.deadline}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={editingTask.priority}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={editingTask.status}
                  onChange={handleEditChange}
                  className="w-full mt-1 border rounded-md p-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex-1"
                >
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetTaskTable;
