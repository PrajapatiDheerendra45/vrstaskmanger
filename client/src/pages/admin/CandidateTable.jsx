import React, { useState, useEffect } from "react";
import axios from "axios";

const statusColor = {
  Shortlisted: "bg-yellow-100 text-yellow-800",
  Interviewed: "bg-blue-100 text-blue-800",
  Hired: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function CandidateTable() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  // Fetch candidates from API on mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
           
        const res = await axios.get(`/api/v1/candidate/get/`);
        // console.log("object", res);
        setCandidates(res.data);
        setFilteredCandidates(res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    const result = candidates.filter(
      (candidate) =>
        candidate?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        candidate?.position?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCandidates(result);
  }, [search, candidates]);

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
              <th className="">Skill</th>
              <th className="px-4 py-3">Experience</th>

              <th className="px-4 py-3">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No candidates found.
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate) => (
                <tr key={candidate._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{candidate.fullName}</td>
                  <td className="px-4 py-3">{candidate.email}</td>
                  <td className="px-4 py-3">{candidate.phone}</td>
                  <td className="px-4 py-3">{candidate.position}</td>
                  <td className=" bg-white"><textarea className="w-full" name="" id="">{candidate.skills}</textarea></td>
                  <td className="px-4 py-3">{candidate.experience}</td>

                  <td className="px-4 py-3">
                    {candidate.resume ? (
                      <a
                        href={`http://localhost:5000/${candidate.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-gray-400">No Resume</span>
                    )}
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
