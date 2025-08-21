import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffTable = () => {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3); // Small page size for testing

  // Fetch staff data once on mount
  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = () => {
    axios.get('/api/v1/users/getusers')
      .then(res => {
        console.log('Raw API response:', res.data.users);
        const staffOnly = res.data.users
          .filter(u => u.role === 0)
          .map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            designation: u.designation,
            department: u.department,
            status: u.status || 'active',
            joiningDate: u.joiningDate ? u.joiningDate.split('T')[0] : '',
          }));
        console.log('Filtered staff data:', staffOnly);
        setRawData(staffOnly);
      })
      .catch(err => console.error(err.response?.data || err));
  };

  // Filter data
  const filteredData = rawData.filter(row => {
    const matchesStatus = statusFilter ? row.status === statusFilter : true;
    const matchesSearch = !globalFilter ||
      row.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
      row.email.toLowerCase().includes(globalFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Simple pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  console.log('Pagination debug:', {
    totalRecords: filteredData.length,
    pageSize,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    currentDataLength: currentData.length,
    currentData: currentData
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [globalFilter, statusFilter, pageSize]);

  const handleEdit = (id) => {
    navigate(`/admin/edit-staff/${id}`);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await axios.delete(`/api/v1/users/delete/${id}`);
        if (response.data.status) {
          alert('Staff deleted successfully!');
          fetchStaffData();
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert(error.response?.data?.message || 'Error deleting staff');
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus, name) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    if (window.confirm(`Are you sure you want to change ${name}'s status to ${newStatus}?`)) {
      try {
        const response = await axios.put(`/api/v1/users/update/${id}`, {
          status: newStatus
        });
        if (response.data.status) {
          alert(`Status updated successfully!`);
          fetchStaffData();
        }
      } catch (error) {
        console.error('Error updating status:', error);
        alert(error.response?.data?.message || 'Error updating status');
      }
    }
  };

  const goToPage = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    console.log('Navigating to page:', newPage);
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-6xl mx-auto mt-10">
      {/* Header & Filters */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Staff Management</h2>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search staff..."
            value={globalFilter}
            onChange={e => setGlobalFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-48 focus:outline-none focus:ring focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value={3}>3 per page</option>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Debug Info */}
     

      {/* Simple Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Designation</th>
              <th className="px-4 py-2 text-left font-medium">Department</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Joining Date</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {currentData.map((row, index) => (
              <tr key={row._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.designation}</td>
                <td className="px-4 py-3">{row.department}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleStatusToggle(row._id, row.status, row.name)}
                    className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer hover:opacity-80 ${
                      row.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {row.status}
                  </button>
                </td>
                <td className="px-4 py-3">{row.joiningDate}</td>
                <td className="px-4 py-3">
                  <div className="space-x-2">
                    <button 
                      onClick={() => handleEdit(row._id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(row._id, row.name)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Simple Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Page {currentPage} of {totalPages}</span>
              <span>|</span>
              <span>
                Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{' '}
                {Math.min(endIndex, filteredData.length)}{' '}
                of {filteredData.length} results
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                First
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-gray-200 rounded">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                Next
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffTable;
