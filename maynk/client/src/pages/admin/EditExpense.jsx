import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/Auth';

const EditExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    category: '',
    otherCategory: '',
    amount: '',
    description: '',
    date: '',
    paymentMethod: '',
    receiptNumber: '',
    vendor: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchExpense();
  }, [id]);

  const fetchCategories = async () => {
    // Manual categories - no API call needed
    const manualCategories = [
      "Office Rent",
      "Employee Salaries & Wages", 
      "Travel Expenses",
      "Office Utilities",
      "Stationery / Office Supplies",
      "Marketing & Advertising",
      "Equipment Purchase",
      "Maintenance & Repairs",
      "Training & Development",
      "Insurance Premiums",
      "Taxes & Compliance Fees",
      "Other"
    ];
    setCategories(manualCategories);
  };

  const fetchExpense = async () => {
    try {
      const response = await fetch(`/api/v1/expense/get/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const expense = data.data;
        setFormData({
          category: expense.category,
          otherCategory: expense.otherCategory || '',
          amount: expense.amount,
          description: expense.description,
          date: new Date(expense.date).toISOString().split('T')[0],
          paymentMethod: expense.paymentMethod,
          receiptNumber: expense.receiptNumber || '',
          vendor: expense.vendor || '',
          remarks: expense.remarks || ''
        });
      } else {
        toast.error('Expense not found');
        navigate('/admin/manage-expenses');
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      toast.error('Failed to fetch expense details');
      navigate('/admin/manage-expenses');
    } finally {
      setFetching(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.category === 'Other' && !formData.otherCategory) {
      newErrors.otherCategory = 'Other category is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear otherCategory when category changes from "Other"
    if (name === 'category' && value !== 'Other') {
      setFormData(prev => ({
        ...prev,
        otherCategory: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/v1/expense/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Expense updated successfully!');
        navigate('/admin/manage-expenses');
      } else {
        toast.error(data.message || 'Failed to update expense');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/manage-expenses');
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
                <p className="text-gray-600 mt-1">Update the expense details below</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Other Category */}
              {formData.category === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="otherCategory"
                    value={formData.otherCategory}
                    onChange={handleInputChange}
                    placeholder="Enter other category"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.otherCategory ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.otherCategory && (
                    <p className="text-red-500 text-sm mt-1">{errors.otherCategory}</p>
                  )}
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                </select>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
                )}
              </div>

              {/* Receipt Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Number
                </label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleInputChange}
                  placeholder="Enter receipt number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor
                </label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  placeholder="Enter vendor name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description of the expense"
                rows="4"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Enter any additional remarks"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditExpense;
