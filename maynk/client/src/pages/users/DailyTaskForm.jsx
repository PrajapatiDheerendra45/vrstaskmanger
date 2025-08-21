import { useState } from "react";

const DailyTaskForm = () => {
  const [taskData, setTaskData] = useState({
    date: new Date().toISOString().slice(0, 10),
    title: "",
    description: "",
    type: "Development",
    hours: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Task:", taskData);

    // 👉 Send data to backend using axios/fetch here

    // Clear form
    setTaskData({
      date: new Date().toISOString().slice(0, 10),
      title: "",
      description: "",
      type: "Development",
      hours: ""
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">📝 Daily Task Submission</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={taskData.date}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium">Task Title</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="e.g. Worked on login page"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Describe what you did today..."
            required
            rows="4"
            className="w-full px-4 py-2 border rounded-md"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Task Type</label>
          <select
            name="type"
            value={taskData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option>Development</option>
            <option>Meeting</option>
            <option>Testing</option>
            <option>Design</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Hours Spent</label>
          <input
            type="number"
            name="hours"
            value={taskData.hours}
            onChange={handleChange}
            placeholder="e.g. 6"
            min="1"
            max="24"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
        >
          Submit Task
        </button>
      </form>
    </div>
  );
};

export default DailyTaskForm;
