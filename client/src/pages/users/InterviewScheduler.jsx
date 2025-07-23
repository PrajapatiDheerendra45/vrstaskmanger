import React, { useState } from "react";

const InterviewScheduler = () => {
  const [formData, setFormData] = useState({
    candidateId: "",
    interviewDate: "",
    interviewTime: "",
    interviewType: "In-Person",
    hr: "",
    company: "",
    status: "In progress",
    notes: "",
  });

  const [searchCandidate, setSearchCandidate] = useState("");

  const candidates = [
    { id: 1, name: "Rahul Sharma" },
    { id: 2, name: "Priya Verma" },
    { id: 3, name: "Amit Patel" },
    { id: 4, name: "Divya Singh" },
    { id: 5, name: "Mohit Chauhan" },
  ];

  const hrList = ["Neha Gupta", "Rakesh Kumar", "Sonal Jain"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Interview Scheduled:", formData);
    // Add API call here
  };

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchCandidate.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md p-8 rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Interview Scheduler</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Search Candidate</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchCandidate}
            onChange={(e) => setSearchCandidate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-2"
          />
          <select
            name="candidateId"
            value={formData.candidateId}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          >
            <option value="">-- Select Candidate --</option>
            {filteredCandidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              name="interviewTime"
              value={formData.interviewTime}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Interview Type</label>
          <select
            name="interviewType"
            value={formData.interviewType}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          >
            <option>In-Person</option>
            <option>Online</option>
            <option>Telephonic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g., Infosys Ltd."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select HR</label>
          <select
            name="hr"
            value={formData.hr}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          >
            <option value="">-- Select HR --</option>
            {hrList.map((hr, idx) => (
              <option key={idx} value={hr}>{hr}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          >
            <option value="In progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Additional notes..."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Schedule Interview
        </button>
      </form>
    </div>
  );
};

export default InterviewScheduler;