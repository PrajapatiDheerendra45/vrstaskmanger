import axios from "axios";
import React, { useState } from "react";

const CompanyRegistrationForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    industry: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key] = "This field is required.";
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("auth"));
    console.log("user", user);
    const hrname = user?.user?.name || "";
    const createdBy = user?.user?._id || "";

    // Prepare final payload
    const finalData = {
      ...formData,
      hrname,
      createdBy,
    };

    try {
      const res = await axios.post("/api/v1/company/create", finalData); // Replace with your actual API endpoint
      console.log("Company Registered:", res);
      if (res.data.status) {
        alert(res.data.message);

        setFormData({
          companyName: "",
          email: "",
          phone: "",
          industry: "",
          address: "",
          city: "",
          state: "",
          zip: "",
        });
      }
    } catch (error) {
      console.error(
        "Error registering company:",
        error.response?.data || error.message
      );
      alert("Something went wrong while registering the company.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Company Registration
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          { label: "Company Name", name: "companyName" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "tel" },
          { label: "Industry", name: "industry" },
          { label: "Address", name: "address" },
          { label: "City", name: "city" },
          { label: "State", name: "state" },
          { label: "ZIP Code", name: "zip" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors[name] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[name] && (
              <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Register Company
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyRegistrationForm;
