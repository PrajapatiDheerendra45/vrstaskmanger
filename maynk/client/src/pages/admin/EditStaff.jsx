import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const IT_DESIGNATIONS = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
];

const NON_IT_DESIGNATIONS = [
  "HR Manager",
  "Accountant",
  "Admin",
  "Sales Executive",
];

const IT_DEPARTMENTS = ["Engineering", "Development", "QA", "Support"];
const NON_IT_DEPARTMENTS = ["HR", "Finance", "Administration", "Sales"];

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    department: "",
    joiningDate: null,
    role: "0",
    status: "active",
  });

  const [otherDesignation, setOtherDesignation] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch staff data on component mount
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/getusers/${id}`);
        const userData = response.data.user;
        
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          password: "", // Don't populate password for security
          phone: userData.phone || "",
          designation: userData.designation || "",
          department: userData.department || "",
          joiningDate: userData.joiningDate ? new Date(userData.joiningDate) : null,
          role: userData.role?.toString() || "0",
          status: userData.status || "active",
        });

        // Set other fields if designation/department is custom
        if (![...IT_DESIGNATIONS, ...NON_IT_DESIGNATIONS].includes(userData.designation)) {
          setOtherDesignation(userData.designation || "");
        }
        if (![...IT_DEPARTMENTS, ...NON_IT_DEPARTMENTS].includes(userData.department)) {
          setOtherDepartment(userData.department || "");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching staff data:", error);
        alert("Error loading staff data");
        setLoading(false);
      }
    };

    if (id) {
      fetchStaffData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, joiningDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      designation:
        formData.designation === "Other"
          ? otherDesignation
          : formData.designation,
      department:
        formData.department === "Other" ? otherDepartment : formData.department,
      joiningDate: formData.joiningDate,
      status: formData.status,
    };

    // Only include password if it's provided
    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      const res = await axios.put(`/api/v1/users/update/${id}`, payload);
      
      if (res.data.status) {
        alert("Staff updated successfully!");
        navigate("/admin/staffs");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Staff Member
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md"
            placeholder="Enter new password or leave blank"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Designation Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designation
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Designation</option>
            {[...IT_DESIGNATIONS, ...NON_IT_DESIGNATIONS, "Other"].map(
              (role, idx) => (
                <option key={idx} value={role}>
                  {role}
                </option>
              )
            )}
          </select>

          {formData.designation === "Other" && (
            <input
              type="text"
              placeholder="Enter custom designation"
              value={otherDesignation}
              onChange={(e) => setOtherDesignation(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-md"
              required
            />
          )}
        </div>

        {/* Department Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Department</option>
            {[...IT_DEPARTMENTS, ...NON_IT_DEPARTMENTS, "Other"].map(
              (dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              )
            )}
          </select>

          {formData.department === "Other" && (
            <input
              type="text"
              placeholder="Enter custom department"
              value={otherDepartment}
              onChange={(e) => setOtherDepartment(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-md"
              required
            />
          )}
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Joining Date
          </label>
          <DatePicker
            selected={formData.joiningDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Date"
            className="mt-1 w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Update Staff
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/staffs")}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaff;
