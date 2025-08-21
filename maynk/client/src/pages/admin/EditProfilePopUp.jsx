import { useState } from "react";

export default function EditProfilePopup() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", mobile: "", bio: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", form);
    setOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <button 
        onClick={() => setOpen(true)} 
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Edit Profile
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                value={form.bio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setOpen(false)} 
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
