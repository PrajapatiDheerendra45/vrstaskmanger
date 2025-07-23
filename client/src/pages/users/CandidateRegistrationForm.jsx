import React, { useState } from "react";
import axios from "axios";

const CandidateRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    position:"",
    phone: "",
    experience: "",
    skills: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("auth")); // Assuming user object is stored
      const createdBy = user?.user?._id;

      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email);
      payload.append("position", formData.position);
      payload.append("phone", formData.phone);
      payload.append("experience", formData.experience);
      payload.append("skills", formData.skills);
      payload.append("resume", formData.resume);
      payload.append("createdBy", createdBy);

      const res = await axios.post("/api/v1/candidate/create", payload);
    
      if (res.data.status) {
        alert(res.data.message);

        setFormData({
          fullName: "",
          position:"",
          email: "",
          phone: "",
          experience: "",
          skills: "",
          resume: null,
        });
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Error while submitting candidate!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Candidate Registration
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            onChange={handleChange}
            value={formData.fullName}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            onChange={handleChange}
            value={formData.email}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
          <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
          Position
          </label> 
          <input
            type="text"
            name="position"
            required
            onChange={handleChange}
            value={formData.position}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            required
            onChange={handleChange}
            value={formData.phone}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Experience (Years)
          </label>
          <input
            type="number"
            name="experience"
            onChange={handleChange}
            value={formData.experience}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Skills
          </label>
          <textarea
            name="skills"
            rows="3"
            onChange={handleChange}
            value={formData.skills}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., React, Node.js, SQL"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Upload Resume
          </label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white"
            required
          />
        </div>

        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register Candidate
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidateRegistrationForm;
