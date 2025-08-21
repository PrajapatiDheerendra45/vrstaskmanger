import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
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

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    department: "",
    joiningDate: null,
    role: "0", // Set internally
    status: "active",
  });

  const [otherDesignation, setOtherDesignation] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");

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
      password: formData.password,
      phone: formData.phone,
      designation:
        formData.designation === "Other"
          ? otherDesignation
          : formData.designation,
      department:
        formData.department === "Other" ? otherDepartment : formData.department,
      joiningDate: formData.joiningDate,
      role: "0",
      status: formData.status,
    };

    try {
      console.log("payload", payload);
      const res = await axios.post("/api/v1/users/register", payload);
      console.log(res.data);
      if (res.data.status) {
        alert(res.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          designation: "",
          department: "",
          joiningDate: "",
          role: "0",
          status: "active",
        });
        setOtherDesignation(""); // reset "Other" input
        setOtherDepartment("");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Add New Staff
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
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md"
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

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Add Staff
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
