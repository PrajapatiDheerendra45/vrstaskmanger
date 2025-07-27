import React, { useEffect, useState } from "react";
import axios from "axios";

const InterviewScheduler = () => {
  const [formData, setFormData] = useState({
    candidateId: "",
    interviewDate: "",
    interviewTime: "",
    interviewType: "In-Person",
    hr: "",
    company: "",
    status: "Scheduled",
    notes: "",
  });

  const [candidates, setCandidates] = useState([]);
  const [hrList, setHrList] = useState([]);
  const [searchCandidate, setSearchCandidate] = useState("");

  // ✅ Fetch candidates and HR on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidateRes = await axios.get("/api/v1/candidate/get");
        setCandidates(candidateRes.data);

        const hrRes = await axios.get("/api/v1/users/getusers");
        setHrList(hrRes.data.users || []); // assuming API returns { users: [] }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/interview/schedule", formData);

      if (res?.data?.success) {
        alert(res?.data?.message);
        setFormData({
          candidateId: "",
          interviewDate: "",
          interviewTime: "",
          interviewType: "In-Person",
          hr: "",
          company: "",
          status: "Scheduled",
          notes: "",
        });
      }
    } catch (err) {
      alert("❌ Error scheduling interview");
      console.error(err);
    }
  };

  const filteredCandidates = candidates.filter((c) =>
    c.fullName.toLowerCase().includes(searchCandidate.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md p-8 rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Interview Scheduler
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Search Candidate
          </label>
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
              <option key={c._id} value={c._id}>
                {c.fullName}
              </option>
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
          <label className="block text-sm font-medium mb-1">
            Interview Type
          </label>
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
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">HR</label>
          <select
            name="hr"
            value={formData.hr}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
            required
          >
            <option value="">-- Select HR --</option>
            {hrList.map((hr) => (
              <option key={hr._id} value={hr._id}>
                {hr.name}
              </option>
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
            <option value="Scheduled">Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
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
