import {
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaSortNumericDown,
  } from "react-icons/fa";
  import { useAuth } from "../../context/Auth";
  import { useEffect, useState } from "react";
  import axios from "axios";
  
  function UserProfile() {
    const [auth] = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone_number: "",
      address: "",
    });
  
 

      const fetchUserData = async () => {
        try {

           const user = JSON.parse(localStorage.getItem("auth")); // Get user from localStorage
        const userId = user?.user?._id;
          const response = await axios.get(`/api/v1/users/getusers/${userId}`);
       
          setUser(response.data.user);
          setFormData(response.data.user);
        } catch (err) {
          setError("Failed to fetch user data");
        } finally {
          setLoading(false);
        }
      };
         useEffect(() => {
      fetchUserData();
    }, []);
  
    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleUpdate = async () => {
      try {
          const user = JSON.parse(localStorage.getItem("auth")); // Get user from localStorage
        const userId = user?.user?._id;
        const response = await axios.put(`/api/v1/users/update/${userId}/`, formData);
        
        setUser(response.data.user);
        setIsModalOpen(false);
      } catch (err) {
        console.error("Update Error:", err.response?.data);
        alert("Failed to update user data");
      }
    };
  
    if (loading) return <p className="text-center text-blue-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl overflow-hidden transform transition duration-500 hover:scale-105">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-center text-white">
            <FaUserCircle className="mx-auto text-7xl drop-shadow-lg" />
            <h2 className="text-2xl font-bold mt-2">{user?.name}</h2>
            <p className="text-sm opacity-90">Administrator</p>
          </div>
          <div className="p-6 space-y-4">
          
            <div className="flex items-center space-x-3">
              <FaSortNumericDown className="text-blue-500 text-lg" />
              <span className="text-gray-700 font-medium">{user?.designation}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-blue-500 text-lg" />
              <span className="text-gray-700 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-green-500 text-lg" />
              <span className="text-gray-700 font-medium">{user?.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="text-red-500 text-lg" />
              <span className="text-gray-700 font-medium">{user?.department}</span>
            </div>
            <div className="flex mt-6">
              <button
                className="w-full py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all scale-105">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>
              <div className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Name" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Email" />
                <input type="text" name="phone_number" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Phone Number" />
                <input type="text" name="address" value={formData.department} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Address" />
              </div>
              <div className="flex justify-between mt-6">
                <button className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600" onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default UserProfile;  