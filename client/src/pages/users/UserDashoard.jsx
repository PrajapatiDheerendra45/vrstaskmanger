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
import UserDashHeader from "./UserDashHeader";
import { 
  FaUsers, 
  FaTasks, 
  FaCalendarAlt,
  FaBuilding,
  FaChartLine,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserPlus,
  FaBriefcase
} from "react-icons/fa";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const UserDashoard = () => {

  let storedUser = localStorage.getItem("auth");
  
  const navigate = useNavigate();
  let user = storedUser ? JSON.parse(storedUser) : null;

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    companies: [],
    candidates: [],
    interviews: [],
    tasks: [],
    loading: true,
    error: null
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [interviewStatusData, setInterviewStatusData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Fetch user-specific dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));

        const userId = user?.data?._id || user?.user?._id;
        
        if (!userId) {
          setDashboardData(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'User not found' 
          }));
          return;
        }

        // Fetch user-specific dashboard stats
        console.log("userId",userId)
        const statsResponse = await axios.get(`/api/v1/users/dashboard-stats/${userId}`);
        console.log("statsResponse",statsResponse)
        if (statsResponse.data.status) {
          const stats = statsResponse.data.stats;
          
          setDashboardData({
            companies: stats.totalCompanies || 0,
            candidates: stats.totalCandidates || 0,
            interviews: stats.totalInterviews || 0,
            tasks: stats.totalTasks || 0,
            recentInterviews: stats.recentInterviews || [],
            recentTasks: stats.recentTasks || [],
            loading: false,
            error: null
          });

          // Set chart data
          setMonthlyData(stats.monthlyData || []);
          setTaskStatusData(stats.taskStatusData || []);
          setInterviewStatusData(stats.interviewStatusData || []);

          // Process recent activities
          const activities = processRecentActivities(stats.recentInterviews, stats.recentTasks);
          setRecentActivities(activities);
        } else {
          setDashboardData(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Failed to fetch dashboard data' 
          }));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load dashboard data' 
        }));
      }
    };

    if (user) {
      fetchDashboardData();
    }
  },user, []);

  const processRecentActivities = (recentInterviews, recentTasks) => {
    const activities = [];

    // Add recent interviews
    if (recentInterviews && recentInterviews.length > 0) {
      recentInterviews.forEach(interview => {
        activities.push({
          type: 'interview',
          title: `Interview: ${interview.candidateId?.fullName || 'Candidate'}`,
          status: interview.status,
          date: new Date(interview.createdAt),
          icon: FaCalendarAlt,
          color: 'text-purple-500',
          details: `${interview.interviewDate} at ${interview.interviewTime}`
        });
      });
    }

    // Add recent tasks
    if (recentTasks && recentTasks.length > 0) {
      recentTasks.forEach(task => {
        activities.push({
          type: 'task',
          title: `Task: ${task.title}`,
          status: task.status,
          date: new Date(task.createdAt),
          icon: FaTasks,
          color: 'text-blue-500',
          details: `Due: ${new Date(task.deadline).toLocaleDateString()}`
        });
      });
    }

    // Sort by date and return top 10
    return activities
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);
  };

  const getCompletedTasks = () => {
    return taskStatusData.find(item => item.name === 'Completed')?.value || 0;
  };

  const getScheduledInterviews = () => {
    return interviewStatusData.find(item => item.name === 'Scheduled')?.value || 0;
  };

  const getPendingTasks = () => {
    return taskStatusData.find(item => item.name === 'Pending')?.value || 0;
  };

  if (dashboardData.loading) {
    return (
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-green-50 to-blue-50 mt-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-green-50 to-blue-50 mt-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            <span>{dashboardData.error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserDashHeader className="mb-16" />
      <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-green-50 to-blue-50 mt-16">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-extrabold font-serif text-gray-800 hover:text-blue-600 transition-colors">
              <span className="text-sm text-gray-600">
                Hi {user?.data?.firstName && user?.data?.lastName
                ? `${user?.data?.firstName} ${user?.data?.lastName}`
                : user?.user?.name || " Guest"}
            </span>
              <br /> Welcome to Your Dashboard!
          </h2>
            <p className="text-gray-600 mt-2">Here's your performance overview</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Companies",
              value: dashboardData.companies,
              icon: FaBuilding,
              bgColor: "from-purple-500 to-blue-500",
              textColor: "text-white",
              image: grafleft,
              gradient: true,
              route: "companylisting",
              link:"/getcompanylisting"
              
            },
            {
              title: "Total Candidates",
              value: dashboardData.candidates,
              icon: FaUserPlus,
              bgColor: "from-green-500 to-teal-500",
              textColor: "text-black",
              image: graf1,
              gradient: false,
              route: "candidate-data",
              link:"/get-candidate-data"
            },
            {
              title: "Total Interviews",
              value: dashboardData.interviews,
              icon: FaCalendarAlt,
              bgColor: "from-yellow-500 to-orange-500",
              textColor: "text-black",
              image: graf2,
              gradient: false,
              route: "interview",
               link:"/interviewget"

              
            },
            {
              title: "Total Tasks",
              value: dashboardData.tasks,
              icon: FaTasks,
              bgColor: "from-pink-500 to-red-500",
              textColor: "text-white",
              image: grafright,
              gradient: true,
              route: "allotedtask",
              link:"/allotedtask"
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
                  <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">Click to view details</p>
                    <button 
                      onClick={() => navigate(`/${item.route}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
          {/* Monthly Progress Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold font-serif text-gray-800">
                Monthly Progress <span className="text-green-500">● On Track</span>
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-serif">2024</span>
                <FaChartLine className="text-blue-500" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="companies"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="url(#colorCompanies)"
                  name="Companies"
                />
                <Area
                  type="monotone"
                  dataKey="candidates"
                  stackId="1"
                  stroke="#10B981"
                  fill="url(#colorCandidates)"
                  name="Candidates"
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

          {/* Performance Trend Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="interviews"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  name="Interviews"
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  name="Tasks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Recent Activities</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${activity.color} bg-opacity-10`}>
                      <activity.icon className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                      <p className="text-xs text-gray-400">
                        {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaBriefcase className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activities</p>
                  <p className="text-sm text-gray-400">Start by adding companies, candidates, or tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 font-serif text-gray-800">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaUserTie className="text-blue-500 text-xl" />
                  <span className="font-medium">Total Companies</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{dashboardData.companies}</span>
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
                <span className="text-2xl font-bold text-yellow-600">{getPendingTasks()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashoard;
