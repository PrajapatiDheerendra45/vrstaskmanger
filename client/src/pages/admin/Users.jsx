import React, { useEffect, useState } from "react";
import { GrView } from "react-icons/gr";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../context/Auth";

const UserPanels = () => {
  const [users, setUsers] = useState([]);
  const [auth, setAuth] = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://hola9.in/auth/admin-users/?admin_id=${auth.user.id}`);
      console.log("response users",response)
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModal = (user = null) => {
    setSelectedUser(user);
    setNewUser(user ? user : { name: "", email: "", address: "", mobile: "" });
    setModalOpen(true);
  };

  const saveUser = async () => {
    if (selectedUser) {
      await axios.put(
        `https://hola9.in/auth/users/${selectedUser.id}/`,
        newUser
      );
    } else {
      await axios.post("https://hola9.in/auth/users/", newUser);
    }
    setModalOpen(false);
    fetchData();
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`https://hola9.in/auth/users/${id}/`);
      fetchData();
    }
  };

  return (
    <div className=" bg-gray-100 min-h-screen p-5 ">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-500 font-serif overflow-x-auto ">
        All USERS
      </h1>

      <div className="bg-white shadow-2xl rounded-lg p-6 border border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gray-600 text-white text-lg">
              <th className="p-4 border text-left">ID</th>
              <th className="p-4 border text-left">Name</th>
              <th className="p-4 border text-left">Email</th>
              <th className="p-4 border text-left">Mobile</th>
              <th className="p-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              ?.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <td className="p-4 border">{user.id}</td>
                  <td className="p-4 border">{user.name}</td>
                  <td className="p-4 border">{user.email}</td>
                  <td className="p-4 border">{user.phone_number}</td>
                  <td className="p-4 border flex gap-2 justify-center">
                    <button
                      onClick={() => handleModal(user)}
                      className="bg-green-500 px-4 py-2 rounded text-white"
                    >
                      <GrView />
                    </button>
                    <button
                      onClick={() => handleModal(user)}
                      className="bg-yellow-500 px-4 py-2 rounded text-white"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 px-4 py-2 rounded text-white"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-80 font-serif animate-fadeIn">
          <div className="bg-white p-6 w-96 rounded-2xl shadow-lg shadow-blue-500 transition-transform transform hover:scale-105 duration-300 ml-65 ">
            <div className="flex justify-center mb-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFvZyXMK4sVoY3Pg-2fMPkTUa7X4s9r6d-nA&s"
                alt="Logo"
                className="w-16 h-16"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center animate-slideIn">
              {selectedUser ? "Edit User" : "Add User"}
            </h2>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border p-3 w-full mb-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="border p-3 w-full mb-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
            />
            <textarea
              placeholder="Address"
              value={newUser.address}
              onChange={(e) =>
                setNewUser({ ...newUser, address: e.target.value })
              }
              className="border p-3 w-full mb-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"
            />
            <input
              type="text"
              placeholder="Mobile"
              value={newUser.phone_number}
              onChange={(e) =>
                setNewUser({ ...newUser, mobile: e.target.value })
              }
              className="border p-3 w-full mb-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition-all hover:shadow-md"/>
              <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg font-serif transition-all hover:bg-gray-600 hover:shadow-lg">
                Cancel
               </button>
               <button
                onClick={saveUser}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg font-serif transition-all hover:bg-blue-600 hover:shadow-lg">                                                                                                              
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanels;
