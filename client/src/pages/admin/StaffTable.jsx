import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const StaffTable = () => {
  const [rawData, setRawData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  // Fetch staff data once on mount
  useEffect(() => {
    axios.get('/api/v1/users/getusers')
      .then(res => {
        const staffOnly = res.data.users
          .filter(u => u.role === 0)
          .map(u => ({
            name: u.name,
            email: u.email,
            designation: u.designation,
            department: u.department,
            status: u.status || 'active', // default if not provided
            joiningDate: u.joiningDate.split('T')[0], // format date
          }));
        setRawData(staffOnly);
      })
      .catch(err => console.error(err.response?.data || err));
  }, []);

  const data = useMemo(() => {
    return rawData.filter(row => {
      const matchesStatus = statusFilter ? row.status === statusFilter : true;
      const matchesSearch = !globalFilter ||
        row.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        row.email.toLowerCase().includes(globalFilter.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [rawData, statusFilter, globalFilter]);

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'department', header: 'Department' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 text-xs font-semibold rounded ${
          info.getValue() === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {info.getValue()}
        </span>
      ),
    },
    { accessorKey: 'joiningDate', header: 'Joining Date' },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="space-x-2">
          <button className="text-blue-600 hover:underline text-sm">Edit</button>
          <button className="text-red-600 hover:underline text-sm">Delete</button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility: {} },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-sm text-gray-700">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left font-medium cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination (optional) */}
        <div className="flex justify-end mt-4 space-x-2 text-sm">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage?.()}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage?.()}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffTable;
