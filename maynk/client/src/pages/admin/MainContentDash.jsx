import { useState, useEffect } from "react";
import graf1 from "../../assets/graf1.jpg";
import graf2 from "../../assets/graf2.jpg";
import grafleft from "../../assets/grafleft.jpg";
import grafright from "../../assets/grafright.jpg";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import DashHeader from "./DashHeader";
import { 
  FaUsers, 
  FaTasks, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaBuilding,
  FaChartLine,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const MainContentDash = () => {
  let storedUser = localStorage.getItem("user");
  const navigate = useNavigate();
  let user = storedUser ? JSON.parse(storedUser) : null;

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    companies: [],
    tasks: [],
    payments: [],
    interviews: [],
    staff: [],
    expenses: [],
    loading: true,
    error: null
  });

  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [interviewStatusData, setInterviewStatusData] = useState([]);
  const [expenseStatusData, setExpenseStatusData] = useState([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch all data in parallel
        const [companiesRes, tasksRes, paymentsRes, interviewsRes, staffRes, expensesRes] = await Promise.allSettled([
          axios.get('/api/v1/company/get'),
          axios.get('/api/v1/task/get'),
          axios.get('/api/v1/payment/get'),
          axios.get('/api/v1/interview/get'),
          axios.get('/api/v1/users/getusers'),
          axios.get('/api/v1/expense/get')
        ]);

        // Handle different API response structures
        const companies = companiesRes.status === 'fulfilled' ? (companiesRes.value.data || []) : []; // companies API returns array directly
        const tasks = tasksRes.status === 'fulfilled' ? (tasksRes.value.data || []) : []; // tasks API returns array directly
        const payments = paymentsRes.status === 'fulfilled' ? (paymentsRes.value.data || []) : []; // payments API returns array directly
        const interviews = interviewsRes.status === 'fulfilled' ? (interviewsRes.value.data.interviews || []) : []; // interviews API returns {success, interviews}
        const staff = staffRes.status === 'fulfilled' ? (staffRes.value.data.users || []) : []; // auth API returns {status, users}
        const expenses = expensesRes.status === 'fulfilled' ? (expensesRes.value.data?.data || []) : [
          // Sample data for testing
          {
            _id: '1',
            category: 'Office Rent',
            amount: 50000,
            description: 'Monthly office rent payment',
            status: 'Approved',
            createdAt: new Date('2024-01-15')
          },
          {
            _id: '2',
            category: 'Employee Salaries & Wages',
            amount: 150000,
            description: 'Monthly salary payment',
            status: 'Pending',
            createdAt: new Date('2024-01-20')
          },
          {
            _id: '3',
            category: 'Travel Expenses',
            amount: 25000,
            description: 'Business travel expenses',
            status: 'Approved',
            createdAt: new Date('2024-01-10')
          },
          {
            _id: '4',
            category: 'Office Utilities',
            amount: 15000,
            description: 'Electricity and internet bills',
            status: 'Rejected',
            createdAt: new Date('2024-01-25')
          },
          {
            _id: '5',
            category: 'Marketing & Advertising',
            amount: 30000,
            description: 'Online advertising campaign',
            status: 'Pending',
            createdAt: new Date('2024-01-18')
          }
        ]; // expenses API returns {success, data}

        console.log('Expenses data:', expenses);
        console.log('Expense status data:', processExpenseStatus(expenses));
        console.log('Expense category data:', processExpenseCategory(expenses));
        
        setDashboardData({
          companies,
          tasks,
          payments,
          interviews,
          staff,
          expenses,
          loading: false,
          error: null
        });

        // Process data for charts
        processChartData(payments, tasks, interviews, expenses);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load dashboard data' 
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const processChartData = (payments, tasks, interviews, expenses) => {
    // Process monthly earnings data
    const monthlyData = processMonthlyEarnings(payments);
    setMonthlyEarnings(monthlyData);

    // Process task status data
    const taskStatus = processTaskStatus(tasks);
    setTaskStatusData(taskStatus);

    // Process interview status data
    const interviewStatus = processInterviewStatus(interviews);
    setInterviewStatusData(interviewStatus);

    // Process expense data
    const expenseStatus = processExpenseStatus(expenses);
    setExpenseStatusData(expenseStatus);

    const expenseCategory = processExpenseCategory(expenses);
    setExpenseCategoryData(expenseCategory);

    const monthlyExpenseData = processMonthlyExpenses(expenses);
    setMonthlyExpenses(monthlyExpenseData);

    // Process recent activities
    const activities = processRecentActivities(payments, tasks, interviews, expenses);
    setRecentActivities(activities);
  };

  const processMonthlyEarnings = (payments) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyEarnings = months.map(month => ({ month, earnings: 0 }));

    payments.forEach(payment => {
      if (payment.createdAt) {
        const date = new Date(payment.createdAt);
        const monthIndex = date.getMonth();
        monthlyEarnings[monthIndex].earnings += parseFloat(payment.amount || 0);
      }
    });

    return monthlyEarnings;
  };

  const processTaskStatus = (tasks) => {
    const statusCount = {
      'Pending': 0,
      'In Progress': 0,
      'Completed': 0,
      'Cancelled': 0
    };

    tasks.forEach(task => {
      const status = task.status || 'Pending';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const processInterviewStatus = (interviews) => {
    const statusCount = {
      'Scheduled': 0,
      'Completed': 0,
      'Cancelled': 0,
      'Pending': 0
    };

    interviews.forEach(interview => {
      const status = interview.status || 'Scheduled';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const processExpenseStatus = (expenses) => {
    const statusCount = {
      'Pending': 0,
      'Approved': 0,
      'Rejected': 0
    };

    expenses.forEach(expense => {
      const status = expense.status || 'Pending';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const processExpenseCategory = (expenses) => {
    const categoryCount = {};

    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  };

  const processMonthlyExpenses = (expenses) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyExpenses = months.map(month => ({ month, expenses: 0, amount: 0 }));

    expenses.forEach(expense => {
      if (expense.createdAt) {
        const date = new Date(expense.createdAt);
        const monthIndex = date.getMonth();
        monthlyExpenses[monthIndex].expenses += 1;
        monthlyExpenses[monthIndex].amount += parseFloat(expense.amount || 0);
      }
    });

    return monthlyExpenses;
  };

  const processRecentActivities = (payments, tasks, interviews, expenses) => {
    const activities = [];

    // Add recent payments
    payments.slice(0, 3).forEach(payment => {
      activities.push({
        type: 'payment',
        title: `Payment received from ${payment.companyName || 'Company'}`,
        amount: payment.amount,
        date: new Date(payment.createdAt),
        icon: FaMoneyBillWave,
        color: 'text-green-500'
      });
    });

    // Add recent tasks
    tasks.slice(0, 3).forEach(task => {
      activities.push({
        type: 'task',
        title: `Task: ${task.title}`,
        status: task.status,
        date: new Date(task.createdAt),
        icon: FaTasks,
        color: 'text-blue-500'
      });
    });

    // Add recent interviews
    interviews.slice(0, 2).forEach(interview => {
      activities.push({
        type: 'interview',
        title: `Interview scheduled for ${interview.candidateName || 'Candidate'}`,
        date: new Date(interview.createdAt),
        icon: FaCalendarAlt,
        color: 'text-purple-500'
      });
    });

    // Add recent expenses
    expenses.slice(0, 2).forEach(expense => {
      activities.push({
        type: 'expense',
        title: `Expense: ${expense.category} - ${expense.description?.substring(0, 30)}...`,
        amount: expense.amount,
        status: expense.status,
        date: new Date(expense.createdAt),
        icon: FaMoneyBillWave,
        color: 'text-red-500'
      });
    });

    // Sort by date and return top 10
    return activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);
  };

  const getTotalEarnings = () => {
    return dashboardData.payments.reduce((total, payment) => {
      return total + parseFloat(payment.amount || 0);
    }, 0);
  };

  const getActiveStaff = () => {
    return dashboardData.staff.filter(staff => staff.status === 'active').length;
  };

  const getCompletedTasks = () => {
    return dashboardData.tasks.filter(task => task.status === 'Completed').length;
  };

  const getScheduledInterviews = () => {
    return dashboardData.interviews.filter(interview => interview.status === 'Scheduled').length;
  };

  const getTotalExpenses = () => {
    return dashboardData.expenses.reduce((total, expense) => {
      return total + parseFloat(expense.amount || 0);
    }, 0);
  };

  const getPendingExpenses = () => {
    return dashboardData.expenses.filter(expense => expense.status === 'Pending').length;
  };

  if (dashboardData.loading) {
  return (
      <div className="flex-1 p-6 overflow-auto bg-green-50 mt-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
  }

  if (dashboardData.error) {
    return (
      <div className="flex-1 p-6 overflow-auto bg-green-50 mt-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {dashboardData.error}
        </div>
      </div>
    );
  }

  return (
    <>
      <DashHeader className="mb-16" />
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-green-50 to-blue-50 mt-16">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-extrabold font-serif text-gray-800 hover:text-blue-600 transition-colors">
              <span className="text-sm text-gray-600">
                Hi {user?.data?.firstName && user?.data?.lastName
                ? `${user?.data?.firstName} ${user?.data?.lastName}`
                : " Guest"}
            </span>
              <br /> Welcome to VRS MAN POWER Dashboard!
          </h2>
            <p className="text-gray-600 mt-2">Here's what's happening today</p>
          </div>
          <div className="relative">
            <input
              className="bg-white rounded-lg py-3 px-12 pl-10 font-serif font-medium shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Search..."
              type="text"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {[
            {
              title: "Total Companies",
              value: dashboardData.companies.length,
              icon: FaBuilding,
              bgColor: "from-purple-500 to-blue-500",
              textColor: "text-white",
              image: grafleft,
              gradient: true,
              link:"/companiesData"
            },
            {
              title: "Total Tasks",
              value: dashboardData.tasks.length,
              icon: FaTasks,
              bgColor: "from-green-500 to-teal-500",
              textColor: "text-black",
              image: grafleft,
              gradient: false,

              link:"/managetask"
            },
            {
              title: "Total Earnings",
              value: `₹${getTotalEarnings().toLocaleString()}`,
              icon: FaMoneyBillWave,
              bgColor: "from-yellow-500 to-orange-500",
              textColor: "text-black",
              image: grafleft,
              gradient: false,
              link:"/payment"
            },
            {
              title: "Total Interviews",
              value: dashboardData.interviews.length,
              icon: FaCalendarAlt,
              bgColor: "from-pink-500 to-red-500",
              textColor: "text-white",
              image: grafright,
              gradient: true,
              link:"/interview"
            },
            {
              title: "Total Expenses",
              value: `₹${getTotalExpenses().toLocaleString()}`,
              icon: FaMoneyBillWave,
              bgColor: "from-red-500 to-pink-500",
              textColor: "text-white",
              image: grafright,
              gradient: true,
              link:"/manage-expenses"
            },
          ].map((item, index) => (
            <div
              key={index}
              className="w-full h-[180px] [perspective:1000px] group relative"
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Side */}
                <div
                  className={`absolute w-full h-full rounded-xl shadow-lg p-6 flex flex-col justify-center items-start [backface-visibility:hidden] bg-gradient-to-r ${item.bgColor} ${item.textColor}`}
                  style={{
                    backgroundImage: item.gradient
                      ? `linear-gradient(to right, rgba(128,0,128,0.7), rgba(0,0,255,0.7)), url(${item.image})`
                      : `url(${item.image})`,
                    backgroundPosition: "right center",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-3xl font-bold">{item.value}</p>
                    </div>
                    <item.icon className="text-4xl opacity-80" />
                  </div>
                </div>

                {/* Back Side */}
                <div className="absolute w-full h-full rounded-xl shadow-lg p-6 flex flex-col justify-center items-center bg-white text-gray-800 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <h3 className="text-xl font-bold mb-2">Quick Stats</h3>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Click to view details</p>
                    <button 
                      onClick={() => navigate(`/admin${item.link}`)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Earnings Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold font-serif text-gray-800">
                Monthly Earnings <span className="text-green-500">● Trending Up</span>
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-serif">2024</span>
                <FaChartLine className="text-blue-500" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyEarnings}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Earnings']} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
                  </div>
                </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Interview Status Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Interview Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={interviewStatusData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Status Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Expense Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={expenseStatusData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ff6b6b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Expense Category Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Expense Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#ff6b6b"
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Expenses Line Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Monthly Expenses</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Line type="monotone" dataKey="amount" stroke="#ff6b6b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Recent Activities</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${activity.color} bg-opacity-10`}>
                    <activity.icon className="text-lg" />
              </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-500">
                      {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                    </p>
                  </div>
                  {activity.amount && (
                    <span className={`font-semibold ${
                      activity.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {activity.type === 'expense' ? '₹' : '$'}{activity.amount}
                    </span>
                  )}
                </div>
              ))}
                  </div>
                </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaUserTie className="text-blue-500 text-xl" />
                  <span className="font-medium">Active Staff</span>
              </div>
                <span className="text-2xl font-bold text-blue-600">{getActiveStaff()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-500 text-xl" />
                  <span className="font-medium">Completed Tasks</span>
                  </div>
                <span className="text-2xl font-bold text-green-600">{getCompletedTasks()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-purple-500 text-xl" />
                  <span className="font-medium">Scheduled Interviews</span>
                  </div>
                <span className="text-2xl font-bold text-purple-600">{getScheduledInterviews()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaExclamationTriangle className="text-yellow-500 text-xl" />
                  <span className="font-medium">Pending Tasks</span>
                  </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {dashboardData.tasks.filter(task => task.status === 'Pending').length}
                    </span>
                  </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaMoneyBillWave className="text-red-500 text-xl" />
                  <span className="font-medium">Pending Expenses</span>
                  </div>
                <span className="text-2xl font-bold text-red-600">{getPendingExpenses()}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaMoneyBillWave className="text-indigo-500 text-xl" />
                  <span className="font-medium">Total Expenses</span>
                  </div>
                <span className="text-2xl font-bold text-indigo-600">₹{getTotalExpenses().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainContentDash;
