// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const statusColor = {
//   Shortlisted: "bg-yellow-100 text-yellow-800",
//   Interviewed: "bg-blue-100 text-blue-800",
//   Hired: "bg-green-100 text-green-800",
//   Rejected: "bg-red-100 text-red-800",
// };

// export default function CandidateTable() {
//   const [search, setSearch] = useState("");
//   const [candidates, setCandidates] = useState([]);
//   const [filteredCandidates, setFilteredCandidates] = useState([]);

//   // Fetch candidates from API on mount
//   useEffect(() => {
//     const fetchCandidates = async () => {
//       try {
           
//         const res = await axios.get(`/api/v1/candidate/get/`);
//         // console.log("object", res);
//         setCandidates(res.data);
//         setFilteredCandidates(res.data);
//       } catch (err) {
//         console.error("Error fetching candidates:", err);
//       }
//     };

//     fetchCandidates();
//   }, []);

//   useEffect(() => {
//     const result = candidates.filter(
//       (candidate) =>
//         candidate?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//         candidate?.position?.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredCandidates(result);
//   }, [search, candidates]);

//   return (
//     <div className="p-6 bg-white shadow-lg rounded-xl">
//       <div className="mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Candidate List</h2>
//         <input
//           type="text"
//           placeholder="Search by name or position..."
//           className="mt-2 px-4 py-2 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border divide-y divide-gray-200">
//           <thead className="bg-gray-100">
//             <tr className="text-left text-sm font-medium text-gray-600">
//               <th className="px-4 py-3">Name</th>
//               <th className="px-4 py-3">Email</th>
//               <th className="px-4 py-3">Phone</th>
//               <th className="px-4 py-3">Position</th>
//               <th className="">Skill</th>
//               <th className="px-4 py-3">Experience</th>

//               <th className="px-4 py-3">Resume</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 text-sm">
//             {filteredCandidates.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center py-4 text-gray-500">
//                   No candidates found.
//                 </td>
//               </tr>
//             ) : (
//               filteredCandidates.map((candidate) => (
//                 <tr key={candidate._id} className="hover:bg-gray-50 transition">
//                   <td className="px-4 py-3">{candidate.fullName}</td>
//                   <td className="px-4 py-3">{candidate.email}</td>
//                   <td className="px-4 py-3">{candidate.phone}</td>
//                   <td className="px-4 py-3">{candidate.position}</td>
//                   <td className=" bg-white"><textarea className="w-full" name="" id="">{candidate.skills}</textarea></td>
//                   <td className="px-4 py-3">{candidate.experience}</td>

//                   <td className="px-4 py-3">
//                     {candidate.resume ? (
//                       <a
//                         href={`http://localhost:5000/${candidate.resume}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         View Resume
//                       </a>
//                     ) : (
//                       <span className="text-gray-400">No Resume</span>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [hrList, setHrList] = useState([]);
  
  // Fetch candidates from API on mount
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("auth")); // Get user from localStorage
        const userId = user?.user?._id;
        const res = await axios.get(`/api/v1/candidate/get/`);
        console.log("object", res);
        setCandidates(res.data);
        setFilteredCandidates(res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchCandidates();
  }, []);

  // Fetch HR list for edit modal
  useEffect(() => {
    const fetchHRList = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("auth"));
        if (user?.user?.role === 'hr' || user?.user?.role === 'admin') {
          const hrRes = await axios.get("/api/v1/users/getusers");
          setHrList(hrRes?.data?.users || []);
        } else {
          setHrList([user?.user]);
        }
      } catch (error) {
        console.error("Error fetching HR list:", error);
      }
    };
    fetchHRList();
  }, []);

  useEffect(() => {
    const result = candidates.filter(
      (candidate) =>
        candidate?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        candidate?.position?.toLowerCase().includes(search.toLowerCase()) ||
        candidate?.location?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCandidates(result);
  }, [search, candidates]);

  // Handle edit candidate
  const handleEdit = (candidate) => {
    setEditingCandidate({
      ...candidate,
      resume: null // Reset resume for edit
    });
    setShowEditModal(true);
  };

  // Handle update candidate
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("fullName", editingCandidate.fullName);
      payload.append("email", editingCandidate.email);
      payload.append("position", editingCandidate.position);
      payload.append("phone", editingCandidate.phone);
      payload.append("experience", editingCandidate.experience);
      payload.append("location", editingCandidate.location);
      payload.append("comments", editingCandidate.comments);
      if (editingCandidate.resume) {
        payload.append("resume", editingCandidate.resume);
      }

      const res = await axios.put(`/api/v1/candidate/update/${editingCandidate._id}`, payload);
      setCandidates(candidates.map(candidate => candidate._id === editingCandidate._id ? res.data : candidate));
      setShowEditModal(false);
      setEditingCandidate(null);
      alert("Candidate updated successfully!");
    } catch (error) {
      console.error("Error updating candidate:", error);
      alert("Failed to update candidate.");
    }
  };

  // Handle delete candidate
  const handleDelete = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(`/api/v1/candidate/delete/${candidateId}`);
        setCandidates(candidates.filter(candidate => candidate._id !== candidateId));
        alert("Candidate deleted successfully!");
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert("Failed to delete candidate.");
      }
    }
  };

  // Handle input change in edit modal
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setEditingCandidate(prev => ({ ...prev, resume: files[0] }));
    } else {
      setEditingCandidate(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Candidate List</h2>
        <input
          type="text"
          placeholder="Search by name, position, or location..."
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
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Comments</th>
              <th className="px-4 py-3">Resume</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
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
                  <td className="px-4 py-3">{candidate.location}</td>
                  <td className="px-4 py-3">{candidate.experience}</td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs truncate" title={candidate.comments}>
                      {candidate.comments || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {candidate.resume ? (
                      <a
                        href={`/${candidate.resume.split('uploads/').pop()}`}
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
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(candidate._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Candidate</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editingCandidate.fullName}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editingCandidate.email}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={editingCandidate.position}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editingCandidate.phone}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={editingCandidate.experience}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editingCandidate.location}
                    onChange={handleEditChange}
                    className="w-full mt-1 border rounded-md p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Comments</label>
                <textarea
                  name="comments"
                  value={editingCandidate.comments || ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full mt-1 border rounded-md p-2"
                  placeholder="Additional comments or notes about the candidate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Update Resume (Optional)</label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleEditChange}
                  className="w-full mt-1 border rounded-md p-2"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing resume</p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex-1"
                >
                  Update Candidate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCandidate(null);
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
}
