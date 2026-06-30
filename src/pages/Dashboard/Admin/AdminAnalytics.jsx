import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DashboardPageHeader from "../../../components/Dashboard/DashboardPageHeader";
import DashboardCard from "../../../components/Dashboard/DashboardCard";
import Loading from "../../../components/Loading";
import { FaUsers, FaBlog, FaUserPlus, FaFileSignature } from "react-icons/fa";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Helmet } from "react-helmet-async";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminAnalytics() {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/analytics");
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const { kpis, growthData, roleDistribution, statusDistribution } = data;

  return (
    <>
      <Helmet>
        <title>Platform Analytics | Okkhor Admin</title>
      </Helmet>
      
      <DashboardPageHeader 
        title="Platform Analytics" 
        subtitle="Track the growth and health of the Okkhor ecosystem." 
      />

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.totalUsers}</h4>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <FaBlog size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Blogs</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.totalBlogs}</h4>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <FaUserPlus size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Users (Today)</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.newUsersToday}</h4>
          </div>
        </DashboardCard>

        <DashboardCard className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <FaFileSignature size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Blogs (Today)</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{kpis.newBlogsToday}</h4>
          </div>
        </DashboardCard>
      </div>

      {/* Growth Chart */}
      <DashboardCard className="mb-8 p-6">
        <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Growth Over Last 30 Days</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" name="New Users" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="blogs" name="New Blogs" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      {/* Distributions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <DashboardCard className="p-6">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">User Roles Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard className="p-6">
          <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Blog Status Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
    </>
  );
}
