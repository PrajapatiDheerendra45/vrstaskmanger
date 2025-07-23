import React, { useState } from 'react';

const AssignTask = ({ staffList = [], onAssignTask }) => {
  const [task, setTask] = useState({
    staffId: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.staffId || !task.title || !task.deadline) {
      alert("Please fill all required fields");
      return;
    }
    onAssignTask(task); // Send to parent or backend
    setTask({ staffId: '', title: '', description: '', deadline: '', priority: 'Medium' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Assign Task to Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Staff</label>
          <select
            name="staffId"
            value={task.staffId}
            onChange={handleChange}
            className="w-full mt-1 border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Staff</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
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
            value={task.title}
            onChange={handleChange}
            className="w-full mt-1 border rounded-md p-2"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            rows={3}
            className="w-full mt-1 border rounded-md p-2"
            placeholder="Optional task description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={task.deadline}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full mt-1 border rounded-md p-2"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm"
        >
          Assign Task
        </button>
      </form>
    </div>
  );
};

export default AssignTask;